"use client";

import Image from "next/image";
import Link from "next/link";
import { CartIcon, UserIcon } from "@/components/ui/icons";
import { SitePage } from "@/components/layout/site-page";
import { useShop } from "@/context/shop-context";
import { getProductDisplayPrice } from "@/lib/pricing";
import { getProductDetailHref } from "@/lib/product-links";

export default function CartPage() {
  const { user, cartItems, subtotal, removeFromCart, increaseQuantity, decreaseQuantity, openLogin } = useShop();

  if (!user) {
    return (
      <SitePage eyebrow="Shopping Cart" title="Login to view your cart" description="Please login to add products and manage your saved cart.">
        <section data-native-screen="cart" className="px-4 pb-24 md:px-8">
          <div className="mx-auto grid max-w-3xl place-items-center rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-6 text-center shadow-[0_10px_30px_rgba(84,61,35,0.06)] md:p-10">
            <UserIcon className="h-10 w-10 text-[#0A3A38]" />
            <h2 className="mt-4 text-2xl font-black text-[#1D2D2E]">Login required</h2>
            <p className="mt-2 font-semibold text-[#5A6362]">Your cart is saved with your account.</p>
            <button onClick={openLogin} className="mt-6 rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white">Login to Continue</button>
          </div>
        </section>
      </SitePage>
    );
  }

  return (
    <SitePage eyebrow="Shopping Cart" title="Your selected products" description="Review your cart before checkout.">
      <section data-native-screen="cart" className="px-4 pb-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_22rem] lg:gap-8">
          <div className="overflow-hidden rounded-none border-0 bg-transparent shadow-none lg:rounded-2xl lg:border lg:border-[#E8DCCB] lg:bg-[#FFF9F1] lg:shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
            <div className="mb-4 border-b-0 p-0 lg:mb-0 lg:border-b lg:border-[#E5D8C7] lg:p-5">
              <h2 className="text-lg font-black text-[#1D2D2E] md:text-xl">Cart Items</h2>
              <p className="mt-1 text-sm font-semibold text-[#5A6362]">{cartItems.length} product{cartItems.length === 1 ? "" : "s"} selected</p>
            </div>

            {cartItems.length === 0 ? (
              <div className="grid min-h-[20rem] place-items-center p-8 text-center">
                <CartIcon className="h-10 w-10 text-[#0A3A38]" />
                <h3 className="mt-4 text-2xl font-black">Your cart is empty.</h3>
                <p className="mt-2 font-semibold text-[#5A6362]">Browse products and add items to continue checkout.</p>
                <Link href="/products" className="mt-6 rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white">Continue Shopping</Link>
              </div>
            ) : (
              <div className="grid gap-3 lg:block lg:divide-y lg:divide-[#E5D8C7]">
                {cartItems.map((item) => {
                  const display = getProductDisplayPrice(item.product, user?.role);
                  const productHref = getProductDetailHref(item.product.slug);
                  return (
                  <article key={item.product.id} data-cart-product-row className="grid grid-cols-[5.5rem_1fr] gap-3 rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-3 shadow-[0_10px_24px_rgba(84,61,35,0.06)] md:grid-cols-[7rem_1fr_auto] md:gap-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-5 lg:shadow-none">
                    <Link href={productHref} className="relative h-24 overflow-hidden rounded-xl bg-[#F7F0E7] md:h-28">
                      <Image src={item.product.image} alt={item.product.name} fill sizes="(max-width: 767px) 88px, 112px" className="object-contain p-2" unoptimized />
                    </Link>
                    <div className="min-w-0">
                      <Link href={productHref} className="line-clamp-2 text-base font-black leading-snug text-[#1D2D2E] hover:text-[#0A3A38] md:text-xl">
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B68A45] md:mt-2 md:text-sm md:tracking-[0.18em]">{item.product.category}</p>
                      <p data-current-price className="mt-2 text-xl font-black text-[#0A3A38] md:mt-3 md:text-2xl">Rs. {display.price.toLocaleString("en-IN")}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-4 md:gap-3">
                        <div className="inline-flex items-center overflow-hidden rounded-lg border border-[#E5D8C7] bg-white">
                          <button type="button" onClick={() => void decreaseQuantity(item.product.id)} className="grid h-9 w-9 place-items-center text-lg font-black text-[#0A3A38] md:h-10 md:w-10 md:text-xl">-</button>
                          <span className="grid h-9 w-10 place-items-center border-x border-[#E5D8C7] text-sm font-black text-[#1D2D2E] md:h-10 md:w-11">{item.quantity}</span>
                          <button type="button" onClick={() => void increaseQuantity(item.product.id)} className="grid h-9 w-9 place-items-center text-lg font-black text-[#0A3A38] md:h-10 md:w-10 md:text-xl">+</button>
                        </div>
                        <button type="button" onClick={() => void removeFromCart(item.product.id)} className="rounded-lg px-2 py-2 text-xs font-black text-red-600 transition hover:bg-red-50 md:px-3 md:text-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-base font-black text-[#1D2D2E] md:col-span-1 md:text-lg">
                      Rs. {(display.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </article>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="h-max rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-4 shadow-[0_10px_30px_rgba(84,61,35,0.06)] lg:p-6">
            <h2 className="text-xl font-black lg:text-2xl">Order Summary</h2>
            <div className="mt-6 grid gap-3 border-t border-[#E5D8C7] pt-6 text-sm font-bold text-[#5A6362]">
              <p className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString("en-IN")}</span></p>
              <p className="flex justify-between"><span>Shipping</span><span>Free</span></p>
            </div>
            <div className="mt-4 flex justify-between border-t border-[#E5D8C7] pt-4 text-lg font-black">
              <span>Total</span>
              <span>Rs. {subtotal.toLocaleString("en-IN")}</span>
            </div>
            <Link href="/checkout" aria-disabled={cartItems.length === 0} className={`mt-6 flex h-[3.25rem] items-center justify-center rounded-full font-black text-white ${cartItems.length === 0 ? "pointer-events-none bg-[#0A3A38]/45" : "bg-[#0A3A38] hover:bg-[#12383A]"}`}>
              Proceed to Checkout
            </Link>
            <Link href="/products" className="mt-3 flex h-12 items-center justify-center rounded-full border border-[#C59A55] font-black text-[#9B7137] hover:bg-[#F5E9D8]">
              Continue Shopping
            </Link>
          </aside>
        </div>
      </section>
    </SitePage>
  );
}
