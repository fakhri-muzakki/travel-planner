import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { Errors } from "../types";

const paceOptions = ["relaxed", "moderate", "fast"];

type Watch = UseFormWatch<{
  destination: string;
  budget: number;
  startDate: string;
  endDate: string;
  travelers: number;
  preferences?: string[] | undefined;
  pace: string;
  dietary?: string[] | undefined;
}>;

type Setvalue = UseFormSetValue<{
  destination: string;
  budget: number;
  startDate: string;
  endDate: string;
  travelers: number;
  preferences?: string[] | undefined;
  pace: string;
  dietary?: string[] | undefined;
}>;

interface PaceOptionsProps {
  setValue: Setvalue;
  watch: Watch;
  errors: Errors;
}

const PaceOptions = ({ errors, setValue, watch }: PaceOptionsProps) => {
  const selectedPace = watch("pace");
  return (
    <div>
      <label className="text-muted-foreground mb-3 block text-sm">
        Travel Pace
      </label>

      <div className="grid grid-cols-3 gap-3">
        {paceOptions.map((item) => {
          const active = selectedPace === item;

          return (
            <button
              type="button"
              key={item}
              onClick={() => setValue("pace", item)}
              className={`rounded-2xl border px-4 py-3 text-sm capitalize transition ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-card hover:border-primary/60"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {errors.pace && (
        <p className="mt-2 text-sm text-destructive">{errors.pace.message}</p>
      )}
    </div>
  );
};

export default PaceOptions;
