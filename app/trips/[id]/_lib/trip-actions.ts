import type { Trip } from "@/types";

import type { ActivityForm } from "../types";
import toast from "react-hot-toast";

type Day = Trip["itinerary_days"][number];
type Activity = Trip["itinerary_days"][number]["itinerary_activities"][number];

interface SaveActivity {
  selectedDay: Day;
  form: ActivityForm;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  editingActivity: Activity | null;
  days: Day[];
  setDays: React.Dispatch<React.SetStateAction<Day[]>>;
  activeDay: number;
  closeModal: () => void;
}

export const saveActivity = async ({
  selectedDay,
  form,
  setIsProcessing,
  editingActivity,
  days,
  setDays,
  activeDay,
  closeModal,
}: SaveActivity) => {
  if (!selectedDay) return;

  const activityName = form.activity_name.trim();

  if (!activityName) {
    alert("Activity name is required");
    return;
  }

  try {
    // ========================================
    // UPDATE
    // ========================================
    setIsProcessing(true);
    if (editingActivity) {
      const previousDays = days;

      // Optimistic UI
      setDays((prev) =>
        prev.map((day) => {
          if (day.day_number !== activeDay) return day;

          return {
            ...day,
            itinerary_activities: day.itinerary_activities.map((item) =>
              item.id === editingActivity.id
                ? {
                    ...item,
                    activity_name: activityName,
                    time_slot: form.time_slot,
                    category: form.category,
                    estimated_cost: form.estimated_cost,
                    duration_minutes: `${form.start_time} - ${form.end_time} ${Number(form.end_time[0]) > 12 ? "PM" : "AM"}`,
                  }
                : item,
            ),
          };
        }),
      );

      closeModal();

      const response = await fetch(`/api/activities/${editingActivity.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activity_name: activityName,
          time_slot: form.time_slot,
          category: form.category,
          estimated_cost: form.estimated_cost,
          duration_minutes: `${form.start_time} - ${form.end_time}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setDays(previousDays);
        throw new Error(result.error || "Failed to update activity");
      }
      toast.success("Update activity successfully");
      setIsProcessing(false);
      return;
    }

    // ========================================
    // CREATE
    // ========================================
    const tempId = crypto.randomUUID();

    const optimisticActivity: Activity = {
      id: tempId,
      category: form.category,
      time_slot: form.time_slot,
      activity_name: activityName,
      estimated_cost: form.estimated_cost,
      duration_minutes: `${form.start_time} - ${form.end_time}`,
    };

    const previousDays = days;

    // Optimistic UI
    setDays((prev) =>
      prev.map((day) =>
        day.day_number === activeDay
          ? {
              ...day,
              itinerary_activities: [
                ...day.itinerary_activities,
                optimisticActivity,
              ],
            }
          : day,
      ),
    );

    closeModal();

    const response = await fetch("/api/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day_id: selectedDay.id,
        activity_name: activityName,
        category: form.category,
        time_slot: form.time_slot,
        estimated_cost: form.estimated_cost,
        duration_minutes: `${form.start_time} - ${form.end_time} ${Number(form.end_time[0]) > 12 ? "PM" : "AM"}`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setDays(previousDays);
      throw new Error(result.error || "Failed to create activity");
    }

    const createdActivity = result.data;

    // replace temp activity with real DB row
    setDays((prev) =>
      prev.map((day) =>
        day.day_number === activeDay
          ? {
              ...day,
              itinerary_activities: day.itinerary_activities.map((item) =>
                item.id === tempId ? createdActivity : item,
              ),
            }
          : day,
      ),
    );

    //   toast.success("Created activity successfully");
    setIsProcessing(false);
  } catch (error) {
    alert(error instanceof Error ? error.message : "Failed to save activity");
  }
};
