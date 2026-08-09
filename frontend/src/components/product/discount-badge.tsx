import { Badge } from "@/components/ui/badge";

export function DiscountBadge({ discount }: { discount?: number }) {
  if (!discount) {
    return null;
  }

  return <Badge className="bg-rose-50 text-rose-700">{discount}% OFF</Badge>;
}
