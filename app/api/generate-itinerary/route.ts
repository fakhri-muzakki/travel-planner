import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import * as v from "valibot";
import { createClient } from "@/lib/supabase/server";
// import { logger } from "@/lib/logger";

// ========================================
// INPUT VALIDATION
// ========================================
export const ItineraryRequestSchema = v.object({
  destination: v.pipe(v.string(), v.trim(), v.minLength(1)),
  budget: v.pipe(v.number(), v.minValue(100000)),
  startDate: v.string(),
  endDate: v.string(),

  travelers: v.pipe(v.number(), v.minValue(1), v.maxValue(10)),

  preferences: v.optional(v.array(v.string())),

  // NEW
  // dietary: v.optional(
  //   v.picklist([
  //     "Any",
  //     "Halal",
  //     "Vegetarian",
  //     "Vegan",
  //     "Pescatarian",
  //     "Gluten Free",
  //   ]),
  // ),
  dietary: v.optional(v.array(v.string())),
  // Nanti ganti ini
  //   dietary: v.optional(
  //   v.array(
  //     v.picklist([
  //       "Halal",
  //       "Vegetarian",
  //       "Vegan",
  //       "Pescatarian",
  //       "Gluten Free",
  //     ])
  //   )
  // )
  pace: v.optional(v.picklist(["relaxed", "moderate", "fast"])),
});

type ItineraryRequest = v.InferOutput<typeof ItineraryRequestSchema>;

// ========================================
// AI RESPONSE VALIDATION
// ========================================
const ActivitySchema = v.object({
  title: v.string(),
  time: v.string(), // 07:00
  time_range: v.string(),
  estimated_cost: v.number(),
});

const DaySchema = v.object({
  day: v.number(),
  title: v.string(),
  hotel: v.string(),

  morning: ActivitySchema,
  lunch: ActivitySchema,
  afternoon: ActivitySchema,
  dinner: ActivitySchema,
});

const AIResponseSchema = v.object({
  days: v.array(DaySchema),
  budget: v.object({
    transportation: v.number(),
    accommodation: v.number(),
    food: v.number(),
    activities: v.number(),
  }),
});

type AIResponse = v.InferOutput<typeof AIResponseSchema>;

