"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import toast from "react-hot-toast";
import { CreateTripSchema, type CreateTripData } from "./schema";
import InterestOptions from "./components/InterestOptions";
import DietaryOptions from "./components/DietaryOptions";
import PaceOptions from "./components/PaceOptions";
import Dates from "./components/Dates";
import BudgetAndTravelers from "./components/BudgetAndTravelers";

const CreateTripForm = ({ prefs }: { prefs: string[] }) => {
  const router = useRouter();

  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTripData>({
    resolver: valibotResolver(CreateTripSchema),
    defaultValues: {
      destination: "",
      budget: 0,
      startDate: "",
      endDate: "",
      travelers: 1,
      preferences: [],
      pace: "Balanced",
      dietary: [],
    },
  });

  const togglePreference = (item: string) => {
    const exists = selectedPrefs.includes(item);

    const updated = exists
      ? selectedPrefs.filter((x) => x !== item)
      : [...selectedPrefs, item];

    setSelectedPrefs(updated);
    setValue("preferences", updated);
  };

  const onSubmit = async (payload: CreateTripData) => {
    try {
      setServerError("");

      router.push("/create-trip/generating");

      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate trip");
      }

      router.replace(`/trips/${result.tripId}`);
      toast.success("Created travel successfully");
    } catch (error) {
      router.back();

      setServerError(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      {/* Destination */}
      <div>
        <label className="text-muted-foreground mb-2 block text-sm">
          Destination
        </label>

        <input
          placeholder="Tokyo, Bali, Paris..."
          autoComplete="off"
          {...register("destination")}
          className="border-input bg-card ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-2xl border px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        />

        {errors.destination && (
          <p className="mt-2 text-sm text-destructive">
            {errors.destination.message}
          </p>
        )}
      </div>

      {/* Budget + Travelers */}
      <BudgetAndTravelers errors={errors} register={register} />

      {/* Dates */}
      <Dates control={control} errors={errors} />

      {/* Interests */}
      <InterestOptions
        prefs={prefs}
        selectedPrefs={selectedPrefs}
        togglePreference={togglePreference}
      />

      {/* Dietary */}
      <DietaryOptions setValue={setValue} />

      {/* Pace */}
      <PaceOptions errors={errors} setValue={setValue} watch={watch} />

      {/* Error */}
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      {/* Submit */}
      <button
        disabled={isSubmitting}
        className="bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 w-full rounded-2xl px-6 py-4 font-medium transition"
      >
        {isSubmitting ? "Generating..." : "Generate My Itinerary"}
      </button>
    </form>
  );
};

export default CreateTripForm;
