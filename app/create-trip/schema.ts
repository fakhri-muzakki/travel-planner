import * as v from "valibot";

export const CreateTripSchema = v.object({
  destination: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Destination is required"),
  ),

  budget: v.pipe(
    v.number("Budget is required"),
    v.minValue(1, "Budget must be positive"),
  ),

  startDate: v.pipe(v.string(), v.minLength(1, "Start date is required")),
  endDate: v.pipe(v.string(), v.minLength(1, "End date is required")),
  travelers: v.pipe(
    v.number("Travelers is required"),
    v.minValue(1, "At least 1 traveler"),
  ),

  preferences: v.optional(v.array(v.string())),
  pace: v.pipe(v.string(), v.minLength(1, "Pace is required")),
  dietary: v.optional(v.array(v.string())),
});

export type CreateTripData = v.InferOutput<typeof CreateTripSchema>;
