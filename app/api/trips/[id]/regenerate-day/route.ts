import * as v from "valibot";
import getPrompt from "./prompt";
import { generateText } from "ai";
import { logger } from "@/lib/logger";
import { google } from "@ai-sdk/google";
import type { AIResult } from "./types";
import { NextResponse } from "next/server";
import type { Trip, TripDay } from "@/types";
import mapAiToActivities from "./mapAiToActivities";
import { createClient } from "@/lib/supabase/server";

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
      .single<Trip>();

    if (error || !trip) {
      return NextResponse.json(
        { success: false, error: "Trip not found" },
        { status: 404 },
      );
    }

    const targetDay = trip.itinerary_days.find(
      (d: TripDay) => d.day_number === dayNumber,
    );

    if (!targetDay) {
      return NextResponse.json(
        { success: false, error: "Day not found" },
        { status: 404 },
      );
    }

    // AI Generate
    const prompt = getPrompt({ dayNumber, trip });

    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      prompt,
      temperature: 0.8,
    });

    const ai: AIResult = JSON.parse(
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim(),
    );

    logger.info({ data: ai });

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
    const rows = mapAiToActivities(ai, targetDay.id);

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
