"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Home, Package, UserIcon } from "lucide-react";
import { SitePage } from "@/components/layout/site-page";
import { getStoredUser, logoutUser, type AuthUser } from "@/services/auth-service";

export default function ProfilePage() {
  const [user] = useState<AuthUser | null>(() => getStoredUser());

  if (!user) {
    return (
      <SitePage eyebrow="Account" title="Login Required" description="Please login from the header account icon to view your profile and orders.">
        <section className="px-5 pb-20 md:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-10 text-center shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#F5E9D8] text-[#0A3A38]">
              <UserIcon className="h-6 w-6" />
            </div>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white">Back to Home</Link>
          </div>
        </section>
      </SitePage>
    );
  }

  return (
    <SitePage eyebrow="Account" title="My Profile" description="Manage your account details and view your order history.">
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="h-max rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#0A3A38] text-lg font-black text-white">
                {user.fullName.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-black text-[#1D2D2E]">{user.fullName}</p>
                <p className="truncate text-sm font-semibold text-[#5A6362]">{user.email}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 text-sm">
              <Link href="/profile" className="flex items-center gap-2 rounded-xl bg-[#F5E9D8] px-3 py-2 font-black text-[#0A3A38]"><Home className="h-4 w-4" /> Profile</Link>
              <Link href="/profile/orders" className="flex items-center gap-2 rounded-xl px-3 py-2 font-black text-[#5A6362] hover:bg-[#F5E9D8] hover:text-[#0A3A38]"><Package className="h-4 w-4" /> Order History</Link>
              <Link href="/wishlist" className="flex items-center gap-2 rounded-xl px-3 py-2 font-black text-[#5A6362] hover:bg-[#F5E9D8] hover:text-[#0A3A38]"><Heart className="h-4 w-4" /> Wishlist</Link>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-6 shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
              <h2 className="text-xl font-black text-[#1D2D2E]">Account Details</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Info label="Full Name" value={user.fullName} />
                <Info label="Mobile Number" value={user.mobile} />
                <Info label="Email" value={user.email} />
                <Info label="Account Type" value={user.role} />
              </div>
              <button onClick={logoutUser} className="mt-6 rounded-full border border-red-200 px-6 py-3 text-sm font-black text-red-600 hover:bg-red-50">
                Logout
              </button>
            </section>
          </div>
        </div>
      </section>
    </SitePage>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-[#E5D8C7] bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#B68A45]">{label}</p>
      <p className="mt-1 font-black text-[#1D2D2E]">{value || "-"}</p>
    </div>
  );
}
