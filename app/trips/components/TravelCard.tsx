import Link from "next/link";

interface TravelCardProps {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  duration_days: string;
  traveler_count: string;
  budget_per_person: string;
  currency: string;
  pace: string;
  status: string;
  created_at: string;
}

const TravelCard = ({
  id,
  currency,
  destination,
  duration_days,
  end_date,
  pace,
  start_date,
  status,
  title,
  traveler_count,
  budget_per_person,
}: TravelCardProps) => {
  return (
    <Link
      key={id}
      href={`/trips/${id}`}
      className="group rounded-3xl border bg-card p-6 transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-muted-foreground text-xs uppercase tracking-[0.25em]">
            {destination}
          </div>

          <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs ${
            status === "done"
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-yellow-500/15 text-yellow-400"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Duration</span>
          <span>{duration_days} Days</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Travelers</span>
          <span>{traveler_count}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Budget</span>
          <span>
            {currency} {Number(budget_per_person).toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Dates</span>
          <span>
            {start_date} → {end_date}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Pace</span>
          <span className="capitalize">{pace}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-5 text-sm">
        <span className="text-muted-foreground">Open itinerary</span>

        <span className="translate-x-0 transition group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
};

export default TravelCard;
