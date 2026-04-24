import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
// import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // logger.info({ data: body });

    const {
      day_id,
      activity_name,
      category = "attraction",
      time_slot = "morning",
      duration_minutes = 60,
      estimated_cost = 0,
      tips = null,
      description = null,
      location_name = null,
    } = body;

    if (!day_id || !activity_name) {
      return NextResponse.json(
        {
          success: false,
          error: "day_id and activity_name are required",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // ========================================
    // AUTH
    // ========================================
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // ========================================
    // VERIFY DAY + OWNERSHIP
    // ========================================
    const { data: day, error: dayError } = await supabase
      .from("itinerary_days")
      .select(
        `
        id,
        itineraries (
          user_id
        )
        `,
      )
      .eq("id", day_id)
      .single();

    if (dayError || !day) {
      return NextResponse.json(
        {
          success: false,
          error: "Day not found",
        },
        { status: 404 },
      );
    }

    const itinerary = Array.isArray(day.itineraries)
      ? day.itineraries[0]
      : day.itineraries;

    const ownerId = itinerary?.user_id;

    if (!ownerId || ownerId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 },
      );
    }

    // ========================================
    // GET NEXT ORDER INDEX
    // ========================================
    const { data: lastActivity } = await supabase
      .from("itinerary_activities")
      .select("order_index")
      .eq("day_id", day_id)
      .order("order_index", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrderIndex = (lastActivity?.order_index ?? 0) + 1;

    // ========================================
    // INSERT
    // ========================================
    const { data: createdActivity, error: insertError } = await supabase
      .from("itinerary_activities")
      .insert({
        day_id,
        activity_name,
        category,
        time_slot,
        duration_minutes,
        estimated_cost,
        tips,
        description,
        location_name,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Activity created",
        data: createdActivity,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create activity",
      },
      { status: 500 },
    );
  }
}
