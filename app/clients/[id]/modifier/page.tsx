"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EntityForm from "@/components/EntityForm";
import PageHeader from "@/components/PageHeader";
import { sendJson } from "@/lib/api";
import { clientFields } from "@/lib/fields";
import { API_BASE } from "@/lib/format";

type Client = {
  IdClient: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  ville: string | null;
};

export default function ModifierClientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/clients/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404 ? "Client introuvable" : "Erreur " + res.status
          );
        }
        return res.json();
      })
      .then(setClient)
      .catch((err: Error) => setErreur(err.message));
  }, [id]);

  async function modifier(values: Record<string, string>) {
    await sendJson(`${API_BASE}/api/clients/${id}`, "PUT", values);
    router.push("/clients");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageHeader
        emoji="✏️"
        title="Modifier le client"
        subtitle="Changez les informations puis enregistrez."
      />

      {erreur && (
        <p className="rounded-2xl bg-rose-50 px-5 py-4 font-medium text-rose-700 ring-1 ring-rose-200">
          ⚠️ {erreur}
        </p>
      )}

      {!client && !erreur && <p className="text-slate-500">Chargement...</p>}

      {client && (
        <EntityForm
          fields={clientFields}
          initialValues={{
            Nom: client.nom,
            Prenom: client.prenom,
            Telephone: client.telephone ?? "",
            Email: client.email,
            Ville: client.ville ?? "",
          }}
          submitLabel="Enregistrer les modifications"
          cancelHref="/clients"
          onSubmit={modifier}
        />
      )}
    </main>
  );
}