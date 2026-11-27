"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EntityForm from "@/components/EntityForm";
import PageHeader from "@/components/PageHeader";
import { sendJson } from "@/lib/api";
import { produitFields } from "@/lib/fields";
import { API_BASE } from "@/lib/format";

type Produit = {
  id_produit: number;
  nom: string;
  prix: string;
  stock: number;
};

export default function ModifierProduitPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/produits/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status === 404 ? "Produit introuvable" : "Erreur " + res.status);
        }
        return res.json();
      })
      .then(setProduit)
      .catch((err: Error) => setErreur(err.message));
  }, [id]);

  async function modifier(values: Record<string, string>) {
    await sendJson(`${API_BASE}/api/produits/${id}`, "PUT", {
      Nom: values.Nom,
      Prix: Number(values.Prix),
      Stock: Number(values.Stock),
    });
    router.push("/produits");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageHeader
        emoji="✏️"
        title="Modifier le produit"
        subtitle="Changez les informations puis enregistrez."
      />

      {erreur && (
        <p className="rounded-2xl bg-rose-50 px-5 py-4 font-medium text-rose-700 ring-1 ring-rose-200">
          ⚠️ {erreur}
        </p>
      )}

      {!produit && !erreur && <p className="text-slate-500">Chargement...</p>}

      {produit && (
        <EntityForm
          fields={produitFields}
          initialValues={{
            Nom: produit.nom,
            Prix: String(produit.prix),
            Stock: String(produit.stock),
          }}
          submitLabel="Enregistrer les modifications"
          cancelHref="/produits"
          onSubmit={modifier}
        />
      )}
    </main>
  );
}