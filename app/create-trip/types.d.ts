import type { FieldErrors } from "react-hook-form";

export type Errors = FieldErrors<{
  destination: string;
  budget: number;
  startDate: string;
  endDate: string;
  travelers: number;
  preferences?: string[] | undefined;
  pace: string;
  dietary?: string[] | undefined;
}>;
