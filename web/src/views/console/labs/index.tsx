import { Input, Select, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";
import { useAsyncList } from "@/hooks/useAsyncList";
import { careflowService } from "@/services/careflowService";

type LabOrder = {
  id: number;
  case_id: string;
  test_code: string;
  test_name: string;
  priority: string;
  status: string;
};

export default function LabsPage() {
  const { rows, loading, reload } = useAsyncList(() => careflowService.labOrders() as Promise<LabOrder[]>, []);
  const [status, setStatus] = useState<string | undefined>();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return rows.filter((o) => {
      if (status && o.status !== status) return false;
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return o.case_id.toLowerCase().includes(needle) || o.test_name.toLowerCase().includes(needle);
    });
  }, [rows, status, q]);

  return (
    <ModuleWorkbench
      title="Clinical laboratory"
      subtitle="Order queue, reflex rules, and resulted document hooks."
      kpis={[
        { label: "Open orders", value: filtered.filter((o) => o.status !== "resulted").length },
        { label: "STAT", value: filtered.filter((o) => o.priority === "stat").length, tone: "warn" },
        { label: "Resulted today", value: filtered.filter((o) => o.status === "resulted").length, tone: "ok" },
        { label: "Avg TAT", value: "42m", hint: "Demo metric" },
      ]}
      filters={
        <div className="flex flex-wrap gap-3">
          <Input.Search placeholder="Case or test…" allowClear onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 280 }} />
          <Select
            allowClear
            placeholder="Status"
            style={{ width: 160 }}
            onChange={(v) => setStatus(v)}
            options={["ordered", "in_progress", "resulted"].map((s) => ({ value: s, label: s }))}
          />
        </div>
      }
    >
      <Table<LabOrder>
        loading={loading}
        size="small"
        rowKey="id"
        dataSource={filtered}
        columns={[
          { title: "Case", dataIndex: "case_id" },
          { title: "Test", render: (_, o) => `${o.test_code} — ${o.test_name}` },
          { title: "Priority", dataIndex: "priority", render: (p) => <Tag color={p === "stat" ? "red" : "default"}>{p}</Tag> },
          { title: "Status", dataIndex: "status" },
          {
            title: "",
            render: (_, o) =>
              o.status !== "resulted" ? (
                <button
                  type="button"
                  className="text-xs text-brand-600"
                  onClick={() => careflowService.patchLabOrder(o.id, { status: "resulted" }).then(() => reload())}
                >
                  Mark resulted
                </button>
              ) : null,
          },
        ]}
      />
    </ModuleWorkbench>
  );
}
