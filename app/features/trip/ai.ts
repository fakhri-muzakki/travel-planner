/// app/features/trip/ai.ts

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import * as v from "valibot";

import buildPrompt from "./prompts";
import {
  AIResponseSchema,
  type AIResponse,
  type ItineraryRequest,
} from "./schemas";

export async function generateTripPlan({
  payload,
  days,
}: {
  payload: ItineraryRequest;
  days: number;
}): Promise<AIResponse> {
  const { text } = await generateText({
    model: google("gemini-2.5-flash-lite"),
    temperature: 0.7,
    prompt: buildPrompt(payload, days),
  });

  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    const ai = v.parse(AIResponseSchema, parsed);

    if (ai.days.length !== days) {
      throw new Error("AI returned wrong number of days");
    }

    return ai;
  } catch (error) {
    console.error("AI RAW RESPONSE:");
    console.error(text);
    console.error(error);

    throw new Error("AI returned invalid response");
  }
}
