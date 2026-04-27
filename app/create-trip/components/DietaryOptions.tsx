import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

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

interface DietaryOptionsProps {
  setValue: Setvalue;
}

const dietaryOptions = [
  "Halal",
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "No Pork",
];

const DietaryOptions = ({ setValue }: DietaryOptionsProps) => {
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const toggleDietary = (item: string) => {
    const exists = selectedDietary.includes(item);

    const updated = exists
      ? selectedDietary.filter((x) => x !== item)
      : [...selectedDietary, item];

    setSelectedDietary(updated);
    setValue("dietary", updated);
  };
  return (
    <div>
      <label className="text-muted-foreground mb-3 block text-sm">
        Dietary Preferences
      </label>

      <div className="flex flex-wrap gap-3">
        {dietaryOptions.map((item) => {
          const active = selectedDietary.includes(item);

          return (
            <button
              type="button"
              key={item}
              onClick={() => toggleDietary(item)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                  : "border-input bg-background hover:border-emerald-500/60"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DietaryOptions;
