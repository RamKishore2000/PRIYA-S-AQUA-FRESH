"use client";

import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";

export function EmptyProductsState({ onClear }: { onClear: () => void }) {
  return (
    <EmptyState
      icon={<PackageSearch className="h-6 w-6" />}
      title="No products match your filters."
      description="Try changing the category or price range."
      action={<Button onClick={onClear}>Clear Filters</Button>}
    />
  );
}
