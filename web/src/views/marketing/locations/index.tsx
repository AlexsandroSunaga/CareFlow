import { SiteNav } from "@/components/SiteNav";

const sites = [
  { name: "CareFlow Medical Center", city: "Berlin", beds: 420, ed: "Level II" },
  { name: "North River Outpatient Pavilion", city: "Potsdam", beds: 0, ed: "—" },
  { name: "CareFlow West Imaging", city: "Spandau", beds: 12, ed: "—" },
];

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-semibold">Locations & service lines</h1>
        <p className="mt-4 text-slate-600">Demo facilities wired into department and scheduling APIs.</p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Site</th>
                <th>City</th>
                <th>Licensed beds</th>
                <th>ED</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((s) => (
                <tr key={s.name} className="border-t">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="text-center">{s.city}</td>
                  <td className="text-center">{s.beds}</td>
                  <td className="text-center">{s.ed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
