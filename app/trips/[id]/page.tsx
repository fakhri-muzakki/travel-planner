import { createClient } from "@/lib/supabase/server";
import TripView from "./TripView";
import { notFound } from "next/navigation";
import { logger } from "@/lib/logger";

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
    .single();

  logger.info({ data: trip });

  if (!trip) notFound();

  return <TripView trip={trip} />;
}
