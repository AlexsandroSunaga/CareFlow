
import { useEffect, useState } from "react";
import { apiGet } from "@/api/client";
import { Link } from "react-router-dom";

type Overview = {
  departments: number;
  open_cases: number;
  appointments: number;
  lab_orders_pending: number;
  imaging_scheduled: number;
  pharmacy_pending_verify: number;
  claims_in_flight: number;
  patients_in_lobby: number;
};

export default function CommandCenter() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    apiGet<Overview>("/command/overview", true).then(setData).catch(() => setData(null));
  }, []);

  const cards = data
    ? [
        ["Departments & units", data.departments, "/console/departments"],
        ["Open clinical cases", data.open_cases, "/console/cases"],
        ["Active appointments", data.appointments, "/console/scheduling"],
        ["Lab orders in flight", data.lab_orders_pending, "/console/labs"],
        ["Imaging scheduled", data.imaging_scheduled, "/console/imaging"],
        ["Pharmacy verify queue", data.pharmacy_pending_verify, "/console/pharmacy"],
        ["Claims in flight", data.claims_in_flight, "/console/billing"],
        ["Patients in lobby", data.patients_in_lobby, "/console/front-desk"],
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Hospital command center</h1>
        <p className="mt-1 text-slate-600">Cross-department operational picture — same view a charge nurse or ops lead uses at shift change.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, href]) => (
          <Link key={label} to={href as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-200">
            <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-brand-700">{value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
