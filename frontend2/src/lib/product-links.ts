export const SITE_ORIGIN = "https://priyasaquafresh.com";

export function getCanonicalProductHref(slug: string) {
  return `/products/${encodeURIComponent(slug)}`;
}

export function getProductDetailHref(slug: string) {
  return getCanonicalProductHref(slug);
}

export function getCanonicalProductUrl(slug: string) {
  return `${SITE_ORIGIN}${getCanonicalProductHref(slug)}`;
}