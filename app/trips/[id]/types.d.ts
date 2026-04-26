import type { CategoryActivity } from "@/types";

export type ActivityForm = {
  activity_name: string;
  time_slot: "morning" | "afternoon" | "evening" | "night";
  estimated_cost: number;
  category: CategoryActivity;
  start_time: string;
  end_time: string;
};
