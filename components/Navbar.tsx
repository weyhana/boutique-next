"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Produits" },
  { href: "/clients", label: "Clients" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-xl shadow-lg shadow-indigo-300/50">
            🛍️
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight text-slate-900 sm:inline">
            Weyhana<span className="text-indigo-600">Shop</span>
          </span>
        </Link>

        <ul className="flex items-center gap-1 rounded-full bg-slate-100/80 p-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    active
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}