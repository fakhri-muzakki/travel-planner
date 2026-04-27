import Link from "next/link";

export default function TravelLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-muted-foreground text-sm tracking-[0.3em] uppercase">
              Travel Planner
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              prefetch={false}
              scroll={true}
              className="inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Login
            </Link>

            <Link
              href="/register"
              prefetch={false}
              scroll={true}
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-emerald-500/10 dark:to-emerald-500/10" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:py-32">
            <div>
              <div className="inline-flex rounded-full border bg-muted px-4 py-2 text-sm text-muted-foreground">
                AI Powered Trip Planning
              </div>

              <h1 className="mt-6 text-5xl font-semibold leading-tight lg:text-7xl">
                Plan unforgettable trips in minutes.
              </h1>

              <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
                Create personalized travel itineraries based on your budget,
                travel dates, and preferences. From hidden gems to realistic
                daily budgets — all in one place.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/create-trip"
                  prefetch={false}
                  scroll={true}
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Create Your Trip
                </Link>

                <button className="rounded-2xl border px-6 py-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                  See How It Works
                </button>
              </div>

              <div className="text-muted-foreground mt-10 flex gap-8 text-sm">
                <div>
                  <span className="text-foreground font-semibold">5 min</span>
                  <br />
                  Average planning time
                </div>

                <div>
                  <span className="text-foreground font-semibold">100+</span>
                  <br />
                  Destinations ready
                </div>

                <div>
                  <span className="text-foreground font-semibold">AI</span>
                  <br />
                  Smart recommendations
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-card/80 p-6 shadow-2xl backdrop-blur-xl">
              <div className="text-muted-foreground text-sm">
                Sample Itinerary
              </div>

              <div className="mt-3 text-2xl font-semibold">3 Days in Bali</div>

              <div className="mt-6 space-y-4">
                {[
                  ["Day 1", "Beach club, sunset dinner, Seminyak walk"],
                  ["Day 2", "Ubud rice terrace, cafe hopping, spa"],
                  ["Day 3", "Nusa Penida tour, seafood dinner"],
                ].map(([day, desc]) => (
                  <div key={day} className="rounded-2xl border bg-muted/40 p-4">
                    <div className="font-medium">{day}</div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {desc}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-muted-foreground">
                Estimated Budget:{" "}
                <span className="text-foreground font-medium">$420</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              [
                "Personalized Plans",
                "Trips tailored to your budget and travel style.",
              ],
              ["Smart Budgeting", "Know realistic daily costs before you go."],
              ["Share Anywhere", "Send itinerary links or export PDF."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-3xl border bg-card p-6">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-3">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="rounded-3xl border bg-linear-to-br from-primary/10 to-emerald-500/10 p-10 text-center">
            <h2 className="text-4xl font-semibold">
              Your next trip starts here.
            </h2>

            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              Skip spreadsheet chaos and endless tabs. Let AI build a smarter
              itinerary for you.
            </p>

            <button className="mt-8 rounded-2xl bg-primary px-6 py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90">
              Create Travel Plan
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
