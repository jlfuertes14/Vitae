"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AtSign,
  BadgeCheck,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
      if (email === "test@example.com" && password === "password123") {
        document.cookie = `sb-mock-token=true; path=/; max-age=${
          remember ? 60 * 60 * 24 * 30 : 60 * 60
        }; SameSite=Lax`;
        window.location.href = "/dashboard";
        return;
      }
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  const handleOAuth = async (provider: "google" | "github") => {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
    }
  };

  return (
    <div className="text-white">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
          <BadgeCheck className="size-3.5" />
          Elite access
        </div>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/68 sm:text-base">
          Sign in to keep building Harvard-style resumes with a cinematic,
          high-performance workspace behind you.
        </p>
      </div>

      {error ? (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/12 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="mb-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/6 text-sm font-medium text-white/88 transition hover:bg-white/10"
        >
          <svg className="size-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>

        <button
          type="button"
          onClick={() => handleOAuth("github")}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/6 text-sm font-medium text-white/88 transition hover:bg-white/10"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577V20.58c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.302 1.23A11.51 11.51 0 0 1 12 5.8c1.02.005 2.047.138 3.005.404 2.294-1.552 3.302-1.23 3.302-1.23.653 1.653.241 2.874.118 3.176.768.84 1.235 1.911 1.235 3.221 0 4.608-2.803 5.624-5.475 5.921.43.372.814 1.102.814 2.222v3.293c0 .319.192.694.8.576C20.565 21.797 24 17.3 24 12 24 5.373 18.627 0 12 0Z" />
          </svg>
          GitHub
        </button>
      </div>

      <div className="mb-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[11px] uppercase tracking-[0.24em] text-white/40">
          or continue with email
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-white/75">Email</span>
          <div className="relative">
            <AtSign className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/45" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/5 pr-4 pl-11 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:bg-white/7"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-white/75">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/45" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/5 pr-12 pl-11 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:bg-white/7"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-white/50 transition hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </label>

        <div className="flex items-center justify-between gap-4 pt-1">
          <label className="flex items-center gap-3 text-sm text-white/72">
            <button
              type="button"
              onClick={() => setRemember((prev) => !prev)}
              className={`relative h-6 w-11 rounded-full border transition ${
                remember
                  ? "border-white/25 bg-white"
                  : "border-white/15 bg-white/10"
              }`}
              aria-pressed={remember}
            >
              <span
                className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-black transition ${
                  remember ? "left-6" : "left-0.5"
                }`}
              />
            </button>
            Remember me
          </label>

          <Link
            href="#"
            className="text-sm text-white/68 transition hover:text-white"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-white font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Enter Vitae"}
          <ArrowRight className="size-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/58">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-white transition hover:text-white/75"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
