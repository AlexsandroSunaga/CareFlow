import { Input, Table } from "antd";
import { useMemo, useState } from "react";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";
import { useAsyncList } from "@/hooks/useAsyncList";
import type { AuditEvent } from "@/types/api";
import { careflowService } from "@/services/careflowService";

export default function CompliancePage() {
  const { rows, loading, reload } = useAsyncList(() => careflowService.audit(), []);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (a: AuditEvent) =>
        a.actor_email.toLowerCase().includes(needle) ||
        a.action.toLowerCase().includes(needle) ||
        a.resource.toLowerCase().includes(needle)
    );
  }, [rows, q]);

  return (
    <ModuleWorkbench
      title="Compliance & audit trail"
      subtitle="Immutable-style activity log for access and workflow changes."
      kpis={[
        { label: "Events (24h)", value: filtered.length, tone: "ok" },
        { label: "Unique actors", value: new Set(filtered.map((r) => r.actor_email)).size },
        { label: "Break-glass", value: filtered.filter((r) => r.action.includes("break")).length, tone: "warn" },
        { label: "Export status", value: "Ready" },
      ]}
      filters={<Input.Search placeholder="Filter actor, action, resource…" allowClear onChange={(e) => setQ(e.target.value)} />}
      aside={
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-900">Retention policy</p>
          <p className="mt-2">7 years hot storage · legal hold tags · SIEM forwarder hook.</p>
          <button type="button" className="mt-4 text-brand-600" onClick={() => reload()}>
            Refresh stream
          </button>
        </div>
      }
    >
      <Table<AuditEvent>
        loading={loading}
        size="small"
        rowKey={(r) => `${r.at}-${r.actor_email}-${r.action}`}
        dataSource={filtered}
        columns={[
          { title: "Time", dataIndex: "at", width: 180 },
          { title: "Actor", dataIndex: "actor_email" },
          { title: "Action", dataIndex: "action" },
          { title: "Resource", dataIndex: "resource" },
        ]}
        pagination={{ pageSize: 12 }}
      />
    </ModuleWorkbench>
  );
}
