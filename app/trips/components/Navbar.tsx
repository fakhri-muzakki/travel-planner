import Link from "next/link";
import LogoutButton from "../LogoutButton";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/trips"
          className="text-muted-foreground text-sm tracking-[0.3em] uppercase"
        >
          Travel Planner
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/create-trip"
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            New Trip
          </Link>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
