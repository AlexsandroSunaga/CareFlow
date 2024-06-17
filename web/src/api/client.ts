/** Empty base = same-origin `/api` (Vite proxy to the API in dev). */
const envBase = (import.meta.env.VITE_API_BASE as string | undefined)?.trim();
const base =
  envBase && envBase.length > 0
    ? envBase.replace(/\/$/, "")
    : import.meta.env.DEV
      ? ""
      : "http://localhost:8011";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("careflow_token");
}

export function setToken(token: string) {
  localStorage.setItem("careflow_token", token);
}

export function clearToken() {
  localStorage.removeItem("careflow_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string, auth = false): Promise<T> {
  const res = await fetch(`${base}/api/v1${path}`, {
    cache: "no-store",
    headers: auth ? authHeaders() : {},
  });
  if (res.status === 401 && auth) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown, auth = false): Promise<T> {
  const res = await fetch(`${base}/api/v1${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(auth ? authHeaders() : {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${base}/api/v1${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export function downloadUrl(jobId: number) {
  return `${base}/api/v1/documents/${jobId}/download`;
}

export async function downloadDocument(jobId: number) {
  const res = await fetch(downloadUrl(jobId), { headers: authHeaders() });
  if (!res.ok) throw new Error("Download failed");
  return res.blob();
}
