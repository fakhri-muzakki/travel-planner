import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const { dayId, items } = body;

    for (const item of items) {
      const { error } = await supabase
        .from("itinerary_activities")
        .update({
          order_index: item.order_index,
        })
        .eq("id", item.id)
        .eq("day_id", dayId)
        .select();

      if (error) {
        throw error;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
