import Link from "next/link";

const EmptyTrips = () => {
  return (
    <div className="rounded-3xl border bg-card p-10 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border bg-muted text-3xl">
        ✈️
      </div>

      <h2 className="mt-6 text-3xl font-semibold">No Trips Yet</h2>

      <p className="text-muted-foreground mx-auto mt-4 max-w-xl leading-8">
        You haven’t created any itinerary yet. Start with your next destination
        and let AI build a personalized travel plan in minutes.
      </p>

      <Link
        href="/create-trip"
        className="mt-8 inline-flex rounded-2xl bg-primary px-6 py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Create Your First Trip
      </Link>
    </div>
  );
};

export default EmptyTrips;
