"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadImage } from "@/services/api";
import type { ProductImageVariant } from "@/types/admin";

type ImageSlot = { imageUrl: string; error?: string };
type VariantGroup = {
  id: string;
  colorName: string;
  colorCode: string;
  images: ImageSlot[];
};

const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
const requiredWidth = 800;
const requiredHeight = 800;
const imagesPerVariant = 4;
const maxVariants = 6;

function emptySlots() {
  return Array.from({ length: imagesPerVariant }, () => ({ imageUrl: "" }));
}

function createGroup(index: number, variant?: ProductImageVariant): VariantGroup {
  const images = emptySlots();
  const sourceImages = variant?.images?.length ? variant.images : variant?.imageUrl ? [variant.imageUrl] : [];
  sourceImages.slice(0, imagesPerVariant).forEach((imageUrl, imageIndex) => {
    images[imageIndex] = { imageUrl };
  });
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
    colorName: variant?.colorName || "",
    colorCode: variant?.colorCode || "",
    images,
  };
}

function buildInitialGroups(initialVariants?: ProductImageVariant[]) {
  const variants = (initialVariants || []).filter((variant) => variant.colorName || variant.colorCode || !variant.isPrimary);
  const groups = variants.map((variant, index) => createGroup(index, variant));
  return groups.length ? groups : [createGroup(0)];
}
function syncFirstVariantMainImage(groups: VariantGroup[], imageUrl: string) {
  const nextGroups = groups.length ? groups : [createGroup(0)];
  return nextGroups.map((group, index) => {
    if (index !== 0) return group;
    const images = group.images.map((slot, slotIndex) => slotIndex === 0 ? { imageUrl } : slot);
    return { ...group, images };
  });
}

