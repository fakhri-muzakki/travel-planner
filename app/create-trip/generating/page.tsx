export default function CreateTripGeneratingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center">
        <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
          {/* Badge */}
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            AI Generating Trip
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Creating your personalized itinerary...
          </h1>

          <p className="mt-4 text-base leading-7 text-white/60">
            We’re analyzing your destination, budget, travel dates, and
            preferences to build a realistic day-by-day travel plan.
          </p>

          {/* Progress */}
          <div className="mt-8">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400" />
            </div>

            <div className="mt-3 text-sm text-white/45">
              Usually takes around 10–30 seconds
            </div>
          </div>

          {/* Steps */}
          <div className="mt-8 grid gap-3">
            {[
              "Finding attractions and local spots",
              "Balancing your budget allocation",
              "Optimizing route and daily schedule",
              "Preparing final itinerary result",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-medium text-cyan-300">
                  {index + 1}
                </div>

                <span className="text-sm text-white/75">{item}</span>
              </div>
            ))}
          </div>

          {/* Bottom Note */}
          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm text-white/75">
            Please keep this page open while your trip is being generated.
          </div>
        </section>
      </div>
    </div>
  );
}
