"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LogoutButton = () => {
  const router = useRouter();

  const handleClick = async (): Promise<void> => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    router.push("/login");
    router.refresh();
  };

  return (
    <button
      className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5 transition"
      onClick={handleClick}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
