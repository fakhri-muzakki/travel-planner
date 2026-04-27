import { DatePickerField } from "./date-picker-field";
import type { Errors } from "../types";
import type { Control } from "react-hook-form";

type ControlType = Control<
  {
    destination: string;
    budget: number;
    startDate: string;
    endDate: string;
    travelers: number;
    preferences?: string[] | undefined;
    pace: string;
    dietary?: string[] | undefined;
  },
  {
    destination: string;
    budget: number;
    startDate: string;
    endDate: string;
    travelers: number;
    preferences?: string[] | undefined;
    pace: string;
    dietary?: string[] | undefined;
  }
>;

interface DatesProps {
  errors: Errors;
  control: ControlType;
}

const Dates = ({ errors, control }: DatesProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="text-muted-foreground mb-2 block text-sm">
          Start Date
        </label>

        <DatePickerField
          control={control}
          name="startDate"
          placeholder="Select start date"
        />

        {errors.startDate && (
          <p className="mt-2 text-sm text-destructive">
            {errors.startDate.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-muted-foreground mb-2 block text-sm">
          End Date
        </label>

        <DatePickerField
          control={control}
          name="endDate"
          placeholder="Select end date"
        />

        {errors.endDate && (
          <p className="mt-2 text-sm text-destructive">
            {errors.endDate.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dates;
