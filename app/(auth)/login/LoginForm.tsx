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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      console.error(error.message);
      return;
    }

    console.log("Login success:", data);
    toast.success("Login successfully");

    redirect("/");
  };
  return (
    <section className="flex items-center justify-center p-6 sm:p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 mb-6">
          ✈️
        </div>
        <h2 className="text-3xl font-semibold">Welcome back</h2>
        <p className="mt-2 text-white/60">
          Sign in to continue planning your next adventure.
        </p>

        <div className="mt-8 space-y-4">
          <input
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-400"
            {...register("email")}
            placeholder="Email address"
          />
          {errors.email?.message && (
            <p className="text-sm text-red-800"> {errors.email.message} </p>
          )}
          <input
            type="password"
            {...register("password")}
            className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-400"
            placeholder="Password"
          />
          {errors.password?.message && (
            <p className="text-sm text-red-800"> {errors.password.message} </p>
          )}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/60">
              <input type="checkbox" /> Remember me
            </label>
            <button className="text-cyan-400 hover:text-cyan-300">
              Forgot password?
            </button>
          </div>
          <button
            className="w-full rounded-2xl bg-cyan-500 py-3 font-medium text-black hover:opacity-90 transition"
            type="submit"
          >
            Sign In
          </button>
        </div>

        <div className="my-6 flex items-center gap-3 text-white/30">
          <div className="h-px flex-1 bg-white/10" />
          or
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <GoogleButton />

        <p className="mt-6 text-center text-sm text-white/50">
          New here?{" "}
          <Link
            href="/register"
            prefetch={false}
            scroll={true}
            className="text-cyan-400"
          >
            Create account
          </Link>
        </p>
      </form>
    </section>
  );
};

export default LoginForm;
