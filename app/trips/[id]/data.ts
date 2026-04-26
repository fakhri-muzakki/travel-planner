import type { Trip } from "@/types";
import calculateTotalCost from "./_lib/calculateTotalCost";

type Day = Trip["itinerary_days"][number];

export const getTotalBudget = (days: Day[]) => {
  const totalBudgets = [
    {
      category: "transport",
      total_cost: calculateTotalCost(days, "transport"),
    },
    {
      category: "accommodation",
      total_cost: calculateTotalCost(days, "accommodation"),
    },
    {
      category: "food",
      total_cost: calculateTotalCost(days, "restaurant"),
    },
    {
      category: "activities",
      total_cost: calculateTotalCost(days, "attraction"),
    },
  ];

  const totalBudget = totalBudgets.reduce(
    (sum, item) => sum + (item.total_cost || 0),
    0,
  );

  return { totalBudgets, totalBudget };
};

export const labels = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Lunch",
  night: "Dinner",
};
