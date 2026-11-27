"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number";
  required?: boolean;
  placeholder?: string;
  min?: number;
  step?: string;
};

type Values = Record<string, string>;

type EntityFormProps = {
  fields: Field[];
  initialValues?: Values;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (values: Values) => Promise<void>;
};

export default function EntityForm({
  fields,
  initialValues = {},
  submitLabel,
  cancelHref,
  onSubmit,
}: EntityFormProps) {
  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(fields.map((f) => [f.name, initialValues[f.name] ?? ""]))
  );
  const [errors, setErrors] = useState<Values>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(name: string, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  }

  function validate() {
    const next: Values = {};
    for (const f of fields) {
      const v = values[f.name].trim();
      if (f.required && !v) {
        next[f.name] = "Ce champ est obligatoire";
      } else if (v && f.type === "email" && !/^\S+@\S+\.\S+$/.test(v)) {
        next[f.name] = "Adresse email invalide";
      } else if (
        v &&
        f.type === "number" &&
        (Number.isNaN(Number(v)) || Number(v) < (f.min ?? -Infinity))
      ) {
        next[f.name] = "Valeur invalide";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const clean = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, v.trim()])
      );
      await onSubmit(clean);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Une erreur est survenue");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="animate-fade-up space-y-5 rounded-3xl bg-white p-6 shadow-xl shadow-indigo-200/40 ring-1 ring-indigo-100 sm:p-8"
    >
      {serverError && (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
          ⚠️ {serverError}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name}>
            <label
              htmlFor={f.name}
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              {f.label}
              {f.required && <span className="text-rose-500"> *</span>}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              value={values[f.name]}
              onChange={(e) => handleChange(f.name, e.target.value)}
              placeholder={f.placeholder}
              min={f.min}
              step={f.step}
              className={`w-full rounded-2xl border-0 bg-slate-100 px-4 py-3 text-sm text-slate-800 outline-none ring-2 transition placeholder:text-slate-400 focus:bg-white ${
                errors[f.name]
                  ? "ring-rose-300"
                  : "ring-transparent focus:ring-indigo-300"
              }`}
            />
            {errors[f.name] && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {errors[f.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          className="rounded-full bg-slate-100 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-linear-to-r from-indigo-600 to-fuchsia-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-300/50 transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? "Enregistrement..." : submitLabel}
        </button>
      </div>
    </form>
  );
}