export function ImageUploader({
  initialImages = [],
  initialVariants,
  onImagesChange,
  onVariantsChange,
}: {
  initialImages?: string[];
  initialVariants?: ProductImageVariant[];
  onImagesChange?: (images: string[]) => void;
  onVariantsChange?: (images: ProductImageVariant[]) => void;
}) {
  const initialCommonImageUrl = initialVariants?.find((variant) => variant.isPrimary && !variant.colorName && !variant.colorCode)?.imageUrl || initialImages[0] || "";
  const [commonImage, setCommonImage] = useState<ImageSlot>(() => ({ imageUrl: initialCommonImageUrl }));
  const [groups, setGroups] = useState<VariantGroup[]>(() => syncFirstVariantMainImage(buildInitialGroups(initialVariants), initialCommonImageUrl));

  function emitChange(nextCommon: ImageSlot, nextGroups: VariantGroup[]) {
    const syncedGroups = syncFirstVariantMainImage(nextGroups, nextCommon.imageUrl);
    const variants: ProductImageVariant[] = [];
    if (nextCommon.imageUrl) {
      variants.push({ imageUrl: nextCommon.imageUrl, colorName: "", colorCode: "", isPrimary: true, images: [nextCommon.imageUrl] });
    }

    syncedGroups.forEach((group) => {
      const urls = group.images.map((slot) => slot.imageUrl).filter(Boolean).slice(0, imagesPerVariant);
      if (!urls.length) return;
      variants.push({
        imageUrl: urls[0],
        colorName: group.colorName.trim(),
        colorCode: group.colorCode.trim(),
        isPrimary: false,
        images: urls,
      });
    });

    onImagesChange?.(variants.flatMap((variant) => variant.images?.length ? variant.images : [variant.imageUrl]));
    onVariantsChange?.(variants);
  }

  function readImageSize(file: File) {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new window.Image();
      image.onload = () => {
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
        URL.revokeObjectURL(objectUrl);
      };
      image.onerror = () => {
        reject(new Error("Unable to read image size."));
        URL.revokeObjectURL(objectUrl);
      };
      image.src = objectUrl;
    });
  }

  async function validateAndUpload(file: File) {
    if (!acceptedTypes.includes(file.type)) throw new Error("Use JPG, PNG, or WEBP image.");
    const size = await readImageSize(file);
    if (size.width !== requiredWidth || size.height !== requiredHeight) {
      throw new Error(`Image must be exactly ${requiredWidth} x ${requiredHeight} px.`);
    }
    return uploadImage(file, "products", requiredWidth, requiredHeight);
  }

  async function setCommonFile(file?: File) {
    if (!file) return;
    try {
      const uploadedUrl = await validateAndUpload(file);
      const nextCommon = { imageUrl: uploadedUrl };
      setCommonImage(nextCommon);
      setGroups((current) => {
        const nextGroups = syncFirstVariantMainImage(current, uploadedUrl);
        emitChange(nextCommon, nextGroups);
        return nextGroups;
      });
    } catch (error) {
      const nextCommon = { ...commonImage, error: error instanceof Error ? error.message : "Image upload failed." };
      setCommonImage(nextCommon);
    }
  }

  async function setVariantFile(groupIndex: number, imageIndex: number, file?: File) {
    if (groupIndex === 0 && imageIndex === 0) return;
    if (!file) return;
    try {
      const uploadedUrl = await validateAndUpload(file);
      setGroups((current) => {
        const nextGroups = current.map((group, index) => {
          if (index !== groupIndex) return group;
          const images = group.images.map((slot, slotIndex) => slotIndex === imageIndex ? { imageUrl: uploadedUrl } : slot);
          return { ...group, images };
        });
        emitChange(commonImage, nextGroups);
        return nextGroups;
      });
    } catch (error) {
      setGroups((current) => current.map((group, index) => {
        if (index !== groupIndex) return group;
        const images = group.images.map((slot, slotIndex) => slotIndex === imageIndex ? { ...slot, error: error instanceof Error ? error.message : "Image upload failed." } : slot);
        return { ...group, images };
      }));
    }
  }

  function updateGroup(groupIndex: number, field: "colorName" | "colorCode", value: string) {
    setGroups((current) => {
      const nextGroups = current.map((group, index) => index === groupIndex ? { ...group, [field]: value } : group);
      emitChange(commonImage, nextGroups);
      return nextGroups;
    });
  }

  function removeVariantImage(groupIndex: number, imageIndex: number) {
    if (groupIndex === 0 && imageIndex === 0) return;
    setGroups((current) => {
      const nextGroups = current.map((group, index) => {
        if (index !== groupIndex) return group;
        const images = group.images.map((slot, slotIndex) => slotIndex === imageIndex ? { imageUrl: "" } : slot);
        return { ...group, images };
      });
      emitChange(commonImage, nextGroups);
      return nextGroups;
    });
  }

  function addGroup() {
    setGroups((current) => current.length >= maxVariants ? current : [...current, createGroup(current.length)]);
  }

  function removeGroup(groupIndex: number) {
    setGroups((current) => {
      const nextGroups = current.filter((_, index) => index !== groupIndex);
      emitChange(commonImage, nextGroups);
      return nextGroups.length ? nextGroups : [createGroup(0)];
    });
  }

  function removeCommonImage() {
    const nextCommon = { imageUrl: "" };
    setCommonImage(nextCommon);
    setGroups((current) => {
      const nextGroups = syncFirstVariantMainImage(current, "");
      emitChange(nextCommon, nextGroups);
      return nextGroups;
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-900">Common Product Main Image</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Shown on home, products, search, and related product cards. Required size: {requiredWidth} x {requiredHeight} px.</p>
          </div>
          <span className="rounded-full bg-teal-50 px-2 py-1 text-[11px] font-bold text-teal-700">Required</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-[11rem_1fr] sm:items-start">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
            {commonImage.imageUrl ? <Image src={commonImage.imageUrl} alt="Common product image" fill className="object-contain p-3" unoptimized /> : <span className="px-3 text-center text-sm font-medium text-slate-400">No image selected</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
              {commonImage.imageUrl ? "Replace" : "Upload"}
              <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setCommonFile(event.target.files?.[0])} />
            </label>
            {commonImage.imageUrl ? <button type="button" onClick={removeCommonImage} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">Remove</button> : null}
            {commonImage.error ? <p className="basis-full text-xs font-semibold text-red-600">{commonImage.error}</p> : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Color Variants</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">Each color has 4 image slots. First image is used in cart, wishlist, checkout, and orders. Other images are product detail gallery only.</p>
          {groups.length >= maxVariants ? (
            <p className="mt-2 text-xs font-bold text-amber-700">Maximum 6 color variants are allowed for one product.</p>
          ) : null}
        </div>
        <button type="button" onClick={addGroup} disabled={groups.length >= maxVariants} className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 disabled:opacity-50">Add Color</button>
      </div>

      <div className="space-y-4">
        {groups.map((group, groupIndex) => (
          <div key={group.id} className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">Color Variant {groupIndex + 1}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Color name required. Color code optional.</p>
              </div>
              {groupIndex === 0 ? <span className="rounded-md bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">Required first color</span> : <button type="button" onClick={() => removeGroup(groupIndex)} className="rounded-md border border-red-100 px-3 py-2 text-xs font-bold text-red-600">Remove Color</button>}
            </div>

            <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)]">
              <label className="block min-w-0">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Color Name</span>
                <input value={group.colorName} onChange={(event) => updateGroup(groupIndex, "colorName", event.target.value)} maxLength={60} placeholder="Example: Black" className="h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-teal-500" />
              </label>
              <label className="block min-w-0">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Color Code <span className="normal-case tracking-normal text-slate-400">Optional</span></span>
                <div className="grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] gap-2">
                  <input type="color" value={/^#[0-9A-Fa-f]{6}$/.test(group.colorCode) ? group.colorCode : "#0057C8"} onChange={(event) => updateGroup(groupIndex, "colorCode", event.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-slate-200 bg-white p-1" aria-label={`Variant ${groupIndex + 1} color`} />
                  <input value={group.colorCode} onChange={(event) => updateGroup(groupIndex, "colorCode", event.target.value)} maxLength={7} placeholder="#000000" className="h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-teal-500" />
                </div>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {group.images.map((slot, imageIndex) => {
                const isSyncedMainImage = groupIndex === 0 && imageIndex === 0;
                return (
                  <div key={`${group.id}-${imageIndex}`} className="rounded-md border border-slate-200 bg-white p-3">
                    <p className="mb-2 text-xs font-bold text-slate-700">{isSyncedMainImage ? "Variant Main Image (Synced)" : imageIndex === 0 ? "Variant Main Image" : `Gallery Image ${imageIndex + 1}`}</p>
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                      {slot.imageUrl ? <Image src={slot.imageUrl} alt="" fill className="object-contain p-2" unoptimized /> : <span className="px-2 text-center text-xs font-medium text-slate-400">No image</span>}
                    </div>
                    {isSyncedMainImage ? (
                      <p className="mt-2 rounded-md bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">Auto-filled from Common Product Main Image</p>
                    ) : (
                      <div className="mt-2 flex gap-2">
                        <label className="inline-flex cursor-pointer rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                          {slot.imageUrl ? "Replace" : "Upload"}
                          <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setVariantFile(groupIndex, imageIndex, event.target.files?.[0])} />
                        </label>
                        {slot.imageUrl ? <button type="button" onClick={() => removeVariantImage(groupIndex, imageIndex)} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">Remove</button> : null}
                      </div>
                    )}
                    {slot.error ? <p className="mt-2 text-xs font-semibold text-red-600">{slot.error}</p> : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}