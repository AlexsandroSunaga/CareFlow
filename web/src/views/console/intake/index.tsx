
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGet, downloadDocument } from "@/api/client";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";

type DocumentJob = {
  id: number;
  case_id: string;
  original_name: string;
  status: string;
  redaction_hits: number;
  ai_summary: string | null;
};

export default function ConsoleIntakePage() {
  const [documents, setDocuments] = useState<DocumentJob[]>([]);

  useEffect(() => {
    apiGet<DocumentJob[]>("/documents", true).then(setDocuments).catch(() => setDocuments([]));
  }, []);

  return (
    <ModuleWorkbench
      title="Intake & health information management"
      subtitle="Document queue with PHI redaction pipeline."
      kpis={[
        { label: "In queue", value: documents.length },
        { label: "Ready", value: documents.filter((d) => d.status === "ready").length, tone: "ok" },
        { label: "Processing", value: documents.filter((d) => d.status === "processing").length },
        { label: "Redaction hits", value: documents.reduce((n, d) => n + d.redaction_hits, 0) },
      ]}
    >
      <p className="text-sm text-slate-600">
        Patients upload via <Link to="/portal/intake" className="text-brand-600 underline">public secure intake</Link>.
      </p>
      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {documents.map((doc) => (
          <div key={doc.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_2fr_auto]">
            <div>
              <p className="font-mono text-brand-700">{doc.case_id}</p>
              <p className="text-sm text-slate-600">{doc.original_name}</p>
              <p className="text-xs text-slate-500">{doc.status} · {doc.redaction_hits} redaction hits</p>
            </div>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{doc.ai_summary ?? "—"}</p>
            {doc.status === "ready" && (
              <button
                className="rounded-full border border-brand-200 px-4 py-2 text-sm text-brand-700"
                onClick={() =>
                  downloadDocument(doc.id).then((blob) => {
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `redacted-${doc.id}.pdf`;
                    a.click();
                  })
                }
              >
                Download redacted PDF
              </button>
            )}
          </div>
        ))}
        {documents.length === 0 && <p className="p-8 text-slate-500">No documents in queue yet.</p>}
      </div>
    </ModuleWorkbench>
  );
}
