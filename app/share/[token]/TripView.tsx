"use client";

import ActionMenu from "@/app/trips/[id]/components/ActionMenu";
import { exportTripPdf } from "@/app/trips/[id]/_lib/exportTripPdf";
import type { Trip } from "@/types";
import Link from "next/link";
import { useMemo, useState } from "react";
import Hero from "./components/Hero";
import { formatMoney } from "@/lib/utils";

export default function TripPage({ trip }: { trip: Trip }) {
  const [activeDay, setActiveDay] = useState(1);

  const selectedDay = useMemo(() => {
    return trip.itinerary_days.find((item) => item.day_number === activeDay);
  }, [activeDay, trip.itinerary_days]);

  const totalBudget = trip.budget_per_person * trip.traveler_count;

  const labels = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Lunch",
    night: "Dinner",
  };

  const totalHotelaccommodation = trip.itinerary_budget_summary.find(
    (p) => p.category === "accommodation",
  );

  const hotelAccommodation = totalHotelaccommodation?.total_cost
    ? Math.ceil(totalHotelaccommodation.total_cost / trip.duration_days)
    : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-muted-foreground text-sm uppercase tracking-[0.3em]">
            Travel Planner
          </div>

          <div className="flex gap-3">
            <ActionMenu
              onExportPdf={() => exportTripPdf(trip)}
              shareToken={trip.share_token}
            />

            <Link
              href="/trips"
              prefetch={false}
              scroll={true}
              className="inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Back
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        {/* HERO */}
        <Hero trip={trip} totalBudget={totalBudget} />

        {/* CONTENT */}
        <section className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* TABS */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {trip.itinerary_days
                .sort((prev, current) =>
                  prev.day_number > current.day_number ? 1 : -1,
                )
                .map((day) => {
                  const active = activeDay === day.day_number;

                  return (
                    <button
                      key={day.id}
                      onClick={() => setActiveDay(day.day_number)}
                      className={`whitespace-nowrap rounded-2xl border px-5 py-3 text-sm transition ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "bg-card hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      Day {day.day_number}
                    </button>
                  );
                })}
            </div>

            {/* DAY DETAIL */}
            {selectedDay && (
              <div className="space-y-6 rounded-3xl border bg-card p-8">
                <div>
                  <div className="text-primary text-sm">
                    Day {selectedDay.day_number}
                  </div>

                  <h2 className="mt-2 text-3xl font-semibold">
                    {selectedDay.day_theme}
                  </h2>
                </div>

                {selectedDay.itinerary_activities.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border bg-muted/40 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-muted-foreground text-sm">
                          {labels[item.time_slot as keyof typeof labels]}
                        </div>

                        <div className="mt-2 font-medium leading-7">
                          {item.activity_name}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-primary text-sm font-medium">
                          IDR{" "}
                          {Number(item.estimated_cost).toLocaleString("id-ID")}
                        </div>

                        <div className="text-muted-foreground mt-1 text-xs">
                          {item.duration_minutes}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border bg-muted/40 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-muted-foreground text-sm">Hotel</div>

                      <div className="mt-2 font-medium leading-7">
                        {selectedDay.accommodation?.name}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-primary text-sm font-medium">
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
            {/* BUDGET */}
            <div className="rounded-3xl border bg-card p-6">
              <h3 className="text-xl font-semibold">Budget Breakdown</h3>

              <div className="mt-5 space-y-4 text-sm">
                {trip.itinerary_budget_summary.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {item.category}
                    </span>

                    <span>{formatMoney(item.total_cost)}</span>
                  </div>
                ))}

                <div className="flex justify-between border-t pt-4 font-semibold">
                  <span>Total</span>
                  <span>{formatMoney(totalBudget)}</span>
                </div>
              </div>
            </div>

            {/* TIPS */}
            <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/10 p-6">
              <h3 className="text-xl font-semibold">Pro Tips</h3>

              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>• Buy Suica card for transport.</li>
                <li>• Avoid rush hour trains.</li>
                <li>• Carry some cash.</li>
                <li>• Book attractions early.</li>
                <li>• Keep flexible free time.</li>
              </ul>
            </div>

            {/* CTA */}
          </aside>
        </section>
      </main>
    </div>
  );
}
