import type { AIResult } from "./types";

const mapAiToActivities = (ai: AIResult, id: string) => {
  const rows = [
    {
      time_slot: "morning",
      order_index: 1,
      ...ai.morning,
    },
    {
      time_slot: "evening",
      order_index: 2,
      ...ai.lunch,
    },
    {
      time_slot: "afternoon",
      order_index: 3,
      ...ai.afternoon,
    },
    {
      time_slot: "night",
      order_index: 4,
      ...ai.dinner,
    },
    {
      time_slot: "night",
      order_index: 5,
      ...ai.lodging,
    },
  ].map((item) => ({
    day_id: id,
    time_slot: item.time_slot,
    order_index: item.order_index,
    category: item.category,
    activity_name: item.title,
    tips: `Start ${item.time}`,
    duration_minutes: item.time_range,
    estimated_cost: item.estimated_cost,
  }));

  return rows;
};

export default mapAiToActivities;
