import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teranga Shop",
  description: "Gestion simple et élégante de votre boutique",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <Suspense
          fallback={
            <header className="h-16.25 border-b border-white/60 bg-white/70" />
          }
        >
          <Navbar />
        </Suspense>

        <div className="flex-1">
          <Suspense
            fallback={<p className="p-8 text-slate-500">Chargement...</p>}
          >
            {children}
          </Suspense>
        </div>

        <Footer />
      </body>
    </html>
  );
}