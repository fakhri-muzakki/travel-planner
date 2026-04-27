import type { ItineraryRequest } from "./schema";

const buildPrompt = (input: ItineraryRequest, days: number) => {
  return `
Create realistic travel itinerary.

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

Dietary:
${input.dietary || "Any"}

Pace:
${input.pace || "moderate"}

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- No code fences
- Use integer numbers only
- Create EXACTLY ${days} days
- Respect dietary preference for lunch and dinner
- If Halal, only halal-friendly restaurants
- If Vegetarian/Vegan, food must match
- Pace affects schedule:
  relaxed = fewer activities + more free time
  moderate = balanced itinerary
  fast = packed itinerary
- Total budget MUST NOT exceed ${input.budget}
- Budget summary totals must match realistic trip cost
- category allowed values:
  attraction
  restaurant
  transport
  accommodation
- lodging activity MUST always use category: accommodation

JSON FORMAT:

{
  "days": [
    {
      "day": 1,
      "title": "Theme",
      "hotel": "Hotel Name",

      "morning": {
        "title": "Visit park",
        "category": "attraction",
        "time": "07:00",
        "time_range": "07:00 - 10:00 AM",
        "estimated_cost": 0
      },

      "lunch": {
        "title": "Lunch at restaurant",
        "category": "restaurant",
        "time": "12:00",
        "time_range": "12:00 - 13:00 PM",
        "estimated_cost": 120000
      },

      "afternoon": {
        "title": "Museum visit",
        "category": "attraction",
        "time": "14:00",
        "time_range": "14:00 - 16:00 PM",
        "estimated_cost": 90000
      },

      "dinner": {
        "title": "Dinner seafood",
        "category": "restaurant",
        "time": "19:00",
        "time_range": "19:00 - 20:00 PM",
        "estimated_cost": 180000
      },

       "lodging": {
        "title": "Check-in and stay at hotel",
        "category": "accommodation",
        "time": "21:00",
        "time_range": "21:00 - Overnight",
        "estimated_cost": 850000
      }
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
};

export default buildPrompt;
