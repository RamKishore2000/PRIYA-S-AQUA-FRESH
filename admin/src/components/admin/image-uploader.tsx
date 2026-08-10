"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadImage } from "@/services/api";

type Preview = {
  label: string;
  src: string | null;
  error?: string;
};

const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
const requiredWidth = 800;
const requiredHeight = 800;

export function ImageUploader({
  initialImages = [],
  onImagesChange,
}: {
  initialImages?: string[];
  onImagesChange?: (images: string[]) => void;
}) {
  const [previews, setPreviews] = useState<Preview[]>([
    { label: "Main Image", src: initialImages[0] ?? null },
    { label: "Image 2", src: initialImages[1] ?? null },
    { label: "Image 3", src: initialImages[2] ?? null },
    { label: "Image 4", src: initialImages[3] ?? null },
  ]);

  function emitChange(nextPreviews: Preview[]) {
    onImagesChange?.(nextPreviews.map((preview) => preview.src).filter(Boolean) as string[]);
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

  async function setFile(index: number, file?: File) {
    if (!file) return;
    if (!acceptedTypes.includes(file.type)) {
      setPreviews((current) => current.map((preview, previewIndex) => previewIndex === index ? { ...preview, error: "Use JPG, PNG, or WEBP image." } : preview));
      return;
    }

    try {
      const size = await readImageSize(file);
      if (size.width !== requiredWidth || size.height !== requiredHeight) {
        setPreviews((current) =>
          current.map((preview, previewIndex) =>
            previewIndex === index
              ? { ...preview, error: `Image must be exactly ${requiredWidth} x ${requiredHeight} px.` }
              : preview,
          ),
        );
        return;
      }
    } catch {
      setPreviews((current) => current.map((preview, previewIndex) => previewIndex === index ? { ...preview, error: "Unable to read image size." } : preview));
      return;
    }

    let uploadedUrl = "";
    try {
      uploadedUrl = await uploadImage(file, "products", requiredWidth, requiredHeight);
    } catch (error) {
      setPreviews((current) => current.map((preview, previewIndex) => previewIndex === index ? { ...preview, error: error instanceof Error ? error.message : "Image upload failed." } : preview));
      return;
    }

    setPreviews((current) =>
      {
        const nextPreviews = current.map((preview, previewIndex) => {
        if (previewIndex !== index) return preview;
        if (preview.src?.startsWith("blob:")) URL.revokeObjectURL(preview.src);
        return { ...preview, src: uploadedUrl, error: undefined };
      });
        emitChange(nextPreviews);
        return nextPreviews;
      },
    );
  }

  function removeFile(index: number) {
    setPreviews((current) =>
      {
        const nextPreviews = current.map((preview, previewIndex) => {
        if (previewIndex !== index) return preview;
        if (preview.src?.startsWith("blob:")) URL.revokeObjectURL(preview.src);
        return { ...preview, src: null, error: undefined };
      });
        emitChange(nextPreviews);
        return nextPreviews;
      },
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {previews.map((preview, index) => (
        <div key={preview.label} className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-slate-800">{preview.label}</p>
            {index === 0 ? <span className="rounded-full bg-teal-50 px-2 py-1 text-[11px] font-bold text-teal-700">Required</span> : null}
          </div>
          <p className="mb-3 text-xs font-semibold text-slate-500">Required size: {requiredWidth} x {requiredHeight} px</p>
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
            {preview.src ? <Image src={preview.src} alt={preview.label} fill className="object-contain p-4" unoptimized /> : <span className="text-sm font-medium text-slate-400">No image selected</span>}
          </div>
          <div className="mt-3 flex gap-2">
            <label className="inline-flex cursor-pointer rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
              {preview.src ? "Replace" : "Upload"}
              <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setFile(index, event.target.files?.[0])} />
            </label>
            {preview.src ? (
              <button type="button" onClick={() => removeFile(index)} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                Remove
              </button>
            ) : null}
          </div>
          {preview.error ? <p className="mt-2 text-xs font-semibold text-red-600">{preview.error}</p> : null}
        </div>
      ))}
    </div>
  );
}
