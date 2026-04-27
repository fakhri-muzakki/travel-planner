import * as v from "valibot";

export const ItineraryRequestSchema = v.object({
  destination: v.pipe(v.string(), v.trim(), v.minLength(1)),
  budget: v.pipe(v.number(), v.minValue(100000)),
  startDate: v.string(),
  endDate: v.string(),
  travelers: v.pipe(v.number(), v.minValue(1), v.maxValue(10)),
  preferences: v.optional(v.array(v.string())),
  dietary: v.optional(v.array(v.string())),
  pace: v.optional(v.picklist(["relaxed", "moderate", "fast"])),
});

export type ItineraryRequest = v.InferOutput<typeof ItineraryRequestSchema>;

const ActivitySchema = v.object({
  title: v.string(),
  time: v.string(), // 07:00
  category: v.string(),
  time_range: v.string(),
  estimated_cost: v.number(),
});

const DaySchema = v.object({
  day: v.number(),
  title: v.string(),
  hotel: v.string(),

  morning: ActivitySchema,
  lunch: ActivitySchema,
  afternoon: ActivitySchema,
  dinner: ActivitySchema,
  lodging: ActivitySchema,
});

export const AIResponseSchema = v.object({
  days: v.array(DaySchema),
  budget: v.object({
    transportation: v.number(),
    accommodation: v.number(),
    food: v.number(),
    activities: v.number(),
  }),
});

export type AIResponse = v.InferOutput<typeof AIResponseSchema>;
