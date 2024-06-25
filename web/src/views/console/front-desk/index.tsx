
import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/api/client";

type Row = {
  id: number;
  case_id: string;
  department: string;
  provider: string;
  slot: string;
  check_in_status: string;
};

export default function FrontDeskPage() {
  const [queue, setQueue] = useState<Row[]>([]);
  const load = () => apiGet<Row[]>("/front-desk/queue", true).then(setQueue);
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Front desk & arrivals</h1>
      <p className="text-slate-600">Check-in workflow across ED, clinics, and procedural units.</p>
      <div className="space-y-3">
        {queue.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <p className="font-mono text-brand-700">{r.case_id}</p>
              <p className="text-sm text-slate-600">{r.department} · {r.provider} · {r.slot}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{r.check_in_status}</span>
            <div className="flex gap-2">
              {["arrived", "roomed", "completed"].map((s) => (
                <button
                  key={s}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-xs"
                  onClick={() => apiPatch(`/front-desk/appointments/${r.id}/check-in`, { check_in_status: s }).then(load)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
