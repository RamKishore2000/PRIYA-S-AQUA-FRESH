export function getProductDetailHref(slug: string) {
  return `/product-detail?slug=${encodeURIComponent(slug)}`;
}
