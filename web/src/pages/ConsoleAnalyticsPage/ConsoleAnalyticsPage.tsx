import { Card, Table } from "antd";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";
import { useAsyncList } from "@/hooks/useAsyncList";
import { careflowService } from "@/services/careflowService";

export default function ConsoleAnalyticsPage() {
  const cases = useAsyncList(() => careflowService.cases(), []);
  const appts = useAsyncList(() => careflowService.appointments(), []);

  return (
    <ModuleWorkbench
      title="Operational analytics"
      subtitle="Throughput, acuity mix, and scheduling pressure — demo aggregates from live API data."
      kpis={[
        { label: "Active cases", value: cases.rows.length, hint: "De-identified" },
        { label: "Appointments", value: appts.rows.length, hint: "Next 14 days" },
        { label: "Lab backlog", value: "—", hint: "See laboratory module" },
        { label: "Imaging queue", value: "—", hint: "See radiology module" },
      ]}
      aside={
        <Card title="Executive notes" size="small">
          <p className="text-sm text-slate-600">
            Wire this view to your warehouse in production. The SPA layer follows Kombai webbuilder conventions
            (pages, services, hooks).
          </p>
        </Card>
      }
    >
      <Card title="Case volume by department" loading={cases.loading}>
        <Table
          size="small"
          pagination={false}
          rowKey="id"
          dataSource={cases.rows}
          columns={[
            { title: "Case", dataIndex: "public_case_id" },
            { title: "Department", dataIndex: "department_code" },
            { title: "Status", dataIndex: "status" },
            { title: "Acuity", dataIndex: "acuity" },
          ]}
        />
      </Card>
    </ModuleWorkbench>
  );
}
