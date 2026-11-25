const tones = {
  indigo: "from-indigo-500 to-violet-500 shadow-indigo-300/50",
  fuchsia: "from-fuchsia-500 to-pink-500 shadow-fuchsia-300/50",
  amber: "from-amber-400 to-orange-500 shadow-amber-300/50",
  emerald: "from-emerald-400 to-teal-500 shadow-emerald-300/50",
};

export default function StatCard({
  icon,
  label,
  value,
  tone = "indigo",
}: {
  icon: string;
  label: string;
  value: string | number;
  tone?: keyof typeof tones;
}) {
  return (
    <div className="animate-fade-up flex items-center gap-4 rounded-3xl bg-white p-5 shadow-lg shadow-indigo-100/60 ring-1 ring-indigo-50 transition hover:-translate-y-1 hover:shadow-xl">
      <span
        className={`flex size-12 items-center justify-center rounded-2xl bg-linear-to-br text-xl text-white shadow-lg ${tones[tone]}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      </div>
    </div>
  );
}