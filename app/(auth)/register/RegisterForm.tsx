"use client";

import * as v from "valibot";
import GoogleButton from "../GoogleButton";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const RegisterSchema = v.pipe(
  v.object({
    full_name: v.pipe(v.string(), v.minLength(5, "Minimum 5 characters")),

    email: v.pipe(v.string(), v.email("Invalid email address")),

    password: v.pipe(v.string(), v.minLength(8, "Minimum 8 characters")),

    confirm_password: v.string(),
  }),

  v.forward(
    v.check(
      (input) => input.password === input.confirm_password,
      "Password confirmation does not match",
    ),
    ["confirm_password"],
  ),
);

type RegisterData = v.InferOutput<typeof RegisterSchema>;

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
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl p-8 shadow-2xl"
      >
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
            {...register("full_name")}
          />
          {errors.full_name?.message && (
            <p className="text-sm text-red-800"> {errors.full_name.message} </p>
          )}
          <input
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Email address"
            {...register("email")}
          />
          {errors.email?.message && (
            <p className="text-sm text-red-800"> {errors.email.message} </p>
          )}
          <input
            type="password"
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-sm text-red-800"> {errors.password.message} </p>
          )}
          <input
            type="password"
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-emerald-400"
            placeholder="Confirm password"
            {...register("confirm_password")}
          />
          {errors.confirm_password?.message && (
            <p className="text-sm text-red-800">
              {" "}
              {errors.confirm_password.message}{" "}
            </p>
          )}
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

        <GoogleButton />

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link
            href="/login"
            prefetch={false}
            scroll={true}
            className="text-cyan-400"
          >
            Sign in
          </Link>
        </p>
      </form>
    </section>
  );
};

export default RegisterForm;
