import type { Trip } from "@/types";

type Day = Trip["itinerary_days"][number];

interface DayTabsProps {
  days: Day[];
  activeDay: number;
  setActiveDay: React.Dispatch<React.SetStateAction<number>>;
}

const DayTabs = ({ days, activeDay, setActiveDay }: DayTabsProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {days
        .sort((prev, current) =>
          prev.day_number > current.day_number ? 1 : -1,
        )
        .map((day) => {
          const active = activeDay === day.day_number;

          return (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.day_number)}
              className={`rounded-2xl border px-5 py-3 text-sm whitespace-nowrap transition-colors ${
                active
                  ? "border-primary/30 bg-primary/10 font-medium text-primary"
                  : "bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              Day {day.day_number}
            </button>
          );
        })}
    </div>
  );
};

export default DayTabs;
