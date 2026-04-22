// import { createClient } from "@/lib/supabase/server";
// import TripView from "../../trips/[id]/TripView";
// import { notFound } from "next/navigation";

// type PageProps = {
//   params: Promise<{
//     token: string;
//   }>;
// };

// export default async function SharePage({ params }: PageProps) {
//   const { token } = await params;
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) notFound();

//   const { data: trip } = await supabase
//     .from("itineraries")
//     .select(
//       `
//       *,
//       itinerary_days (
//         *,
//         itinerary_activities (*)
//       ),
//       itinerary_budget_summary (*)
//     `,
//     )
//     .eq("share_token", token)
//     .eq("is_public", true)
//     .single();

//   if (!trip) notFound();

//   return <TripView trip={trip} />;
// }

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

  console.log(trip);

  if (error || !trip) notFound();

  return <TripView trip={trip} />;
}
