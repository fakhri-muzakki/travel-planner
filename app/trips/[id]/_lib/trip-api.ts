import type { CategoryActivity, TimeSlot } from "@/types";

export const regenerateTripDay = async (tripId: string, dayNumber: number) => {
  const response = await fetch(`/api/trips/${tripId}/regenerate-day`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dayNumber,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to regenerate day");
  }

  return result;
};

interface Reordered {
  order_index: number;
  id: string;
  time_slot: TimeSlot;
  activity_name: string;
  estimated_cost: number;
  category: CategoryActivity;
  duration_minutes: string;
}

export const saveReorder = async (dayId: string, reordered: Reordered[]) => {
  await fetch("/api/activities/reorder", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dayId: dayId,
      items: reordered.map((item) => ({
        id: item.id,
        order_index: item.order_index,
      })),
    }),
  });
};