// ========================================
// POST
// ========================================
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // ------------------------------------
    // AUTH CHECK
    // ------------------------------------
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // ------------------------------------
    // VALIDATE INPUT
    // ------------------------------------
    const body = await request.json();
    console.dir(body, { depth: null });
    const validated = v.parse(ItineraryRequestSchema, body);

    const start = new Date(validated.startDate);
    const end = new Date(validated.endDate);

    const diffMs = end.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0 || days > 30) {
      return NextResponse.json(
        {
          success: false,
          error: "Trip duration must be between 1 and 30 days",
        },
        { status: 400 },
      );
    }

    // ------------------------------------
    // GENERATE AI
    // ------------------------------------
    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      temperature: 0.7,
      prompt: buildPrompt(validated, days),
    });

    let ai: AIResponse;

    try {
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      ai = v.parse(AIResponseSchema, JSON.parse(cleaned));
      // logger.info({ data: ai });
      if (ai.days.length !== days) {
        throw new Error("Wrong total days");
      }
    } catch (error) {
      console.error("AI RAW RESPONSE:");
      console.error(text);
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          error: "AI returned invalid response",
        },
        { status: 500 },
      );
    }

    // ------------------------------------
    // INSERT MAIN ITINERARY
    // ------------------------------------
    const { data: itinerary, error: itineraryError } = await supabase
      .from("itineraries")
      .insert({
        user_id: user.id,
        title: `${validated.destination} Trip`,
        destination: validated.destination,
        start_date: validated.startDate,
        end_date: validated.endDate,
        duration_days: days,
        traveler_count: validated.travelers,
        budget_per_person: Math.floor(validated.budget / validated.travelers),
        currency: "IDR",
        travel_styles: validated.preferences ?? [],
        pace: validated.pace,
        status: "done",
      })
      .select("id")
      .single();

    if (itineraryError || !itinerary) {
      throw itineraryError;
    }

    const itineraryId = itinerary.id;

    // ------------------------------------
    // INSERT DAYS + ACTIVITIES
    // ------------------------------------
    for (const item of ai.days) {
      const date = new Date(start);
      date.setDate(start.getDate() + (item.day - 1));

      const isoDate = date.toISOString().split("T")[0];

      const { data: insertedDay, error: dayError } = await supabase
        .from("itinerary_days")
        .insert({
          itinerary_id: itineraryId,
          day_number: item.day,
          date: isoDate,
          day_theme: item.title,
          accommodation: {
            name: item.hotel,
          },
        })
        .select("id")
        .single();

      if (dayError || !insertedDay) {
        throw dayError;
      }

      const rows = [
        {
          day_id: insertedDay.id,
          time_slot: "morning",
          order_index: 1,
          activity_name: item.morning.title,
          category: "attraction",
          // duration_minutes: item.morning.duration_minutes,
          duration_minutes: item.morning.time_range,
          estimated_cost: item.morning.estimated_cost,
          tips: `Start ${item.morning.time}`,
        },
        {
          day_id: insertedDay.id,
          time_slot: "afternoon",
          order_index: 2,
          activity_name: item.afternoon.title,
          category: "attraction",
          // duration_minutes: item.afternoon.duration_minutes,
          duration_minutes: item.afternoon.time_range,
          estimated_cost: item.afternoon.estimated_cost,
          tips: `Start ${item.afternoon.time}`,
        },
        {
          day_id: insertedDay.id,
          time_slot: "evening",
          order_index: 3,
          activity_name: item.lunch.title,
          category: "restaurant",
          // duration_minutes: item.lunch.duration_minutes,
          duration_minutes: item.lunch.time_range,
          estimated_cost: item.lunch.estimated_cost,
          tips: `Start ${item.lunch.time}`,
        },
        {
          day_id: insertedDay.id,
          time_slot: "night",
          order_index: 4,
          activity_name: item.dinner.title,
          category: "restaurant",
          // duration_minutes: item.dinner.duration_minutes,
          duration_minutes: item.dinner.time_range,
          estimated_cost: item.dinner.estimated_cost,
          tips: `Start ${item.dinner.time}`,
        },
      ];

      const { error: activityError } = await supabase
        .from("itinerary_activities")
        .insert(rows);

      if (activityError) {
        throw activityError;
      }
    }

    // ------------------------------------
    // INSERT BUDGET
    // ------------------------------------
    const budgetRows = [
      ["transport", ai.budget.transportation],
      ["accommodation", ai.budget.accommodation],
      ["food", ai.budget.food],
      ["activities", ai.budget.activities],
    ].map(([category, total]) => ({
      itinerary_id: itineraryId,
      category,
      total_cost: total,
      percentage: Math.round((Number(total) / validated.budget) * 100),
    }));

    const { error: budgetError } = await supabase
      .from("itinerary_budget_summary")
      .insert(budgetRows);

    if (budgetError) {
      throw budgetError;
    }

    return NextResponse.json({
      success: true,
      tripId: itineraryId,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof v.ValiError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: v.flatten(error.issues),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

// ========================================
// PROMPT
// ========================================
function buildPrompt(input: ItineraryRequest, days: number) {
  return `
Create realistic travel itinerary.

Destination:
${input.destination}

Budget:
${input.budget} IDR

Travelers:
${input.travelers}

Duration:
${days} days

Preferences:
${input.preferences?.join(", ") || "Any"}

Dietary:
${input.dietary || "Any"}

Pace:
${input.pace || "moderate"}

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- No code fences
- Use integer numbers only
- Create EXACTLY ${days} days
- Respect dietary preference for lunch and dinner
- If Halal, only halal-friendly restaurants
- If Vegetarian/Vegan, food must match
- Pace affects schedule:
  relaxed = fewer activities + more free time
  moderate = balanced itinerary
  fast = packed itinerary
- Total budget MUST NOT exceed ${input.budget}
- Budget summary totals must match realistic trip cost

JSON FORMAT:

{
  "days": [
    {
      "day": 1,
      "title": "Theme",
      "hotel": "Hotel Name",

      "morning": {
        "title": "Visit park",
        "time": "07:00",
        "time_range": "07:00 - 10:00 AM",
        "estimated_cost": 0
      },

      "lunch": {
        "title": "Lunch at restaurant",
        "time": "12:00",
        "time_range": "12:00- 13:00 PM",
        "estimated_cost": 120000
      },

      "afternoon": {
        "title": "Museum visit",
        "time": "14:00",
     "time_range": "14:00 - 16:00 PM",
        "estimated_cost": 90000
      },

      "dinner": {
        "title": "Dinner seafood",
        "time": "19:00",
        "time_range": "19:00 - 20:00 PM",
        "estimated_cost": 180000
      }
    }
  ],

  "budget": {
    "transportation": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0
  }
}

Total budget max ${input.budget}.
`;
}
