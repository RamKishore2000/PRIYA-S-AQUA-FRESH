"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { FileText, Heart, Home, Package, ShieldCheck, Truck, Undo2, UserIcon } from "lucide-react";
import { SitePage } from "@/components/layout/site-page";
import { useShop } from "@/context/shop-context";

export default function ProfilePage() {
  const { user, logout } = useShop();

  if (!user) {
    return (
      <SitePage eyebrow="Account" title="Login Required" description="Please login from the header account icon to view your profile and orders.">
        <section className="px-4 pb-24 md:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-6 text-center shadow-[0_10px_30px_rgba(0,87,200,0.07)] md:p-10">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#EAF6FF] text-[#0057C8]">
              <UserIcon className="h-6 w-6" />
            </div>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-[#0057C8] px-6 py-3 text-sm font-black text-white">Back to Home</Link>
          </div>
        </section>
      </SitePage>
    );
  }

  return (
    <SitePage eyebrow="Account" title="My Profile" description="Manage your account details and view your order history.">
      <section className="px-4 pb-28 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[340px_1fr] lg:gap-6">
          <aside className="h-max rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(0,87,200,0.07)] lg:p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#0057C8] text-lg font-black text-white">
                {(user.mobile || user.role || "U").slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-black text-[#102033]">{user.mobile || "Customer"}</p>
                <p className="truncate text-sm font-semibold text-[#40576C]">{user.role}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-xs sm:text-sm lg:grid-cols-1">
              <Link href="/profile" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#EAF6FF] px-2 py-2 text-center font-black text-[#0057C8] lg:justify-start lg:gap-2 lg:px-3"><Home className="h-4 w-4" /> Profile</Link>
              <Link href="/profile/orders" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-center font-black text-[#40576C] hover:bg-[#EAF6FF] hover:text-[#0057C8] lg:justify-start lg:gap-2 lg:px-3"><Package className="h-4 w-4" /> Order History</Link>
              <Link href="/wishlist" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-center font-black text-[#40576C] hover:bg-[#EAF6FF] hover:text-[#0057C8] lg:justify-start lg:gap-2 lg:px-3"><Heart className="h-4 w-4" /> Wishlist</Link>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(0,87,200,0.07)] lg:p-6">
              <h2 className="text-xl font-black text-[#102033]">Account Details</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-4">
                <Info label="Mobile Number" value={user.mobile} />
                <Info label="Account Type" value={user.role} />
              </div>
              <button onClick={logout} className="mt-6 h-11 rounded-full border border-red-200 px-6 text-sm font-black text-red-600 hover:bg-red-50">
                Logout
              </button>
            </section>

            <section className="rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(0,87,200,0.07)] lg:p-6">
              <h2 className="text-xl font-black text-[#102033]">Important Links</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <LegalLink href="/privacy-policy" label="Privacy Policy" icon={<ShieldCheck className="h-4 w-4" />} />
                <LegalLink href="/terms" label="Terms" icon={<FileText className="h-4 w-4" />} />
                <LegalLink href="/shipping-policy" label="Shipping" icon={<Truck className="h-4 w-4" />} />
                <LegalLink href="/refund-policy" label="Refund" icon={<Undo2 className="h-4 w-4" />} />
                <LegalLink href="/warranty" label="Warranty" icon={<FileText className="h-4 w-4" />} />
              </div>
            </section>
          </div>
        </div>
      </section>
    </SitePage>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-[#D8EAF8] bg-white p-3 md:p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0057C8]">{label}</p>
      <p className="mt-1 break-words font-black text-[#102033]">{value || "-"}</p>
    </div>
  );
}

function LegalLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <Link href={href} className="flex min-h-12 items-center gap-3 rounded-xl border border-[#D8EAF8] bg-white px-4 py-3 text-sm font-black text-[#102033] transition hover:border-[#0057C8] hover:text-[#0057C8]">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#EAF6FF] text-[#0057C8]">{icon}</span>
      {label}
    </Link>
  );
}
