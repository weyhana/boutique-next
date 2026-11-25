"use client";

import DataTable, { Avatar, Badge, Column } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { useApiList } from "@/hooks/useApiList";
import { API_BASE } from "@/lib/format";

type Client = {
  IdClient: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  ville: string;
};

const API_URL = `${API_BASE}/api/clients`;

const columns: Column<Client>[] = [
  {
    key: "IdClient",
    label: "ID",
    render: (c) => (
      <span className="font-mono text-xs text-slate-400">#{c.IdClient}</span>
    ),
  },
  {
    key: "nom",
    label: "Client",
    format: (c) => `${c.prenom} ${c.nom}`,
    render: (c) => (
      <div className="flex items-center gap-3">
        <Avatar name={c.prenom} />
        <span className="font-semibold text-slate-900">
          {c.prenom} {c.nom}
        </span>
      </div>
    ),
  },
  { key: "email", label: "Email" },
  { key: "telephone", label: "Téléphone" },
  {
    key: "ville",
    label: "Ville",
    render: (c) => <Badge tone="indigo">📍 {c.ville}</Badge>,
  },
];

export default function ClientsPage() {
  const { data, setData, loading, error } = useApiList<Client>(API_URL);

  async function supprimer(client: Client) {
    const res = await fetch(`${API_URL}/${client.IdClient}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Suppression impossible.");
    }
    setData((liste) => liste.filter((c) => c.IdClient !== client.IdClient));
  }

  const villes = new Set(data.map((c) => c.ville)).size;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <PageHeader
        emoji="👥"
        title="Clients"
        subtitle="Tous vos clients et leurs coordonnées."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard icon="🙋" label="Clients" value={data.length} tone="fuchsia" />
        <StatCard icon="🌍" label="Villes" value={villes} tone="emerald" />
      </div>

      {error && (
        <p className="mb-6 rounded-2xl bg-rose-50 px-5 py-4 font-medium text-rose-700 ring-1 ring-rose-200">
          ⚠️ {error}
        </p>
      )}

      <DataTable
        columns={columns}
        data={data}
        idKey="IdClient"
        onDelete={supprimer}
        loading={loading}
        itemName="client"
      />
    </main>
  );
}