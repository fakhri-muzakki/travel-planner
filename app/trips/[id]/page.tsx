import { createClient } from "@/lib/supabase/client";
import TripView from "./TripView";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TripsId({ params }: PageProps) {
  const { id } = await params;
  const supabase = createClient();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/user`,
    {
      headers: { Cookie: (await cookies()).toString() }, // Kirim cookies
    },
  );
  const { user } = await response.json();

  if (!user) redirect("/login");

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
