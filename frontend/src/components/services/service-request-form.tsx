"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { services } from "@/components/services/service-data";

export function ServiceRequestForm() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedService, setSelectedService] = useState("");

    const submit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const nextErrors: Record<string, string> = {};
      if (!data.get("name")) nextErrors.name = "Full name is required.";
      if (!data.get("mobile")) nextErrors.mobile = "Mobile number is required.";
      if (!selectedService) nextErrors.service = "Please select a service.";
      if (!data.get("address")) nextErrors.address = "Address is required.";
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;
      toast.success("Service request submitted successfully.");
      event.currentTarget.reset();
      setSelectedService("");
    };

    return (
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-2xl font-bold text-slate-950">Service Request Form</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Full Name" error={errors.name}><Input name="name" placeholder="Full Name" /></Field>
          <Field label="Mobile Number" error={errors.mobile}><Input name="mobile" placeholder="Mobile Number" /></Field>
          <Field label="Email"><Input name="email" type="email" placeholder="Email" /></Field>
          <Field label="Service Type" error={errors.service}>
            <select
              name="service"
              value={selectedService}
              onChange={(event) => {
                setSelectedService(event.target.value);
              }}
              className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">Service Type</option>
              {services.map((service) => <option key={service} value={service}>{service}</option>)}
            </select>
          </Field>
          <Field label="City"><Input name="city" placeholder="City" /></Field>
          <Field label="Preferred Date"><Input name="date" type="date" placeholder="Preferred Date" /></Field>
          <Field label="Address" error={errors.address} className="md:col-span-2"><Input name="address" placeholder="Address" /></Field>
          <Field label="Problem / Requirement" className="md:col-span-2">
            <textarea
              name="message"
              placeholder="Describe the issue or service you need..."
              className="min-h-[150px] w-full resize-y rounded-md border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </Field>
        </div>
        <Button type="submit" className="mt-5">Submit Service Request</Button>
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
