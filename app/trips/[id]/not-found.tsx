import Link from "next/link";

export default function TripNotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-3xl">🧳</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold">Trip Not Found</h1>

        {/* Description */}
        <p className="text-white/60 leading-relaxed">
          The trip you’re looking for doesn’t exist or may have been removed.
        </p>

        {/* Suggestion box */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
          Make sure the URL is correct or go back to your trips list.
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/trips"
            className="rounded-2xl bg-cyan-500 text-black py-3 font-medium hover:opacity-90 transition"
          >
            Back to Trips
          </Link>

          <Link
            href="/create-trip"
            className="rounded-2xl border border-white/10 py-3 hover:bg-white/5 transition"
          >
            Create New Trip
          </Link>
        </div>
      </div>
    </div>
  );
}
