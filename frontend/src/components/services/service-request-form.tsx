"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { services } from "@/components/services/service-data";
import { submitServiceRequest } from "@/services/request-service";

export function ServiceRequestForm() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedService, setSelectedService] = useState("");

    const submit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const nextErrors: Record<string, string> = {};
      if (!data.get("name")) nextErrors.name = "Full name is required.";
      if (!data.get("mobile")) nextErrors.mobile = "Mobile number is required.";
      if (!selectedService) nextErrors.service = "Please select a service.";
      if (!data.get("address")) nextErrors.address = "Address is required.";
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;
      try {
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
        toast.success("Service request submitted successfully.");
        form.reset();
        setSelectedService("");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to submit service request.");
      }
    };

    return (
      <form onSubmit={submit} className="rounded-lg border border-white/10 bg-[#111418] p-5 shadow-sm md:p-6">
        <h2 className="text-2xl font-bold text-white">Service Request Form</h2>
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
              className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#12a8e6] focus:ring-2 focus:ring-[#12a8e6]/20"
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
              className="min-h-[150px] w-full resize-y rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#12a8e6] focus:ring-2 focus:ring-[#12a8e6]/20"
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
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      {children}
      {error ? <span className="text-xs font-semibold text-rose-600">{error}</span> : null}
    </label>
  );
}
