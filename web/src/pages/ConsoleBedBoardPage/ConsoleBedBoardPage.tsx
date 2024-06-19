import { Progress, Table } from "antd";
import { ModuleWorkbench } from "@/components/ModuleWorkbench";
import { useAsyncList } from "@/hooks/useAsyncList";
import { apiGet } from "@/api/client";

type BedUnit = {
  department_code: string;
  department_name: string;
  floor: string;
  bed_capacity: number;
  occupied: number;
  available: number;
  census_pct: number;
};

type Board = { units: BedUnit[]; total_capacity: number; total_occupied: number };

export default function ConsoleBedBoardPage() {
  const { rows, loading } = useAsyncList(async () => {
    const b = await apiGet<Board>("/adt/bed-board", true);
    return b.units;
  }, []);

  const capacity = rows.reduce((n, u) => n + u.bed_capacity, 0);
  const occupied = rows.reduce((n, u) => n + u.occupied, 0);

  return (
    <ModuleWorkbench
      title="ADT & bed board"
      subtitle="Inpatient census by unit — aligned with HMIS ADT modules (GNU Health / CARE HMIS)."
      kpis={[
        { label: "Licensed beds", value: capacity },
        { label: "Occupied", value: occupied, tone: occupied / capacity > 0.85 ? "warn" : "ok" },
        { label: "Available", value: capacity - occupied },
        { label: "Hospital census", value: capacity ? `${Math.round(100 * occupied / capacity)}%` : "—" },
      ]}
    >
      <Table<BedUnit>
        loading={loading}
        rowKey="department_code"
        dataSource={rows}
        columns={[
          { title: "Unit", dataIndex: "department_name" },
          { title: "Code", dataIndex: "department_code" },
          { title: "Floor", dataIndex: "floor" },
          { title: "Occupied", render: (_, r) => `${r.occupied} / ${r.bed_capacity}` },
          {
            title: "Census",
            render: (_, r) => <Progress percent={r.census_pct} size="small" status={r.census_pct > 90 ? "exception" : "active"} />,
          },
        ]}
      />
    </ModuleWorkbench>
  );
}
