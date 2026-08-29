"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { DealerForm } from "@/components/admin/dealer-form";
import { PageHeader } from "@/components/admin/page-header";
import { adminApi } from "@/services/api";
import type { Dealer } from "@/types/admin";

export default function EditDealerPage() {
  const [dealerId, setDealerId] = useState("");
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDealerId(new URLSearchParams(window.location.search).get("id") || "");
  }, []);

  useEffect(() => {
    if (!dealerId) return;
    adminApi.getDealer(dealerId)
      .then(setDealer)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load dealer."));
  }, [dealerId]);

  return (
    <AdminShell>
      <AdminToast message={message} />
      <PageHeader title="Edit Dealer" description={dealer ? `Update ${dealer.name}'s dealer account.` : "Update dealer account."} />
      {dealer ? <DealerForm mode="edit" initialDealer={dealer} /> : null}
    </AdminShell>
  );
}