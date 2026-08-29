"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { adminApi } from "@/services/api";
import type { Product } from "@/types/admin";

export default function EditProductPage() {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("Loading product...");

  useEffect(() => {
    setProductId(new URLSearchParams(window.location.search).get("id") || "");
  }, []);

  useEffect(() => {
    if (!productId) {
      setMessage("Product not found.");
      return;
    }
    adminApi.getProduct(productId)
      .then((item) => {
        setProduct(item);
        setMessage("");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load product."));
  }, [productId]);

  return (
    <AdminShell>
      <PageHeader title="Edit Product" description="Update product details, pricing, images, and status." />
      {product ? <ProductForm mode="edit" initialProduct={product} /> : <p className="text-sm font-semibold text-slate-500">{message}</p>}
    </AdminShell>
  );
}