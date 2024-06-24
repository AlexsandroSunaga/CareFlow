
import { useEffect, useState } from "react";
import { apiGet } from "@/api/client";

export default function BillingPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    apiGet<any[]>("/billing/claims", true).then(setRows);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Revenue cycle & claims</h1>
      <table className="w-full rounded-2xl border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left">Case</th>
            <th>Payer</th>
            <th>Amount</th>
            <th>CPT bundle</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-mono">{c.case_id}</td>
              <td className="text-center">{c.payer}</td>
              <td className="text-center">${c.amount_usd}</td>
              <td className="text-center font-mono text-xs">{c.cpt_bundle}</td>
              <td className="text-center">{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
