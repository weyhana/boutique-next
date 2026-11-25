export function formatFcfa(value: string | number) {
  return new Intl.NumberFormat("fr-FR").format(Number(value)) + " FCFA";
}

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";