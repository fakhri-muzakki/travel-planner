import LoginForm from "./LoginForm";

export default function TravelLoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white grid lg:grid-cols-2">
      <section className="hidden lg:flex relative overflow-hidden border-r border-white/10">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-transparent to-emerald-500/10" />
        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div>
            <div className="text-sm tracking-[0.3em] uppercase text-white/60">
              Travel Planner
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-tight">
              Plan smarter. Travel farther.
            </h1>
            <p className="mt-4 text-white/70 max-w-md">
              Generate personalized itineraries, manage budgets, and organize
              unforgettable trips in minutes.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {["Tokyo", "Bali", "Istanbul"].map((city) => (
              <div
                key={city}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <div className="text-xs text-white/50">Popular</div>
                <div className="mt-2 font-medium">{city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LoginForm />
    </div>
  );
}
