import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";
import { WishlistContent } from "@/components/wishlist/wishlist-content";

export default function WishlistPage() {
  return (
    <SitePage>
      <PageHeader title="My Wishlist" description="Your saved products are collected here for quick access." />
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <WishlistContent />
      </section>
    </SitePage>
  );
}
