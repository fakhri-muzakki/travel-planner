import type { CategoryActivity, TripDay } from "@/types";

const calculateTotalCost = (days: TripDay[], category: CategoryActivity) => {
  const result = days.reduce((total, day) => {
    const dayAttractionTotal = day.itinerary_activities
      .filter((activity) => activity.category === category)
      .reduce((sum, activity) => sum + (activity.estimated_cost || 0), 0);

    return total + dayAttractionTotal;
  }, 0);

  return result;
};

export default calculateTotalCost;
