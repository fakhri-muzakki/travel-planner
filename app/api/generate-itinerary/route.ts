/// app/api/generate-itinerary/route.ts

import { NextResponse } from "next/server";
import * as v from "valibot";

import { createClient } from "@/lib/supabase/server";

import { ItineraryRequestSchema } from "@/app/features/trip/schemas";
import { createTrip } from "@/app/features/trip/service";

export async function POST(request: Request) {
  try {
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

    const body = await request.json();

    const validated = v.parse(ItineraryRequestSchema, body);

    const result = await createTrip({
      userId: user.id,
      payload: validated,
    });

    return NextResponse.json({
      success: true,
      tripId: result.tripId,
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
