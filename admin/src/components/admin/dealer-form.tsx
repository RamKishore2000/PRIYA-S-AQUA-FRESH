"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminToast } from "@/components/admin/admin-toast";
import { adminApi } from "@/services/api";
import type { Dealer, Status } from "@/types/admin";

type DealerFormState = {
  name: string;
  businessName: string;
  mobile: string;
  email: string;
  dealerCode: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: Extract<Status, "Active" | "Inactive">;
};

type DealerFormProps = {
  mode?: "add" | "edit";
  initialDealer?: Dealer;
};

const inputClass = "h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";
const textareaClass = "min-h-24 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

function initialState(dealer?: Dealer): DealerFormState {
  return {
    name: dealer?.name ?? "",
    businessName: dealer?.businessName ?? "",
    mobile: dealer?.mobile ?? "",
    email: dealer?.email ?? "",
    dealerCode: dealer?.dealerCode ?? "",
    gstNumber: dealer?.gstNumber ?? "",
    address: dealer?.address ?? "",
    city: dealer?.city ?? "",
    state: dealer?.state ?? "",
    pincode: dealer?.pincode ?? "",
    status: dealer?.status === "Inactive" ? "Inactive" : "Active",
  };
}

export function DealerForm({ mode = "add", initialDealer }: DealerFormProps) {
  const [form, setForm] = useState<DealerFormState>(() => initialState(initialDealer));
  const [errors, setErrors] = useState<Partial<Record<keyof DealerFormState, string>>>({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof DealerFormState>(field: K, value: DealerFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof DealerFormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = "Dealer name is required.";
    if (!form.businessName.trim()) nextErrors.businessName = "Business name is required.";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) nextErrors.mobile = "Enter a valid 10 digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email.";
    if (form.gstNumber.trim() && form.gstNumber.trim().length > 30) nextErrors.gstNumber = "GST number is too long.";
    if (!form.address.trim()) nextErrors.address = "Address is required.";
    if (!form.city.trim()) nextErrors.city = "City is required.";
    if (!form.state.trim()) nextErrors.state = "State is required.";
    if (!/^\d{6}$/.test(form.pincode)) nextErrors.pincode = "Enter a valid 6 digit pincode.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: Record<string, string> = {
      name: form.name,
      businessName: form.businessName,
      mobile: form.mobile,
      email: form.email,
      dealerCode: form.dealerCode,
      gstNumber: form.gstNumber.trim(),
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      status: form.status === "Active" ? "ACTIVE" : "INACTIVE",
    };

    setSaving(true);
    const request = mode === "edit" && initialDealer
      ? adminApi.updateDealer(initialDealer.id, payload)
      : adminApi.createDealer(payload);

    request
      .then(() => setMessage(mode === "edit" ? "Dealer updated successfully." : "Dealer added successfully."))
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to save dealer."))
      .finally(() => setSaving(false));
  }

  return (
    <>
      <AdminToast message={message} />
      <form onSubmit={submitForm} className="space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-950">{mode === "edit" ? "Edit Dealer" : "Dealer Account Details"}</h2>
            <p className="text-sm text-slate-500">Dealers are created by admin and login with OTP using the registered dealer mobile number.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ["name", "Dealer Name", "Dealer name"],
              ["businessName", "Business Name", "Business name"],
              ["mobile", "Mobile Number", "9876543210"],
              ["email", "Email", "dealer@example.com"],
              ["dealerCode", "Dealer Code", "DLR-AP-001"],
              ["gstNumber", "GST Number (Optional)", "GST number"],
              ["city", "City", "City"],
              ["state", "State", "State"],
              ["pincode", "Pincode", "Pincode"],
            ].map(([field, label, placeholder]) => (
              <label key={field} className="block">
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <input className={`${inputClass} mt-2`} value={String(form[field as keyof DealerFormState])} onChange={(event) => updateField(field as keyof DealerFormState, event.target.value)} placeholder={placeholder} />
                {errors[field as keyof DealerFormState] ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors[field as keyof DealerFormState]}</span> : null}
              </label>
            ))}
            <label className="block lg:col-span-3">
              <span className="text-sm font-semibold text-slate-700">Address</span>
              <textarea className={`${textareaClass} mt-2`} value={form.address} onChange={(event) => updateField("address", event.target.value)} placeholder="Full dealer address" />
              {errors.address ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.address}</span> : null}
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Status</span>
              <select className={`${inputClass} mt-2`} value={form.status} onChange={(event) => updateField("status", event.target.value as DealerFormState["status"])}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
          </div>
        </section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Link href="/dealers" className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 px-5 text-sm font-semibold text-slate-700">Cancel</Link>
          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-5 text-sm font-semibold text-white">{saving ? "Saving..." : mode === "edit" ? "Update Dealer" : "Save Dealer"}</button>
        </div>
      </form>
    </>
  );
}
