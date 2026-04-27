import type { Trip } from "@/types";
import Card from "./Card";
import { formatDate, formatMoney } from "@/lib/utils";

interface HeroProps {
  trip: Trip;
  totalBudget: number;
}

const Hero = ({ trip, totalBudget }: HeroProps) => {
  return (
    <section className="rounded-3xl border bg-linear-to-br from-primary/10 via-card/40 to-emerald-500/10 p-8 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border bg-muted px-4 py-2 text-sm text-muted-foreground">
            AI Generated Itinerary
          </div>

          <h1 className="mt-5 text-5xl font-semibold">
            {trip.duration_days} Days in {trip.destination}
          </h1>

          <p className="text-muted-foreground mt-4 max-w-3xl leading-8">
            Personalized itinerary optimized for budget, pace, and traveler
            preferences.
          </p>
        </div>

        <div className="grid min-w-70 grid-cols-2 gap-3 text-sm">
          <Card label="Budget" value={formatMoney(totalBudget)} />
          <Card label="Travelers" value={`${trip.traveler_count} People`} />
          <Card
            label="Dates"
            value={`${formatDate(trip.start_date)} - ${formatDate(
              trip.end_date,
            )}`}
          />
          <Card label="Pace" value={trip.pace} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
