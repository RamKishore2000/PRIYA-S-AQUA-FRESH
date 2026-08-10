"use client";

import Link from "next/link";
import { useState } from "react";
import { User } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";
import { LinkButton } from "@/components/ui/button";
import { getStoredUser, type AuthUser } from "@/services/auth-service";

export default function ProfilePage() {
  const [user] = useState<AuthUser | null>(() => getStoredUser());

  if (!user) {
    return (
      <SitePage>
        <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
            <User className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-slate-950">Login Required</h1>
          <p className="mt-3 text-slate-600">Please login from the header account icon to view your profile and orders.</p>
          <LinkButton href="/" className="mt-6">Back to Home</LinkButton>
        </section>
      </SitePage>
    );
  }

  return (
    <SitePage>
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        description="Manage your account details and view your order history."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:px-8 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
              {user.fullName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-slate-950">{user.fullName}</p>
              <p className="truncate text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
            <div className="mt-5 space-y-2 text-sm">
              <Link href="/profile" className="block rounded-md bg-teal-50 px-3 py-2 font-semibold text-teal-700">Profile</Link>
            <Link href="/profile/orders" className="block rounded-md px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">Order History</Link>
            <Link href="/wishlist" className="block rounded-md px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">Wishlist</Link>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Account Details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Info label="Full Name" value={user.fullName} />
              <Info label="Mobile Number" value={user.mobile} />
              <Info label="Email" value={user.email} />
              <Info label="Account Type" value={user.role} />
            </div>
          </section>
        </div>
      </section>
    </SitePage>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value || "-"}</p>
    </div>
  );
}
