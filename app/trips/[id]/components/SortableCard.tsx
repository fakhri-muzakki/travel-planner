import type { Trip } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type Activity = Trip["itinerary_days"][number]["itinerary_activities"][number];

export function SortableCard({
  item,
  children,
}: {
  item: Activity;
  children: React.ReactNode;
}) {
  const { setNodeRef, transform, transition, attributes, listeners } =
    useSortable({
      id: item.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button
        {...attributes}
        {...listeners}
        className="absolute right-4 top-4 cursor-grab text-white/30 hover:text-white"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {children}
    </div>
  );
}
