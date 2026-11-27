"use client";

import Link from "next/link";
import DataTable, { Avatar, Badge, Column } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { useApiList } from "@/hooks/useApiList";
import { API_BASE, formatFcfa } from "@/lib/format";

type Produit = {
  id_produit: number;
  nom: string;
  prix: string;
  stock: number;
};

const API_URL = `${API_BASE}/api/produits`;

const columns: Column<Produit>[] = [
  {
    key: "id_produit",
    label: "ID",
    render: (p) => (
      <span className="font-mono text-xs text-slate-400">#{p.id_produit}</span>
    ),
  },
  {
    key: "nom",
    label: "Produit",
    render: (p) => (
      <div className="flex items-center gap-3">
        <Avatar name={p.nom} />
        <span className="font-semibold text-slate-900">{p.nom}</span>
      </div>
    ),
  },
  {
    key: "prix",
    label: "Prix",
    format: (p) => formatFcfa(p.prix),
    render: (p) => (
      <span className="font-bold text-indigo-700">{formatFcfa(p.prix)}</span>
    ),
  },
  {
    key: "stock",
    label: "Stock",
    format: (p) => `${p.stock} unités`,
    render: (p) =>
      p.stock === 0 ? (
        <Badge tone="red">Rupture</Badge>
      ) : p.stock < 15 ? (
        <Badge tone="amber">{p.stock} · Stock faible</Badge>
      ) : (
        <Badge tone="green">{p.stock} en stock</Badge>
      ),
  },
];

export default function ProduitsPage() {
  const { data, setData, loading, error } = useApiList<Produit>(API_URL);

  async function supprimer(produit: Produit) {
    const res = await fetch(`${API_URL}/${produit.id_produit}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        body.message ||
          "Suppression impossible : ce produit est peut-être utilisé dans une commande."
      );
    }
    setData((liste) =>
      liste.filter((p) => p.id_produit !== produit.id_produit)
    );
  }

  const unites = data.reduce((total, p) => total + p.stock, 0);
  const valeur = data.reduce((total, p) => total + Number(p.prix) * p.stock, 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <PageHeader
        emoji="📦"
        title="Produits"
        subtitle="Votre catalogue et l'état de vos stocks."
        action={
          <Link
            href="/produits/nouveau"
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-indigo-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-300/50 transition hover:-translate-y-0.5 hover:brightness-110"
          >
            + Ajouter un produit
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon="🏷️" label="Produits" value={data.length} tone="indigo" />
        <StatCard icon="📚" label="Unités en stock" value={unites} tone="fuchsia" />
        <StatCard
          icon="💰"
          label="Valeur du stock"
          value={formatFcfa(valeur)}
          tone="amber"
        />
      </div>

      {error && (
        <p className="mb-6 rounded-2xl bg-rose-50 px-5 py-4 font-medium text-rose-700 ring-1 ring-rose-200">
          ⚠️ {error}
        </p>
      )}

      <DataTable
        columns={columns}
        data={data}
        idKey="id_produit"
        onDelete={supprimer}
        loading={loading}
        itemName="produit"
        editHref={(p) => `/produits/${p.id_produit}/modifier`}
      />
    </main>
  );
}