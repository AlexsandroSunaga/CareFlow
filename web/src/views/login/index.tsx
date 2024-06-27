
import { useState } from "react";
import { apiPost, setToken } from "@/api/client";

export default function ConsoleLogin() {
  const [email, setEmail] = useState("admin@careflow.demo");
  const [password, setPassword] = useState("CareflowDemo2026!");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await apiPost<{ access_token: string }>("/auth/login", { email, password });
      setToken(data.access_token);
      window.location.href = "/console";
    } catch {
      setError("Invalid login or API offline on :8011");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Hospital staff sign-in</h1>
        <p className="mt-2 text-sm text-slate-500">admin@careflow.demo / CareflowDemo2026!</p>
        <input
          className="mt-6 w-full rounded-xl border px-3 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          className="mt-3 w-full rounded-xl border px-3 py-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button type="submit" className="mt-6 w-full rounded-full bg-brand-600 py-2.5 text-sm font-medium text-white">
          Enter console
        </button>
      </form>
    </div>
  );
}
