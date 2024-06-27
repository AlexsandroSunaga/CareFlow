import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { ProcessSteps } from "@/components/MarketingSections";

export default function PatientGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-semibold">Patient guide</h1>
        <p className="mt-4 max-w-2xl text-slate-600">Book visits and complete intake without creating a full chart in the demo.</p>
        <ProcessSteps
          steps={[
            { title: "Book", body: "Choose department, time, and reason for visit — receive a case reference." },
            { title: "Intake", body: "Upload PDFs; sensitive fields are redacted before staff review." },
            { title: "Visit", body: "Front desk checks you in against the same case ID in the console." },
          ]}
        />
        <div className="mt-10 flex gap-3">
          <Link to="/portal/book" className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white">Book appointment</Link>
          <Link to="/portal/intake" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm">Start intake</Link>
        </div>
      </main>
    </div>
  );
}
