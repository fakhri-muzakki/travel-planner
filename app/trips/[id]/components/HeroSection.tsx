import type { Trip } from "@/types";
import { formatDate, formatMoney } from "../_lib/formatters";
import Card from "./Card";

const HeroSection = ({
  trip,
  totalBudget,
}: {
  trip: Trip;
  totalBudget: number;
}) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-linear-to-br from-cyan-500/10 via-white/2 to-emerald-500/10 p-8 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            AI Generated Itinerary
          </div>

          <h1 className="mt-5 text-5xl font-semibold">
            {trip.duration_days} Days in {trip.destination}
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-white/65">
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

export default HeroSection;
