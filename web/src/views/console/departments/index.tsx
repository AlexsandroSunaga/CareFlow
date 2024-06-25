
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "@/api/client";

type Dept = {
  id: number;
  code: string;
  name: string;
  floor: string;
  kind: string;
  bed_capacity: number;
  staff_count: number;
  room_count: number;
};

export default function DepartmentsPage() {
  const [rows, setRows] = useState<Dept[]>([]);
  useEffect(() => {
    apiGet<Dept[]>("/departments", true).then(setRows);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Departments & units</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((d) => (
          <Link
            key={d.id}
            to={`/console/departments/${d.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-200"
          >
            <p className="font-mono text-sm text-brand-600">{d.code}</p>
            <p className="mt-1 text-lg font-medium">{d.name}</p>
            <p className="mt-2 text-xs text-slate-500">Floor {d.floor} · {d.kind}</p>
            <p className="mt-3 text-sm text-slate-600">
              {d.staff_count} staff · {d.room_count} rooms{d.bed_capacity ? ` · ${d.bed_capacity} beds` : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
