import type { UseFormRegister } from "react-hook-form";
import type { Errors } from "../types";

type Register = UseFormRegister<{
  destination: string;
  budget: number;
  startDate: string;
  endDate: string;
  travelers: number;
  preferences?: string[] | undefined;
  pace: string;
  dietary?: string[] | undefined;
}>;

interface BudgetAndTravelersProps {
  errors: Errors;
  register: Register;
}

const BudgetAndTravelers = ({ errors, register }: BudgetAndTravelersProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="text-muted-foreground mb-2 block text-sm">
          Budget (IDR)
        </label>

        <input
          type="number"
          placeholder="5000000"
          {...register("budget", { valueAsNumber: true })}
          className="border-input bg-card ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-2xl border px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        />

        {errors.budget && (
          <p className="mt-2 text-sm text-destructive">
            {errors.budget.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-muted-foreground mb-2 block text-sm">
          Travelers
        </label>

        <input
          type="number"
          min="1"
          {...register("travelers", { valueAsNumber: true })}
          className="border-input bg-card ring-offset-background focus-visible:ring-ring w-full rounded-2xl border px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        />

        {errors.travelers && (
          <p className="mt-2 text-sm text-destructive">
            {errors.travelers.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetAndTravelers;
