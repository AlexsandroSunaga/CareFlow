import { Input, Table } from "antd";
import { useMemo, useState } from "react";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";
import { useAsyncList } from "@/hooks/useAsyncList";
import { careflowService } from "@/services/careflowService";

type ImagingOrder = {
  id: number;
  case_id: string;
  modality: string;
  body_region: string;
  status: string;
};

export default function ImagingPage() {
  const { rows, loading, reload } = useAsyncList(() => careflowService.imagingOrders() as Promise<ImagingOrder[]>, []);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (o) =>
        o.case_id.toLowerCase().includes(needle) ||
        o.modality.toLowerCase().includes(needle) ||
        o.body_region.toLowerCase().includes(needle)
    );
  }, [rows, q]);

  return (
    <ModuleWorkbench
      title="Radiology & imaging"
      subtitle="Modality worklists, PACS handoff, and peer review flags."
      kpis={[
        { label: "Active studies", value: filtered.length },
        { label: "CT/MR", value: filtered.filter((o) => o.modality.startsWith("CT") || o.modality.startsWith("MR")).length },
        { label: "Unread", value: filtered.filter((o) => o.status !== "completed").length, tone: "warn" },
        { label: "Peer review", value: 2, hint: "Demo" },
      ]}
      filters={<Input.Search placeholder="Case, modality, region…" allowClear onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320 }} />}
    >
      <Table<ImagingOrder>
        loading={loading}
        size="small"
        rowKey="id"
        dataSource={filtered}
        columns={[
          { title: "Case", dataIndex: "case_id" },
          { title: "Modality", dataIndex: "modality" },
          { title: "Region", dataIndex: "body_region" },
          { title: "Status", dataIndex: "status" },
          {
            title: "",
            render: (_, o) =>
              o.status !== "completed" ? (
                <button
                  type="button"
                  className="text-xs text-brand-600"
                  onClick={() => careflowService.patchImagingOrder(o.id, { status: "completed" }).then(() => reload())}
                >
                  Complete
                </button>
              ) : null,
          },
        ]}
      />
    </ModuleWorkbench>
  );
}
