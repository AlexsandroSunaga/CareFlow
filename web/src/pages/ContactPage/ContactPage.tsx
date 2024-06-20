import { SiteNav } from "@/components/SiteNav";
import { PageHero } from "@/components/MarketingSections";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageHero eyebrow="Contact" title="Enterprise deployments" subtitle="Demo environment — form routes to your CRM in production." />
        <form className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={(e) => e.preventDefault()}>
          <label className="block text-sm font-medium text-slate-700">
            Organization
            <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Regional health system" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Work email
            <input type="email" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="cio@hospital.org" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Modules of interest
            <select className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2">
              <option>Full platform</option>
              <option>Intake & HIM only</option>
              <option>Labs + imaging</option>
              <option>Revenue cycle</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Message
            <textarea rows={4} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Timeline, EHR interfaces, go-live regions…" />
          </label>
          <button type="submit" className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-white">
            Request architecture review
          </button>
        </form>
      </main>
    </div>
  );
}
