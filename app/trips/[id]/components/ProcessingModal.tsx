type ProcessingModalProps = {
  title?: string;
  description?: string;
};

export default function ProcessingModal({
  //   open,
  title = "Saving changes...",
  description = "Please wait while we update your itinerary.",
}: ProcessingModalProps) {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-background/80 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-card-foreground shadow-2xl">
        {/* Spinner */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>

        {/* Content */}
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Progress Bar
    <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
    </div> */}

        {/* Note */}
        <div className="mt-4 text-center text-xs uppercase tracking-wide text-muted-foreground">
          Please do not close this window
        </div>
      </div>
    </div>
  );
}
