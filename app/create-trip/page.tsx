import Link from "next/link";
import { redirect } from "next/navigation";
import CreateTripForm from "./CreateTripForm";
import { createClient } from "@/lib/supabase/server";

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

export default async function CreateTripPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-muted-foreground text-sm tracking-[0.3em] uppercase">
            Travel Planner
          </div>

          <Link
            href="/trips"
            prefetch={false}
            scroll={true}
            className="inline-flex items-center rounded-2xl border px-4 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground"
          >
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border bg-card p-8 text-card-foreground shadow-sm">
          <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
            AI Itinerary Generator
          </div>

          <h1 className="mt-5 text-4xl font-semibold">
            Create your next trip in minutes
          </h1>

          <p className="text-muted-foreground mt-3 max-w-2xl">
            Tell us where you want to go, your budget, dates, and travel style.
            We’ll build a smart day-by-day itinerary for you.
          </p>

          <CreateTripForm prefs={prefs} />
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border bg-card p-6 text-card-foreground shadow-sm">
            <h2 className="text-xl font-semibold">What you’ll get</h2>

            <ul className="text-muted-foreground mt-4 space-y-3 text-sm">
              <li>• Day-by-day itinerary</li>
              <li>• Attractions & food recommendations</li>
              <li>• Realistic budget breakdown</li>
              <li>• Shareable link & export ready</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <div className="text-sm text-muted-foreground">
              Average generation time
            </div>

            <div className="mt-2 text-3xl font-semibold">&lt; 30 sec</div>
          </div>

          <div className="rounded-3xl border bg-linear-to-br from-primary/10 to-transparent p-6">
            <div className="text-sm text-muted-foreground">Pro Tip</div>

            <p className="mt-2 text-sm text-muted-foreground">
              The more specific your preferences are, the better the AI
              itinerary becomes.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
