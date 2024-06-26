
import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/api/client";

export default function PharmacyPage() {
  const [rows, setRows] = useState<any[]>([]);
  const load = () => apiGet<any[]>("/pharmacy/orders", true).then(setRows);
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pharmacy & formulary</h1>
      <table className="w-full rounded-2xl border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left">Case</th>
            <th>Drug</th>
            <th>Route</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-mono">{o.case_id}</td>
              <td className="text-center">{o.drug_name}</td>
              <td className="text-center">{o.route}</td>
              <td className="text-center">{o.status}</td>
              <td className="px-2">
                <button className="text-xs text-brand-600" onClick={() => apiPatch(`/pharmacy/orders/${o.id}`, { status: "verified" }).then(load)}>
                  Verify
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
