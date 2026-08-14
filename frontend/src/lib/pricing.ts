import type { Product } from "@/types/product";

export function getProductDisplayPrice(product: Product, role?: string | null) {
  const isDealer = role === "DEALER";
  const price = isDealer ? product.dealerPrice : product.customerPrice;
  const originalPrice = isDealer ? product.dealerOriginalPrice : product.customerOriginalPrice;
  const discount = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return {
    price,
    originalPrice,
    discount,
    label: isDealer ? "Special Price" : "Customer Price",
  };
}
