"use client";

import type { Trip } from "@/types";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { exportTripPdf } from "./exportTripPdf";
import toast from "react-hot-toast";
import ActionMenu from "./components/ActionMenu";
import Link from "next/link";

type Activity = Trip["itinerary_days"][number]["itinerary_activities"][number];

type Day = Trip["itinerary_days"][number];

type ActivityForm = {
  activity_name: string;
  time_slot: "morning" | "afternoon" | "evening" | "night";
  estimated_cost: number;
  duration_minutes: number;
};

export default function TripPage({ trip }: { trip: Trip }) {
  const router = useRouter();

  const [activeDay, setActiveDay] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [loadingDay, setLoadingDay] = useState<number | null>(null);

  /** existing trip days copied into local editable state */
  const [days, setDays] = useState<Day[]>(trip.itinerary_days);

  /** modal states */
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [form, setForm] = useState<ActivityForm>({
    activity_name: "",
    time_slot: "morning",
    estimated_cost: 0,
    duration_minutes: 60,
  });

  useEffect(() => {
    setDays(trip.itinerary_days);
  }, [trip.itinerary_days]);

  const selectedDay = useMemo(() => {
    return days.find((item) => item.day_number === activeDay);
  }, [activeDay, days]);

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

  /** ---------------- CRUD FRONTEND ONLY ---------------- */

  const openCreateModal = () => {
    setEditingActivity(null);

    setForm({
      activity_name: "",
      time_slot: "morning",
      estimated_cost: 0,
      duration_minutes: 60,
    });

    setShowForm(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);

    setForm({
      activity_name: activity.activity_name,
      time_slot: activity.time_slot as ActivityForm["time_slot"],
      estimated_cost: Number(activity.estimated_cost),
      duration_minutes: activity.duration_minutes,
    });

    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  const saveActivity = async () => {
    if (!selectedDay) return;

    const activityName = form.activity_name.trim();

    if (!activityName) {
      alert("Activity name is required");
      return;
    }

    try {
      // ========================================
      // UPDATE
      // ========================================
      if (editingActivity) {
        const previousDays = days;

        // Optimistic UI
        setDays((prev) =>
          prev.map((day) => {
            if (day.day_number !== activeDay) return day;

            return {
              ...day,
              itinerary_activities: day.itinerary_activities.map((item) =>
                item.id === editingActivity.id
                  ? {
                      ...item,
                      activity_name: activityName,
                      time_slot: form.time_slot,
                      estimated_cost: form.estimated_cost,
                      duration_minutes: form.duration_minutes,
                    }
                  : item,
              ),
            };
          }),
        );

        closeModal();

        const response = await fetch(`/api/activities/${editingActivity.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activity_name: activityName,
            time_slot: form.time_slot,
            estimated_cost: form.estimated_cost,
            duration_minutes: form.duration_minutes,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setDays(previousDays);
          throw new Error(result.error || "Failed to update activity");
        }
        toast.success("Update activity successfully");
        return;
      }

      // ========================================
      // CREATE
      // ========================================
      const tempId = crypto.randomUUID();

      const optimisticActivity: Activity = {
        id: tempId,
        time_slot: form.time_slot,
        activity_name: activityName,
        estimated_cost: form.estimated_cost,
        duration_minutes: form.duration_minutes,
      };

      const previousDays = days;

      // Optimistic UI
      setDays((prev) =>
        prev.map((day) =>
          day.day_number === activeDay
            ? {
                ...day,
                itinerary_activities: [
                  ...day.itinerary_activities,
                  optimisticActivity,
                ],
              }
            : day,
        ),
      );

      closeModal();

      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day_id: selectedDay.id,
          activity_name: activityName,
          category: "attraction",
          time_slot: form.time_slot,
          estimated_cost: form.estimated_cost,
          duration_minutes: form.duration_minutes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setDays(previousDays);
        throw new Error(result.error || "Failed to create activity");
      }

      const createdActivity = result.data;

      // replace temp activity with real DB row
      setDays((prev) =>
        prev.map((day) =>
          day.day_number === activeDay
            ? {
                ...day,
                itinerary_activities: day.itinerary_activities.map((item) =>
                  item.id === tempId ? createdActivity : item,
                ),
              }
            : day,
        ),
      );

      toast.success("Created activity successfully");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save activity");
    }
  };

  const deleteActivity = async (activityId: string) => {
    const confirmed = confirm("Delete this activity?");
    if (!confirmed) return;

    const previousDays = days;

    // Optimistic UI update
    setDays((prev) =>
      prev.map((day) => {
        if (day.day_number !== activeDay) return day;

        return {
          ...day,
          itinerary_activities: day.itinerary_activities
            .filter((item) => item.id !== activityId)
            .map((item, index) => ({
              ...item,
              order_index: index + 1,
            })),
        };
      }),
    );

    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete activity");
      }

      toast.success("Delete activity successfully");
    } catch (error) {
      // rollback UI
      setDays(previousDays);

      alert(
        error instanceof Error ? error.message : "Failed to delete activity",
      );
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
            <ActionMenu
              onExportPdf={() => exportTripPdf(trip)}
              shareToken={trip.share_token}
            />
            <Link
              href="/trips"
              prefetch={false}
              scroll={true}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
            >
              Back Home
            </Link>
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
              {days.map((day) => {
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
              <div className="space-y-6 rounded-3xl border border-white/10 bg-white/3 p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="">
                    <div className="text-sm text-cyan-300 ">
                      Day {selectedDay.day_number}
                    </div>

                    <h2 className="mt-2 text-3xl font-semibold">
                      {selectedDay.day_theme}
                    </h2>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={openCreateModal}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 text-nowrap"
                    >
                      Add Activity
                    </button>

                    <button
                      onClick={() => regenerateDay(selectedDay.day_number)}
                      disabled={isPending || loadingDay !== null}
                      className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/15 disabled:opacity-50 text-nowrap"
                    >
                      {loadingDay === selectedDay.day_number
                        ? "Regenerating..."
                        : "Regenerate Day"}
                    </button>
                  </div>
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

                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="rounded-xl border border-white/10 px-3 py-1 text-xs hover:bg-white/10"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteActivity(item.id)}
                            className="rounded-xl border border-red-400/30 px-3 py-1 text-xs text-red-300 hover:bg-red-400/10"
                          >
                            Delete
                          </button>
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

                <div className="flex justify-between border-t border-white/10 pt-4 font-semibold">
                  <span>Total</span>
                  <span>{formatMoney(totalBudget)}</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0a0a0a] p-6">
            <h3 className="text-2xl font-semibold">
              {editingActivity ? "Edit Activity" : "Add Activity"}
            </h3>

            <div className="mt-6 space-y-4">
              <input
                value={form.activity_name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    activity_name: e.target.value,
                  }))
                }
                placeholder="Activity name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              />

              <select
                value={form.time_slot}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    time_slot: e.target.value as ActivityForm["time_slot"],
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 outline-none"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Lunch</option>
                <option value="night">Dinner</option>
              </select>

              <input
                type="number"
                value={form.estimated_cost}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    estimated_cost: Number(e.target.value),
                  }))
                }
                placeholder="Estimated cost"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              />

              <input
                type="number"
                value={form.duration_minutes}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    duration_minutes: Number(e.target.value),
                  }))
                }
                placeholder="Duration minutes"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={saveActivity}
                className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
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
