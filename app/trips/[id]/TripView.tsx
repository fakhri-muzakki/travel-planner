"use client";

import type { Trip } from "@/types";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProcessingModal from "./components/ProcessingModal";
import type { ActivityForm } from "./types";
import ModalFormActivity from "./components/ModalFormActivity";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import DayTabs from "./components/DayTabs";
import BudgetBreakdown from "./components/BudgetBreakdown";
import { getTotalBudget } from "./data";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import DayDetail from "./components/DayDetail";
import { saveActivity } from "./_lib/trip-actions";
import { regenerateTripDay, saveReorder } from "./_lib/trip-api";

type Activity = Trip["itinerary_days"][number]["itinerary_activities"][number];
type Day = Trip["itinerary_days"][number];

export default function TripPage({ trip }: { trip: Trip }) {
  const router = useRouter();

  const [activeDay, setActiveDay] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [loadingDay, setLoadingDay] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /** existing trip days copied into local editable state */
  const [days, setDays] = useState<Day[]>(trip.itinerary_days);
  const { totalBudgets, totalBudget } = getTotalBudget(days);

  /** modal states */
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const [form, setForm] = useState<ActivityForm>({
    activity_name: "",
    time_slot: "morning",
    category: "attraction",
    estimated_cost: 0,
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    setDays(trip.itinerary_days);
  }, [trip.itinerary_days]);

  const selectedDay = useMemo(() => {
    return days.find((item) => item.day_number === activeDay);
  }, [activeDay, days]);

  if (!selectedDay) {
    throw new Error("");
  }

  const regenerateDay = async (dayNumber: number) => {
    try {
      setLoadingDay(dayNumber);
      await regenerateTripDay(trip.id, dayNumber);

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
      category: "attraction",
      estimated_cost: 0,
      start_time: "",
      end_time: "",
    });

    setShowForm(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);

    const repliceAM = activity.duration_minutes.replace("AM", "");
    const replicePM = repliceAM.replace("PM", "");
    const time = replicePM.replace(/\s/g, "").split("-");
    setForm({
      activity_name: activity.activity_name,
      time_slot: activity.time_slot as ActivityForm["time_slot"],
      estimated_cost: Number(activity.estimated_cost),
      start_time: time[0],
      end_time: time[1],
      category: activity.category,
    });

    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  const handleSave = () =>
    saveActivity({
      form,
      days,
      setDays,
      selectedDay,
      activeDay,
      editingActivity,
      closeModal,
      setIsProcessing,
    });

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !selectedDay) return;

    const oldIndex = selectedDay.itinerary_activities.findIndex(
      (item) => item.id === active.id,
    );

    const newIndex = selectedDay.itinerary_activities.findIndex(
      (item) => item.id === over.id,
    );

    const reordered = arrayMove(
      selectedDay.itinerary_activities,
      oldIndex,
      newIndex,
    ).map((item, index) => ({
      ...item,
      order_index: index + 1,
    }));

    /** update frontend langsung */
    setDays((prev) =>
      prev.map((day) =>
        day.day_number === activeDay
          ? {
              ...day,
              itinerary_activities: reordered,
            }
          : day,
      ),
    );

    /** save backend */
    await saveReorder(selectedDay.id, reordered);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* HEADER */}
      <Header trip={trip} />

      {/* MAIN */}
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        {/* HERO */}
        <HeroSection totalBudget={totalBudget} trip={trip} />

        {/* CONTENT */}
        <section className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* TABS */}
            <DayTabs
              activeDay={activeDay}
              days={days}
              setActiveDay={setActiveDay}
            />

            {/* DAY DETAIL */}
            {mounted ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedDay.itinerary_activities.map(
                    (item) => item.id,
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  {selectedDay && (
                    <DayDetail
                      deleteActivity={deleteActivity}
                      isPending={isPending}
                      loadingDay={loadingDay}
                      openCreateModal={openCreateModal}
                      openEditModal={openEditModal}
                      regenerateDay={regenerateDay}
                      selectedDay={selectedDay}
                    />
                  )}
                </SortableContext>
              </DndContext>
            ) : (
              selectedDay && (
                <DayDetail
                  deleteActivity={deleteActivity}
                  isPending={isPending}
                  loadingDay={loadingDay}
                  openCreateModal={openCreateModal}
                  openEditModal={openEditModal}
                  regenerateDay={regenerateDay}
                  selectedDay={selectedDay}
                />
              )
            )}
          </div>

          {/* RIGHT */}
          <BudgetBreakdown
            totalBudget={totalBudget}
            totalBudgets={totalBudgets}
          />
        </section>
      </main>

      {/* MODAL */}
      {showForm && (
        <ModalFormActivity
          closeModal={closeModal}
          editingActivity={editingActivity}
          form={form}
          saveActivity={handleSave}
          setForm={setForm}
        />
      )}

      {isProcessing && <ProcessingModal />}
    </div>
  );
}
