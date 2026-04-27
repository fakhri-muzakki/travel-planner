import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import * as v from "valibot";
import { createClient } from "@/lib/supabase/server";
import {
  AIResponseSchema,
  ItineraryRequestSchema,
  type AIResponse,
} from "./schema";
import buildPrompt from "./buildPrompt";
import mapActivities from "./mapActivities";

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

      const rows = mapActivities(insertedDay.id, item);

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
