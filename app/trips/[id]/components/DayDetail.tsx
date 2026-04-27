import type { Trip, TripDay } from "@/types";
import { SortableCard } from "./SortableCard";
import { labels } from "../data";

type Activity = Trip["itinerary_days"][number]["itinerary_activities"][number];

interface DayDetailProps {
  selectedDay: TripDay;
  openCreateModal: () => void;
  regenerateDay: (dayNumber: number) => Promise<void>;
  loadingDay: number | null;
  isPending: boolean;
  deleteActivity: (activityId: string) => Promise<void>;
  openEditModal: (activity: Activity) => void;
}

const DayDetail = ({
  selectedDay,
  openCreateModal,
  regenerateDay,
  loadingDay,
  isPending,
  deleteActivity,
  openEditModal,
}: DayDetailProps) => {
  return (
    <div className="space-y-6 rounded-3xl border bg-card p-8 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-medium text-primary">
            Day {selectedDay.day_number}
          </div>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {selectedDay.day_theme}
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={openCreateModal}
            className="rounded-2xl border bg-background px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-nowrap"
          >
            Add Activity
          </button>

          <button
            onClick={() => regenerateDay(selectedDay.day_number)}
            disabled={isPending || loadingDay !== null}
            className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15 disabled:pointer-events-none disabled:opacity-50 text-nowrap"
          >
            {loadingDay === selectedDay.day_number
              ? "Regenerating..."
              : "Regenerate Day"}
          </button>
        </div>
      </div>

      {selectedDay.itinerary_activities.map((item) => (
        <SortableCard key={item.id} item={item}>
          <div className="rounded-2xl border bg-muted/40 p-5 transition-colors hover:bg-muted/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  {labels[item.time_slot as keyof typeof labels]}
                </div>

                <div className="mt-2 font-medium leading-7">
                  {item.activity_name}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-sm font-medium text-primary pr-5">
                  IDR {Number(item.estimated_cost).toLocaleString("id-ID")}
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {item.duration_minutes}
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="rounded-xl border px-3 py-1 text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteActivity(item.id)}
                    className="rounded-xl border border-destructive/30 px-3 py-1 text-xs text-destructive transition-colors hover:bg-destructive/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SortableCard>
      ))}
    </div>
  );
};

export default DayDetail;
