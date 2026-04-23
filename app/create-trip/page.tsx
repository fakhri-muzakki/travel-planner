import Link from "next/link";
import { redirect } from "next/navigation";
import CreateTripForm from "./CreateTripForm";
import { createClient } from "@/lib/supabase/server";

export default async function CreateTripPage() {
  const prefs = [
    "Food",
    "Nature",
    "Adventure",
    "Luxury",
    "Nightlife",
    "Culture",
    "Shopping",
    "Relaxing",
  ];
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="text-sm tracking-[0.3em] uppercase text-white/60">
            Travel Planner
          </div>
          <Link
            href="/trips"
            prefetch={false}
            scroll={true}
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Back Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <section className="rounded-3xl border border-white/10 bg-white/3 p-8">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            AI Itinerary Generator
          </div>
          <h1 className="mt-5 text-4xl font-semibold">
            Create your next trip in minutes
          </h1>
          <p className="mt-3 text-white/60 max-w-2xl">
            Tell us where you want to go, your budget, dates, and travel style.
            We’ll build a smart day-by-day itinerary for you.
          </p>

          <CreateTripForm prefs={prefs} />
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
            <h2 className="text-xl font-semibold">What you’ll get</h2>
            <ul className="mt-4 space-y-3 text-white/65 text-sm">
              <li>• Day-by-day itinerary</li>
              <li>• Attractions & food recommendations</li>
              <li>• Realistic budget breakdown</li>
              <li>• Shareable link & export ready</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <div className="text-sm text-white/70">Average generation time</div>
            <div className="mt-2 text-3xl font-semibold">&lt; 30 sec</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-linear-to-br from-cyan-500/10 to-transparent p-6">
            <div className="text-sm text-white/60">Pro Tip</div>
            <p className="mt-2 text-sm text-white/75">
              The more specific your preferences are, the better the AI
              itinerary becomes.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
