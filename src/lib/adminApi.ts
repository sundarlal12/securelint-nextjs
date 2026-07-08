const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://securelint-api.vercel.app";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

function getOrgId(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_org_id") || "" : "";
}

/**
 * XHR-based fetch that bypasses browser extension patches on window.fetch.
 * Extensions commonly patch fetch but rarely patch XMLHttpRequest.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResult = Record<string, any> | null;

function xhrRequest(url: string, method = "GET", body?: string): Promise<ApiResult> {
  return new Promise((resolve) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.timeout = 30_000;
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", `Bearer ${getToken()}`);
      xhr.setRequestHeader("x-org-id", getOrgId());
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { resolve(JSON.parse(xhr.responseText) as ApiResult); } catch { resolve(null); }
        } else {
          resolve(null);
        }
      };
      xhr.onerror   = () => resolve(null);
      xhr.ontimeout = () => resolve(null);
      xhr.send(body ?? null);
    } catch {
      resolve(null);
    }
  });
}

async function apiFetch(path: string, options?: RequestInit): Promise<ApiResult> {
  const method = (options?.method ?? "GET").toUpperCase();
  const body   = options?.body != null ? String(options.body) : undefined;
  return xhrRequest(`${API_BASE}${path}`, method, body);
}

export async function adminLogin(email: string, password: string, browser_id: string) {
  return new Promise<Record<string, unknown>>((resolve) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE}/api/admin/login`, true);
      xhr.timeout = 15_000;
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) resolve(data);
          else resolve({ error: 1, ...data });
        } catch {
          resolve({ error: 1, message: "Invalid server response" });
        }
      };
      xhr.onerror   = () => resolve({ error: 1, message: "Network error" });
      xhr.ontimeout = () => resolve({ error: 1, message: "Request timed out" });
      xhr.send(JSON.stringify({ email, password, browser_id }));
    } catch {
      resolve({ error: 1, message: "Request failed" });
    }
  });
}

export async function fetchDashboard() {
  return apiFetch("/api/admin/dashboard");
}

export async function fetchCharts(severityType?: "secrets" | "phishing" | "email_dlp") {
  const qs = severityType ? `?severity_type=${severityType}` : "";
  return apiFetch(`/api/admin/charts${qs}`);
}

export async function fetchLiveThreats(limit = 50) {
  return apiFetch(`/api/admin/live-threats?limit=${limit}`);
}

export async function fetchIncidents(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiFetch(`/api/admin/incidents${qs}`);
}

export interface IncidentQueryParams {
  page?: number;
  page_size?: number;
  start_time?: string;
  end_time?: string;
}

function defaultParams(): IncidentQueryParams {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 90);
  return {
    page: 0,
    page_size: 200,
    start_time: start.toISOString(),
    end_time: end.toISOString(),
  };
}

export async function fetchIncidentsSecrets(params?: IncidentQueryParams) {
  const p = { ...defaultParams(), ...params };
  return apiFetch(`/api/admin/incidents/secrets?${new URLSearchParams(p as Record<string, string>).toString()}`);
}

export async function fetchIncidentsPhishing(params?: IncidentQueryParams) {
  const p = { ...defaultParams(), ...params };
  return apiFetch(`/api/admin/incidents/phishing?${new URLSearchParams(p as Record<string, string>).toString()}`);
}

export async function fetchIncidentsEmailDlp(params?: IncidentQueryParams) {
  const p = { ...defaultParams(), ...params };
  return apiFetch(`/api/admin/incidents/email-dlp?${new URLSearchParams(p as Record<string, string>).toString()}`);
}

export async function fetchIncidentsExtension(params?: IncidentQueryParams & { type?: string }) {
  const p = { ...defaultParams(), ...params };
  return apiFetch(`/api/admin/incidents/extension?${new URLSearchParams(p as Record<string, string>).toString()}`);
}

export async function fetchExtensionStats(params?: { start_time?: string; end_time?: string }) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiFetch(`/api/admin/extension-stats${qs}`);
}

export async function fetchSecretScanner() {
  return apiFetch("/api/admin/secret-scanner");
}

export async function fetchBrowserProtection() {
  return apiFetch("/api/admin/browser-protection");
}

export async function fetchPhishingStats() {
  return apiFetch("/api/admin/phishing-stats");
}

export async function fetchTeam() {
  return apiFetch("/api/admin/team");
}

export async function fetchProfile() {
  return apiFetch("/api/admin/me");
}

export async function fetchSettings() {
  return apiFetch("/api/admin/settings");
}

export async function updateSettings(body: Record<string, unknown>) {
  return apiFetch("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function fetchIntegrations() {
  return apiFetch("/api/admin/integrations");
}

export async function updateIntegration(id: string, body: Record<string, unknown>) {
  return apiFetch(`/api/admin/integrations/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function disconnectIntegration(id: string) {
  return apiFetch(`/api/admin/integrations/${id}/disconnect`, {
    method: "POST",
  });
}

export async function sendReport(body: Record<string, unknown>) {
  return apiFetch("/api/admin/report/send", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
