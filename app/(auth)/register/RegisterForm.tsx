"use client";

import GoogleButton from "../GoogleButton";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { RegisterSchema, type RegisterData } from "./schema";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: valibotResolver(RegisterSchema),
  });

  const onSubmit = async (payload: RegisterData) => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.full_name,
        },
      },
    });

    if (error) {
      console.error(error.message);
      return;
    }

    console.log("Register success:", data);
    toast.success("Register successfully");

    redirect("/login");
  };

  return (
    <section className="flex items-center justify-center p-6 sm:p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 mb-6">
          🌍
        </div>

        <h2 className="text-3xl font-semibold">Create account</h2>

        <p className="mt-2 text-muted-foreground">
          Join now and start planning unforgettable trips.
        </p>

        <div className="mt-8 space-y-4">
          <input
            {...register("full_name")}
            autoComplete="off"
            placeholder="Full name"
            className="w-full rounded-2xl border border-input bg-card px-4 py-3 outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          {errors.full_name?.message && (
            <p className="text-sm text-destructive">
              {errors.full_name.message}
            </p>
          )}

          <input
            {...register("email")}
            autoComplete="off"
            placeholder="Email address"
            className="w-full rounded-2xl border border-input bg-card px-4 py-3 outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          {errors.email?.message && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}

          <input
            type="password"
            autoComplete="off"
            {...register("password")}
            placeholder="Password"
            className="w-full rounded-2xl border border-input bg-card px-4 py-3 outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          {errors.password?.message && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}

          <input
            type="password"
            autoComplete="off"
            {...register("confirm_password")}
            placeholder="Confirm password"
            className="w-full rounded-2xl border border-input bg-card px-4 py-3 outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          {errors.confirm_password?.message && (
            <p className="text-sm text-destructive">
              {errors.confirm_password.message}
            </p>
          )}

          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="mt-1 accent-primary" />
            <span>I agree to the Terms of Service and Privacy Policy</span>
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-primary py-3 font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Create Account
          </button>
        </div>

        <div className="my-6 flex items-center gap-3 text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <GoogleButton />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            prefetch={false}
            scroll={true}
            className="text-primary hover:opacity-80 transition"
          >
            Sign in
          </Link>
        </p>
      </form>
    </section>
  );
};

export default RegisterForm;
