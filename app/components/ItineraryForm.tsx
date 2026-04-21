"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";

// Valibot schema untuk form
const formSchema = v.object({
  destination: v.pipe(
    v.string(),
    v.minLength(1, "Destination is required"),
    v.minLength(2, "Destination must be at least 2 characters"),
  ),
  budget: v.pipe(
    v.number(),
    v.minValue(100000, "Minimum budget is 100,000 IDR"),
    v.maxValue(100000000, "Maximum budget is 100,000,000 IDR"),
  ),
  startDate: v.pipe(v.string(), v.minLength(1, "Start date is required")),
  endDate: v.pipe(v.string(), v.minLength(1, "End date is required")),
  travelers: v.pipe(
    v.number(),
    v.minValue(1, "At least 1 traveler"),
    v.maxValue(20, "Maximum 20 travelers"),
  ),
  preferences: v.optional(v.array(v.string())),
});

type FormValues = v.InferOutput<typeof formSchema>;

const preferencesList = [
  { value: "adventure", label: "🏔️ Adventure" },
  { value: "culture", label: "🏛️ Culture" },
  { value: "food", label: "🍜 Food" },
  { value: "nature", label: "🌿 Nature" },
  { value: "relaxation", label: "🧘 Relaxation" },
  { value: "shopping", label: "🛍️ Shopping" },
];

export default function ItineraryForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      destination: "",
      budget: 5000000,
      startDate: "",
      endDate: "",
      travelers: 1,
      preferences: [],
    },
  });

  const selectedPreferences = watch("preferences") || [];

  const togglePreference = (value: string) => {
    const current = selectedPreferences;
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue("preferences", updated, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Something went wrong");
      }

      setResult(responseData.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate itinerary",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Destination *
          </label>
          <input
            {...register("destination")}
            type="text"
            placeholder="e.g., Bali, Tokyo, Paris"
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-400 transition"
          />
          {errors.destination && (
            <p className="text-sm text-red-400 mt-1">
              {errors.destination.message}
            </p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Budget (IDR) *
          </label>
          <input
            {...register("budget", { valueAsNumber: true })}
            type="number"
            placeholder="e.g., 5000000"
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-400 transition"
          />
          {errors.budget && (
            <p className="text-sm text-red-400 mt-1">{errors.budget.message}</p>
          )}
          <p className="text-xs text-white/40 mt-1">
            Min: 100,000 | Max: 100,000,000
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Start Date *
            </label>
            <input
              {...register("startDate")}
              type="date"
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-400 transition"
            />
            {errors.startDate && (
              <p className="text-sm text-red-400 mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              End Date *
            </label>
            <input
              {...register("endDate")}
              type="date"
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-400 transition"
            />
            {errors.endDate && (
              <p className="text-sm text-red-400 mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Number of Travelers *
          </label>
          <input
            {...register("travelers", { valueAsNumber: true })}
            type="number"
            min="1"
            max="20"
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-400 transition"
          />
          {errors.travelers && (
            <p className="text-sm text-red-400 mt-1">
              {errors.travelers.message}
            </p>
          )}
        </div>

        {/* Preferences */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Travel Preferences
          </label>
          <div className="flex flex-wrap gap-3">
            {preferencesList.map((pref) => (
              <button
                key={pref.value}
                type="button"
                onClick={() => togglePreference(pref.value)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedPreferences.includes(pref.value)
                    ? "bg-cyan-500 text-black"
                    : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                }`}
              >
                {pref.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-cyan-500 py-3 font-medium text-black hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-black"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate My Trip"
          )}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">✨ Your Itinerary</h2>
          <div className="prose prose-invert max-w-none">
            {result.split("\n").map((line, idx) => {
              if (line.startsWith("##")) {
                return (
                  <h3
                    key={idx}
                    className="text-xl font-bold mt-6 mb-3 text-cyan-400"
                  >
                    {line.replace("##", "").trim()}
                  </h3>
                );
              }
              if (line.startsWith("**")) {
                return (
                  <strong key={idx} className="block mt-3">
                    {line}
                  </strong>
                );
              }
              if (line.trim() === "") {
                return <br key={idx} />;
              }
              return (
                <p key={idx} className="mb-2 text-white/80">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
