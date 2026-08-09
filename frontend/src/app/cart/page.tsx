import { ShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";
import { LinkButton } from "@/components/ui/button";

export default function CartPage() {
  return (
    <SitePage>
      <PageHeader title="Shopping Cart" description="Review your selected products before checkout." />
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
        <EmptyState
          icon={<ShoppingCart className="h-6 w-6" />}
          title="Your cart page is ready."
          description="Use the cart drawer to manage frontend mock cart items in this phase."
          action={<LinkButton href="/products">Continue Shopping</LinkButton>}
        />
      </section>
    </SitePage>
  );
}
