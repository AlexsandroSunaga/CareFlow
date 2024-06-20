import type { AuditEvent } from "@/types/api";
import { apiGet, apiPatch, apiPost, downloadDocument } from "@/api/client";

export const careflowService = {
  audit: () => apiGet<AuditEvent[]>("/audit", true),
  labOrders: () => apiGet<any[]>("/labs/orders", true),
  patchLabOrder: (id: number, body: unknown) => apiPatch(`/labs/orders/${id}`, body),
  imagingOrders: () => apiGet<any[]>("/imaging/orders", true),
  patchImagingOrder: (id: number, body: unknown) => apiPatch(`/imaging/orders/${id}`, body),
  documents: () => apiGet<any[]>("/documents", true),
  downloadDocument,
  departments: () => apiGet<any[]>("/departments", true),
  cases: () => apiGet<any[]>("/cases", true),
  appointments: () => apiGet<any[]>("/appointments", true),
  login: (email: string, password: string) => apiPost<{ access_token: string }>("/auth/login", { email, password }),
};
