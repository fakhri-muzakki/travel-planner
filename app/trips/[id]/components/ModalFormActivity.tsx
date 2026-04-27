import type { Trip } from "@/types";
import type { ActivityForm } from "../types";

type Activity = Trip["itinerary_days"][number]["itinerary_activities"][number];

interface ModalFormActivityProps {
  editingActivity: Activity | null;
  form: ActivityForm;
  setForm: React.Dispatch<React.SetStateAction<ActivityForm>>;
  closeModal: () => void;
  saveActivity: () => Promise<void>;
}

const ModalFormActivity = ({
  editingActivity,
  form,
  setForm,
  closeModal,
  saveActivity,
}: ModalFormActivityProps) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 px-6 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border bg-card p-6 text-card-foreground shadow-xl">
        {/* Header */}
        <h3 className="text-2xl font-semibold tracking-tight">
          {editingActivity ? "Edit Activity" : "Add Activity"}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Fill in the activity details for this itinerary day.
        </p>

        {/* Form */}
        <div className="mt-6 space-y-5">
          {/* Activity Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Activity Name</label>

            <input
              value={form.activity_name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  activity_name: e.target.value,
                }))
              }
              placeholder="e.g. Visit Shibuya Sky"
              className="w-full rounded-2xl border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
            />
          </div>

          {/* Time Slot */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Time</label>

            <select
              value={form.time_slot}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  time_slot: e.target.value as ActivityForm["time_slot"],
                }))
              }
              className="w-full rounded-2xl border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Lunch</option>
              <option value="night">Dinner</option>
            </select>
          </div>

          {/* Category activity */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Activity</label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  category: e.target.value as ActivityForm["category"],
                }))
              }
              className="w-full rounded-2xl border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
            >
              <option value="attraction">Activity</option>
              <option value="restaurant">Food</option>
              <option value="transport">Transport</option>
              <option value="accommodation">Accommodation</option>
            </select>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estimated Budget</label>

            <input
              type="number"
              value={form.estimated_cost || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  estimated_cost: Number(e.target.value),
                }))
              }
              placeholder="e.g. 150000"
              className="w-full rounded-2xl border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
            />
          </div>

          {/* Start & End Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>

              <input
                type="time"
                value={form.start_time ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    start_time: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>

              <input
                type="time"
                value={form.end_time ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    end_time: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="rounded-2xl border px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </button>

          <button
            onClick={saveActivity}
            className="rounded-2xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalFormActivity;
