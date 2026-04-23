"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import toast from "react-hot-toast";

const CreateTripSchema = v.object({
  destination: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Destination is required"),
  ),

  budget: v.pipe(
    v.number("Budget is required"),
    v.minValue(1, "Budget must be positive"),
  ),

  startDate: v.pipe(v.string(), v.minLength(1, "Start date is required")),

  endDate: v.pipe(v.string(), v.minLength(1, "End date is required")),

  travelers: v.pipe(
    v.number("Travelers is required"),
    v.minValue(1, "At least 1 traveler"),
  ),

  preferences: v.optional(v.array(v.string())),

  pace: v.pipe(v.string(), v.minLength(1, "Pace is required")),

  dietary: v.optional(v.array(v.string())),
});

type CreateTripData = v.InferOutput<typeof CreateTripSchema>;

const paceOptions = ["relaxed", "balanced", "packed"];

const dietaryOptions = [
  "Halal",
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "No Pork",
];

const CreateTripForm = ({ prefs }: { prefs: string[] }) => {
  const router = useRouter();

  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const selectedPace = watch("pace");

  const togglePreference = (item: string) => {
    const exists = selectedPrefs.includes(item);

    const updated = exists
      ? selectedPrefs.filter((x) => x !== item)
      : [...selectedPrefs, item];

    setSelectedPrefs(updated);
    setValue("preferences", updated);
  };

  const toggleDietary = (item: string) => {
    const exists = selectedDietary.includes(item);

    const updated = exists
      ? selectedDietary.filter((x) => x !== item)
      : [...selectedDietary, item];

    setSelectedDietary(updated);
    setValue("dietary", updated);
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
        <label className="mb-2 block text-sm text-white/70">Destination</label>

        <input
          placeholder="Tokyo, Bali, Paris..."
          {...register("destination")}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"
        />

        {errors.destination && (
          <p className="mt-2 text-sm text-red-400">
            {errors.destination.message}
          </p>
        )}
      </div>

      {/* Budget + Travelers */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Budget (IDR)
          </label>

          <input
            type="number"
            placeholder="5000000"
            {...register("budget", { valueAsNumber: true })}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"
          />

          {errors.budget && (
            <p className="mt-2 text-sm text-red-400">{errors.budget.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">Travelers</label>

          <input
            type="number"
            min="1"
            {...register("travelers", { valueAsNumber: true })}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"
          />

          {errors.travelers && (
            <p className="mt-2 text-sm text-red-400">
              {errors.travelers.message}
            </p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm text-white/70">Start Date</label>

          <input
            type="date"
            {...register("startDate")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"
          />

          {errors.startDate && (
            <p className="mt-2 text-sm text-red-400">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">End Date</label>

          <input
            type="date"
            {...register("endDate")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"
          />

          {errors.endDate && (
            <p className="mt-2 text-sm text-red-400">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="mb-3 block text-sm text-white/70">Interests</label>

        <div className="flex flex-wrap gap-3">
          {prefs.map((item) => {
            const active = selectedPrefs.includes(item);

            return (
              <button
                type="button"
                key={item}
                onClick={() => togglePreference(item)}
                className={`rounded-full px-4 py-2 text-sm transition border ${
                  active
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 bg-white/5 hover:border-cyan-400/60"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dietary */}
      <div>
        <label className="mb-3 block text-sm text-white/70">
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
                className={`rounded-full px-4 py-2 text-sm transition border ${
                  active
                    ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 bg-white/5 hover:border-emerald-400/60"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pace */}
      <div>
        <label className="mb-3 block text-sm text-white/70">Travel Pace</label>

        <div className="grid grid-cols-3 gap-3">
          {paceOptions.map((item) => {
            const active = selectedPace === item;

            return (
              <button
                type="button"
                key={item}
                onClick={() => setValue("pace", item)}
                className={`rounded-2xl px-4 py-3 text-sm border transition capitalize ${
                  active
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 bg-white/5 hover:border-cyan-400/60"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {errors.pace && (
          <p className="mt-2 text-sm text-red-400">{errors.pace.message}</p>
        )}
      </div>

      {/* Error */}
      {serverError && <p className="text-sm text-red-400">{serverError}</p>}

      {/* Submit */}
      <button
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-cyan-500 px-6 py-4 font-medium text-black hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Generating..." : "Generate My Itinerary"}
      </button>
    </form>
  );
};

export default CreateTripForm;
