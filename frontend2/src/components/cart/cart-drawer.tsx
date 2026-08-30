"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrashIcon } from "@/components/ui/icons";
import { useShop } from "@/context/shop-context";
import { getProductDisplayPrice } from "@/lib/pricing";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, cartItems, subtotal, removeFromCart, increaseQuantity, decreaseQuantity } = useShop();

  useEffect(() => {
    if (!open) return;
    const handleNativeBack = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    window.addEventListener("priyas-native-back", handleNativeBack);
    return () => window.removeEventListener("priyas-native-back", handleNativeBack);
  }, [onClose, open]);

  return (
    <div data-cart-drawer-overlay className={`fixed inset-0 z-[1500] ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      <button
        type="button"
        className={`absolute inset-0 bg-black/45 backdrop-blur-sm transition duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        aria-label="Close cart"
        onClick={onClose}
      />
      <aside data-cart-drawer-panel className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#FFF9F1] text-[#1D2D2E] shadow-[0_30px_90px_rgba(0,0,0,0.28)] transition duration-300 ${open ? "translate-x-0" : "translate-x-full"}`} aria-label="Shopping cart">
        <div className="flex items-center justify-between border-b border-[#E5D8C7] px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">Shopping Cart</p>
            <h2 className="mt-1 text-xl font-black">Your selected products</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-lg border border-[#E5D8C7] text-lg font-black transition hover:bg-[#F5E9D8]" aria-label="Close cart">
            x
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length === 0 ? (
            <div className="grid min-h-[20rem] place-items-center rounded-2xl border border-dashed border-[#D8B879] bg-[#FFFDF8] p-6 text-center">
              <div>
                <p className="text-2xl font-black">Your cart is empty.</p>
                <p className="mt-2 text-sm font-semibold text-[#66706F]">Browse products and add items to checkout.</p>
                <Link href="/products" onClick={onClose} className="mt-5 inline-flex rounded-lg bg-[#0A3A38] px-5 py-3 text-sm font-black text-white">
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {cartItems.map((item) => {
                const display = getProductDisplayPrice(item.product, user?.role);
                return (
                <article key={item.product.id} className="grid grid-cols-[76px_1fr] gap-4 rounded-xl border border-[#E8DCCB] bg-[#FFFBF6] p-3">
                  <div className="relative h-[76px] w-[76px] rounded-lg bg-[#F7F0E7]">
                    <Image src={item.product.image} alt={item.product.name} fill sizes="76px" className="object-contain p-2" unoptimized />
                  </div>
                  <div className="min-w-0">
                    <div className="flex gap-2">
                      <h3 className="flex-1 truncate text-sm font-black">{item.product.name}</h3>
                      <button type="button" onClick={() => void removeFromCart(item.product.id)} className="text-[#B68A45] transition hover:text-red-600" aria-label={`Remove ${item.product.name}`}>
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p data-current-price className="mt-1 text-sm font-black text-[#0A3A38]">Rs. {display.price.toLocaleString("en-IN")}</p>
                    <div className="mt-3 inline-flex items-center overflow-hidden rounded-lg border border-[#E5D8C7] bg-white">
                      <button type="button" onClick={() => void decreaseQuantity(item.product.id)} className="grid h-8 w-8 place-items-center font-black text-[#0A3A38]">-</button>
                      <span className="grid h-8 w-9 place-items-center border-x border-[#E5D8C7] text-sm font-black">{item.quantity}</span>
                      <button type="button" onClick={() => void increaseQuantity(item.product.id)} className="grid h-8 w-8 place-items-center font-black text-[#0A3A38]">+</button>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-[#E5D8C7] p-5">
          <div className="mb-4 flex items-center justify-between text-base font-black">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/cart" onClick={onClose} className="inline-flex h-11 items-center justify-center rounded-lg border border-[#C59A55] text-sm font-black text-[#9B7137] transition hover:bg-[#F5E9D8]">
              View Cart
            </Link>
            <Link href="/checkout" onClick={onClose} className="inline-flex h-11 items-center justify-center rounded-lg bg-[#0A3A38] text-sm font-black text-white transition hover:bg-[#124945]">
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

