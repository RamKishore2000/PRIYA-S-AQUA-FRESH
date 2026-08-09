import type { Category } from "@/types/product";

export const categories: Category[] = [
  {
    id: "alkaline",
    name: "Alkaline Water Purifiers",
    slug: "alkaline-water-purifiers",
    productCount: 6,
    image: "/images/categories/alkaline.svg",
    accent: "bg-teal-50",
  },
  {
    id: "ro",
    name: "RO Water Purifiers",
    slug: "ro-water-purifiers",
    productCount: 5,
    image: "/images/categories/ro.svg",
    accent: "bg-sky-50",
  },
  {
    id: "commercial",
    name: "Commercial Water Purifiers",
    slug: "commercial-water-purifiers",
    productCount: 4,
    image: "/images/categories/commercial.svg",
    accent: "bg-slate-50",
  },
  {
    id: "softeners",
    name: "Water Softeners",
    slug: "water-softeners",
    productCount: 3,
    image: "/images/categories/softeners.svg",
    accent: "bg-cyan-50",
  },
  {
    id: "electronics",
    name: "Smart TVs & Electronics",
    slug: "smart-tvs-electronics",
    productCount: 3,
    image: "/images/categories/electronics.svg",
    accent: "bg-indigo-50",
  },
  {
    id: "spares",
    name: "Spare Parts",
    slug: "spare-parts",
    productCount: 3,
    image: "/images/categories/spares.svg",
    accent: "bg-emerald-50",
  },
];

export const categoryChips = [
  "Alkaline",
  "RO Purifiers",
  "Commercial",
  "Water Softeners",
  "Smart TVs",
  "Spare Parts",
];
