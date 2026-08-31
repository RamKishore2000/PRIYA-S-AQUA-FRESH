"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AdminModalShell } from "@/components/admin/admin-modal-shell";
import { uploadImage } from "@/services/api";
import type { Coupon, CouponManualStatus, CouponProductScope, DiscountType, Product } from "@/types/admin";

type CouponFormState = {
  code: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  discountType: DiscountType;
  discountValue: string;
  minimumOrderAmount: string;
  maximumDiscountAmount: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  usageLimit: string;
  sortOrder: string;
  productScope: CouponProductScope;
  applicableProductIds: string[];
  manualStatus: CouponManualStatus;
};

type CouponFormDialogProps = {
  mode: "add" | "edit";
  open: boolean;
  initialCoupon?: Coupon | null;
  products: Product[];
  onClose: () => void;
  onSave: (coupon: Coupon) => void;
};

const inputClass = "h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";
function validateExactImageSize(file: File, width: number, height: number) {
  return new Promise<void>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (image.naturalWidth !== width || image.naturalHeight !== height) {
        reject(new Error(`Please upload ${width} x ${height} px image. Selected image is ${image.naturalWidth} x ${image.naturalHeight} px.`));
        return;
      }
      resolve();
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read image size."));
    };
    image.src = objectUrl;
  });
}

function initialState(coupon?: Coupon | null): CouponFormState {
  const applicableProductIds = coupon?.applicableProductIds || [];
  return {
    code: coupon?.code ?? "",
    title: coupon?.title ?? "",
    subtitle: coupon?.subtitle ?? "",
    imageUrl: coupon?.imageUrl ?? "",
    discountType: coupon?.discountType ?? "Percentage",
    discountValue: coupon ? String(coupon.discountValue) : "",
    minimumOrderAmount: coupon ? String(coupon.minimumOrderAmount) : "",
    maximumDiscountAmount: coupon?.maximumDiscountAmount ? String(coupon.maximumDiscountAmount) : "",
    startDate: coupon?.startDate ?? "",
    startTime: coupon?.startTime ?? "",
    endDate: coupon?.endDate ?? "",
    endTime: coupon?.endTime ?? "",
    usageLimit: coupon ? String(coupon.usageLimit) : "",
    sortOrder: coupon ? String(coupon.sortOrder) : "0",
    productScope: applicableProductIds.length ? "Selected Products" : "All Products",
    applicableProductIds,
    manualStatus: coupon?.manualStatus ?? "Active",
  };
}

