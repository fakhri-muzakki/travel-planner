import * as v from "valibot";

export const ItineraryRequestSchema = v.object({
  destination: v.pipe(v.string(), v.trim(), v.minLength(1)),
  budget: v.pipe(v.number(), v.minValue(100000)),
  startDate: v.string(),
  endDate: v.string(),
  travelers: v.pipe(v.number(), v.minValue(1), v.maxValue(10)),
  preferences: v.optional(v.array(v.string())),
});

export type ItineraryRequest = v.InferOutput<typeof ItineraryRequestSchema>;

export const AIResponseSchema = v.object({
  days: v.array(
    v.object({
      day: v.number(),
      title: v.string(),
      morning: v.string(),
      lunch: v.string(),
      afternoon: v.string(),
      dinner: v.string(),
      hotel: v.string(),
    }),
  ),
  budget: v.object({
    transportation: v.number(),
    accommodation: v.number(),
    food: v.number(),
    activities: v.number(),
  }),
});

export type AIResponse = v.InferOutput<typeof AIResponseSchema>;
