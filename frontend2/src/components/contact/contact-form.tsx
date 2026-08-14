"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { submitContactMessage } from "@/services/request-service";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Record<string, string> = {};

    if (!data.get("name")) nextErrors.name = "Full name is required.";
    if (!data.get("phone")) nextErrors.phone = "Phone number is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email") ?? ""))) {
      nextErrors.email = "Enter a valid email.";
    }
    if (!data.get("subject")) nextErrors.subject = "Subject is required.";
    if (!data.get("message")) nextErrors.message = "Message is required.";

    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      await submitContactMessage({
        fullName: String(data.get("name") ?? ""),
        mobile: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        subject: String(data.get("subject") ?? ""),
        message: String(data.get("message") ?? ""),
      });
      form.reset();
      setMessage("Your message has been sent successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)] md:p-6">
      <h2 className="font-serif text-3xl font-semibold text-[#1D2D2E]">Send Message</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Full Name" error={errors.name}><TextInput name="name" placeholder="Full Name" /></Field>
        <Field label="Phone Number" error={errors.phone}><TextInput name="phone" placeholder="Phone Number" /></Field>
        <Field label="Email" error={errors.email}><TextInput name="email" type="email" placeholder="Email" /></Field>
        <Field label="Subject" error={errors.subject}><TextInput name="subject" placeholder="Subject" /></Field>
        <Field label="Message" error={errors.message} className="md:col-span-2">
          <textarea
            name="message"
            placeholder="Tell us how we can help you..."
            className="min-h-[150px] w-full resize-y rounded-xl border border-[#E5D8C7] bg-white px-4 py-3 text-sm font-semibold text-[#1D2D2E] outline-none placeholder:text-[#7D7B75] focus:border-[#0A3A38]"
          />
        </Field>
      </div>
      <button type="submit" disabled={submitting} className="mt-5 rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white transition hover:bg-[#12383A] disabled:cursor-not-allowed disabled:opacity-65">
        {submitting ? "Sending..." : "Send Message"}
      </button>
      {message ? <p className="mt-4 rounded-lg bg-[#F5E9D8] px-3 py-2 text-sm font-bold text-[#8A5F23]">{message}</p> : null}
    </form>
  );
}

function TextInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-11 rounded-xl border border-[#E5D8C7] bg-white px-4 text-sm font-semibold text-[#1D2D2E] outline-none placeholder:text-[#7D7B75] focus:border-[#0A3A38] ${className}`}
    />
  );
}

function Field({ children, error, label, className }: { children: ReactNode; error?: string; label: string; className?: string }) {
  return (
    <label className={`grid gap-1.5 ${className ?? ""}`}>
      <span className="text-sm font-black text-[#526161]">{label}</span>
      {children}
      {error ? <span className="text-xs font-bold text-red-600">{error}</span> : null}
    </label>
  );
}
