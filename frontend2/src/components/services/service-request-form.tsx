"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { services } from "@/components/services/service-data";
import { submitServiceRequest } from "@/services/request-service";

export function ServiceRequestForm({ compact = false }: { compact?: boolean }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Record<string, string> = {};

    if (!data.get("name")) nextErrors.name = "Full name is required.";
    if (!data.get("mobile")) nextErrors.mobile = "Mobile number is required.";
    if (!selectedService) nextErrors.service = "Please select a service.";
    if (!data.get("address")) nextErrors.address = "Address is required.";

    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      await submitServiceRequest({
        customerName: String(data.get("name") ?? ""),
        mobile: String(data.get("mobile") ?? ""),
        email: String(data.get("email") ?? ""),
        serviceType: selectedService,
        city: String(data.get("city") ?? ""),
        preferredDate: String(data.get("date") ?? ""),
        address: String(data.get("address") ?? ""),
        problem: String(data.get("message") ?? ""),
      });
      form.reset();
      setSelectedService("");
      setMessage("Service request submitted successfully.");
    } catch (error) {
      const fieldErrors = (error as Error & { fieldErrors?: Record<string, string> }).fieldErrors;
      if (fieldErrors) setErrors(fieldErrors);
      setMessage(error instanceof Error ? error.message : "Unable to submit service request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className={compact ? "rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-4 shadow-[0_10px_30px_rgba(84,61,35,0.06)] md:p-5" : "rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)] md:p-6"}>
      {!compact ? <h2 className="text-2xl font-black text-[#1D2D2E]">Service Request Form</h2> : null}
      <div className={compact ? "grid gap-4 md:grid-cols-2" : "mt-6 grid gap-4 md:grid-cols-2"}>
        <Field label="Full Name" error={errors.name}><TextInput name="name" placeholder="Full Name" /></Field>
        <Field label="Mobile Number" error={errors.mobile}><TextInput name="mobile" placeholder="Mobile Number" /></Field>
        <Field label="Email"><TextInput name="email" type="email" placeholder="Email" /></Field>
        <Field label="Service Type" error={errors.service}>
          <select
            name="service"
            value={selectedService}
            onChange={(event) => setSelectedService(event.target.value)}
            className="h-11 rounded-xl border border-[#E5D8C7] bg-white px-4 text-sm font-semibold text-[#1D2D2E] outline-none focus:border-[#0A3A38]"
          >
            <option value="">Service Type</option>
            {services.map((service) => <option key={service} value={service}>{service}</option>)}
          </select>
        </Field>
        <Field label="City"><TextInput name="city" placeholder="City" /></Field>
        <Field label="Preferred Date"><TextInput name="date" type="date" placeholder="Preferred Date" /></Field>
        <Field label="Address" error={errors.address} className="md:col-span-2"><TextInput name="address" placeholder="Address" /></Field>
        <Field label="Problem / Requirement" className="md:col-span-2">
          <textarea
            name="message"
            placeholder="Describe the issue or service you need..."
            className="min-h-[140px] w-full resize-y rounded-xl border border-[#E5D8C7] bg-white px-4 py-3 text-sm font-semibold text-[#1D2D2E] outline-none placeholder:text-[#7D7B75] focus:border-[#0A3A38]"
          />
        </Field>
      </div>
      <button type="submit" disabled={submitting} className="mt-5 rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white transition hover:bg-[#12383A] disabled:cursor-not-allowed disabled:opacity-65">
        {submitting ? "Submitting..." : "Submit Service Request"}
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
