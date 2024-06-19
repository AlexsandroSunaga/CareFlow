import { Input, Button } from "antd";
import { useState } from "react";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";
import { apiGet } from "@/api/client";

export default function ConsoleFhirPage() {
  const [caseId, setCaseId] = useState("CASE-001");
  const [payload, setPayload] = useState<string>("");

  return (
    <ModuleWorkbench
      title="FHIR interoperability"
      subtitle="Read-only Patient & Encounter stubs (R4) for EHR integration demos — Phase 2."
      kpis={[
        { label: "Profile", value: "R4" },
        { label: "Auth", value: "Bearer" },
        { label: "Write", value: "Off" },
        { label: "Gateway", value: "/fhir" },
      ]}
    >
      <div className="flex max-w-xl gap-2">
        <Input value={caseId} onChange={(e) => setCaseId(e.target.value)} placeholder="Case ID" />
        <Button
          type="primary"
          onClick={async () => {
            const patient = await apiGet<unknown>(`/fhir/Patient/${caseId}`, true);
            const encounter = await apiGet<unknown>(`/fhir/Encounter/${caseId}`, true);
            setPayload(JSON.stringify({ patient, encounter }, null, 2));
          }}
        >
          Fetch bundle
        </Button>
      </div>
      {payload && <pre className="mt-4 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">{payload}</pre>}
    </ModuleWorkbench>
  );
}
