"use client";

import type { Trip } from "@/types";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function TripPage({ trip }: { trip: Trip }) {
  const router = useRouter();

  const [activeDay, setActiveDay] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [loadingDay, setLoadingDay] = useState<number | null>(null);

  const selectedDay = useMemo(() => {
    return trip.itinerary_days.find((item) => item.day_number === activeDay);
  }, [activeDay, trip.itinerary_days]);

  const totalBudget = trip.budget_per_person * trip.traveler_count;

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: trip.currency,
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const labels = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Lunch",
    night: "Dinner",
  };

  const totalHotelAccommodation = trip.itinerary_budget_summary.find(
    (p) => p.category === "accommodation",
  );

  const hotelAccommodation = totalHotelAccommodation?.total_cost
    ? Math.ceil(totalHotelAccommodation.total_cost / trip.duration_days)
    : undefined;

  const regenerateDay = async (dayNumber: number) => {
    try {
      setLoadingDay(dayNumber);

      const response = await fetch(`/api/trips/${trip.id}/regenerate-day`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dayNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to regenerate day");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to regenerate day",
      );
    } finally {
      setLoadingDay(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-sm uppercase tracking-[0.3em] text-white/60">
            Travel Planner
          </div>

          <div className="flex gap-3">
            <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
              Share
            </button>

            <button className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:opacity-90">
              Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        {/* HERO */}
        <section className="rounded-3xl border border-white/10 bg-linear-to-br from-cyan-500/10 via-white/2 to-emerald-500/10 p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                AI Generated Itinerary
              </div>

              <h1 className="mt-5 text-5xl font-semibold">
                {trip.duration_days} Days in {trip.destination}
              </h1>

              <p className="mt-4 max-w-3xl leading-8 text-white/65">
                Personalized itinerary optimized for budget, pace, and traveler
                preferences.
              </p>
            </div>

            <div className="grid min-w-70 grid-cols-2 gap-3 text-sm">
              <Card label="Budget" value={formatMoney(totalBudget)} />
              <Card label="Travelers" value={`${trip.traveler_count} People`} />
              <Card
                label="Dates"
                value={`${formatDate(trip.start_date)} - ${formatDate(
                  trip.end_date,
                )}`}
              />
              <Card label="Pace" value={trip.pace} />
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* TABS */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {trip.itinerary_days.map((day) => {
                const active = activeDay === day.day_number;

                return (
                  <button
                    key={day.id}
                    onClick={() => setActiveDay(day.day_number)}
                    className={`rounded-2xl border px-5 py-3 text-sm whitespace-nowrap transition ${
                      active
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    Day {day.day_number}
                  </button>
                );
              })}
            </div>

            {/* DAY DETAIL */}
            {selectedDay && (
              <div className="rounded-3xl border border-white/10 bg-white/3 p-8 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm text-cyan-300">
                      Day {selectedDay.day_number}
                    </div>

                    <h2 className="mt-2 text-3xl font-semibold">
                      {selectedDay.day_theme}
                    </h2>
                  </div>

                  <button
                    onClick={() => regenerateDay(selectedDay.day_number)}
                    disabled={isPending || loadingDay !== null}
                    className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/15 disabled:opacity-50"
                  >
                    {loadingDay === selectedDay.day_number
                      ? "Regenerating..."
                      : "Regenerate Day"}
                  </button>
                </div>

                {selectedDay.itinerary_activities.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm text-white/50">
                          {labels[item.time_slot as keyof typeof labels]}
                        </div>

                        <div className="mt-2 font-medium leading-7">
                          {item.activity_name}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-sm font-medium text-cyan-300">
                          IDR{" "}
                          {Number(item.estimated_cost).toLocaleString("id-ID")}
                        </div>

                        <div className="mt-1 text-xs text-white/45">
                          {item.duration_minutes} min
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-white/50">Hotel</div>

                      <div className="mt-2 font-medium leading-7">
                        {selectedDay.accommodation?.name}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-sm font-medium text-cyan-300">
                        IDR {hotelAccommodation?.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
              <h3 className="text-xl font-semibold">Budget Breakdown</h3>

              <div className="mt-5 space-y-4 text-sm">
                {trip.itinerary_budget_summary.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="capitalize text-white/55">
                      {item.category}
                    </span>

                    <span>{formatMoney(item.total_cost)}</span>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatMoney(totalBudget)}</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-white/50">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
