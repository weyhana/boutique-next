"use client";

import { useRouter } from "next/navigation";
import EntityForm from "@/components/EntityForm";
import PageHeader from "@/components/PageHeader";
import { sendJson } from "@/lib/api";
import { produitFields } from "@/lib/fields";
import { API_BASE } from "@/lib/format";

export default function NouveauProduitPage() {
  const router = useRouter();

  async function creer(values: Record<string, string>) {
    await sendJson(`${API_BASE}/api/produits`, "POST", {
      Nom: values.Nom,
      Prix: Number(values.Prix),
      Stock: Number(values.Stock),
    });
    router.push("/produits");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageHeader
        emoji="➕"
        title="Nouveau produit"
        subtitle="Renseignez les informations du produit à ajouter."
      />
      <EntityForm
        fields={produitFields}
        submitLabel="Ajouter le produit"
        cancelHref="/produits"
        onSubmit={creer}
      />
    </main>
  );
}