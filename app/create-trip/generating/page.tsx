export default function CreateTripGeneratingPage() {
  return (
    <div className="min-h-screen bg-background px-6 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center">
        <section className="w-full max-w-2xl rounded-3xl border bg-card p-8 text-card-foreground shadow-sm backdrop-blur-xl sm:p-10">
          {/* Badge */}
          <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            AI Generating Trip
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Creating your personalized itinerary...
          </h1>

          <p className="text-muted-foreground mt-4 text-base leading-7">
            We’re analyzing your destination, budget, travel dates, and
            preferences to build a realistic day-by-day travel plan.
          </p>

          {/* Progress */}
          <div className="mt-8">
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full w-1/2 animate-pulse rounded-full" />
            </div>

            <div className="text-muted-foreground mt-3 text-sm">
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
                className="flex items-center gap-4 rounded-2xl border bg-background/60 px-4 py-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {index + 1}
                </div>

                <span className="text-muted-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Bottom Note */}
          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm text-foreground/80">
            Please keep this page open while your trip is being generated.
          </div>
        </section>
      </div>
    </div>
  );
}
