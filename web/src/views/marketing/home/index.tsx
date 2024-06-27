import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { ShieldCheck, Sparkles, Stethoscope } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Blue-box PDF redaction",
    body: "SSN, phone, email, MRN-style IDs, and manual regions are burned in with audit-friendly blue masks — staff never see raw PHI in the queue.",
  },
  {
    icon: Stethoscope,
    title: "Case-based scheduling",
    body: "Patients receive a case ID at booking. Dashboards list CASE-2026-XXXX, not names or addresses.",
  },
  {
    icon: Sparkles,
    title: "AI on redacted text only",
    body: "Optional OpenAI summaries run after redaction so visit prep stays within your compliance boundary.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />
      <main className="mx-auto max-w-6xl space-y-16 px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            Multi-department hospital platform
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            ED, labs, imaging, pharmacy, and revenue — one operations product.
          </h1>
          <p className="text-lg text-slate-600">
            Patient portal for booking and PHI-safe intake. Staff console with 12+ modules: scheduling, front desk,
            cases, HIM documents, lab/imaging/pharmacy queues, departments, billing, and audit.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/portal/book" className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-500">
              Patient booking
            </Link>
            <Link to="/login" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-brand-200">
              Staff console (12 modules)
            </Link>
          </div>
        </div>
        <div className="glass relative overflow-hidden p-8">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-100 blur-3xl" />
          <div className="relative space-y-4 text-sm">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="font-medium text-slate-800">Document queue</p>
              <p className="mt-1 text-slate-500">CASE-2026-A3F2 · 14 redaction hits · Ready</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">AI prep</p>
              <p className="mt-2 text-slate-600">
                Staff prep: allergy keyword detected — highlight for nurse review. No patient name stored.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((f) => (
          <article key={f.title} className="glass p-6">
            <f.icon className="h-8 w-8 text-brand-600" />
            <h2 className="mt-4 text-lg font-semibold">{f.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{f.body}</p>
          </article>
        ))}
      </section>
      </main>
    </div>
  );
}
