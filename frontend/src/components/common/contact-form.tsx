"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    if (!data.get("name")) nextErrors.name = "Full name is required.";
    if (!data.get("phone")) nextErrors.phone = "Phone number is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email") ?? ""))) {
      nextErrors.email = "Enter a valid email.";
    }
    if (!data.get("subject")) nextErrors.subject = "Subject is required.";
    if (!data.get("message")) nextErrors.message = "Message is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    toast.success("Your message has been sent successfully.");
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-2xl font-bold text-slate-950">Send Message</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Full Name" error={errors.name}><Input name="name" placeholder="Full Name" /></Field>
        <Field label="Phone Number" error={errors.phone}><Input name="phone" placeholder="Phone Number" /></Field>
        <Field label="Email" error={errors.email}><Input name="email" type="email" placeholder="Email" /></Field>
        <Field label="Subject" error={errors.subject}><Input name="subject" placeholder="Subject" /></Field>
        <Field label="Message" error={errors.message} className="md:col-span-2">
          <textarea
            name="message"
            placeholder="Tell us how we can help you..."
            className="min-h-[150px] w-full resize-y rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </Field>
      </div>
      <Button type="submit" className="mt-5">Send Message</Button>
    </form>
  );
}

function Field({
  children,
  error,
  label,
  className,
}: {
  children: ReactNode;
  error?: string;
  label: string;
  className?: string;
}) {
  return (
    <label className={`grid gap-1.5 ${className ?? ""}`}>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error ? <span className="text-xs font-semibold text-rose-600">{error}</span> : null}
    </label>
  );
}
