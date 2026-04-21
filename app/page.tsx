import Link from "next/link";

export default function TravelLandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm tracking-[0.3em] uppercase text-white/60">
              Travel Planner
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              prefetch={false}
              scroll={true}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
            >
              Login
            </Link>
            <Link
              href="/register"
              prefetch={false}
              scroll={true}
              className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-transparent to-emerald-500/10" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                AI Powered Trip Planning
              </div>
              <h1 className="mt-6 text-5xl lg:text-7xl font-semibold leading-tight">
                Plan unforgettable trips in minutes.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/65 leading-8">
                Create personalized travel itineraries based on your budget,
                travel dates, and preferences. From hidden gems to realistic
                daily budgets — all in one place.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create-trip"
                  prefetch={false}
                  scroll={true}
                  className="rounded-2xl bg-cyan-500 px-6 py-4 font-medium text-black hover:opacity-90"
                >
                  Create Your Trip
                </Link>
                <button className="rounded-2xl border border-white/10 px-6 py-4 hover:bg-white/5">
                  See How It Works
                </button>
              </div>
              <div className="mt-10 flex gap-8 text-sm text-white/50">
                <div>
                  <span className="text-white font-semibold">5 min</span>
                  <br />
                  Average planning time
                </div>
                <div>
                  <span className="text-white font-semibold">100+</span>
                  <br />
                  Destinations ready
                </div>
                <div>
                  <span className="text-white font-semibold">AI</span>
                  <br />
                  Smart recommendations
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl p-6 shadow-2xl">
              <div className="text-sm text-white/50">Sample Itinerary</div>
              <div className="mt-3 text-2xl font-semibold">3 Days in Bali</div>
              <div className="mt-6 space-y-4">
                {[
                  ["Day 1", "Beach club, sunset dinner, Seminyak walk"],
                  ["Day 2", "Ubud rice terrace, cafe hopping, spa"],
                  ["Day 3", "Nusa Penida tour, seafood dinner"],
                ].map(([day, desc]) => (
                  <div
                    key={day}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="font-medium">{day}</div>
                    <div className="mt-1 text-sm text-white/60">{desc}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-white/70">
                Estimated Budget:{" "}
                <span className="text-white font-medium">$420</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              [
                "Personalized Plans",
                "Trips tailored to your budget and travel style.",
              ],
              ["Smart Budgeting", "Know realistic daily costs before you go."],
              ["Share Anywhere", "Send itinerary links or export PDF."],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/3 p-6"
              >
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="rounded-3xl border border-white/10 bg-linear-to-br from-cyan-500/10 to-emerald-500/10 p-10 text-center">
            <h2 className="text-4xl font-semibold">
              Your next trip starts here.
            </h2>
            <p className="mt-4 text-white/65 max-w-2xl mx-auto">
              Skip spreadsheet chaos and endless tabs. Let AI build a smarter
              itinerary for you.
            </p>
            <button className="mt-8 rounded-2xl bg-cyan-500 px-6 py-4 font-medium text-black hover:opacity-90">
              Create Travel Plan
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
