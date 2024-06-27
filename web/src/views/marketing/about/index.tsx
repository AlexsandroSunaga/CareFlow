import { SiteNav } from "@/components/SiteNav";
import { FaqSection, StatsRow } from "@/components/MarketingSections";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />
      <main className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        <section>
          <h1 className="text-3xl font-semibold text-slate-900">About CareFlow Hospital</h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            CareFlow is a portfolio-grade acute care platform: patient portal, HIM-safe document intake, and a
            multi-department staff console used by scheduling, clinical ops, revenue cycle, and compliance teams.
          </p>
        </section>
        <StatsRow
          items={[
            { label: "Staff console modules", value: "12+" },
            { label: "Departments modeled", value: "8" },
            { label: "Portal flows", value: "2" },
            { label: "Audit events / day (demo)", value: "240" },
          ]}
        />
        <FaqSection
          items={[
            { q: "Who is this for?", a: "Health systems evaluating scheduling + revenue + clinical ops in one UX." },
            { q: "Is PHI shown in the demo?", a: "Staff views use case IDs; intake uses redacted document flows." },
          ]}
        />
      </main>
    </div>
  );
}
