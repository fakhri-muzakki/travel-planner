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
    <div className="space-y-6 rounded-3xl border border-white/10 bg-white/3 p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="">
          <div className="text-sm text-cyan-300 ">
            Day {selectedDay.day_number}
          </div>

          <h2 className="mt-2 text-3xl font-semibold">
            {selectedDay.day_theme}
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={openCreateModal}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 text-nowrap"
          >
            Add Activity
          </button>

          <button
            onClick={() => regenerateDay(selectedDay.day_number)}
            disabled={isPending || loadingDay !== null}
            className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/15 disabled:opacity-50 text-nowrap"
          >
            {loadingDay === selectedDay.day_number
              ? "Regenerating..."
              : "Regenerate Day"}
          </button>
        </div>
      </div>

      {selectedDay.itinerary_activities.map((item) => (
        <SortableCard key={item.id} item={item}>
          <div
            // key={item.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-white/50">
                  {labels[item.time_slot as keyof typeof labels]}
                </div>

                <div className="mt-2 font-medium leading-7">
                  {item.activity_name}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-sm font-medium text-cyan-300">
                  IDR {Number(item.estimated_cost).toLocaleString("id-ID")}
                </div>

                <div className="mt-1 text-xs text-white/45">
                  {item.duration_minutes}
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="rounded-xl border border-white/10 px-3 py-1 text-xs hover:bg-white/10"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteActivity(item.id)}
                    className="rounded-xl border border-red-400/30 px-3 py-1 text-xs text-red-300 hover:bg-red-400/10"
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
