import LoginForm from "./LoginForm";
import { Card, CardContent } from "@/components/ui/card";

export default function TravelLoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground grid lg:grid-cols-2">
      <section className="hidden lg:flex relative overflow-hidden border-r border-border">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-transparent to-emerald-500/10" />

        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div>
            <div className="text-sm tracking-[0.3em] uppercase text-muted-foreground">
              Travel Planner
            </div>

            <h1 className="mt-6 text-5xl font-semibold leading-tight">
              Plan smarter. Travel farther.
            </h1>

            <p className="mt-4 text-muted-foreground max-w-md">
              Generate personalized itineraries, manage budgets, and organize
              unforgettable trips in minutes.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {["Tokyo", "Bali", "Istanbul"].map((city) => (
              <Card
                key={city}
                className="rounded-2xl border-border bg-card/60 backdrop-blur"
              >
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground">Popular</div>
                  <div className="mt-2 font-medium">{city}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <LoginForm />
    </div>
  );
}
