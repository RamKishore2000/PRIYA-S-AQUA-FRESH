"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { ShareDetailsModal } from "@/components/common/share-details-modal";
import { services } from "@/components/services/service-data";
import { submitServiceRequest } from "@/services/request-service";

type ShareDetail = {
  label: string;
  value: string;
};

const SERVICE_WHATSAPP_DISPLAY = "9133213211";
const SERVICE_WHATSAPP_LINK = "919133213211";
const SERVICE_CALL_DISPLAY = "9063606360";

export function ServiceRequestForm({ compact = false }: { compact?: boolean }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shareDetails, setShareDetails] = useState<ShareDetail[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 5000);
    return () => window.clearTimeout(timer);
  }, [message]);

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

    const payload = {
      customerName: String(data.get("name") ?? ""),
      mobile: String(data.get("mobile") ?? ""),
      email: String(data.get("email") ?? ""),
      serviceType: selectedService,
      city: String(data.get("city") ?? ""),
      preferredDate: String(data.get("date") ?? ""),
      address: String(data.get("address") ?? ""),
      problem: String(data.get("message") ?? ""),
    };

    try {
      setSubmitting(true);
      await submitServiceRequest(payload);
      setShareDetails([
        { label: "Request Type", value: "Service Request" },
        { label: "Customer Name", value: payload.customerName },
        { label: "Mobile Number", value: payload.mobile },
        { label: "Email", value: payload.email },
        { label: "Service Type", value: payload.serviceType },
        { label: "City", value: payload.city },
        { label: "Preferred Date", value: payload.preferredDate },
        { label: "Address", value: payload.address },
        { label: "Requirement", value: payload.problem },
      ]);
      form.reset();
      setSelectedService("");
      setMessage("Service request submitted successfully.");
      setShareModalOpen(true);
    } catch (error) {
      const fieldErrors = (error as Error & { fieldErrors?: Record<string, string> }).fieldErrors;
      if (fieldErrors) setErrors(fieldErrors);
      setMessage(error instanceof Error ? error.message : "Unable to submit service request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} className={compact ? "rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(0,87,200,0.07)] md:p-5" : "rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_rgba(0,87,200,0.07)] md:p-6"}>
        {!compact ? <h2 className="text-2xl font-black text-[#102033]">Service Request Form</h2> : null}
        <div className={compact ? "grid gap-4 md:grid-cols-2" : "mt-6 grid gap-4 md:grid-cols-2"}>
          <Field label="Full Name" error={errors.name}><TextInput name="name" placeholder="Full Name" /></Field>
          <Field label="Mobile Number" error={errors.mobile}><TextInput name="mobile" placeholder="Mobile Number" /></Field>
          <Field label="Email"><TextInput name="email" type="email" placeholder="Email" /></Field>
          <Field label="Service Type" error={errors.service}>
            <select
              name="service"
              value={selectedService}
              onChange={(event) => setSelectedService(event.target.value)}
              className="h-11 rounded-xl border border-[#D8EAF8] bg-white px-4 text-sm font-semibold text-[#102033] outline-none focus:border-[#0057C8]"
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
              className="min-h-[140px] w-full resize-y rounded-xl border border-[#D8EAF8] bg-white px-4 py-3 text-sm font-semibold text-[#102033] outline-none placeholder:text-[#74879A] focus:border-[#0057C8]"
            />
          </Field>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="submit" disabled={submitting} className="rounded-full bg-[#0057C8] px-6 py-3 text-sm font-black text-white transition hover:bg-[#063B7A] disabled:cursor-not-allowed disabled:opacity-65">
            {submitting ? "Submitting..." : "Submit Service Request"}
          </button>
          <a href={`tel:${SERVICE_CALL_DISPLAY}`} className="inline-flex items-center justify-center rounded-full border border-[#0057C8] px-6 py-3 text-sm font-black text-[#0057C8] transition hover:bg-[#EAF6FF]">
            Call Service Support: {SERVICE_CALL_DISPLAY}
          </a>
        </div>
        {message ? <p className="mt-4 rounded-lg bg-[#EAF6FF] px-3 py-2 text-sm font-bold text-[#075985]">{message}</p> : null}
      </form>
      <ShareDetailsModal
        open={shareModalOpen}
        title="Service Request Submitted"
        description="Your request was saved. Share the details now so support can contact you faster."
        details={shareDetails}
        supportPhoneDisplay={SERVICE_WHATSAPP_DISPLAY}
        supportPhoneLink={SERVICE_WHATSAPP_LINK}
        supportNote={`Please share these service details on WhatsApp to ${SERVICE_WHATSAPP_DISPLAY}. For service support call ${SERVICE_CALL_DISPLAY}.`}
        onShared={() => undefined}
        onContinue={() => setShareModalOpen(false)}
        continueLabel="Close"
      />
    </>
  );
}

function TextInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-11 rounded-xl border border-[#D8EAF8] bg-white px-4 text-sm font-semibold text-[#102033] outline-none placeholder:text-[#74879A] focus:border-[#0057C8] ${className}`}
    />
  );
}

function Field({ children, error, label, className }: { children: ReactNode; error?: string; label: string; className?: string }) {
  return (
    <label className={`grid gap-1.5 ${className ?? ""}`}>
      <span className="text-sm font-black text-[#40576C]">{label}</span>
      {children}
      {error ? <span className="text-xs font-bold text-red-600">{error}</span> : null}
    </label>
  );
}
