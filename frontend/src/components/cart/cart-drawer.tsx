"use client";

import Image from "next/image";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { QuantitySelector } from "@/components/cart/quantity-selector";
import { Button, LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { useShop } from "@/context/shop-context";
import { cn, formatPrice } from "@/lib/utils";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cartItems, subtotal, removeFromCart, increaseQuantity, decreaseQuantity } = useShop();

  return (
    <div className={cn("fixed inset-0 z-[80]", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
      <button
        className={cn("absolute inset-0 bg-slate-950/40 transition", open ? "opacity-100" : "opacity-0")}
        aria-label="Close cart"
        onClick={onClose}
      />
      <aside className={cn("absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition duration-300", open ? "translate-x-0" : "translate-x-full")} aria-label="Shopping cart">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-600">Shopping Cart</p>
            <h2 className="text-xl font-bold text-slate-950">Your selected products</h2>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close cart" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Your cart is empty."
              description="Browse purifiers and add products to compare your subtotal."
              action={<Button onClick={onClose}>Start Shopping</Button>}
            />
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="grid grid-cols-[72px_1fr] gap-4 rounded-lg border border-slate-200 p-3">
                  <div className="relative h-[72px] w-[72px] rounded-md bg-slate-50">
                    <Image src={item.product.image} alt={item.product.name} fill sizes="72px" className="object-contain p-2" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex gap-2">
                      <h3 className="flex-1 text-sm font-semibold leading-5 text-slate-950">{item.product.name}</h3>
                      <button type="button" aria-label={`Remove ${item.product.name}`} className="text-slate-400 hover:text-rose-600" onClick={() => removeFromCart(item.product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-teal-700">{formatPrice(item.product.price)}</p>
                    <div className="mt-3">
                      <QuantitySelector
                        quantity={item.quantity}
                        onDecrease={() => decreaseQuantity(item.product.id)}
                        onIncrease={() => increaseQuantity(item.product.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between text-base font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <LinkButton href="/cart" variant="secondary" onClick={onClose}>View Cart</LinkButton>
            <LinkButton href="/checkout" onClick={onClose}>Checkout</LinkButton>
          </div>
        </div>
      </aside>
    </div>
  );
}
