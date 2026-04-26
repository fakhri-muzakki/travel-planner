import { createClient } from "@/lib/supabase/server";
import TripView from "./TripView";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TripsId({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: trip } = await supabase
    .from("itineraries")
    .select(
      `
      *,
      itinerary_days (
        *,
        itinerary_activities (*)
      ),
      itinerary_budget_summary (*)
    `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .order("day_number", { foreignTable: "itinerary_days" })
    .order("order_index", {
      foreignTable: "itinerary_days.itinerary_activities",
    })
    .single();

  if (!trip) notFound();

  return <TripView trip={trip} />;
}
