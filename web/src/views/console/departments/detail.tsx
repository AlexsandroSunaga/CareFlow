import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "@/api/client";

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiGet(`/departments/${id}`, true).then(setData);
  }, [id]);

  if (!data) return <p className="text-slate-500">Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-brand-600">{data.department.code}</p>
        <h1 className="text-2xl font-semibold">{data.department.name}</h1>
        <p className="text-slate-600">Floor {data.department.floor} · {data.department.kind}</p>
      </div>
      <section>
        <h2 className="font-medium">Care lines</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
          {data.service_lines.map((s: any) => (
            <li key={s.id}>{s.name} ({s.duration_min} min)</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-medium">Rooms & bays</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.rooms.map((r: any) => (
            <span key={r.id} className="rounded-lg bg-slate-100 px-3 py-1 text-sm">{r.code} · {r.room_type}</span>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-medium">Assigned staff</h2>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {data.staff.map((s: any) => (
              <tr key={s.id} className="border-b border-slate-100">
                <td className="py-2">{s.full_name}</td>
                <td>{s.title}</td>
                <td className="text-slate-500">{s.role}</td>
                <td className="font-mono text-xs">{s.pager}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
