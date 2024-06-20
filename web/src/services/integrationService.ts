import { apiGet } from "@/api/client";

export type IntegrationStatus = Record<string, { enabled: boolean; mode?: string }>;

export const integrationService = {
  status: () => apiGet<IntegrationStatus>("/integrations/status", true),
};
