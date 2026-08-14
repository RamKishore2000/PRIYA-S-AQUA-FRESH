import type { Product } from "@/types/product";

export function getProductDisplayPrice(product: Product, role?: string | null) {
  const isDealer = role === "DEALER";
  const price = isDealer ? product.dealerPrice ?? product.price : product.customerPrice ?? product.price;
  const originalPrice = isDealer ? product.dealerOriginalPrice : product.customerOriginalPrice ?? product.originalPrice;
  const discount = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return {
    price,
    originalPrice,
    discount,
    label: isDealer ? "Special Price" : "Customer Price",
  };
}
