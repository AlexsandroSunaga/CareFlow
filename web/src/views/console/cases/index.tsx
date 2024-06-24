
import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/api/client";

type Case = {
  id: number;
  case_id: string;
  department_code: string;
  acuity: string;
  status: string;
  presentation: string;
};

export default function CasesPage() {
  const [rows, setRows] = useState<Case[]>([]);
  const load = () => apiGet<Case[]>("/cases", true).then(setRows);
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Clinical cases</h1>
      <p className="text-slate-600">De-identified case registry — no patient names in lists.</p>
      <table className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Case</th>
            <th>Dept</th>
            <th>Acuity</th>
            <th>Status</th>
            <th className="px-4 py-3 text-left">Presentation</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-mono text-brand-700">{c.case_id}</td>
              <td className="text-center">{c.department_code}</td>
              <td className="text-center">{c.acuity}</td>
              <td className="text-center">{c.status}</td>
              <td className="px-4 py-3 text-slate-600">{c.presentation}</td>
              <td className="px-2">
                <button className="text-xs text-brand-600" onClick={() => apiPatch(`/cases/${c.id}`, { status: "closed" }).then(load)}>
                  Close
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
