/// app/features/trip/repository.ts

import { createClient } from "@/lib/supabase/server";
import type { AIResponse, ItineraryRequest } from "./schemas";

export async function insertItinerary({
  userId,
  validated,
  days,
}: {
  userId: string;
  validated: ItineraryRequest;
  days: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("itineraries")
    .insert({
      user_id: userId,
      title: `${validated.destination} Trip`,
      destination: validated.destination,
      start_date: validated.startDate,
      end_date: validated.endDate,
      duration_days: days,
      traveler_count: validated.travelers,
      budget_per_person: Math.floor(validated.budget / validated.travelers),
      currency: "IDR",
      travel_styles: validated.preferences ?? [],
      pace: "moderate",
      status: "done",
    })
    .select("id")
    .single();

  if (error || !data) throw error;

  return data;
}

export async function insertTripDays({
  itineraryId,
  aiDays,
  startDate,
}: {
  itineraryId: string;
  aiDays: AIResponse["days"];
  startDate: Date;
}) {
  const supabase = await createClient();

  const dayMap: Record<number, string> = {};

  for (const item of aiDays) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + (item.day - 1));

    const isoDate = date.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("itinerary_days")
      .insert({
        itinerary_id: itineraryId,
        day_number: item.day,
        date: isoDate,
        day_theme: item.title,
        accommodation: {
          name: item.hotel,
        },
      })
      .select("id")
      .single();

    if (error || !data) throw error;

    dayMap[item.day] = data.id;
  }

  return dayMap;
}

export async function insertTripActivities({
  aiDays,
  dayMap,
}: {
  aiDays: AIResponse["days"];
  dayMap: Record<number, string>;
}) {
  const supabase = await createClient();

  for (const item of aiDays) {
    const dayId = dayMap[item.day];

    if (!dayId) continue;

    const rows = [
      {
        day_id: dayId,
        time_slot: "morning",
        order_index: 1,
        activity_name: item.morning,
        category: "attraction",
      },
      {
        day_id: dayId,
        time_slot: "afternoon",
        order_index: 2,
        activity_name: item.afternoon,
        category: "attraction",
      },
      {
        day_id: dayId,
        time_slot: "evening",
        order_index: 3,
        activity_name: item.lunch,
        category: "restaurant",
      },
      {
        day_id: dayId,
        time_slot: "night",
        order_index: 4,
        activity_name: item.dinner,
        category: "restaurant",
      },
    ];

    const { error } = await supabase.from("itinerary_activities").insert(rows);

    if (error) throw error;
  }
}

export async function insertBudgetSummary({
  itineraryId,
  budget,
  totalBudget,
}: {
  itineraryId: string;
  budget: AIResponse["budget"];
  totalBudget: number;
}) {
  const supabase = await createClient();

  const rows = [
    ["transport", budget.transportation],
    ["accommodation", budget.accommodation],
    ["food", budget.food],
    ["activities", budget.activities],
  ].map(([category, total]) => ({
    itinerary_id: itineraryId,
    category,
    total_cost: total,
    percentage: Math.round((Number(total) / totalBudget) * 100),
  }));

  const { error } = await supabase
    .from("itinerary_budget_summary")
    .insert(rows);

  if (error) throw error;
}
