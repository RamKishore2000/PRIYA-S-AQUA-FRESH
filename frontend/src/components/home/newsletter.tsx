"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="grid items-center gap-6 rounded-lg border border-white/15 bg-white/[0.07] p-6 shadow-sm backdrop-blur md:grid-cols-[1fr_auto] md:p-8">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">Stay Updated</h2>
          <p className="mt-2 text-slate-300">Get product updates, offers and water-care tips directly in your inbox.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:w-[420px] sm:flex-row">
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" aria-label="Email address" />
          <Button type="submit" className="shrink-0">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
