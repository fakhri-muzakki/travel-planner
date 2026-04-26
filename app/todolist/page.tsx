"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { GripVertical, CheckCircle2, Circle, Plus } from "lucide-react";

const initialTodos = [
  { id: "1", title: "Finalize landing page UI", done: false },
  { id: "2", title: "Connect Supabase auth flow", done: true },
  { id: "3", title: "Build trip export PDF", done: false },
  { id: "4", title: "Refactor itinerary state", done: false },
];

type Todo = {
  id: string;
  title: string;
  done: boolean;
};

function SortableItem({
  todo,
  onToggle,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition ${
          isDragging ? "opacity-70 scale-[0.98]" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggle(todo.id)}
            className="shrink-0 transition hover:scale-105"
          >
            {todo.done ? (
              <CheckCircle2 className="h-5 w-5 text-cyan-300" />
            ) : (
              <Circle className="h-5 w-5 text-white/45" />
            )}
          </button>

          <div
            className={`flex-1 text-sm md:text-base ${
              todo.done ? "text-white/40 line-through" : "text-white"
            }`}
          >
            {todo.title}
          </div>

          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-white/40 transition hover:text-white active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TodoDndPage() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [value, setValue] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const completed = useMemo(
    () => todos.filter((item) => item.done).length,
    [todos],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setTodos((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  }

  function addTodo() {
    if (!value.trim()) return;

    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        title: value.trim(),
        done: false,
      },
      ...prev,
    ]);

    setValue("");
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              done: !item.done,
            }
          : item,
      ),
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-white/10 bg-linear-to-br from-cyan-500/10 via-white/2 to-transparent p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-white/50">
                Productivity
              </div>

              <h1 className="mt-3 text-4xl font-semibold">
                Drag & Drop Todo List
              </h1>

              <p className="mt-3 max-w-xl text-white/60">
                Organize tasks with a clean dark interface matching your current
                web theme.
              </p>
            </div>

            <div className="grid min-w-60 grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-white/50">Total</div>
                <div className="mt-1 font-semibold">{todos.length}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-white/50">Done</div>
                <div className="mt-1 font-semibold">{completed}</div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/3 p-6">
          {/* INPUT */}
          <div className="flex gap-3">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Add new task..."
              className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 outline-none transition focus:border-cyan-400"
            />

            <button
              onClick={addTodo}
              className="flex h-12 items-center gap-2 rounded-2xl bg-cyan-500 px-5 font-medium text-black transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {/* LIST */}
          {mounted && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={todos.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <SortableItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* 
          
          */}
        </section>
      </div>
    </div>
  );
}
