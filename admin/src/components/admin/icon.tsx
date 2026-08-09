import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  name: string;
};

const paths: Record<string, string[]> = {
  alert: ["M12 9v4", "M12 17h.01", "M10.3 3.9 2.5 17.5A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.5L13.7 3.9a2 2 0 0 0-3.4 0Z"],
  bell: ["M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9", "M13.7 21a2 2 0 0 1-3.4 0"],
  box: ["M21 8 12 3 3 8l9 5 9-5Z", "M3 8v8l9 5 9-5V8", "M12 13v8"],
  categories: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
  chevron: ["m9 18 6-6-6-6"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 6v6l4 2"],
  copy: ["M8 8h10v12H8z", "M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"],
  coupon: ["M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4Z", "m9 15 6-6", "M9 9h.01", "M15 15h.01"],
  customer: ["M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"],
  dashboard: ["M3 13h8V3H3z", "M13 21h8V11h-8z", "M13 3v6h8V3z", "M3 21h8v-6H3z"],
  dealer: ["M3 10h18", "M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4", "M5 10v10h14V10", "M9 20v-5h6v5"],
  delete: ["M3 6h18", "M8 6V4h8v2", "M19 6l-1 14H6L5 6", "M10 11v5", "M14 11v5"],
  duplicate: ["M8 8h10v12H8z", "M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"],
  edit: ["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],
  grid: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
  logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
  more: ["M12 8h.01", "M12 12h.01", "M12 16h.01"],
  orders: ["M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", "M3 6h18", "M16 10a4 4 0 0 1-8 0"],
  products: ["M21 8 12 3 3 8l9 5 9-5Z", "M3 8v8l9 5 9-5V8", "M12 13v8"],
  reports: ["M3 3v18h18", "M8 17V9", "M13 17V5", "M18 17v-6"],
  revenue: ["M6 4h8a4 4 0 0 1 0 8H6", "M6 12h8a4 4 0 0 1 0 8H6", "M6 4v16"],
  search: ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "m21 21-4.35-4.35"],
  service: ["M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5Z", "m15 5 4 4"],
  settings: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"],
  stock: ["M4 20V10", "M10 20V4", "M16 20v-7", "M22 20H2"],
  user: ["M20 21a8 8 0 0 0-16 0", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"],
  users: ["M16 21a6 6 0 0 0-12 0", "M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M22 21a6 6 0 0 0-5-5.9", "M17 3.3a4 4 0 0 1 0 7.4"],
  view: ["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"],
};

export function Icon({ name, className = "", ...props }: IconProps) {
  const iconPaths = paths[name] ?? paths.grid;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 shrink-0 ${className}`}
      {...props}
    >
      {iconPaths.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
