export default function CreateTripGeneratingPage() {
  const steps = [
    "Analyzing your destination and travel dates",
    "Balancing itinerary with your budget",
    "Finding attractions and food spots",
    "Optimizing daily routes and timing",
    "Finalizing your personalized trip plan",
  ];
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
        <section className="rounded-3xl border border-white/10 bg-white/3 p-8 lg:p-10">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            AI Generating
          </div>
          <h1 className="mt-5 text-4xl lg:text-5xl font-semibold leading-tight">
            Building your perfect trip...
          </h1>
          <p className="mt-4 text-white/60 max-w-xl">
            We’re crafting a realistic day-by-day itinerary based on your
            budget, dates, and travel style.
          </p>

          <div className="mt-8 h-3 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-2/3 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="mt-2 text-sm text-white/45">
            Estimated time: 10–30 seconds
          </div>

          <div className="mt-8 space-y-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/15 text-sm text-cyan-300">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{step}</div>
                  <div className="mt-1 text-sm text-white/50">
                    Please keep this tab open while we generate your plan.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
            <div className="text-sm text-white/50">Your request</div>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/55">Destination</span>
                <span>Tokyo</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/55">Budget</span>
                <span>$1,200</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/55">Travelers</span>
                <span>2 People</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/55">Duration</span>
                <span>5 Days</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <div className="text-sm text-white/70">
              What you&apos;ll receive
            </div>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li>• Daily activity timeline</li>
              <li>• Restaurant recommendations</li>
              <li>• Hotel suggestions</li>
              <li>• Budget breakdown</li>
              <li>• Local travel tips</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-linear-to-br from-cyan-500/10 to-transparent p-6">
            <div className="text-sm text-white/60">Pro Tip</div>
            <p className="mt-2 text-sm text-white/75">
              More detailed preferences usually produce better recommendations.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
