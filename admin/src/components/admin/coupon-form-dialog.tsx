"use client";

import { useState } from "react";
import { AdminModalShell } from "@/components/admin/admin-modal-shell";
import type { Coupon, CouponManualStatus, DiscountType } from "@/types/admin";

type CouponFormState = {
  code: string;
  discountType: DiscountType;
  discountValue: string;
  minimumOrderAmount: string;
  maximumDiscountAmount: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  usageLimit: string;
  manualStatus: CouponManualStatus;
};

type CouponFormDialogProps = {
  mode: "add" | "edit";
  open: boolean;
  initialCoupon?: Coupon | null;
  onClose: () => void;
  onSave: (coupon: Coupon) => void;
};

const inputClass = "h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

function initialState(coupon?: Coupon | null): CouponFormState {
  return {
    code: coupon?.code ?? "",
    discountType: coupon?.discountType ?? "Percentage",
    discountValue: coupon ? String(coupon.discountValue) : "",
    minimumOrderAmount: coupon ? String(coupon.minimumOrderAmount) : "",
    maximumDiscountAmount: coupon?.maximumDiscountAmount ? String(coupon.maximumDiscountAmount) : "",
    startDate: coupon?.startDate ?? "",
    startTime: coupon?.startTime ?? "",
    endDate: coupon?.endDate ?? "",
    endTime: coupon?.endTime ?? "",
    usageLimit: coupon ? String(coupon.usageLimit) : "",
    manualStatus: coupon?.manualStatus ?? "Active",
  };
}

export function CouponFormDialog({ mode, open, initialCoupon, onClose, onSave }: CouponFormDialogProps) {
  const [form, setForm] = useState<CouponFormState>(() => initialState(initialCoupon));
  const [errors, setErrors] = useState<Partial<Record<keyof CouponFormState | "dateRange", string>>>({});

  if (!open) return null;

  function updateField<K extends keyof CouponFormState>(field: K, value: CouponFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, dateRange: undefined }));
  }

  function normalizeCode(value: string) {
    return value.toUpperCase().replace(/\s+/g, "");
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof CouponFormState | "dateRange", string>> = {};
    const start = new Date(`${form.startDate}T${form.startTime}`);
    const end = new Date(`${form.endDate}T${form.endTime}`);

    if (!form.code.trim()) nextErrors.code = "Coupon code is required.";
    if (!Number(form.discountValue) || Number(form.discountValue) <= 0) nextErrors.discountValue = "Enter a valid discount value.";
    if (!Number(form.minimumOrderAmount) || Number(form.minimumOrderAmount) <= 0) nextErrors.minimumOrderAmount = "Enter a valid minimum order amount.";
    if (form.maximumDiscountAmount && Number(form.maximumDiscountAmount) <= 0) nextErrors.maximumDiscountAmount = "Enter a valid maximum discount amount.";
    if (!form.startDate) nextErrors.startDate = "Start date is required.";
    if (!form.startTime) nextErrors.startTime = "Start time is required.";
    if (!form.endDate) nextErrors.endDate = "End date is required.";
    if (!form.endTime) nextErrors.endTime = "End time is required.";
    if (!Number(form.usageLimit) || Number(form.usageLimit) <= 0) nextErrors.usageLimit = "Enter a valid usage limit.";
    if (form.startDate && form.startTime && form.endDate && form.endTime && end <= start) {
      nextErrors.dateRange = "End date and time must be after the start date and time.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      id: initialCoupon?.id ?? `cpn-${Date.now()}`,
      code: normalizeCode(form.code),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minimumOrderAmount: Number(form.minimumOrderAmount),
      maximumDiscountAmount: form.maximumDiscountAmount ? Number(form.maximumDiscountAmount) : undefined,
      startDate: form.startDate,
      startTime: form.startTime,
      endDate: form.endDate,
      endTime: form.endTime,
      usageLimit: Number(form.usageLimit),
      manualStatus: form.manualStatus,
      createdDate: initialCoupon?.createdDate ?? "09 Aug 2026",
    });
  }

  return (
    <AdminModalShell labelledBy="coupon-form-title" maxWidth="xl">
      <form onSubmit={submitForm}>
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 id="coupon-form-title" className="text-lg font-bold text-slate-950">{mode === "edit" ? "Edit Coupon" : "Add Coupon"}</h2>
            <p className="text-sm text-slate-500">Create exact coupon validity using date and time.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Close</button>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Coupon Code</span>
            <input className={`${inputClass} mt-2 font-bold uppercase`} value={form.code} onChange={(event) => updateField("code", normalizeCode(event.target.value))} placeholder="AQUA20" />
            {errors.code ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.code}</span> : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Discount Type</span>
            <select className={`${inputClass} mt-2`} value={form.discountType} onChange={(event) => updateField("discountType", event.target.value as DiscountType)}>
              <option>Percentage</option>
              <option>Flat Amount</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">{form.discountType === "Percentage" ? "Discount Value (%)" : "Discount Value (Rs.)"}</span>
            <input type="number" className={`${inputClass} mt-2`} value={form.discountValue} onChange={(event) => updateField("discountValue", event.target.value)} placeholder={form.discountType === "Percentage" ? "20" : "500"} />
            {errors.discountValue ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.discountValue}</span> : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Minimum Order Amount</span>
            <input type="number" className={`${inputClass} mt-2`} value={form.minimumOrderAmount} onChange={(event) => updateField("minimumOrderAmount", event.target.value)} placeholder="5000" />
            {errors.minimumOrderAmount ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.minimumOrderAmount}</span> : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Maximum Discount Amount</span>
            <input type="number" className={`${inputClass} mt-2`} value={form.maximumDiscountAmount} onChange={(event) => updateField("maximumDiscountAmount", event.target.value)} placeholder="2000" />
            {errors.maximumDiscountAmount ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.maximumDiscountAmount}</span> : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Start Date</span>
            <input type="date" className={`${inputClass} mt-2`} value={form.startDate} onChange={(event) => updateField("startDate", event.target.value)} />
            {errors.startDate ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.startDate}</span> : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Start Time</span>
            <input type="time" className={`${inputClass} mt-2`} value={form.startTime} onChange={(event) => updateField("startTime", event.target.value)} />
            {errors.startTime ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.startTime}</span> : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">End Date</span>
            <input type="date" className={`${inputClass} mt-2`} value={form.endDate} onChange={(event) => updateField("endDate", event.target.value)} />
            {errors.endDate ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.endDate}</span> : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">End Time</span>
            <input type="time" className={`${inputClass} mt-2`} value={form.endTime} onChange={(event) => updateField("endTime", event.target.value)} />
            {errors.endTime ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.endTime}</span> : null}
          </label>
          {errors.dateRange ? <p className="text-xs font-semibold text-red-600 md:col-span-2">{errors.dateRange}</p> : null}
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Usage Limit</span>
            <input type="number" className={`${inputClass} mt-2`} value={form.usageLimit} onChange={(event) => updateField("usageLimit", event.target.value)} placeholder="100" />
            {errors.usageLimit ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.usageLimit}</span> : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select className={`${inputClass} mt-2`} value={form.manualStatus} onChange={(event) => updateField("manualStatus", event.target.value as CouponManualStatus)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button type="submit" className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white">{mode === "edit" ? "Save Coupon" : "Add Coupon"}</button>
        </div>
      </form>
    </AdminModalShell>
  );
}
