"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, User } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";
import { QuantitySelector } from "@/components/cart/quantity-selector";
import { Button, LinkButton } from "@/components/ui/button";
import { useShop } from "@/context/shop-context";
import { getProductDisplayPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { getStoredUser } from "@/services/auth-service";

export default function CartPage() {
  const { cartItems, subtotal, removeFromCart, increaseQuantity, decreaseQuantity, requestLogin } = useShop();
  const user = getStoredUser();
  const role = user?.role || null;

  if (!user) {
    return (
      <SitePage>
        <PageHeader title="Shopping Cart" description="Login to view and manage your cart." />
        <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
          <EmptyState
            icon={<User className="h-6 w-6" />}
            title="Login required"
            description="Please login to add products and view your saved cart."
            action={<Button onClick={requestLogin}>Login to Continue</Button>}
          />
        </section>
      </SitePage>
    );
  }

  return (
    <SitePage>
      <PageHeader title="Shopping Cart" description="Review your selected products before checkout." />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:px-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-white/10 bg-[#111418] shadow-sm">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-lg font-bold text-white">Cart Items</h2>
            <p className="mt-1 text-sm text-slate-300">{cartItems.length} product{cartItems.length === 1 ? "" : "s"} selected</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<ShoppingCart className="h-6 w-6" />}
                title="Your cart is empty."
                description="Browse products and add items to continue checkout."
                action={<LinkButton href="/products">Continue Shopping</LinkButton>}
              />
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {cartItems.map((item) => {
                const displayPrice = getProductDisplayPrice(item.product, role).price;
                return (
                  <article key={item.product.id} className="grid gap-4 p-5 sm:grid-cols-[112px_1fr_auto]">
                    <Link href={`/products/${item.product.slug}`} className="relative h-28 w-28 overflow-hidden rounded-md bg-white">
                      <Image src={item.product.image} alt={item.product.name} fill sizes="112px" className="object-contain p-2" unoptimized />
                    </Link>
                    <div className="min-w-0">
                      <Link href={`/products/${item.product.slug}`} className="line-clamp-2 font-bold text-white hover:text-[#12a8e6]">
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-[#12a8e6]">{item.product.category}</p>
                      <p className="mt-3 text-lg font-bold text-white">{formatPrice(displayPrice)}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <QuantitySelector
                          quantity={item.quantity}
                          onDecrease={() => decreaseQuantity(item.product.id)}
                          onIncrease={() => increaseQuantity(item.product.id)}
                        />
                        <button type="button" onClick={() => removeFromCart(item.product.id)} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="font-bold text-white sm:text-right">
                      {formatPrice(displayPrice * item.quantity)}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-lg border border-white/10 bg-[#111418] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-white">Price Details</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
          <LinkButton href="/checkout" className="mt-5 w-full" aria-disabled={cartItems.length === 0}>
            Proceed to Checkout
          </LinkButton>
          <LinkButton href="/products" variant="secondary" className="mt-3 w-full">
            Continue Shopping
          </LinkButton>
        </aside>
      </section>
    </SitePage>
  );
}
