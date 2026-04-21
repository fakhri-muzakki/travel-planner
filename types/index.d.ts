export type TimeSlot = "morning" | "afternoon" | "evening" | "night";

export type Pace = "relaxed" | "balanced" | "moderate" | "fast" | "packed";

export type BudgetCategory =
  | "transport"
  | "accommodation"
  | "food"
  | "activities"
  | "misc";

export interface TripActivity {
  id: string;
  time_slot: TimeSlot;
  activity_name: string;
}

export interface TripAccommodation {
  name: string;
}

export interface TripDay {
  id: string;
  day_number: number;
  day_theme: string;
  accommodation: TripAccommodation;
  itinerary_activities: TripActivity[];
}

export interface TripBudgetSummary {
  id: string;
  category: BudgetCategory;
  total_cost: number;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  duration_days: number;
  traveler_count: number;
  budget_per_person: number;
  currency: string;
  pace: Pace;
  start_date: string;
  end_date: string;
  itinerary_days: TripDay[];
  itinerary_budget_summary: TripBudgetSummary[];
}
