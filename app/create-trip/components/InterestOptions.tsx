interface InterestOptionsProps {
  prefs: string[];
  togglePreference: (item: string) => void;
  selectedPrefs: string[];
}

const InterestOptions = ({
  prefs,
  togglePreference,
  selectedPrefs,
}: InterestOptionsProps) => {
  return (
    <div>
      <label className="text-muted-foreground mb-3 block text-sm">
        Interests
      </label>

      <div className="flex flex-wrap gap-3">
        {prefs.map((item) => {
          const active = selectedPrefs.includes(item);

          return (
            <button
              type="button"
              key={item}
              onClick={() => togglePreference(item)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-card hover:border-primary/60"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InterestOptions;
