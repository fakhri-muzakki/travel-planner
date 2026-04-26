import Link from "next/link";
import { exportTripPdf } from "../_lib/exportTripPdf";
import ActionMenu from "./ActionMenu";
import type { Trip } from "@/types";

const Header = ({ trip }: { trip: Trip }) => {
  return (
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
  );
};

export default Header;
