
import { useState } from "react";
import { Link } from "react-router-dom";
import { apiPost } from "@/api/client";

const services = ["Primary care", "Cardiology follow-up", "Pediatric wellness", "ED triage (scheduled)"];
const providers = ["Dr. Rivera", "Dr. Chen", "Dr. Okonkwo", "NP Morgan"];
const slots = ["Mon 9:00", "Mon 11:30", "Tue 14:00", "Wed 10:15", "Thu 16:45"];
const departments = [
  { code: "CARD", label: "Cardiology" },
  { code: "PEDS", label: "Pediatrics" },
  { code: "ED", label: "Emergency" },
  { code: "FD", label: "General clinic" },
];

export default function BookPage() {
  const [service, setService] = useState(services[0]);
  const [provider, setProvider] = useState(providers[0]);
  const [slot, setSlot] = useState(slots[0]);
  const [departmentCode, setDepartmentCode] = useState("FD");
  const [email, setEmail] = useState("");
  const [caseId, setCaseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const row = await apiPost<{ case_id: string }>("/appointments", {
        service,
        provider,
        slot,
        contact_email: email,
        department_code: departmentCode,
      });
      setCaseId(row.case_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-semibold">Book a visit</h1>
      <p className="mt-2 text-slate-600">
        Choose a hospital department and receive a <strong>case ID</strong> for intake — no name on staff boards.
      </p>

      {caseId ? (
        <div className="mt-8 glass border-brand-100 p-6">
          <p className="text-sm text-slate-500">Confirmed</p>
          <p className="mt-2 text-2xl font-mono font-semibold text-brand-700">{caseId}</p>
          <p className="mt-4 text-sm text-slate-600">
            Next: <Link to="/portal/intake" className="text-brand-600 underline">Secure intake</Link> with this case ID.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-5 glass p-6">
          <label className="block text-sm font-medium">
            Department
            <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={departmentCode} onChange={(e) => setDepartmentCode(e.target.value)}>
              {departments.map((d) => (
                <option key={d.code} value={d.code}>{d.label}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Service
            <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={service} onChange={(e) => setService(e.target.value)}>
              {services.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Provider
            <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={provider} onChange={(e) => setProvider(e.target.value)}>
              {providers.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Time slot
            <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={slot} onChange={(e) => setSlot(e.target.value)}>
              {slots.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Email
            <input type="email" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {loading ? "Booking…" : "Confirm appointment"}
          </button>
        </form>
      )}
    </div>
  );
}
