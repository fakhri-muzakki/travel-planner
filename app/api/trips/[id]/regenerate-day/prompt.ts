import type { Trip } from "@/types";

interface GetPromptParams {
  dayNumber: number;
  trip: Pick<
    Trip,
    | "destination"
    | "budget_per_person"
    | "traveler_count"
    | "travel_styles"
    | "pace"
  >;
}
const getPrompt = ({ dayNumber, trip }: GetPromptParams) => {
  const prompt = `
Regenerate ONLY day ${dayNumber} for this trip.

Destination: ${trip.destination}
Budget total: ${trip.budget_per_person * trip.traveler_count}
Travelers: ${trip.traveler_count}
Pace: ${trip.pace}
Preferences: ${(trip.travel_styles || []).join(", ")}
IMPORTANT RULES:
- category allowed values:
  attraction
  restaurant
  transport
  accommodation
- lodging activity MUST always use category: accommodation

Return ONLY JSON:

{
  "day": ${dayNumber},
  "title": "",
  "hotel": "",
  "morning": {
    "title": "",
    "time": "08:00",
    "category": "attraction",
    "time_range": "08:00 - 10:00 AM",
    "estimated_cost": 0
  },
  "lunch": {
    "title": "",
    "time": "12:00",
     "category": "restaurant",
     "time_range": "12:00 - 13:00 PM",
    "estimated_cost": 100000
  },
  "afternoon": {
    "title": "",
    "time": "14:00",
    "category": "attraction",
    "time_range": "14:00 - 16:00 PM",
    "estimated_cost": 0
  },
  "dinner": {
    "title": "",
    "time": "19:00",
    "category": "restaurant",
      "time_range": "19:00 - 20:00 PM",
    "estimated_cost": 150000
  },
  "lodging": {
      "title": "Check-in and stay at hotel",
      "category": "accommodation",
      "time": "21:00",
      "time_range": "21:00 - Overnight",
      "estimated_cost": 850000
    }
}
`;

  return prompt;
};

export default getPrompt;
