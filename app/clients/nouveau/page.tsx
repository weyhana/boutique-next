"use client";

import { useRouter } from "next/navigation";
import EntityForm from "@/components/EntityForm";
import PageHeader from "@/components/PageHeader";
import { sendJson } from "@/lib/api";
import { clientFields } from "@/lib/fields";
import { API_BASE } from "@/lib/format";

export default function NouveauClientPage() {
  const router = useRouter();

  async function creer(values: Record<string, string>) {
    await sendJson(`${API_BASE}/api/clients`, "POST", values);
    router.push("/clients");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageHeader
        emoji="➕"
        title="Nouveau client"
        subtitle="Renseignez les informations du client à ajouter."
      />
      <EntityForm
        fields={clientFields}
        submitLabel="Ajouter le client"
        cancelHref="/clients"
        onSubmit={creer}
      />
    </main>
  );
}