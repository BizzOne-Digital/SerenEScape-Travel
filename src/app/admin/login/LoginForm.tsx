"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { BRAND } from "@/config/brand";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-soft-ivory via-warm-sand/40 to-soft-ivory px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold text-deep-aubergine">{BRAND.name}</h1>
          <p className="mt-2 text-sm text-luxury-ink/60">Admin Portal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-warm-sand/60 bg-white p-8 shadow-lg"
        >
          <h2 className="mb-6 font-display text-xl text-deep-aubergine">Sign In</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-rich-berry/10 px-4 py-3 text-sm text-rich-berry">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-luxury-ink/80">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-warm-sand bg-soft-ivory/50 px-4 py-2.5 text-sm outline-none transition focus:border-deep-aubergine focus:ring-2 focus:ring-deep-aubergine/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-luxury-ink/80">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-warm-sand bg-soft-ivory/50 px-4 py-2.5 text-sm outline-none transition focus:border-deep-aubergine focus:ring-2 focus:ring-deep-aubergine/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-deep-aubergine py-3 text-sm font-medium text-soft-ivory transition hover:bg-rich-berry disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
