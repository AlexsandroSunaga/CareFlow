import type { ReactNode } from "react";

export type WorkbenchKpi = { label: string; value: string | number; hint?: string; tone?: "default" | "warn" | "ok" };

type Props = {
  title: string;
  subtitle?: string;
  kpis?: WorkbenchKpi[];
  actions?: ReactNode;
  filters?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
};

export function ModuleWorkbench({ title, subtitle, kpis, actions, filters, aside, children }: Props) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {actions}
      </header>
      {kpis && kpis.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{k.label}</p>
              <p
                className={`mt-2 text-2xl font-semibold ${
                  k.tone === "warn" ? "text-amber-600" : k.tone === "ok" ? "text-emerald-600" : ""
                }`}
              >
                {k.value}
              </p>
              {k.hint ? <p className="mt-1 text-xs text-slate-400">{k.hint}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
      {filters}
      <div className={`grid gap-6 ${aside ? "lg:grid-cols-3" : ""}`}>
        <div className={aside ? "lg:col-span-2 space-y-6" : "space-y-6"}>{children}</div>
        {aside ? <aside className="space-y-4">{aside}</aside> : null}
      </div>
    </div>
  );
}
