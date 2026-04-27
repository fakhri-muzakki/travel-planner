export interface AIResult {
  day: number;
  title: string;
  hotel: string;
  morning: Afternoon;
  lunch: Afternoon;
  afternoon: Afternoon;
  dinner: Afternoon;
  lodging: Afternoon;
}

export interface Afternoon {
  title: string;
  time: string;
  category: string;
  time_range: string;
  estimated_cost: number;
}
