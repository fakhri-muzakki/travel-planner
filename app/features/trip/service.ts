/// app/features/trip/service.ts

import { generateTripPlan } from "./ai";
import {
  insertBudgetSummary,
  insertItinerary,
  insertTripActivities,
  insertTripDays,
} from "./repository";

import type { InferInput } from "valibot";
import { ItineraryRequestSchema } from "./schemas";

type Payload = InferInput<typeof ItineraryRequestSchema>;

export async function createTrip({
  userId,
  payload,
}: {
  userId: string;
  payload: Payload;
}) {
  const start = new Date(payload.startDate);
  const end = new Date(payload.endDate);

  const diffMs = end.getTime() - start.getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  if (days <= 0 || days > 30) {
    throw new Error("Trip duration must be between 1 and 30 days");
  }

  const ai = await generateTripPlan({
    payload,
    days,
  });

  const { id: itineraryId } = await insertItinerary({
    userId,
    validated: payload,
    days,
  });

  const dayMap = await insertTripDays({
    itineraryId,
    aiDays: ai.days,
    startDate: start,
  });

  await insertTripActivities({
    aiDays: ai.days,
    dayMap,
  });

  await insertBudgetSummary({
    itineraryId,
    budget: ai.budget,
    totalBudget: payload.budget,
  });

  return {
    tripId: itineraryId,
  };
}
