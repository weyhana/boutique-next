export async function sendJson(
  url: string,
  method: "POST" | "PUT",
  body: unknown
) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Erreur " + res.status);
  }

  return res.json().catch(() => ({}));
}