export function CouponFormDialog({ mode, open, initialCoupon, products, onClose, onSave }: CouponFormDialogProps) {
  const [form, setForm] = useState<CouponFormState>(() => initialState(initialCoupon));
  const [errors, setErrors] = useState<Partial<Record<keyof CouponFormState | "dateRange", string>>>({});
  const [uploading, setUploading] = useState(false);
  const [productChooserOpen, setProductChooserOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const selectedProducts = useMemo(
    () => products.filter((product) => form.applicableProductIds.includes(product.id)),
    [form.applicableProductIds, products],
  );

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => [product.name, product.sku, product.category, product.subcategory].filter(Boolean).join(" ").toLowerCase().includes(query));
  }, [productSearch, products]);

  if (!open) return null;

  function updateField<K extends keyof CouponFormState>(field: K, value: CouponFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, dateRange: undefined }));
  }

  function normalizeCode(value: string) {
    return value.toUpperCase().replace(/\s+/g, "");
  }

  function toggleProduct(productId: string) {
    setForm((current) => ({
      ...current,
      applicableProductIds: current.applicableProductIds.includes(productId)
        ? current.applicableProductIds.filter((id) => id !== productId)
        : [...current.applicableProductIds, productId],
    }));
    setErrors((current) => ({ ...current, applicableProductIds: undefined }));
  }

  function clearSelectedProducts() {
    updateField("applicableProductIds", []);
  }

  async function uploadOfferImage(file?: File) {
    if (!file) return;
    setUploading(true);
    setErrors((current) => ({ ...current, imageUrl: undefined }));
    try {
      await validateExactImageSize(file, 1200, 1200);
      const imageUrl = await uploadImage(file, "coupons", 1200, 1200);
      updateField("imageUrl", imageUrl);
    } catch (error) {
      setErrors((current) => ({ ...current, imageUrl: error instanceof Error ? error.message : "Image upload failed." }));
    } finally {
      setUploading(false);
    }
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof CouponFormState | "dateRange", string>> = {};
    const start = new Date(`${form.startDate}T${form.startTime}`);
    const end = new Date(`${form.endDate}T${form.endTime}`);

    if (!form.code.trim()) nextErrors.code = "Coupon code is required.";
    if (form.title.length > 160) nextErrors.title = "Offer title is too long.";
    if (form.subtitle.length > 255) nextErrors.subtitle = "Offer subtitle is too long.";
    if (!Number(form.discountValue) || Number(form.discountValue) <= 0) nextErrors.discountValue = "Enter a valid discount value.";
    if (form.minimumOrderAmount === "" || Number(form.minimumOrderAmount) < 0) nextErrors.minimumOrderAmount = "Enter a valid minimum order amount.";
    if (form.maximumDiscountAmount && Number(form.maximumDiscountAmount) <= 0) nextErrors.maximumDiscountAmount = "Enter a valid maximum discount amount.";
    if (!form.startDate) nextErrors.startDate = "Start date is required.";
    if (!form.startTime) nextErrors.startTime = "Start time is required.";
    if (!form.endDate) nextErrors.endDate = "End date is required.";
    if (!form.endTime) nextErrors.endTime = "End time is required.";
    if (!Number(form.usageLimit) || Number(form.usageLimit) <= 0) nextErrors.usageLimit = "Enter a valid usage limit.";
    if (form.sortOrder && Number(form.sortOrder) < 0) nextErrors.sortOrder = "Sort order cannot be negative.";
    if (form.productScope === "Selected Products" && form.applicableProductIds.length === 0) nextErrors.applicableProductIds = "Select at least one product for this coupon.";
    if (form.startDate && form.startTime && form.endDate && form.endTime && end <= start) {
      nextErrors.dateRange = "End date and time must be after the start date and time.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const selectedProductIds = form.productScope === "Selected Products" ? form.applicableProductIds : [];
    onSave({
      id: initialCoupon?.id ?? `cpn-${Date.now()}`,
      code: normalizeCode(form.code),
      title: form.title.trim() || undefined,
      subtitle: form.subtitle.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minimumOrderAmount: Number(form.minimumOrderAmount),
      maximumDiscountAmount: form.maximumDiscountAmount ? Number(form.maximumDiscountAmount) : undefined,
      startDate: form.startDate,
      startTime: form.startTime,
      endDate: form.endDate,
      endTime: form.endTime,
      usageLimit: Number(form.usageLimit),
      sortOrder: form.sortOrder ? Number(form.sortOrder) : 0,
      applicableProductIds: selectedProductIds,
      applicableProducts: products.filter((product) => selectedProductIds.includes(product.id)).map((product) => ({ id: product.id, name: product.name, sku: product.sku })),
      manualStatus: form.manualStatus,
      createdDate: initialCoupon?.createdDate ?? "09 Aug 2026",
    });
  }

  return (
    <>
      <AdminModalShell labelledBy="coupon-form-title" maxWidth="xl" onClose={onClose}>
        <form onSubmit={submitForm}>
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 id="coupon-form-title" className="text-lg font-bold text-slate-950">{mode === "edit" ? "Edit Coupon" : "Add Coupon"}</h2>
              <p className="text-sm text-slate-500">Create coupon validity and choose which products can use it.</p>
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
              <span className="text-sm font-semibold text-slate-700">Offer Title</span>
              <input className={`${inputClass} mt-2`} value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="Festival Water Purifier Offer" />
              {errors.title ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.title}</span> : null}
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Offer Subtitle</span>
              <input className={`${inputClass} mt-2`} value={form.subtitle} onChange={(event) => updateField("subtitle", event.target.value)} placeholder="Limited time savings on selected products" />
              {errors.subtitle ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.subtitle}</span> : null}
            </label>
            <div className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Coupon Right-Side Image</span>
              <div className="mt-2 grid gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 md:grid-cols-[220px_1fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-white">
                  {form.imageUrl ? <Image src={form.imageUrl} alt="Coupon right-side image" fill className="object-contain p-2" unoptimized /> : <span className="grid h-full place-items-center text-xs font-semibold text-slate-400">No image</span>}
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <p className="text-xs font-semibold leading-5 text-slate-500">Required size: 1200 x 1200 px. Upload only square JPG, PNG, or WebP image. Wrong size images will not upload.</p>
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex cursor-pointer rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                      {uploading ? "Uploading..." : form.imageUrl ? "Replace Image" : "Upload Image"}
                      <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(event) => uploadOfferImage(event.target.files?.[0])} />
                    </label>
                    {form.imageUrl ? (
                      <button type="button" onClick={() => updateField("imageUrl", "")} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                        Remove
                      </button>
                    ) : null}
                  </div>
                  {errors.imageUrl ? <span className="text-xs font-semibold text-red-600">{errors.imageUrl}</span> : null}
                </div>
              </div>
            </div>
            <div className="md:col-span-2 rounded-lg border border-slate-200 p-4">
              <span className="text-sm font-semibold text-slate-700">Apply Coupon To</span>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(["All Products", "Selected Products"] as CouponProductScope[]).map((scope) => (
                  <button key={scope} type="button" onClick={() => updateField("productScope", scope)} className={`rounded-md border px-3 py-2 text-left text-sm font-bold transition ${form.productScope === scope ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                    {scope}
                  </button>
                ))}
              </div>
              {form.productScope === "Selected Products" ? (
                <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{selectedProducts.length} product{selectedProducts.length === 1 ? "" : "s"} selected</p>
                      <p className="text-xs font-semibold text-slate-500">Search and choose products in a separate modal.</p>
                    </div>
                    <button type="button" onClick={() => setProductChooserOpen(true)} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                      Choose Products
                    </button>
                  </div>
                  {selectedProducts.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedProducts.slice(0, 8).map((product) => (
                        <span key={product.id} className="rounded-full border border-teal-100 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{product.name}</span>
                      ))}
                      {selectedProducts.length > 8 ? <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">+{selectedProducts.length - 8} more</span> : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
              {errors.applicableProductIds ? <span className="mt-2 block text-xs font-semibold text-red-600">{errors.applicableProductIds}</span> : null}
            </div>
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
              <span className="text-sm font-semibold text-slate-700">Minimum Eligible Product Amount</span>
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
              <span className="text-sm font-semibold text-slate-700">Sort Order</span>
              <input type="number" className={`${inputClass} mt-2`} value={form.sortOrder} onChange={(event) => updateField("sortOrder", event.target.value)} placeholder="0" />
              {errors.sortOrder ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.sortOrder}</span> : null}
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

      {productChooserOpen ? (
        <AdminModalShell labelledBy="coupon-product-chooser-title" maxWidth="xl" onClose={() => setProductChooserOpen(false)}>
          <div className="border-b border-slate-200 p-5">
            <h3 id="coupon-product-chooser-title" className="text-lg font-bold text-slate-950">Choose Products</h3>
            <p className="text-sm text-slate-500">Selected products stay checked while searching.</p>
          </div>
          <div className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input className={inputClass} value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Search product name, SKU, or category" autoFocus />
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={clearSelectedProducts} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Clear Selection</button>
                <button type="button" onClick={() => setProductChooserOpen(false)} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white">Done</button>
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500">{form.applicableProductIds.length} selected from {products.length} products</p>
            <div className="mt-4 max-h-[56vh] overflow-y-auto rounded-lg border border-slate-200 bg-white">
              {filteredProducts.map((product) => (
                <label key={product.id} className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 hover:bg-slate-50">
                  <input type="checkbox" className="h-4 w-4 accent-teal-600" checked={form.applicableProductIds.includes(product.id)} onChange={() => toggleProduct(product.id)} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-slate-900">{product.name}</span>
                    <span className="text-xs font-semibold text-slate-500">{product.sku} | {product.category}{product.subcategory ? ` | ${product.subcategory}` : ""}</span>
                  </span>
                </label>
              ))}
              {!filteredProducts.length ? <p className="p-5 text-sm font-semibold text-slate-500">No products match your search.</p> : null}
            </div>
          </div>
        </AdminModalShell>
      ) : null}
    </>
  );
}