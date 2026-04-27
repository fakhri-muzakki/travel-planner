import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TripView from "./TripView";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function SharePage({ params }: PageProps) {
  const { token } = await params;

  const supabase = await createClient();

  const { data: trip, error } = await supabase
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
    .eq("share_token", token)
    // .eq("is_public", true)
    .single();

  if (error || !trip) notFound();

  return <TripView trip={trip} />;
}
