import { ReactNode } from "react";
export default function PageHeader({
  emoji,
  title,
  subtitle,
  action,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
   return (
    <div className="animate-fade-up mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-3 inline-flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-fuchsia-500 text-2xl shadow-lg shadow-indigo-300/50">
          {emoji}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-1 text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}