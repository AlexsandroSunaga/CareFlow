
import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/api/client";

type Appt = {
  id: number;
  case_id: string;
  department_code: string;
  service: string;
  provider: string;
  slot: string;
  status: string;
  check_in_status: string;
};

export default function SchedulingPage() {
  const [rows, setRows] = useState<Appt[]>([]);

  const load = () => apiGet<Appt[]>("/appointments", true).then(setRows);
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Enterprise scheduling</h1>
      <p className="text-slate-600">Multi-department appointment board with status workflow.</p>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Case</th>
              <th>Dept</th>
              <th>Service</th>
              <th>Provider</th>
              <th>Slot</th>
              <th>Status</th>
              <th>Check-in</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-mono text-brand-700">{r.case_id}</td>
                <td className="text-center">{r.department_code}</td>
                <td className="text-center">{r.service}</td>
                <td className="text-center">{r.provider}</td>
                <td className="text-center">{r.slot}</td>
                <td className="text-center">{r.status}</td>
                <td className="text-center">{r.check_in_status}</td>
                <td className="px-2">
                  {r.status === "scheduled" && (
                    <button
                      className="text-xs text-brand-600"
                      onClick={() => apiPatch(`/appointments/${r.id}/status`, { status: "confirmed" }).then(load)}
                    >
                      Confirm
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
