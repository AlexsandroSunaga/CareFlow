import { Button, Input, Table } from "antd";
import { useState } from "react";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";
import { useAsyncList } from "@/hooks/useAsyncList";
import { apiGet, apiPost } from "@/api/client";

type QueueItem = { case_id: string; acuity: string; presentation: string; status: string };

export default function ConsoleDischargePage() {
  const { rows, loading, reload } = useAsyncList(async () => {
    const r = await apiGet<{ items: QueueItem[] }>("/discharge/queue", true);
    return r.items;
  }, []);
  const [caseId, setCaseId] = useState("CASE-001");
  const [msg, setMsg] = useState("");

  return (
    <ModuleWorkbench
      title="Discharge planning"
      subtitle="ADT discharge queue and plan creation — GNU Health / CARE HMIS workflow stub."
      kpis={[
        { label: "Active cases", value: rows.length },
        { label: "Planner", value: "RN + MD" },
        { label: "FHIR", value: "Encounter close" },
        { label: "Status", value: "Demo" },
      ]}
    >
      <div className="mb-4 flex max-w-lg gap-2">
        <Input value={caseId} onChange={(e) => setCaseId(e.target.value)} placeholder="Case ID" />
        <Button
          type="primary"
          onClick={async () => {
            const r = await apiPost("/discharge/plan", { case_id: caseId, destination: "home", follow_up_days: 7 }, true);
            setMsg(JSON.stringify(r));
            reload();
          }}
        >
          Plan discharge
        </Button>
      </div>
      {msg && <pre className="mb-4 text-xs">{msg}</pre>}
      <Table<QueueItem>
        loading={loading}
        rowKey="case_id"
        dataSource={rows}
        columns={[
          { title: "Case", dataIndex: "case_id" },
          { title: "Acuity", dataIndex: "acuity" },
          { title: "Presentation", dataIndex: "presentation" },
          { title: "Status", dataIndex: "status" },
        ]}
      />
    </ModuleWorkbench>
  );
}
