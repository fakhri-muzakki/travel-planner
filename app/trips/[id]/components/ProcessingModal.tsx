type ProcessingModalProps = {
  //   open: boolean;
  title?: string;
  description?: string;
};

export default function ProcessingModal({
  //   open,
  title = "Saving changes...",
  description = "Please wait while we update your itinerary.",
}: ProcessingModalProps) {
  //   if (!open) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl">
        {/* Spinner */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
        </div>

        {/* Content */}
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-white">{title}</h3>

          <p className="mt-3 text-sm leading-6 text-white/55">{description}</p>
        </div>

        {/* Progress Bar
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400" />
        </div> */}

        {/* Note */}
        <div className="mt-4 text-center text-xs tracking-wide text-white/35 uppercase">
          Please do not close this window
        </div>
      </div>
    </div>
  );
}
