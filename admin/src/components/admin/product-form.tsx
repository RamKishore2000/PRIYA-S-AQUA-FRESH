"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AdminToast } from "@/components/admin/admin-toast";
import { adminApi } from "@/services/api";
import type { Category, Product, ProductImageVariant, Subcategory } from "@/types/admin";
import { generateSlug } from "@/utils/slug";

type ProductFormMode = "add" | "edit";

type ProductFormProps = {
  mode?: ProductFormMode;
  initialProduct?: Product;
};

type ProductFormState = {
  name: string;
  category: string;
  categoryId: string;
  subcategoryId: string;
  sku: string;
  customerOriginalPrice: string;
  customerSellingPrice: string;
  dealerOriginalPrice: string;
  dealerSellingPrice: string;
  rating: string;
  reviewCount: string;
  sortOrder: string;
  images: string[];
  imageVariants: ProductImageVariant[];
  description: string;
  status: "Active" | "Inactive";
};

type ProductFormErrors = Partial<Record<keyof ProductFormState, string>>;

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-slate-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ label, error, helper, children }: { label: string; error?: string; helper?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <div className="mt-2">{children}</div>
      {helper ? <span className="mt-1 block text-xs font-medium text-slate-400">{helper}</span> : null}
      {error ? <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span> : null}
    </label>
  );
}

function PriceInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex h-11 overflow-hidden rounded-md border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
      <span className="flex w-11 items-center justify-center border-r border-slate-200 text-sm font-bold text-slate-500">Rs.</span>
      <input {...props} type="number" min="0" className="w-full px-3 text-sm outline-none" />
    </div>
  );
}

const inputClass = "h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";
const textareaClass = "min-h-44 w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

function getInitialState(initialProduct?: Product): ProductFormState {
  return {
    name: initialProduct?.name ?? "",
    category: initialProduct?.category ?? "",
    categoryId: initialProduct?.categoryId ?? "",
    subcategoryId: initialProduct?.subcategoryId ?? "",
    sku: initialProduct?.sku ?? "",
    customerOriginalPrice: initialProduct ? String(initialProduct.customerOriginalPrice) : "",
    customerSellingPrice: initialProduct ? String(initialProduct.customerSellingPrice) : "",
    dealerOriginalPrice: initialProduct ? String(initialProduct.dealerOriginalPrice) : "",
    dealerSellingPrice: initialProduct ? String(initialProduct.dealerSellingPrice) : "",
    rating: initialProduct ? String(initialProduct.rating) : "0",
    reviewCount: initialProduct ? String(initialProduct.reviewCount) : "0",
    sortOrder: initialProduct ? String(initialProduct.sortOrder ?? 999) : "999",
    images: initialProduct?.images ?? [],
    imageVariants: initialProduct?.imageVariants ?? initialProduct?.images.map((imageUrl) => ({ imageUrl })) ?? [],
    description: initialProduct?.description ?? "",
    status: initialProduct?.status ?? "Active",
  };
}

function isPositiveAmount(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0;
}

