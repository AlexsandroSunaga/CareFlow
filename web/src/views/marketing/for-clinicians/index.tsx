import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";

const modules = [
  "Command center & shift KPIs",
  "Scheduling & front-desk arrivals",
  "Cases, labs, imaging, pharmacy",
  "HIM intake & document redaction",
  "Departments, staff, billing, compliance",
];

export default function ForCliniciansPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-semibold">For clinicians & operations</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          One login reaches every module your charge nurse, HIM analyst, or revenue specialist needs — with role-aware API
          routes behind the console.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {modules.map((m) => (
            <li key={m} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">{m}</li>
          ))}
        </ul>
        <Link to="/console/login" className="mt-8 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white">
          Staff sign-in
        </Link>
      </main>
    </div>
  );
}
