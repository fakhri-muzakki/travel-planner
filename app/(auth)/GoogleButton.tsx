"use client";

import { createClient } from "@/lib/supabase/client";

const GoogleButton = () => {
  const supabase = createClient();

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/api/auth/callback",
      },
    });
    console.log(error);
  };

  return (
    <button
      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 hover:bg-white/10 transition"
      onClick={login}
      type="button"
    >
      Continue with Google
    </button>
  );
};

export default GoogleButton;
