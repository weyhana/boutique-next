"use client";
import Link from "next/link";

import { ReactNode, useEffect, useMemo, useState } from "react";

export type Column<T> = {
  key: keyof T & string;
  label: string;
  render?: (row: T) => ReactNode; // affichage personnalisé dans le tableau
  format?: (row: T) => string; // texte utilisé dans le modal et la recherche
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  idKey: keyof T & string;
  onDelete: (row: T) => Promise<void>;
  loading?: boolean;
  itemName?: string;
  editHref?: (row: T) => string;
};

function cellText<T extends Record<string, unknown>>(col: Column<T>, row: T) {
  return col.format ? col.format(row) : String(row[col.key] ?? "—");
}

/* ---------- Petits composants réutilisables ---------- */

const avatarColors = [
  "from-indigo-500 to-violet-500",
  "from-fuchsia-500 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
];

export function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const color = avatarColors[(name.charCodeAt(0) || 0) % avatarColors.length];
  return (
    <span
      className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br font-bold text-white shadow-md ${color}`}
    >
      {initial}
    </span>
  );
}

const badgeTones = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

export function Badge({
  tone,
  children,
}: {
  tone: keyof typeof badgeTones;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------- Le tableau ---------- */

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  idKey,
  onDelete,
  loading = false,
  itemName = "élément",
  editHref,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<T | null>(null);
  const [toDelete, setToDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      columns.some((col) => cellText(col, row).toLowerCase().includes(q))
    );
  }, [data, query, columns]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSelected(null);
      if (!deleting) setToDelete(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleting]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await onDelete(toDelete);
      setToDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Suppression impossible"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="animate-fade-up overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-200/40 ring-1 ring-indigo-100">
        {/* Barre d'outils */}
        <div className="flex flex-col gap-3 border-b border-indigo-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-xs">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              🔍
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full rounded-full border-0 bg-slate-100 py-2.5 pr-4 pl-11 text-sm text-slate-800 outline-none ring-2 ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-indigo-300"
            />
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
            {rows.length} {rows.length > 1 ? "résultats" : "résultat"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-6 py-4 text-xs font-bold tracking-wider whitespace-nowrap uppercase"
                  >
                    {col.label}
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-bold tracking-wider uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-indigo-50">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={columns.length + 1} className="px-6 py-4">
                      <div className="h-8 animate-pulse rounded-full bg-slate-100" />
                    </td>
                  </tr>
                ))}

              {!loading && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-16 text-center"
                  >
                    <p className="text-4xl">🫥</p>
                    <p className="mt-2 font-semibold text-slate-700">
                      Aucun {itemName} trouvé
                    </p>
                    <p className="text-sm text-slate-400">
                      Essayez une autre recherche.
                    </p>
                  </td>
                </tr>
              )}

              {!loading &&
                rows.map((row) => (
                  <tr
                    key={String(row[idKey])}
                    className="transition-colors odd:bg-white even:bg-indigo-50/30 hover:bg-indigo-50"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 whitespace-nowrap text-slate-700"
                      >
                        {col.render ? col.render(row) : cellText(col, row)}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelected(row)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
                        >
                          👁️ Voir
                        </button>
                        
                        {editHref && (
                          <Link
                            href={editHref(row)}
                            title="Modifier"
                            aria-label="Modifier"
                            className="inline-flex size-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition hover:bg-amber-500 hover:text-white"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-4"
                              aria-hidden="true"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setDeleteError("");
                            setToDelete(row);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-500 hover:text-white"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal : voir les informations */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="animate-pop w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-5 text-white">
              <h2 className="text-lg font-bold">Détails</h2>
              <button
                onClick={() => setSelected(null)}
                aria-label="Fermer"
                className="flex size-8 items-center justify-center rounded-full bg-white/20 text-xl leading-none transition hover:bg-white/30"
              >
                ×
              </button>
            </div>
            <dl className="divide-y divide-indigo-50 px-6 py-2">
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <dt className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    {col.label}
                  </dt>
                  <dd className="text-right font-semibold text-slate-800">
                    {cellText(col, selected)}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="p-6 pt-2">
              <button
                onClick={() => setSelected(null)}
                className="w-full rounded-full bg-linear-to-r from-indigo-600 to-fuchsia-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-300/50 transition hover:brightness-110"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal : confirmer la suppression */}
      {toDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => !deleting && setToDelete(null)}
        >
          <div
            className="animate-pop w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-rose-100 text-3xl">
              🗑️
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Supprimer ce {itemName} ?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Cette action est définitive et modifie la base de données.
            </p>

            {deleteError && (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="flex-1 rounded-full bg-slate-100 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-300/50 transition hover:brightness-110 disabled:opacity-60"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}