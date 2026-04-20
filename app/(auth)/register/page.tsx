export default function TravelRegisterPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white grid lg:grid-cols-2">
      <section className="hidden lg:flex relative overflow-hidden border-r border-white/10">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div>
            <div className="text-sm tracking-[0.3em] uppercase text-white/60">
              Travel Planner
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-tight">
              Start your next journey today.
            </h1>
            <p className="mt-4 text-white/70 max-w-md">
              Create your account to build AI-powered itineraries, track
              budgets, and save every travel idea in one place.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {["Paris", "Seoul", "Lombok"].map((city) => (
              <div
                key={city}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <div className="text-xs text-white/50">Trending</div>
                <div className="mt-2 font-medium">{city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl p-8 shadow-2xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 mb-6">
            🌍
          </div>
          <h2 className="text-3xl font-semibold">Create account</h2>
          <p className="mt-2 text-white/60">
            Join now and start planning unforgettable trips.
          </p>

          <div className="mt-8 space-y-4">
            <input
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="Full name"
            />
            <input
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="Email address"
            />
            <input
              type="password"
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="Password"
            />
            <input
              type="password"
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="Confirm password"
            />
            <label className="flex items-start gap-2 text-sm text-white/60">
              <input type="checkbox" className="mt-1" />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
            <button className="w-full rounded-2xl bg-emerald-500 py-3 font-medium text-black hover:opacity-90 transition">
              Create Account
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-white/30">
            <div className="h-px flex-1 bg-white/10" />
            or
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 hover:bg-white/10 transition">
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <button className="text-emerald-400">Sign in</button>
          </p>
        </div>
      </section>
    </div>
  );
}
