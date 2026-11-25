export default function Footer() {
  return (
    <footer className="mt-16 border-t border-indigo-100 bg-white/60 py-6 text-center text-sm text-slate-500 backdrop-blur">
      © {new Date().getFullYear()} Teranga Shop · Fait avec 💜 à Dakar
    </footer>
  );
}