export function ProductForm({ mode = "add", initialProduct }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(() => getInitialState(initialProduct));
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [saving, setSaving] = useState(false);
  const generatedSlug = useMemo(() => generateSlug(form.name), [form.name]);
  const categorySubcategories = useMemo(() => subcategories.filter((item) => item.categoryId === form.categoryId), [form.categoryId, subcategories]);

  useEffect(() => {
    adminApi.listCategories()
      .then((items) => setCategories(items.filter((item) => item.status === "Active")))
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load categories."));
  }, []);

  function updateField<K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validateForm() {
    const nextErrors: ProductFormErrors = {};
    const customerOriginal = Number(form.customerOriginalPrice);
    const customerSelling = Number(form.customerSellingPrice);
    const dealerOriginal = Number(form.dealerOriginalPrice);
    const dealerSelling = Number(form.dealerSellingPrice);
    const rating = Number(form.rating);
    const reviewCount = Number(form.reviewCount);
    const sortOrder = Number(form.sortOrder);

    if (!form.name.trim()) nextErrors.name = "Product name is required.";
    if (!form.categoryId) nextErrors.category = "Category is required.";
    if (!isPositiveAmount(form.customerOriginalPrice)) nextErrors.customerOriginalPrice = "Enter a valid positive amount.";
    if (!isPositiveAmount(form.customerSellingPrice)) nextErrors.customerSellingPrice = "Enter a valid positive amount.";
    if (!isPositiveAmount(form.dealerOriginalPrice)) nextErrors.dealerOriginalPrice = "Enter a valid positive amount.";
    if (!isPositiveAmount(form.dealerSellingPrice)) nextErrors.dealerSellingPrice = "Enter a valid positive amount.";
    if (isPositiveAmount(form.customerOriginalPrice) && isPositiveAmount(form.customerSellingPrice) && customerSelling > customerOriginal) {
      nextErrors.customerSellingPrice = "Customer selling price cannot be greater than original price.";
    }
    if (isPositiveAmount(form.dealerOriginalPrice) && isPositiveAmount(form.dealerSellingPrice) && dealerSelling > dealerOriginal) {
      nextErrors.dealerSellingPrice = "Dealer selling price cannot be greater than original price.";
    }    const commonImage = form.imageVariants.find((image) => image.isPrimary && !image.colorName && !image.colorCode);
    const colorVariants = form.imageVariants.filter((image) => !image.isPrimary);
    if (!commonImage?.imageUrl) {
      nextErrors.images = "Upload the common product main image.";
    } else if (colorVariants.length < 1) {
      nextErrors.images = "Add at least one color variant with a main image.";
    } else if (colorVariants.some((image) => !String(image.colorName || "").trim())) {
      nextErrors.images = "Color name is required for every color variant.";
    } else if (colorVariants.some((image) => !image.imageUrl)) {
      nextErrors.images = "Variant main image is required for every color variant.";
    }
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) nextErrors.rating = "Rating must be between 0 and 5.";
    if (!Number.isInteger(reviewCount) || reviewCount < 0) nextErrors.reviewCount = "Review count must be 0 or more.";
    if (!Number.isInteger(sortOrder) || sortOrder < 0) nextErrors.sortOrder = "Display order must be 0 or more.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (!form.status) nextErrors.status = "Status is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!validateForm()) return;

    const payload = {
      ...form,
      slug: generatedSlug,
      customerOriginalPrice: Number(form.customerOriginalPrice),
      customerSellingPrice: Number(form.customerSellingPrice),
      dealerOriginalPrice: Number(form.dealerOriginalPrice),
      dealerSellingPrice: Number(form.dealerSellingPrice),
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      sortOrder: Number(form.sortOrder),
    };

    setSaving(true);
    try {
      if (mode === "edit") {
        await adminApi.updateProduct({ ...payload, id: initialProduct?.id ?? "" });
        setMessage("Product updated successfully.");
        router.push("/products");
      } else {
        await adminApi.createProduct(payload);
        setMessage("Product added successfully.");
        setForm(getInitialState());
        router.push("/products");
      }
    } catch (error) {
      const apiError = error as Error & { fieldErrors?: Record<string, string> };
      if (apiError.fieldErrors) {
        const fieldErrors: ProductFormErrors & { categoryId?: string; subcategoryId?: string } = { ...apiError.fieldErrors };
        if ("categoryId" in fieldErrors) {
          fieldErrors.category = fieldErrors.categoryId;
          delete fieldErrors.categoryId;
        }
        setErrors((current) => ({ ...current, ...fieldErrors }));
      }
      setMessage(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
    <AdminToast message={message} />
    <form onSubmit={submitForm} className="space-y-6">
      <FormSection title="Basic Information">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Product Name" error={errors.name}>
            <input className={inputClass} value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="PRIYAS AQUAFRESH ERA RO WATER PURIFIER" />
          </Field>
          <Field label="Category" error={errors.category}>
            <select
              className={inputClass}
              value={form.categoryId}
              onChange={(event) => {
                const category = categories.find((item) => item.id === event.target.value);
                updateField("categoryId", event.target.value);
                updateField("category", category?.name ?? "");
              }}
            >
              <option value="" disabled>Select category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </Field>
          <Field label="Subcategory" error={errors.subcategoryId} helper={categorySubcategories.length ? "Optional. Select only if this product belongs to a subcategory." : "No active subcategories for selected category."}>
            <select
              className={inputClass}
              value={form.subcategoryId}
              onChange={(event) => updateField("subcategoryId", event.target.value)}
              disabled={!form.categoryId || categorySubcategories.length === 0}
            >
              <option value="">No subcategory</option>
              {categorySubcategories.map((subcategory) => <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>)}
            </select>
          </Field>
          <Field label="Product Code" helper="Optional unique code used to identify this product.">
            <input className={inputClass} value={form.sku} onChange={(event) => updateField("sku", event.target.value)} placeholder="PAF-RO-ERA-001" />
          </Field>
          <Field label="Display Order" error={errors.sortOrder} helper="Lower number shows first on website and app. Use 1 for first product.">
            <input className={inputClass} type="number" min="0" step="1" value={form.sortOrder} onChange={(event) => updateField("sortOrder", event.target.value)} placeholder="999" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Pricing">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-teal-100 bg-teal-50/40 p-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-teal-700">Customer Pricing</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Customer Original Price" error={errors.customerOriginalPrice}>
                <PriceInput value={form.customerOriginalPrice} onChange={(event) => updateField("customerOriginalPrice", event.target.value)} placeholder="15999" />
              </Field>
              <Field label="Customer Selling Price" error={errors.customerSellingPrice}>
                <PriceInput value={form.customerSellingPrice} onChange={(event) => updateField("customerSellingPrice", event.target.value)} placeholder="12999" />
              </Field>
            </div>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-indigo-700">Dealer Pricing</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Dealer Original Price" error={errors.dealerOriginalPrice}>
                <PriceInput value={form.dealerOriginalPrice} onChange={(event) => updateField("dealerOriginalPrice", event.target.value)} placeholder="12000" />
              </Field>
              <Field label="Dealer Selling Price" error={errors.dealerSellingPrice}>
                <PriceInput value={form.dealerSellingPrice} onChange={(event) => updateField("dealerSellingPrice", event.target.value)} placeholder="10500" />
              </Field>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Product Images">
        <p className="mb-4 text-sm text-slate-500">Upload one common product main image, then add color variants. Each color supports 4 images total: first image is used in cart/wishlist/buy now, other images are detail gallery only. Each image must be exactly 800 x 800 px.</p>
        <ImageUploader initialImages={form.images} initialVariants={form.imageVariants} onImagesChange={(images) => updateField("images", images)} onVariantsChange={(imageVariants) => updateField("imageVariants", imageVariants)} />
        {errors.images ? <p className="mt-3 text-xs font-semibold text-red-600">{errors.images}</p> : null}
      </FormSection>

      <FormSection title="Description & Status">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <Field label="Description" error={errors.description}>
            <textarea className={textareaClass} value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Enter product description..." />
          </Field>
          <div className="grid gap-4">
            <Field label="Product Rating" error={errors.rating} helper="Enter a value from 0 to 5, for example 4.5.">
              <input className={inputClass} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => updateField("rating", event.target.value)} />
            </Field>
            <Field label="Review Count" error={errors.reviewCount}>
              <input className={inputClass} type="number" min="0" step="1" value={form.reviewCount} onChange={(event) => updateField("reviewCount", event.target.value)} />
            </Field>
            <Field label="Status" error={errors.status}>
              <select className={inputClass} value={form.status} onChange={(event) => updateField("status", event.target.value as ProductFormState["status"])}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </Field>
          </div>
        </div>
      </FormSection>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {message ? <span className="text-sm font-semibold text-teal-700 sm:mr-auto">{message}</span> : null}
        <Link href="/products" className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Cancel
        </Link>
        <button type="submit" disabled={saving} className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:pointer-events-none disabled:opacity-60">
          {saving ? "Saving..." : mode === "edit" ? "Update Product" : "Save Product"}
        </button>
      </div>
    </form>
    </>
  );
}
