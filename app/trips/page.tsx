import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function TripsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/trips"
            className="text-sm tracking-[0.3em] uppercase text-white/65"
          >
            Travel Planner
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/create-trip"
              className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:opacity-90 transition"
            >
              New Trip
            </Link>

            {/* <form action="/auth/signout" method="post"> */}
            <LogoutButton />
            {/* </form> */}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <section className="rounded-3xl border border-white/10 bg-linear-to-br from-cyan-500/10 via-white/2 to-emerald-500/10 p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                Your Travel Workspace
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight lg:text-5xl">
                All Your Trips in One Place
              </h1>

              <p className="mt-4 max-w-3xl text-white/60 leading-8">
                Manage itineraries, reopen previous plans, export PDF, and share
                journeys instantly.
              </p>
            </div>

            <Link
              href="/create-trip"
              className="rounded-2xl bg-cyan-500 px-6 py-4 text-sm font-medium text-black hover:opacity-90 transition"
            >
              Create New Trip
            </Link>
          </div>
        </section>

        {/* Content */}
        <section className="mt-10">
          {hasTrips ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your Trips</h2>

                <div className="text-sm text-white/45">
                  {trips.length} saved trip{trips.length > 1 ? "s" : ""}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {trips.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className="group rounded-3xl border border-white/10 bg-white/3 p-6 transition hover:border-cyan-400/40 hover:bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                          {trip.destination}
                        </div>

                        <h3 className="mt-3 text-2xl font-semibold">
                          {trip.title}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          trip.status === "done"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-yellow-500/15 text-yellow-300"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>

                    <div className="mt-6 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/45">Duration</span>
                        <span>{trip.duration_days} Days</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-white/45">Travelers</span>
                        <span>{trip.traveler_count}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-white/45">Budget</span>
                        <span>
                          {trip.currency}{" "}
                          {Number(trip.budget_per_person).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-white/45">Dates</span>
                        <span>
                          {trip.start_date} → {trip.end_date}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-white/45">Pace</span>
                        <span className="capitalize">{trip.pace}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-sm">
                      <span className="text-white/45">Open itinerary</span>

                      <span className="translate-x-0 transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/3 p-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-3xl">
                ✈️
              </div>

              <h2 className="mt-6 text-3xl font-semibold">No Trips Yet</h2>

              <p className="mx-auto mt-4 max-w-xl text-white/60 leading-8">
                You haven’t created any itinerary yet. Start with your next
                destination and let AI build a personalized travel plan in
                minutes.
              </p>

              <Link
                href="/create-trip"
                className="mt-8 inline-flex rounded-2xl bg-cyan-500 px-6 py-4 font-medium text-black hover:opacity-90 transition"
              >
                Create Your First Trip
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
