import Link from "next/link";

const Hero = () => {
  return (
    <section className="rounded-3xl border bg-linear-to-br from-primary/10 via-card/40 to-emerald-500/10 p-8 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border bg-muted px-4 py-2 text-sm text-muted-foreground">
            Your Travel Workspace
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight lg:text-5xl">
            All Your Trips in One Place
          </h1>

          <p className="text-muted-foreground mt-4 max-w-3xl leading-8">
            Manage itineraries, reopen previous plans, export PDF, and share
            journeys instantly.
          </p>
        </div>

        <Link
          href="/create-trip"
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Create New Trip
        </Link>
      </div>
    </section>
  );
};

export default Hero;
