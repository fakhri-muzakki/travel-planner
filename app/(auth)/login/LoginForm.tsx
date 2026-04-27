"use client";

import GoogleButton from "../GoogleButton";
import * as v from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8, "Minimum 8 characters")),
});

type LoginData = v.InferOutput<typeof LoginSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: valibotResolver(LoginSchema),
  });

  const onSubmit = async (payload: LoginData) => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      console.error(error.message);
      return;
    }

    toast.success("Login successfully");

    redirect("/trips");
  };
  return (
    <section className="flex items-center justify-center p-6 sm:p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 mb-6">
          ✈️
        </div>

        <h2 className="text-3xl font-semibold">Welcome back</h2>

        <p className="mt-2 text-muted-foreground">
          Sign in to continue planning your next adventure.
        </p>

        <div className="mt-8 space-y-4">
          <input
            {...register("email")}
            placeholder="Email address"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          {errors.email?.message && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}

          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          {errors.password?.message && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="accent-primary" />
              Remember me
            </label>

            <button
              type="button"
              className="text-primary hover:opacity-80 transition"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-primary py-3 font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Sign In
          </button>
        </div>

        <div className="my-6 flex items-center gap-3 text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <GoogleButton />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link
            href="/register"
            prefetch={false}
            scroll={true}
            className="text-primary hover:opacity-80 transition"
          >
            Create account
          </Link>
        </p>
      </form>
    </section>
  );
};

export default LoginForm;
