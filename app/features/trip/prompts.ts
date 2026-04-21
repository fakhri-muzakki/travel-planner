import type { ItineraryRequest } from "./schemas";

export default function buildPrompt(input: ItineraryRequest, days: number) {
  return `
Create a realistic travel itinerary.

Destination:
${input.destination}

Budget:
${input.budget} IDR

Travelers:
${input.travelers}

Duration:
${days} days

Preferences:
${input.preferences?.join(", ") || "Any"}

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- No code fences
- Budget values must be numbers
- Create EXACTLY ${days} day objects

JSON FORMAT:

{
  "days": [
    {
      "day": 1,
      "title": "Theme",
      "morning": "Activity",
      "lunch": "Restaurant",
      "afternoon": "Activity",
      "dinner": "Restaurant",
      "hotel": "Hotel Name"
    }
  ],
  "budget": {
    "transportation": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0
  }
}

Total budget max ${input.budget}.
`;
}
