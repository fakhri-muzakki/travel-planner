export type TimeSlot = "morning" | "afternoon" | "evening" | "night";

export type Pace = "relaxed" | "moderate" | "fast";

export type BudgetCategory =
  | "transport"
  | "accommodation"
  | "food"
  | "activities"
  | "misc";

export type CategoryActivity =
  | "attraction"
  | "restaurant"
  | "transport"
  | "accommodation";

export interface TripActivity {
  id: string;
  time_slot: TimeSlot;
  activity_name: string;
  estimated_cost: number;
  category: CategoryActivity;
  duration_minutes: string;
}

export interface TripAccommodation {
  name: string;
}

export interface TripDay {
  id: string;
  day_number: number;
  day_theme: string;
  date: string;
  accommodation: TripAccommodation;
  itinerary_activities: TripActivity[];
}

export interface TripBudgetSummary {
  id: string;
  category: BudgetCategory;
  total_cost: number;
  percentage: number;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  travel_styles: string[];
  share_token: string;
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
