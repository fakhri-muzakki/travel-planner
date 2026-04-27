import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import EmptyTrips from "./components/EmptyTrips";
import TravelCard from "./components/TravelCard";

export default async function TripsPage() {
  const supabase = createClient();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/user`,
    {
      headers: { Cookie: (await cookies()).toString() }, // Kirim cookies
    },
  );
  const { user } = await response.json();

  if (!user) redirect("/login");

  const { data: trips } = await supabase
    .from("itineraries")
    .select(
      `
      id,
      title,
      destination,
      start_date,
      end_date,
      duration_days,
      traveler_count,
      budget_per_person,
      currency,
      pace,
      status,
      created_at
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const hasTrips = trips && trips.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <Hero />

        {/* Content */}
        <section className="mt-10">
          {hasTrips ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your Trips</h2>

                <div className="text-muted-foreground text-sm">
                  {trips.length} saved trip{trips.length > 1 ? "s" : ""}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {trips.map((trip) => (
                  <TravelCard key={trip.id} {...trip} />
                ))}
              </div>
            </>
          ) : (
            <EmptyTrips />
          )}
        </section>
      </main>
    </div>
  );
}
