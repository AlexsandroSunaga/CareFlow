import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { CtaBand, FeatureGrid, PageHero } from "@/components/MarketingSections";

const controls = [
  { title: "HIPAA-aligned workflows", body: "Role-based access, audit trails, and minimum-necessary case identifiers in staff views." },
  { title: "Document redaction", body: "PyMuPDF pipeline with manual review queue before records leave the intake boundary." },
  { title: "Session security", body: "JWT staff sessions, idle logout, and break-glass access logged to compliance." },
  { title: "Encryption", body: "TLS in transit; at-rest encryption for uploads and redacted artifacts in demo storage." },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <PageHero
          eyebrow="Trust center"
          title="Security & compliance for acute care"
          subtitle="CareFlow is a reference architecture for hospitals that need clinical depth without sacrificing governance."
        />
        <FeatureGrid items={controls} />
        <CtaBand
          title="Review audit-ready modules"
          body="Explore compliance, intake redaction, and de-identified case management in the staff console."
          primaryHref="/console/login"
          primaryLabel="Staff login"
          secondaryHref="/portal/intake"
          secondaryLabel="Patient intake"
        />
        <p className="mt-8 text-center text-sm text-slate-500">
          <Link to="/" className="text-brand-700 underline">Back to home</Link>
        </p>
      </main>
    </div>
  );
}
