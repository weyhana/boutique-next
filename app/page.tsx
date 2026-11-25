import Link from "next/link";

const features = [
  {
    emoji: "📦",
    title: "Produits",
    text: "Consultez votre catalogue, surveillez les stocks et gardez le contrôle.",
    href: "/produits",
    color: "from-indigo-500 to-violet-500",
  },
  {
    emoji: "👥",
    title: "Clients",
    text: "Retrouvez tous vos clients et leurs coordonnées en un clin d'œil.",
    href: "/clients",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    emoji: "⚡",
    title: "Données en direct",
    text: "Tout est relié à votre base MySQL : ce que vous voyez est à jour.",
    href: "/produits",
    color: "from-amber-400 to-orange-500",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-20">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-white/70 px-6 py-16 text-center shadow-xl shadow-indigo-200/40 ring-1 ring-indigo-100 backdrop-blur sm:px-12 sm:py-24">
        <div className="animate-float pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-indigo-300/40 blur-3xl" />
        <div className="animate-float pointer-events-none absolute -right-20 -bottom-24 size-80 rounded-full bg-fuchsia-300/40 blur-3xl [animation-delay:2s]" />

        <div className="animate-fade-up relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200">
            ✨ Votre boutique, version simple
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Gérez votre boutique{" "}
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              avec style
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500">
            Produits, clients et bientôt commandes : tout votre commerce dans une
            interface claire, rapide et agréable.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/produits"
              className="rounded-full bg-linear-to-r from-indigo-600 to-fuchsia-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-300/60 transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Voir les produits
            </Link>
            <Link
              href="/clients"
              className="rounded-full bg-white px-7 py-3.5 font-semibold text-indigo-700 shadow ring-1 ring-indigo-100 transition hover:-translate-y-0.5 hover:bg-indigo-50"
            >
              Voir les clients
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="group rounded-3xl bg-white p-6 shadow-lg shadow-indigo-100/60 ring-1 ring-indigo-50 transition hover:-translate-y-1.5 hover:shadow-xl"
          >
            <span
              className={`flex size-14 items-center justify-center rounded-2xl bg-linear-to-br text-2xl text-white shadow-lg ${f.color}`}
            >
              {f.emoji}
            </span>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{f.title}</h2>
            <p className="mt-1 text-slate-500">{f.text}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-indigo-600 transition group-hover:translate-x-1">
              Découvrir →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}