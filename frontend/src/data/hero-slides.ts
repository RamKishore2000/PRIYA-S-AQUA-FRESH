export type HeroSlide = {
  id: string;
  category: string;
  eyebrow: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  image: string;
  imageAlt: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "alkaline",
    category: "Alkaline Water Purifiers",
    eyebrow: "Advanced Alkaline Technology",
    title: "Pure Water.\nBalanced Living.",
    description:
      "Experience advanced alkaline purification designed for refreshing, mineral-balanced drinking water.",
    buttonText: "Shop Alkaline Purifiers",
    href: "/products?category=alkaline-water-purifiers",
    image: "/images/hero/alkaline-purifier.png",
    imageAlt: "Premium alkaline water purifier",
  },
  {
    id: "ro",
    category: "RO Water Purifiers",
    eyebrow: "Advanced RO Protection",
    title: "Purity You\nCan Trust.",
    description:
      "Powerful multi-stage RO purification for safer and better-tasting water every day.",
    buttonText: "Explore RO Purifiers",
    href: "/products?category=ro-water-purifiers",
    image: "/images/hero/ro-purifier.png",
    imageAlt: "Modern RO water purifier",
  },
  {
    id: "commercial",
    category: "Commercial Water Purifiers",
    eyebrow: "Commercial Purification",
    title: "Powerful Solutions.\nBuilt for Business.",
    description:
      "High-capacity water purification solutions for offices, hotels, schools and commercial spaces.",
    buttonText: "Explore Commercial RO",
    href: "/products?category=commercial-water-purifiers",
    image: "/images/hero/commercial-ro.png",
    imageAlt: "Commercial RO purification system",
  },
  {
    id: "softener",
    category: "Water Softeners",
    eyebrow: "Better Water for Your Home",
    title: "Protect Your Home\nFrom Hard Water.",
    description:
      "Modern water softening solutions designed to improve everyday water quality.",
    buttonText: "Explore Water Softeners",
    href: "/products?category=water-softeners",
    image: "/images/hero/water-softener.png",
    imageAlt: "Premium water softener",
  },
  {
    id: "electronics",
    category: "Smart TVs & Electronics",
    eyebrow: "Smart Living",
    title: "Technology for\nModern Homes.",
    description:
      "Discover smart entertainment and home technology designed for everyday convenience.",
    buttonText: "Explore Electronics",
    href: "/products?category=smart-tvs-electronics",
    image: "/images/hero/smart-tv.png",
    imageAlt: "Modern smart TV visual",
  },
  {
    id: "spares",
    category: "Spare Parts",
    eyebrow: "Care & Maintenance",
    title: "Keep Your Purifier\nPerforming Better.",
    description:
      "Explore quality filters, membranes, cartridges and replacement parts for your purification system.",
    buttonText: "Shop Spare Parts",
    href: "/products?category=spare-parts",
    image: "/images/hero/spare-parts.png",
    imageAlt: "Purifier spare parts arrangement",
  },
];
