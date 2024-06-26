
import { useEffect, useState } from "react";
import { apiGet } from "@/api/client";

export default function StaffPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    apiGet<any[]>("/staff", true).then(setRows);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Staff directory</h1>
      <table className="w-full rounded-2xl border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Pager</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{s.full_name} <span className="text-slate-400">({s.title})</span></td>
              <td className="text-center">{s.department_code}</td>
              <td className="text-center">{s.role}</td>
              <td className="text-center font-mono">{s.pager}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
