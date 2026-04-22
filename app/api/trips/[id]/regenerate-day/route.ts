import { NextResponse } from "next/server";
import * as v from "valibot";
import { createClient } from "@/lib/supabase/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const Schema = v.object({
  dayNumber: v.pipe(v.number(), v.minValue(1)),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { dayNumber } = v.parse(Schema, body);

    const supabase = await createClient();

    // auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // ambil trip
    const { data: trip, error } = await supabase
      .from("itineraries")
      .select(
        `
        *,
        itinerary_days (
          *
        )
      `,
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !trip) {
      return NextResponse.json(
        { success: false, error: "Trip not found" },
        { status: 404 },
      );
    }

    const targetDay = trip.itinerary_days.find(
      (d: any) => d.day_number === dayNumber,
    );

    if (!targetDay) {
      return NextResponse.json(
        { success: false, error: "Day not found" },
        { status: 404 },
      );
    }

    // AI Generate
    const prompt = `
Regenerate ONLY day ${dayNumber} for this trip.

Destination: ${trip.destination}
Budget total: ${trip.budget_per_person * trip.traveler_count}
Travelers: ${trip.traveler_count}
Pace: ${trip.pace}
Preferences: ${(trip.travel_styles || []).join(", ")}

Return ONLY JSON:

{
  "day": ${dayNumber},
  "title": "",
  "hotel": "",
  "morning": {
    "title": "",
    "time": "08:00",
    "duration_minutes": 120,
    "estimated_cost": 0
  },
  "lunch": {
    "title": "",
    "time": "12:00",
    "duration_minutes": 60,
    "estimated_cost": 100000
  },
  "afternoon": {
    "title": "",
    "time": "14:00",
    "duration_minutes": 180,
    "estimated_cost": 0
  },
  "dinner": {
    "title": "",
    "time": "19:00",
    "duration_minutes": 90,
    "estimated_cost": 150000
  }
}
`;

    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      prompt,
      temperature: 0.8,
    });

    const ai = JSON.parse(
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim(),
    );

    // update day
    const { error: updateError } = await supabase
      .from("itinerary_days")
      .update({
        day_theme: ai.title,
        accommodation: {
          name: ai.hotel,
        },
      })
      .eq("id", targetDay.id);

    if (updateError) throw updateError;

    // delete old activities
    await supabase
      .from("itinerary_activities")
      .delete()
      .eq("day_id", targetDay.id);

    // insert new activities
    const rows = [
      {
        time_slot: "morning",
        order_index: 1,
        category: "attraction",
        ...ai.morning,
      },
      {
        time_slot: "evening",
        order_index: 2,
        category: "restaurant",
        ...ai.lunch,
      },
      {
        time_slot: "afternoon",
        order_index: 3,
        category: "attraction",
        ...ai.afternoon,
      },
      {
        time_slot: "night",
        order_index: 4,
        category: "restaurant",
        ...ai.dinner,
      },
    ].map((item) => ({
      day_id: targetDay.id,
      time_slot: item.time_slot,
      order_index: item.order_index,
      category: item.category,
      activity_name: item.title,
      tips: `Start ${item.time}`,
      duration_minutes: item.duration_minutes,
      estimated_cost: item.estimated_cost,
    }));

    await supabase.from("itinerary_activities").insert(rows);

    return NextResponse.json({
      success: true,
      message: `Day ${dayNumber} regenerated`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to regenerate day",
      },
      { status: 500 },
    );
  }
}
