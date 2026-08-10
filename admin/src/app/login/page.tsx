"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const rememberMe = Boolean(formData.get("rememberMe"));

    if (!email.includes("@") || password.trim().length < 3) {
      setToast("Enter a valid email and password.");
      return;
    }

    try {
      await loginAdmin(email, password, rememberMe);
      setToast("Login successful.");
      window.setTimeout(() => router.push("/dashboard"), 450);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Login failed.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#ffffff_100%)] px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
        <div className="mb-8 text-center">
          <div className="relative mx-auto h-20 w-44 bg-white">
            <Image
              src="/images/brand/priyas-aqua-fresh-logo-cropped.png"
              alt="Priya's Aqua Fresh"
              fill
              sizes="176px"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">Priya&apos;s Aqua Fresh</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Admin Panel Login</p>
        </div>

        <form onSubmit={submitLogin} className="space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email / Username</span>
            <input name="email" type="email" placeholder="admin@priyasaquafresh.com" className="mt-2 h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <div className="mt-2 flex h-11 rounded-md border border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
              <input name="password" type={showPassword ? "text" : "password"} placeholder="Enter password" className="min-w-0 flex-1 rounded-md px-3 text-sm outline-none" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="px-3 text-xs font-bold text-teal-700">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 font-medium text-slate-600">
              <input name="rememberMe" type="checkbox" className="h-4 w-4 accent-teal-600" />
              Remember me
            </label>
            <button type="button" className="font-semibold text-teal-700 hover:text-teal-800">Forgot Password?</button>
          </div>

          <button type="submit" className="h-11 w-full rounded-md bg-teal-600 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700">
            Login to Admin
          </button>
        </form>

        {toast ? <p className="mt-5 rounded-md border border-teal-100 bg-teal-50 px-3 py-2 text-center text-sm font-semibold text-teal-700">{toast}</p> : null}
      </section>
    </main>
  );
}
