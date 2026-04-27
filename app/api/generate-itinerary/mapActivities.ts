import type { AIResult } from "./types";

const mapActivities = (id: string, item: AIResult) => {
  const rows = [
    {
      day_id: id,
      order_index: 1,
      time_slot: "morning",
      category: item.morning.category,
      activity_name: item.morning.title,
      tips: `Start ${item.morning.time}`,
      duration_minutes: item.morning.time_range,
      estimated_cost: item.morning.estimated_cost,
    },
    {
      day_id: id,
      order_index: 2,
      time_slot: "afternoon",
      category: item.afternoon.category,
      activity_name: item.afternoon.title,
      tips: `Start ${item.afternoon.time}`,
      duration_minutes: item.afternoon.time_range,
      estimated_cost: item.afternoon.estimated_cost,
    },
    {
      day_id: id,
      order_index: 3,
      time_slot: "evening",
      category: item.lunch.category,
      activity_name: item.lunch.title,
      tips: `Start ${item.lunch.time}`,
      duration_minutes: item.lunch.time_range,
      estimated_cost: item.lunch.estimated_cost,
    },
    {
      day_id: id,
      order_index: 4,
      time_slot: "night",
      category: item.dinner.category,
      tips: `Start ${item.dinner.time}`,
      activity_name: item.dinner.title,
      duration_minutes: item.dinner.time_range,
      estimated_cost: item.dinner.estimated_cost,
    },
    {
      day_id: id,
      order_index: 5,
      time_slot: "night",
      category: item.lodging.category,
      tips: `Start ${item.lodging.time}`,
      activity_name: item.lodging.title,
      duration_minutes: item.lodging.time_range,
      estimated_cost: item.lodging.estimated_cost,
    },
  ];

  return rows;
};

export default mapActivities;
