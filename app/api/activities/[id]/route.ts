import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

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

    // FIND ACTIVITY + OWNERSHIP
    const { data: activity, error: findError } = await supabase
      .from("itinerary_activities")
      .select(
        `
        id,
        itinerary_days (
          id,
          itineraries (
            user_id
          )
        )
        `,
      )
      .eq("id", id)
      .single();

    if (findError || !activity) {
      return NextResponse.json(
        {
          success: false,
          error: "Activity not found",
        },
        { status: 404 },
      );
    }

    // Supabase nested relation sering typed sebagai array
    const day = Array.isArray(activity.itinerary_days)
      ? activity.itinerary_days[0]
      : activity.itinerary_days;

    const itinerary = Array.isArray(day?.itineraries)
      ? day.itineraries[0]
      : day?.itineraries;

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

    // Delete
    const { error: deleteError } = await supabase
      .from("itinerary_activities")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Activity deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete activity",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      activity_name,
      category,
      time_slot,
      duration_minutes,
      estimated_cost,
      tips,
      description,
      location_name,
    } = body;

    const supabase = await createClient();

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

    // FIND ACTIVITY + OWNERSHIP
    const { data: activity, error: findError } = await supabase
      .from("itinerary_activities")
      .select(
        `
        id,
        itinerary_days (
          id,
          itineraries (
            user_id
          )
        )
        `,
      )
      .eq("id", id)
      .single();

    if (findError || !activity) {
      return NextResponse.json(
        {
          success: false,
          error: "Activity not found",
        },
        { status: 404 },
      );
    }

    const day = Array.isArray(activity.itinerary_days)
      ? activity.itinerary_days[0]
      : activity.itinerary_days;

    const itinerary = Array.isArray(day?.itineraries)
      ? day.itineraries[0]
      : day?.itineraries;

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
    // BUILD UPDATE PAYLOAD
    // only update fields that are sent
    // ========================================
    const payload: Record<string, unknown> = {};

    if (activity_name !== undefined) payload.activity_name = activity_name;
    if (category !== undefined) payload.category = category;
    if (time_slot !== undefined) payload.time_slot = time_slot;
    if (duration_minutes !== undefined)
      payload.duration_minutes = duration_minutes;
    if (estimated_cost !== undefined) payload.estimated_cost = estimated_cost;
    if (tips !== undefined) payload.tips = tips;
    if (description !== undefined) payload.description = description;
    if (location_name !== undefined) payload.location_name = location_name;

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No fields to update",
        },
        { status: 400 },
      );
    }

    // Update
    const { data: updatedActivity, error: updateError } = await supabase
      .from("itinerary_activities")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: "Activity updated",
      data: updatedActivity,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update activity",
      },
      { status: 500 },
    );
  }
}
