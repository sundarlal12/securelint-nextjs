"use client";
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Tooltip } from "recharts";
import { LazyCard } from "@/components/dashboard/CardLoader";

export interface BrowserInfo {
  os?: string;
  deviceType?: string;
  browserName?: string;
  browserVersion?: string;
  viewportWidth?: number;
  viewportHeight?: number;
}

export interface Incident {
  id: string;
  initials: string;
  initialsColor: string;
  name: string;
  email: string;
  secretType: string;
  secretIcon: React.ReactNode;
  severity: "High" | "Medium" | "Low" | "Critical";
  alertStatus: "Blocked" | "Flagged" | "Detected" | "Masked" | "Quarantined";
  detectedAt: string;
  detectedTime: string;
  preview: string;
  alertTitle: string;
  alertDesc: string;
  details: { icon: string; label: string; value: string }[];
  maskedContent: string;
  browserInfo?: BrowserInfo;
}

export interface FetchParams {
  start_time: string;
  end_time: string;
  page: number;
  page_size: number;
}

export interface ReportStats {
  total: number;
  blocked: number;
  flagged: number;
  critical: number;
  weeklyData: { day: string; count: number }[];
}

interface FilterTab {
  label: string;
  value: string | null; /* null = show all */
  color?: string;
}

interface Props {
  title: string;
  subtitle: string;
  incidents: Incident[];
  stats: ReportStats;
  onFetch?: (params: FetchParams) => void;
  isFetching?: boolean;
  isLoading?: boolean;
  filterTabs?: FilterTab[];
}

const sevStyles: Record<string, { color: string; bg: string; border: string }> = {
  // Critical → deep red
  Critical: { color: "#b91c1c", bg: "#fee2e2", border: "#b91c1c" },
  // High → red-orange
  High:     { color: "#c2410c", bg: "#ffedd5", border: "#fdba74" },
  // Medium → orange
  Medium:   { color: "#b45309", bg: "#fef3c7", border: "#d97706" },
  // Low → yellow-green
  Low:      { color: "#3f6212", bg: "#f7fee7", border: "#bef264" },
};

const alertStatusConfig: Record<string, { color: string; bg: string; border: string; label: string; dot: string }> = {
  Blocked:     { color: "#dc2626", bg: "#f9f2f2", border: "#fecaca", label: "Blocked",     dot: "#dc2626" },
  Flagged:     { color: "#d97706", bg: "#fbf7f0", border: "#fde68a", label: "Flagged",     dot: "#d97706" },
  Detected:    { color: "#2563eb", bg: "#f1f4fa", border: "#cbd5f4", label: "Detected",    dot: "#2563eb" },
  Masked:      { color: "#7c3aed", bg: "#f4f1fa", border: "#dacaf5", label: "Masked",      dot: "#8b5cf6" },
  Quarantined: { color: "#fb923c", bg: "#faf5f0", border: "#fed7aa", label: "Quarantined", dot: "#ea580c" },
  /* extension-specific statuses */
  Installed:   { color: "#16a34a", bg: "#f1faf6", border: "#bbf7d0", label: "Installed",   dot: "#16a34a" },
  Uninstalled: { color: "#dc2626", bg: "#f9f2f2", border: "#fecaca", label: "Uninstalled", dot: "#dc2626" },
  Synced:      { color: "#4f46e5", bg: "#f1f1fa", border: "#d1d0ee", label: "Synced",      dot: "#4f46e5" },
  Info:        { color: "#2563eb", bg: "#f1f4fa", border: "#cbd5f4", label: "Info",        dot: "#2563eb" },
};

const cs: React.CSSProperties = { background: "#ffffff", border: "1px solid #e9e9ec", borderRadius: 14 };

type GroupedIncident = Incident & { count: number; occurrences: Incident[]; secretTypes: string[] };

const DETAIL_ICONS: Record<string, string> = {
  "Employee":      "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z",
  "Email":         "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  "Secret Type":   "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1h.01c1.71 0 3.1 1.39 3.1 3.1v2z",
  "Severity":      "M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z",
  "Action":        "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12V11c0 4.52-3.08 8.79-7 10-3.92-1.21-7-5.48-7-10V6.3l7-3.12z",
  "Page URL":      "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  "Full URL":      "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  "Page Title":    "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  "Domain":        "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  "Site Status":   "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z",
  "Risk Score":    "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
  "Browser ID":    "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",
  "Extension Ver": "M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z",
  "Incident ID":   "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z",
  "Recipients":    "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  "Data Type":     "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
};

function DetailIcon({ label }: { label: string }) {
  const d = DETAIL_ICONS[label] ?? DETAIL_ICONS["Incident ID"];
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#71717a">
      <path d={d} />
    </svg>
  );
}

const emptyKF = `@keyframes ePulse{0%,100%{opacity:.22;transform:scale(.97)}50%{opacity:.5;transform:scale(1)}}@keyframes eLine{0%,100%{width:40%}50%{width:70%}}@keyframes summaryIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}@keyframes summaryOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-6px)}}`;

// ─────────────────────────────────────────────────────────────────────────────
// Extension Activity Card — rich extension list with expandable permissions
// ─────────────────────────────────────────────────────────────────────────────
type ExtRow = {
  extensionId?: string; extensionName?: string; extensionVersion?: string;
  isMalicious?: boolean; isSuspicious?: boolean; enabled?: boolean;
  fromStore?: boolean; installType?: string;
  permissions?: string[]; hostPerms?: string[]; detectedAt?: string;
};

function ExtChip({ icon, label, color = "#52525b", bg = "#f7f7f8", border = "#f4f4f5" }: { icon?: React.ReactNode; label: string; color?: string; bg?: string; border?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 8, padding: "2px 7px", borderRadius: 20, background: bg, border: `1px solid ${border}`, color }}>
      {icon}{label}
    </span>
  );
}

function ExtensionActivityCard({ inc }: { inc: Incident }) {
  const [expandedIdx, setExpandedIdx] = React.useState<number | null>(null);

  const dv = (lbl: string) => inc.details.find(x => x.label === lbl)?.value ?? "";
  const totalExts       = Number(dv("_totalExts")    || 0);
  const malicious       = Number(dv("_maliciousCnt") || 0);
  const suspicious      = Number(dv("_suspiciousCnt")|| 0);
  const sideloaded      = Number(dv("_sideloadedCnt")|| 0);
  const extListRaw      = dv("_extensionsList");
  const malListRaw      = dv("_maliciousList");
  const susListRaw      = dv("_suspiciousList");
  const cwsUrl          = dv("_cwsUrl");
  const riskScore       = dv("_riskScore");
  const policyStatus    = dv("_policyStatus");
  const detectionSource = dv("_detectionSource");
  const extPermsRaw     = dv("_extPerms");
  const complianceRaw   = dv("_complianceRefs");
  const extInstallType  = dv("_extInstallType");
  const extEnabledStr   = dv("_extEnabled");

  const extList: ExtRow[] = (() => { try { return JSON.parse(extListRaw || "[]"); } catch { return []; } })();
  const malList: { extensionId?: string; extensionName?: string }[] = (() => { try { return JSON.parse(malListRaw || "[]"); } catch { return []; } })();
  const susList: { extensionId?: string; extensionName?: string }[] = (() => { try { return JSON.parse(susListRaw || "[]"); } catch { return []; } })();
  const extPerms: string[] = (() => { try { return JSON.parse(extPermsRaw || "[]"); } catch { return []; } })();
  const complianceRefs: string[] = (() => { try { return JSON.parse(complianceRaw || "[]"); } catch { return []; } })();
  const isBlacklisted   = !!cwsUrl || inc.secretType === "Blacklisted Extension Visit";

  const actionColor: Record<string, string> = {
    Synced: "#4f46e5", Installed: "#16a34a", Uninstalled: "#dc2626",
    Blocked: "#dc2626", Masked: "#7c3aed", Detected: "#8e8e93", Info: "#2563eb",
  };
  const RISKY_PERMS = new Set(["proxy","webRequest","declarativeNetRequestWithHostAccess","downloads","nativeMessaging","clipboardRead","management","cookies","identity"]);

  /* icons */
  const storeIco = <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>;
  const normalIco = <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke="currentColor" strokeWidth="1.8"/></svg>;
  const enabledIco = <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  const disabledIco = <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;

  return (
    <>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: isBlacklisted ? "#fef2f2" : "#f3f2f9", border: `1px solid ${isBlacklisted ? "#dc262655" : "#f4effc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {isBlacklisted
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="1.8"/></svg>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#7c3aed" strokeWidth="1.6"/><path d="M8 9h8M8 12h8M8 15h5" stroke="#7c3aed" strokeWidth="1.4" strokeLinecap="round"/></svg>}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#18181b", flex: 1 }}>{isBlacklisted ? "Blacklisted Extension" : "Extension Activity"}</span>
        {inc.alertStatus && (
          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#fafafa", border: `1px solid ${(actionColor[inc.alertStatus] ?? "#8e8e93") + "44"}`, color: actionColor[inc.alertStatus] ?? "#8e8e93" }}>
            {inc.alertStatus}
          </span>
        )}
      </div>

      {/* Blacklist-specific: CWS link + risk score + detection source */}
      {isBlacklisted && (cwsUrl || riskScore || detectionSource || policyStatus) && (
        <div style={{ borderRadius: 8, background: "#fbefef", border: "1px solid #dc262622", padding: "10px 12px", marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {cwsUrl && (
            <div>
              <div style={{ fontSize: 8, color: "#52525b", marginBottom: 2 }}>CHROME WEB STORE</div>
              <a href={cwsUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 10, color: "#2563eb", wordBreak: "break-all", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4, verticalAlign: "middle", flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/></svg>
                {cwsUrl.replace("https://chromewebstore.google.com/detail/","CWS: ")}
              </a>
            </div>
          )}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {riskScore && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: Number(riskScore) >= 75 ? "#fef2f2" : "#fbf5ef", border: `1px solid ${Number(riskScore) >= 75 ? "#dc262644" : "#ea580c44"}`, color: Number(riskScore) >= 75 ? "#dc2626" : "#ea580c", fontWeight: 700 }}>Risk {riskScore}/100</span>}
            {policyStatus && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "#fafafa", border: "1px solid #dc262644", color: "#dc2626" }}>{policyStatus}</span>}
            {detectionSource && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "#fafafa", border: "1px solid #f4f4f5", color: "#52525b" }}>{detectionSource.replace(/_/g," ")}</span>}
          </div>
          {extPerms.length > 0 && (
            <div>
              <div style={{ fontSize: 8, color: "#52525b", marginBottom: 3 }}>PERMISSIONS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {extPerms.map((p, pi) => (
                  <ExtChip key={pi} label={p} color={RISKY_PERMS.has(p) ? "#ea580c" : "#52525b"} bg={RISKY_PERMS.has(p) ? "#fbf5ef" : "#fafafa"} border={RISKY_PERMS.has(p) ? "#f9731433" : "#f4f4f533"} />
                ))}
              </div>
            </div>
          )}
          {complianceRefs.length > 0 && (
            <div>
              <div style={{ fontSize: 8, color: "#52525b", marginBottom: 3 }}>COMPLIANCE REFERENCES</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {complianceRefs.map((c, ci) => (
                  <ExtChip key={ci} label={c} color="#2563eb" bg="#f0f4fb" border="#1e3a5f44" />
                ))}
              </div>
            </div>
          )}
          {/* extInstallType + extEnabled meta */}
          {(extInstallType || extEnabledStr) && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {extInstallType && <ExtChip icon={normalIco} label={extInstallType} />}
              {extEnabledStr === "true"  && <ExtChip icon={enabledIco}  label="enabled"  color="#16a34a" bg="#f1faf6" border="#16a34a33" />}
              {extEnabledStr === "false" && <ExtChip icon={disabledIco} label="disabled" color="#71717a" bg="#fafafa" border="#f3f5f7" />}
            </div>
          )}
        </div>
      )}

      {/* Risk summary chips */}
      {!isBlacklisted && (totalExts > 0 || malicious > 0 || suspicious > 0) && (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
          {totalExts > 0   && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "#f3f2f9", border: "1px solid #4c1d9544", color: "#7c3aed" }}>{totalExts} scanned</span>}
          {malicious > 0   && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "#fef2f2", border: "1px solid #dc262644", color: "#dc2626", fontWeight: 700 }}>⚠ {malicious} malicious</span>}
          {suspicious > 0  && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "#fbf5ef", border: "1px solid #ea580c44", color: "#ea580c" }}>⚠ {suspicious} suspicious</span>}
          {sideloaded > 0  && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "#fafaf1", border: "1px solid #d9770644", color: "#d97706" }}>{sideloaded} sideloaded</span>}
        </div>
      )}

      {/* Malicious/Suspicious named lists */}
      {malList.length > 0 && (
        <div style={{ borderRadius: 7, background: "#f9f2f2", border: "1px solid #dc262633", marginBottom: 8, overflow: "hidden" }}>
          <div style={{ padding: "4px 8px", borderBottom: "1px solid #dc262622", fontSize: 9, color: "#dc2626", fontWeight: 700, letterSpacing: 0.5 }}>MALICIOUS</div>
          {malList.map((m, mi) => (
            <div key={mi} style={{ padding: "4px 8px", borderBottom: mi < malList.length - 1 ? "1px solid #fef2f2" : "none", fontSize: 10, color: "#b91c1c", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="2"/></svg>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(m.extensionName ?? "")}</span>
            </div>
          ))}
        </div>
      )}
      {susList.length > 0 && malList.length === 0 && (
        <div style={{ borderRadius: 7, background: "#fdf5ee", border: "1px solid #f9731433", marginBottom: 8, overflow: "hidden" }}>
          <div style={{ padding: "4px 8px", borderBottom: "1px solid #f9731422", fontSize: 9, color: "#ea580c", fontWeight: 700, letterSpacing: 0.5 }}>SUSPICIOUS ({susList.length})</div>
          <div style={{ maxHeight: 72, overflowY: "auto" }}>
            {susList.map((s, si) => (
              <div key={si} style={{ padding: "4px 8px", borderBottom: si < susList.length - 1 ? "1px solid #fcf5ee" : "none", fontSize: 10, color: "#c2410c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {String(s.extensionName ?? "")}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full extension list — each row expandable */}
      {extList.length > 0 && (
        <div style={{ borderRadius: 7, border: "1px solid #fafafa", overflow: "hidden", flex: 1 }}>
          <div style={{ padding: "5px 8px", borderBottom: "1px solid #fafafa", fontSize: 9, color: "#52525b", fontWeight: 600, background: "#f7f7f8", letterSpacing: 0.4 }}>
            ALL EXTENSIONS ({extList.length})
          </div>
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {extList.map((e, ei) => {
              const eName   = String(e.extensionName ?? "");
              const eId     = String(e.extensionId   ?? "");
              const eVer    = String(e.extensionVersion ?? "");
              const isMal   = Boolean(e.isMalicious);
              const isSus   = Boolean(e.isSuspicious);
              const enabled = e.enabled;
              const perms   = Array.isArray(e.permissions) ? (e.permissions as string[]) : [];
              const hPerms  = Array.isArray(e.hostPerms)   ? (e.hostPerms as string[])   : [];
              const isOpen  = expandedIdx === ei;
              const rowBg   = isMal ? "#fbefef" : isSus ? "#fbf4f0" : ei % 2 === 0 ? "#f7f7f8" : "#f0f4fb";
              return (
                <div key={ei} style={{ borderBottom: ei < extList.length - 1 ? "1px solid #f1f4fa" : "none" }}>
                  {/* Row header — click to expand */}
                  <div
                    role="button"
                    onClick={() => setExpandedIdx(isOpen ? null : ei)}
                    style={{ padding: "7px 8px", background: rowBg, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    {/* status dot */}
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: enabled === false ? "#f3f5f7" : "#16a34a", flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 10, color: isMal ? "#b91c1c" : isSus ? "#c2410c" : "#18181b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{eName}</span>
                    {eVer && <span style={{ fontSize: 8, color: "#a1a1aa", flexShrink: 0 }}>v{eVer}</span>}
                    {isMal && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 10, background: "#fef2f2", border: "1px solid #dc262633", color: "#dc2626", flexShrink: 0 }}>mal</span>}
                    {!isMal && isSus && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 10, background: "#fbf5ef", border: "1px solid #f9731433", color: "#ea580c", flexShrink: 0 }}>sus</span>}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}><path d="M6 9l6 6 6-6" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ padding: "8px 10px 10px", background: "#f0f3fa", borderTop: "1px solid #d0d9ee", display: "flex", flexDirection: "column", gap: 5 }}>
                      {/* ID */}
                      {eId && (
                        <div>
                          <div style={{ fontSize: 8, color: "#a1a1aa", marginBottom: 1 }}>Extension ID</div>
                          <div style={{ fontFamily: "monospace", fontSize: 9, color: "#52525b", wordBreak: "break-all" }}>{eId}</div>
                        </div>
                      )}
                      {/* Meta row with icons */}
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {e.installType && <ExtChip icon={normalIco} label={String(e.installType)} />}
                        {e.fromStore   && <ExtChip icon={storeIco}   label="from store" color="#16a34a" bg="#f1faf6" border="#16422a33" />}
                        {enabled === false && <ExtChip icon={disabledIco} label="disabled" color="#71717a" bg="#fafafa" border="#f3f5f7" />}
                        {enabled === true  && <ExtChip icon={enabledIco}  label="enabled"  color="#16a34a" bg="#f1faf6" border="#16a34a33" />}
                      </div>
                      {/* Permissions */}
                      {perms.length > 0 && (
                        <div>
                          <div style={{ fontSize: 8, color: "#a1a1aa", marginBottom: 3 }}>PERMISSIONS ({perms.length})</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                            {perms.map((p, pi) => {
                              const isRisky = RISKY_PERMS.has(p);
                              return <span key={pi} style={{ fontSize: 7.5, padding: "1px 5px", borderRadius: 10, background: isRisky ? "#fbf5ef" : "#fafafa", border: `1px solid ${isRisky ? "#f9731433" : "#f4f4f533"}`, color: isRisky ? "#ea580c" : "#52525b" }}>{p}</span>;
                            })}
                          </div>
                        </div>
                      )}
                      {/* Host permissions */}
                      {hPerms.length > 0 && (
                        <div>
                          <div style={{ fontSize: 8, color: "#a1a1aa", marginBottom: 3 }}>HOST ACCESS</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                            {hPerms.map((h, hi) => (
                              <span key={hi} style={{ fontSize: 7.5, padding: "1px 5px", borderRadius: 10, background: h === "<all_urls>" ? "#fef2f2" : "#fafafa", border: `1px solid ${h === "<all_urls>" ? "#dc262633" : "#f4f4f533"}`, color: h === "<all_urls>" ? "#dc2626" : "#52525b" }}>{h}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <>
      <style>{emptyKF + skeletonKF}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px", gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, border: "2px dashed #e9e9ec", animation: "ePulse 2.4s ease-in-out infinite", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="4 2"/><path d="M9 12h6M12 9v6" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 120 }}>
          <div style={{ height: 6, borderRadius: 3, background: "#e9e9ec", animation: "eLine 3s ease-in-out infinite", width: "60%" }} />
          <div style={{ height: 6, borderRadius: 3, background: "#e9e9ec", animation: "eLine 3s ease-in-out infinite 0.4s", width: "40%" }} />
        </div>
        <span style={{ fontSize: 12, color: "#a1a1aa", marginTop: 4 }}>{text}</span>
      </div>
    </>
  );
}

function fmtRange(from: string, to: string) {
  const f = new Date(from), t = new Date(to);
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${m[f.getMonth()]} ${f.getDate()} – ${m[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`;
}

// Critical, High, Medium, Low — matches sevStyles text colours
const PIE_C = ["#b91c1c", "#c2410c", "#b45309", "#3f6212"];

const skeletonKF = `@keyframes skPulse{0%,100%{opacity:.35}50%{opacity:.7}}`;
function Sk({ w = "100%", h = 16, r = 6 }: { w?: string | number; h?: number; r?: number }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: "#e9e9ec", animation: "skPulse 1.4s ease-in-out infinite" }} />;
}

export default function IncidentReportLayout({ title, subtitle, incidents, stats, onFetch, isFetching = false, isLoading = false, filterTabs }: Props) {
  const [page, setPage] = useState(0);
  const [sevFilter, setSevFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split("T")[0]);
  const [sevOpen, setSevOpen]     = useState(false);
  const [calOpen, setCalOpen]     = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const perPage = 12;

  /* ── Drawer state ── */
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [drawerInc, setDrawerInc]     = useState<GroupedIncident | null>(null);
  const [showAllOccs, setShowAllOccs] = useState(false);
  const drawerBodyRef = useRef<HTMLDivElement>(null);

  /* Reset scroll to top every time a new incident opens */
  useEffect(() => {
    if (drawerBodyRef.current) drawerBodyRef.current.scrollTop = 0;
  }, [drawerInc]);

  const openDrawer  = useCallback((inc: GroupedIncident) => { setDrawerInc(inc); setDrawerOpen(true); setShowAllOccs(false); }, []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return incidents.filter(inc => {
      if (sevFilter !== "All" && inc.severity !== sevFilter) return false;
      const d = new Date(inc.detectedAt), from = new Date(dateFrom), to = new Date(dateTo);
      to.setHours(23, 59, 59);
      if (d < from || d > to) return false;
      /* filterTabs active tab */
      if (activeTab !== null && inc.alertStatus.toLowerCase() !== activeTab.toLowerCase()) return false;
      if (q) {
        return (
          inc.name.toLowerCase().includes(q) ||
          inc.email.toLowerCase().includes(q) ||
          inc.secretType.toLowerCase().includes(q) ||
          inc.preview.toLowerCase().includes(q) ||
          inc.alertStatus.toLowerCase().includes(q) ||
          inc.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [incidents, sevFilter, dateFrom, dateTo, searchQuery, activeTab]);

  /* ── Group incidents by (employee + page URL + date).
       Falls back to (email + secretType + date) if no Page URL available.
       This collapses all secrets found on the same page visit into one row. ── */
  const grouped = useMemo<GroupedIncident[]>(() => {
    const EXTENSION_RAW_SET = new Set(["extension_sync","extension_install","extension_uninstall","extension_malicious","extension_blacklist","extension_all","extension_type","blacklist_extensions_visit","Blacklisted Extension Visit","Extension Installed","Extension Uninstalled","Extension Synced","Malicious Extension","Blacklisted Extension","Extension Activity"]);
    const map = new Map<string, GroupedIncident>();

    /* Sort desc by detectedAt so the newest occurrence becomes the representative */
    const sorted = [...filtered].sort((a, b) =>
      new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );

    sorted.forEach(inc => {
      const isExt = EXTENSION_RAW_SET.has(inc.secretType) || inc.details.some(d => d.label === "_extName");
      let key: string;
      if (isExt) {
        /* Group by extensionId — one row per unique extension */
        const extId = inc.details.find(d => d.label === "_extId")?.value
                   || inc.details.find(d => d.label === "Extension ID")?.value
                   || inc.preview
                   || inc.id;
        key = `ext||${extId}`;
      } else {
        const pageUrl = inc.details.find(d => d.label === "Page URL")?.value
                     ?? inc.details.find(d => d.label === "Full URL")?.value
                     ?? "";
        key = pageUrl
          ? `${inc.email}||${pageUrl}||${inc.detectedAt}`
          : `${inc.email}||${inc.secretType}||${inc.detectedAt}`;
      }
      if (map.has(key)) {
        const g = map.get(key)!;
        g.count++;
        g.occurrences.push(inc);
        if (!g.secretTypes.includes(inc.secretType)) g.secretTypes.push(inc.secretType);
      } else {
        map.set(key, { ...inc, count: 1, occurrences: [inc], secretTypes: [inc.secretType] });
      }
    });
    return Array.from(map.values());
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(grouped.length / perPage));
  const pageInc = grouped.slice(page * perPage, (page + 1) * perPage);

  // Compute daily counts from actual incidents as a fallback for trend chart
  const derivedTrend = useMemo(() => {
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const m: Record<string, number> = {};
    incidents.forEach(inc => {
      try {
        const d = new Date(inc.detectedAt);
        const key = DAYS[d.getDay()];
        m[key] = (m[key] || 0) + 1;
      } catch { /* skip */ }
    });
    return DAYS.map(d => ({ day: d, count: m[d] ?? 0 }));
  }, [incidents]);

  const trendData = (stats.weeklyData && stats.weeklyData.some(d => d.count > 0))
    ? stats.weeklyData
    : derivedTrend;

  const sevBrk = useMemo(() => {
    const m: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    filtered.forEach(i => m[i.severity] = (m[i.severity] || 0) + 1);
    return Object.entries(m).map(([name, value]) => ({ name, value })).filter(s => s.value > 0);
  }, [filtered]);

  const statusBrk = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.forEach(i => m[i.alertStatus] = (m[i.alertStatus] || 0) + 1);
    return Object.entries(m).map(([name, value]) => ({ name, value })).filter(s => s.value > 0);
  }, [filtered]);

  const handleExport = useCallback(() => {
    const data = filtered.map(inc => ({
      id: inc.id, employee: inc.name, email: inc.email,
      secretType: inc.secretType, severity: inc.severity, alertStatus: inc.alertStatus,
      detectedAt: `${inc.detectedAt} ${inc.detectedTime}`, preview: inc.preview,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  }, [filtered, title]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1440 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.5px", margin: 0 }}>SecureLint Enterprise — {title}</h2>
        <p style={{ fontSize: 13, color: "#52525b", marginTop: 6 }}>{subtitle}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: "Total Incidents", val: stats.total, c: "#0d9488", d: "M3 12a9 9 0 1118 0 9 9 0 01-18 0z|M12 8v4l3 3" },
          { label: "Blocked",         val: stats.blocked, c: "#dc2626", d: "M12 3a9 9 0 100 18 9 9 0 000-18z|M5.5 5.5l13 13" },
          { label: "Flagged",         val: stats.flagged, c: "#d97706", d: "M5 4v16|M5 4l9 4-9 4" },
          { label: "Critical",        val: stats.critical, c: "#dc2626", d: "M12 2L3 20h18L12 2z|M12 9v4M12 17h.01" },
        ] as const).map((s, i) => (
          <div key={i} style={{ ...cs, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            {isLoading ? (
              <>
                <Sk w={44} h={44} r={12} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Sk w="55%" h={28} r={6} />
                  <Sk w="80%" h={10} r={4} />
                </div>
              </>
            ) : (
              <>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.c}10`, border: `1.5px solid ${s.c}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">{s.d.split("|").map((p, j) => <path key={j} d={p} stroke={s.c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />)}</svg>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.c, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#52525b", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{s.label}</div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 3 compact charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Trend */}
        <div style={{ ...cs, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Daily Trend</div>
          {isLoading ? <Sk h={52} r={8} /> : (
          <ResponsiveContainer width="100%" height={52}>
            <AreaChart data={trendData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs><linearGradient id="ilg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/><stop offset="95%" stopColor="#0d9488" stopOpacity={0}/></linearGradient></defs>
              <Tooltip
                cursor={{ stroke: "#0d948844", strokeWidth: 1 }}
                contentStyle={{ background: "#f4f4f5", border: "1px solid #e9e9ec", borderRadius: 8, fontSize: 11, color: "#0a0a0a", padding: "6px 10px" }}
                itemStyle={{ color: "#0d9488" }}
                formatter={(v: unknown) => [`${v}`, "Incidents"]}
                labelFormatter={(l: unknown) => `${l}`}
              />
              <Area type="monotone" dataKey="count" stroke="#0d9488" strokeWidth={1.5} fill="url(#ilg)" dot={false} activeDot={{ r: 4, fill: "#0d9488", stroke: "#ffffff", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>

        {/* Severity Split */}
        <div style={{ ...cs, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Severity Split</div>
          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sk w={52} h={52} r={26} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <Sk h={9} r={4} /><Sk w="80%" h={9} r={4} /><Sk w="60%" h={9} r={4} />
              </div>
            </div>
          ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ResponsiveContainer width={56} height={52}>
              <PieChart>
                <Pie data={sevBrk} dataKey="value" cx="50%" cy="50%" innerRadius={14} outerRadius={24} strokeWidth={0}>
                  {sevBrk.map((_, idx) => <Cell key={idx} fill={PIE_C[idx % PIE_C.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#f4f4f5", border: "1px solid #e9e9ec", borderRadius: 8, fontSize: 11, color: "#0a0a0a", padding: "6px 10px" }}
                  formatter={(v: unknown, _: unknown, props: { payload?: { name?: string } }) => [`${v}`, props.payload?.name ?? ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {sevBrk.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 1, background: PIE_C[i % PIE_C.length] }} />
                  <span style={{ fontSize: 9, color: "#52525b" }}>{s.name} <span style={{ color: "#0a0a0a", fontWeight: 600 }}>{s.value}</span></span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Weekly Volume */}
        <div style={{ ...cs, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Weekly Volume</div>
          {isLoading ? <Sk h={52} r={8} /> : (
          <ResponsiveContainer width="100%" height={52}>
            <BarChart data={trendData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 8 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "#e9e9ec" }}
                contentStyle={{ background: "#f4f4f5", border: "1px solid #e9e9ec", borderRadius: 8, fontSize: 11, color: "#0a0a0a", padding: "6px 10px" }}
                itemStyle={{ color: "#0d9488" }}
                formatter={(v: unknown) => [`${v}`, "Incidents"]}
              />
              <Bar dataKey="count" fill="#0d9488" radius={[2, 2, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Filters (screenshot style: single date button + severity dropdown + export) */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <button onClick={() => { setCalOpen(!calOpen); setSevOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, border: "1px solid #e9e9ec", background: "#ffffff", fontSize: 12, color: "#52525b", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#52525b" strokeWidth="1.5"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round"/></svg>
            {fmtRange(dateFrom, dateTo)}
            <span style={{ fontSize: 10, color: "#a1a1aa" }}>▾</span>
          </button>
          {calOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, padding: "14px 16px", background: "#f4f4f5", border: "1px solid #e9e9ec", borderRadius: 10, zIndex: 30, display: "flex", flexDirection: "column", gap: 10, minWidth: 220 }}>
              <label style={{ fontSize: 10, color: "#52525b", fontWeight: 600 }}>From
                <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(0); }}
                  style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px", borderRadius: 6, border: "1px solid #e9e9ec", background: "#ffffff", fontSize: 12, color: "#0a0a0a", outline: "none" }} />
              </label>
              <label style={{ fontSize: 10, color: "#52525b", fontWeight: 600 }}>To
                <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(0); }}
                  style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px", borderRadius: 6, border: "1px solid #e9e9ec", background: "#ffffff", fontSize: 12, color: "#0a0a0a", outline: "none" }} />
              </label>
              <button
                onClick={() => {
                  setCalOpen(false);
                  setPage(0);
                  
                  if (onFetch) {
                    const end = new Date(dateTo);
                    end.setHours(23, 59, 59, 999);
                    onFetch({
                      start_time: new Date(dateFrom).toISOString(),
                      end_time: end.toISOString(),
                      page: 0,
                      page_size: 200,
                    });
                  }
                }}
                style={{ marginTop: 2, padding: "6px 0", borderRadius: 6, border: "none", background: "#0d9488", color: "#ffffff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                {isFetching ? "Loading…" : "Apply & Fetch"}
              </button>
            </div>
          )}
        </div>
        {/* Search input */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", left: 10, pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="7" stroke="#a1a1aa" strokeWidth="2"/>
            <path d="M16.5 16.5L21 21" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search employee, type, preview…"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
            style={{ paddingLeft: 30, paddingRight: searchQuery ? 28 : 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: "1px solid #e9e9ec", background: "#ffffff", fontSize: 12, color: "#0a0a0a", outline: "none", width: 220 }}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setPage(0); }}
              style={{ position: "absolute", right: 8, background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", fontSize: 14, lineHeight: 1, padding: 0 }}>✕</button>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button onClick={() => { setSevOpen(!sevOpen); setCalOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, border: "1px solid #e9e9ec", background: "#ffffff", fontSize: 12, color: "#52525b", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M10 18h4" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round"/></svg>
            {sevFilter === "All" ? "All Severity" : sevFilter}
            <span style={{ fontSize: 10, color: "#a1a1aa" }}>▾</span>
          </button>
          {sevOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, background: "#f4f4f5", border: "1px solid #e9e9ec", borderRadius: 10, zIndex: 30, minWidth: 150, overflow: "hidden" }}>
              {["All", "Critical", "High", "Medium", "Low"].map(s => (
                <button key={s} onClick={() => { setSevFilter(s); setSevOpen(false); setPage(0); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", padding: "9px 14px", background: sevFilter === s ? "#e9e9ec" : "transparent", color: sevFilter === s ? "#0a0a0a" : "#52525b", border: "none", fontSize: 12, cursor: "pointer" }}>
                  {s !== "All" && <span style={{ width: 8, height: 8, borderRadius: 2, background: sevStyles[s]?.bg ?? "#333" }} />}
                  {s === "All" ? "All Severity" : s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={handleExport}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 8, border: "1px solid #e9e9ec", background: "#ffffff", fontSize: 12, color: "#0a0a0a", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* Filter tabs — shown between search bar and table when provided */}
      {filterTabs && filterTabs.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", paddingBottom: 2 }}>
          {[{ label: "All", value: null, color: "#52525b" }, ...filterTabs].map((tab, ti) => {
            const isActive = activeTab === tab.value;
            const c = tab.color ?? "#52525b";
            const cnt = tab.value === null
              ? incidents.length
              : incidents.filter(i => i.alertStatus.toLowerCase() === tab.value!.toLowerCase()).length;
            return (
              <button
                key={ti}
                onClick={() => { setActiveTab(tab.value); setPage(0); }}
                style={{
                  padding: "5px 14px", borderRadius: 20,
                  border: `1.5px solid ${isActive ? c : "#e9e9ec"}`,
                  background: isActive ? `${c}18` : "#ffffff",
                  color: isActive ? c : "#52525b",
                  fontSize: 12, fontWeight: isActive ? 700 : 400, cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {tab.label}
                <span style={{ marginLeft: 5, fontSize: 11, opacity: isActive ? 1 : 0.6 }}>
                  ({cnt})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Table — full width */}
      <div style={{ ...cs, padding: 0, overflow: "hidden" }}>
          <LazyCard delay={300}>
            {isFetching ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "40px 20px", color: "#52525b", fontSize: 13 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                  <circle cx="12" cy="12" r="9" stroke="#e9e9ec" strokeWidth="2.5"/>
                  <path d="M12 3a9 9 0 019 9" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                Fetching incidents…
              </div>
            ) : filtered.length === 0 ? <EmptyState text={searchQuery ? `No results for "${searchQuery}"` : "No incidents match your filters"} /> : (
              <>
                <div className="overflow-x-auto">
                  <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "1px solid #e9e9ec" }}>
                      {["Employee", "Type", "Severity", "Status", "Detected At", "Preview", ""].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "12px 10px", color: "#52525b", fontWeight: 600, fontSize: 11, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {(pageInc as GroupedIncident[]).map((inc, i) => {
                        const sv = sevStyles[inc.severity] ?? sevStyles.Medium;
                        const asc = alertStatusConfig[inc.alertStatus] ?? alertStatusConfig.Blocked;
                        return (
                          <tr key={`${inc.id}-${i}`} onClick={() => openDrawer(inc)}
                            style={{ borderBottom: "1px solid #e9e9ec", cursor: "pointer", background: "transparent", transition: "background .15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#f3f5f8"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                            <td style={{ padding: "12px 10px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: inc.initialsColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{inc.initials}</div>
                                <div>
                                  <div style={{ color: "#0a0a0a", fontWeight: 600, fontSize: 12 }}>{inc.name}</div>
                                  <div style={{ color: "#52525b", fontSize: 10 }}>{inc.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "10px 10px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 11, color: "#0a0a0a", fontWeight: 500, whiteSpace: "nowrap" }}>
                                  {inc.secretTypes.length > 1 ? inc.secretTypes[0] : inc.secretType}
                                </span>
                                {inc.secretTypes.length > 1 && (
                                  <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: "#fbf7f0", border: "1px solid #fde68a44", color: "#d97706", whiteSpace: "nowrap" }}>
                                    +{inc.secretTypes.length - 1} type{inc.secretTypes.length > 2 ? "s" : ""}
                                  </span>
                                )}
                                {inc.count > 1 && (
                                  <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 10, background: "#f0faf8", border: "1px solid #0d948844", color: "#0d9488", whiteSpace: "nowrap" }}>×{inc.count}</span>
                                )}
                              </div>
                              <div style={{ display: "flex" }}>{inc.secretIcon}</div>
                            </td>
                            <td style={{ padding: "12px 10px" }}><span style={{ fontSize: 10, fontWeight: 600, padding: "2px 10px", borderRadius: 20, color: sv.color, background: sv.bg, border: `1px solid ${sv.border}` }}>{inc.severity}</span></td>
                            <td style={{ padding: "12px 10px" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, padding: "2px 10px", borderRadius: 20, color: asc.color, background: asc.bg, border: `1px solid ${asc.border}` }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: asc.dot, flexShrink: 0 }} />{inc.alertStatus}</span></td>
                            <td style={{ padding: "12px 10px", color: "#52525b", fontSize: 11 }}><div style={{ fontSize: 10 }}>{inc.detectedTime || inc.detectedAt}</div></td>
                            <td style={{ padding: "12px 10px" }}><span style={{ fontFamily: "monospace", fontSize: 11, color: "#18181b", letterSpacing: "0.02em" }}>{inc.preview}</span></td>
                            <td style={{ padding: "12px 6px", color: "#a1a1aa", fontSize: 16, textAlign: "center" }}>⋮</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 16px", borderTop: "1px solid #e9e9ec", gap: 4 }}>
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                    style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #e9e9ec", background: "transparent", color: page === 0 ? "#a1a1aa" : "#0a0a0a", cursor: page === 0 ? "default" : "pointer", fontSize: 13 }}>‹</button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i)}
                      style={{ width: 30, height: 30, borderRadius: 6, border: i === page ? "1.5px solid #0d9488" : "1px solid #e9e9ec", background: "transparent", color: i === page ? "#0d9488" : "#52525b", cursor: "pointer", fontSize: 12, fontWeight: i === page ? 700 : 400 }}>{i + 1}</button>
                  ))}
                  <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                    style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #e9e9ec", background: "transparent", color: page >= totalPages - 1 ? "#a1a1aa" : "#0a0a0a", cursor: page >= totalPages - 1 ? "default" : "pointer", fontSize: 13 }}>›</button>
                </div>
              </>
            )}
          </LazyCard>
        </div>

      {/* ── Slide-over Drawer ── */}
      <style>{`@keyframes drawerIn{from{opacity:0}to{opacity:1}}`}</style>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={closeDrawer}
          style={{ position: "fixed", inset: 0, background: "rgba(16,17,20,0.32)", zIndex: 900, animation: "drawerIn 0.2s ease" }}
        />
      )}

      {/* Drawer panel — extension incidents get extra width for the permission cards */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100dvh",
        width: drawerInc && (
          drawerInc.details.some(d => d.label === "_extName") ||
          ["Extension Installed","Extension Uninstalled","Extension Synced","Malicious Extension","Blacklisted Extension","Extension Activity","extension_sync","extension_install","extension_uninstall","extension_malicious"].includes(drawerInc.secretType)
        ) ? 680 : 540,
        maxWidth: "98vw",
        background: "#f7f7f8",
        borderLeft: "1px solid #fafafa",
        zIndex: 950,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",           /* outer panel must NOT scroll — only body below does */
        transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: drawerOpen ? "-12px 0 60px rgba(16,17,20,0.32)" : "none",
      }}>
        {drawerInc && (() => {
          const inc = drawerInc;
          const ac = alertStatusConfig[inc.alertStatus] ?? alertStatusConfig.Detected;
          const sv = sevStyles[inc.severity] ?? sevStyles.Medium;
          const SHOW_LIMIT = 5;
          const hasMany = inc.count > 1;
          const pageUrl   = inc.details.find(d => d.label === "Page URL")?.value ?? "";
          const pageTitle = inc.details.find(d => d.label === "Page Title")?.value ?? "";
          const bi        = inc.browserInfo;
          const browserId = inc.details.find(d => d.label === "Browser ID")?.value
                        ?? inc.occurrences.find(o => o.details.find(d => d.label === "Browser ID")?.value)?.details.find(d => d.label === "Browser ID")?.value
                        ?? "";
          const extVer    = inc.details.find(d => d.label === "Extension Ver")?.value
                        ?? inc.occurrences.find(o => o.details.find(d => d.label === "Extension Ver")?.value)?.details.find(d => d.label === "Extension Ver")?.value
                        ?? "";

          /* Incident category detection */
          const PHISHING_TYPES = ["Phishing Page Blocked","Phishing Mail Detected","Social Domain Block","WAF Domain Block","Malware Site","Phishing Blocked","Malicious Site","Suspicious Site","Allowlisted Visit","Blocked Site"];
          const EXTENSION_TYPES = ["Extension Installed","Extension Uninstalled","Extension Synced","Malicious Extension","Blacklisted Extension","Extension Activity"];
          const EXTENSION_RAW  = ["extension_sync","extension_install","extension_uninstall","extension_malicious","extension_blacklist","extension_all","extension_type","blacklist_extensions_visit"];
          const isEmailDlp  = inc.secretType === "Email DLP" || inc.secretType === "email_dlp";
          const isPhishing  = !isEmailDlp && (PHISHING_TYPES.includes(inc.secretType) || inc.secretTypes.some(t => PHISHING_TYPES.includes(t)));
          const isExtension = !isEmailDlp && !isPhishing && (
            EXTENSION_TYPES.includes(inc.secretType) || EXTENSION_RAW.includes(inc.secretType) ||
            inc.secretTypes.some(t => EXTENSION_TYPES.includes(t) || EXTENSION_RAW.includes(t)) ||
            inc.details.some(d => d.label === "_extName")
          );

          /* Recipient domains for email DLP */
          const recipientsRaw = inc.details.find(d => d.label === "Recipients")?.value ?? "";
          const recipients = recipientsRaw ? recipientsRaw.split("|").filter(Boolean) : [];

          /* Base64 images embedded in incident data */
          const base64Images = [
            inc.maskedContent, inc.preview,
            ...inc.details.map(d => d.value),
            ...inc.occurrences.flatMap(o => [o.maskedContent, o.preview]),
          ].filter((v): v is string => typeof v === "string" && v.startsWith("data:image/"))
           .filter((v, i, a) => a.indexOf(v) === i); // deduplicate
          const dateLabel = (() => {
            try { return new Date(inc.detectedAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }
            catch { return inc.detectedAt; }
          })();

          /* Incident ID formatted as INC-YYYY-MMDD-#### */
          const incId = (() => {
            const d = inc.detectedAt.replace(/-/g, "");
            const num = String(inc.id).replace(/\D/g, ""); /* keep full numeric ID */
            return `INC-${d.slice(0, 4)}-${d.slice(4, 8)}-${num}`;
          })();

          /* Per-type occurrence counts */
          const typeCountMap = new Map<string, number>();
          inc.occurrences.forEach(occ => {
            typeCountMap.set(occ.secretType, (typeCountMap.get(occ.secretType) ?? 0) + 1);
          });
          const typeCounts = Array.from(typeCountMap.entries()).sort((a, b) => b[1] - a[1]);
          if (typeCounts.length === 0) typeCounts.push([inc.secretType, inc.count]);

          /* Severity → label + colours */
          const sevLabel = inc.severity;
          const sevColor = sv.color;

          /* Card style shared */
          const card: React.CSSProperties = { background: "#fafafa", border: "1px solid #fafafa", borderRadius: 12, padding: "14px 16px" };

          return (
            <>
              {/* ══ Header — sticky, never scrolls ══ */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px 16px", borderBottom: "1px solid #fafafa", flexShrink: 0, background: "#f7f7f8", position: "sticky", top: 0, zIndex: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" fill="white" fillOpacity=".9"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#0a0a0a", lineHeight: 1.2 }}>Detection Details</div>
                  <div style={{ fontSize: 11, color: "#a1a1aa", marginTop: 2 }}>Review and respond to the detected secret exposure</div>
                </div>
                <button onClick={closeDrawer} aria-label="Close"
                  style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #fafafa", background: "#fafafa", color: "#52525b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  ✕
                </button>
              </div>


              {(() => {
                const brightSev: Record<string, string> = { Critical: "#dc2626", High: "#dc2626", Medium: "#d97706", Low: "#86efac" };
                const bsColor = brightSev[inc.severity] ?? "#dc2626";
                return (
                  <div style={{ flexShrink: 0, padding: "12px 16px", borderBottom: "1px solid #fafafa" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#fafafa", border: "1px solid #f4f4f5", borderRadius: 12, overflow: "hidden" }}>

                      {/* Col 1 — INC ID + date */}
                      <div style={{ padding: "16px 14px", borderRight: "1px solid #f4f4f5", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#18181b", fontFamily: "monospace" }}>{incId}</span>
                          <button title="Copy" onClick={() => navigator.clipboard.writeText(incId)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center", flexShrink: 0 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#52525b" strokeWidth="1.8"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#52525b" strokeWidth="1.8"/></svg>
                          </button>
                        </div>
                        <span style={{ fontSize: 10, color: "#4a6080" }}>Detected: {inc.detectedAt}</span>
                      </div>

                      {/* Col 2 — severity chip */}
                      <div style={{ padding: "16px 14px", borderRight: "1px solid #f4f4f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, padding: "5px 14px", borderRadius: 20, color: bsColor, background: `${bsColor}18`, border: `1px solid ${bsColor}55` }}>
                          {inc.severity}
                        </span>
                      </div>

                      {/* Col 3 — status + context label */}
                      <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: ac.color }}>{ac.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#16a34a" strokeWidth="1.8"/><path d="M8 12l3 3 5-5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span style={{ fontSize: 10, color: "#16a34a" }}>
                            {isExtension ? "Extension policy enforced" : isEmailDlp ? "DLP policy enforced" : isPhishing ? "Threat neutralised" : "Secrets are protected"}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}

              {/* ══ Scrollable body ══ */}
              <div ref={drawerBodyRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

                {/* ── Employee card ── */}
                <div style={{ ...card, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: inc.initialsColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", flexShrink: 0, letterSpacing: 1 }}>
                    {inc.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#0a0a0a", lineHeight: 1.2 }}>{inc.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#a1a1aa"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                      <span style={{ fontSize: 12, color: "#52525b" }}>{inc.email}</span>
                    </div>
                  </div>
                </div>

                {/* ── Detection Overview + Secret Types (2 col, or full-width for phishing) ── */}
                <div style={{ display: isPhishing ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {/* Left: Detection Overview — hidden for phishing */}
                  <div style={{ ...card, display: isPhishing ? "none" : "flex", flexDirection: "column", gap: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "#fafafa", border: "1px solid #fafafa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" fill="#2563eb"/><rect x="10" y="7" width="4" height="14" rx="1" fill="#2563eb"/><rect x="17" y="3" width="4" height="18" rx="1" fill="#2563eb"/></svg>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#18181b" }}>Detection Overview</span>
                    </div>
                    {/* Big numbers */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                      <div style={{ flex: 1, textAlign: "center", padding: "10px 6px", background: "#f7f7f8", borderRadius: 8, border: "1px solid #fafafa" }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: "#2563eb", lineHeight: 1 }}>{inc.secretTypes.length}</div>
                        <div style={{ fontSize: 9, color: "#a1a1aa", marginTop: 4, lineHeight: 1.3 }}>Secret Types<br/>Detected</div>
                      </div>
                      <div style={{ flex: 1, textAlign: "center", padding: "10px 6px", background: "#f7f7f8", borderRadius: 8, border: "1px solid #fafafa" }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: "#2563eb", lineHeight: 1 }}>{inc.count}</div>
                        <div style={{ fontSize: 9, color: "#a1a1aa", marginTop: 4, lineHeight: 1.3 }}>Total<br/>Detections</div>
                      </div>
                    </div>
                    {/* First Seen | Status row */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      <div style={{ flex: 1, padding: "7px 8px", background: "#f7f7f8", borderRadius: 7, border: "1px solid #fafafa" }}>
                        <div style={{ fontSize: 9, color: "#a1a1aa", marginBottom: 2 }}>First Seen</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#18181b" }}>{inc.detectedAt}</div>
                      </div>
                      <div style={{ flex: 1, padding: "7px 8px", background: "#f7f7f8", borderRadius: 7, border: "1px solid #fafafa" }}>
                        <div style={{ fontSize: 9, color: "#a1a1aa", marginBottom: 2 }}>Status</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: ac.color }}>{ac.label}</div>
                      </div>
                    </div>
                    {/* Masked note */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 7, padding: "8px 10px", background: "#f7f7f8", borderRadius: 8, border: "1px solid #fafafa" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke={ac.dot} strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={ac.dot} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{ fontSize: 10, color: "#52525b", lineHeight: 1.5 }}>All detected secrets have been automatically {ac.label.toLowerCase()} to prevent exposure.</span>
                    </div>
                  </div>

                  {/* Right: Secret Types / Email DLP / Phishing Detection */}
                  <div style={{ ...card, display: "flex", flexDirection: "column", gridColumn: isPhishing ? "1 / -1" : undefined }}>
                    {isEmailDlp ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 7, background: "#eff5fb", border: "1px solid #cfddf0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#2563eb"/></svg>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#18181b" }}>Cross-domain Mail Detected</span>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                          {recipients.length > 0 ? recipients.map((r, ri) => (
                            <div key={ri} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", borderRadius: 7, background: "#f7f7f8", border: "1px solid #fafafa" }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#2563eb" strokeWidth="1.6"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/></svg>
                              <span style={{ fontSize: 10, color: "#8e8e93", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r}</span>
                            </div>
                          )) : (
                            <div style={{ fontSize: 10, color: "#a1a1aa", padding: "6px 0" }}>No recipient data</div>
                          )}
                        </div>
                      </>
                    ) : isPhishing ? (() => {
                      const dpv = (lbl: string) => inc.details.find(x => x.label === lbl)?.value ?? "";
                      const isMailPhish = dpv("_isPhishMail") === "true";
                      const phishScore   = dpv("_phish_score");
                      const phishVerdict = dpv("_phish_verdict");
                      const phishFrom    = dpv("_phish_from");
                      const phishFromDisp= dpv("_phish_fromDisp");
                      const phishSubject = dpv("_phish_subject");
                      const phishIP      = dpv("_phish_sendingIp");
                      const phishDomain  = dpv("_phish_fromDomain");
                      const phishIncType = dpv("_phish_incType");
                      const phishAuth: Record<string,unknown>     = (() => { try { return JSON.parse(dpv("_phish_auth") || "{}"); } catch { return {}; } })();
                      const phishFlags: Record<string,unknown>    = (() => { try { return JSON.parse(dpv("_phish_flags") || "{}"); } catch { return {}; } })();
                      const phishSignals: { sev: string; text: string }[] = (() => { try { return JSON.parse(dpv("_phish_signals") || "[]"); } catch { return []; } })();

                      const sevColor: Record<string,string> = { critical: "#dc2626", high: "#ea580c", medium: "#d97706", low: "#8e8e93" };
                      const sevBg:    Record<string,string> = { critical: "#fef2f2", high: "#fbf5ef", medium: "#fbfaef", low: "#fafafa" };
                      const authIcon = (pass: unknown) => pass === true || pass === "pass"
                        ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#16a34a" strokeWidth="1.8"/><path d="M8 12l3 3 5-5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        : <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#dc2626" strokeWidth="1.8"/><path d="M15 9l-6 6M9 9l6 6" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/></svg>;
                      const flagsActive = Object.entries(phishFlags).filter(([,v]) => v === true).map(([k]) => k.replace(/([A-Z])/g, ' $1').toLowerCase().trim());

                      return (
                        <>
                          {/* Header */}
                          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                            <div style={{ width: 26, height: 26, borderRadius: 7, background: "#fef2f2", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {isMailPhish
                                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" stroke="#dc2626" strokeWidth="1.4"/><path d="M12 9v4M12 17h.01" stroke="#ea580c" strokeWidth="1.6"/></svg>
                                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="1.6"/></svg>}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#18181b", flex: 1 }}>Phishing Detection</span>
                            {phishScore && <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20, background: "#fef2f2", border: "1px solid #dc262644", color: "#dc2626" }}>Score {phishScore}/100</span>}
                            {phishVerdict && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "#fef2f2", border: "1px solid #dc262644", color: "#b91c1c" }}>{phishVerdict}</span>}
                          </div>

                          {/* Email header block (mail phishing only) */}
                          {isMailPhish && (
                            <div style={{ background: "#f7f7f8", border: "1px solid #e4e4e7", borderRadius: 8, padding: "8px 10px", marginBottom: 8, display: "flex", flexDirection: "column", gap: 5 }}>
                              {phishIncType && <div style={{ fontSize: 8, color: "#a1a1aa", fontWeight: 700, marginBottom: 2, letterSpacing: 0.5 }}>{phishIncType.replace(/_/g," ").toUpperCase()}</div>}
                              {phishSubject && (
                                <div>
                                  <div style={{ fontSize: 8, color: "#a1a1aa", marginBottom: 1 }}>SUBJECT</div>
                                  <div style={{ fontSize: 10, color: "#b91c1c", fontWeight: 600, wordBreak: "break-word" }}>{phishSubject}</div>
                                </div>
                              )}
                              {phishFrom && (
                                <div style={{ display: "flex", gap: 12 }}>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 8, color: "#a1a1aa", marginBottom: 1 }}>FROM ADDRESS</div>
                                    <div style={{ fontSize: 10, color: "#8e8e93", fontFamily: "monospace" }}>{phishFrom}</div>
                                  </div>
                                  {phishFromDisp && (
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 8, color: "#a1a1aa", marginBottom: 1 }}>DISPLAY NAME</div>
                                      <div style={{ fontSize: 10, color: "#ea580c", fontWeight: 600 }}>{phishFromDisp}</div>
                                    </div>
                                  )}
                                </div>
                              )}
                              {(phishDomain || phishIP) && (
                                <div style={{ display: "flex", gap: 12 }}>
                                  {phishDomain && <div style={{ flex: 1 }}><div style={{ fontSize: 8, color: "#a1a1aa", marginBottom: 1 }}>SENDER DOMAIN</div><div style={{ fontSize: 10, color: "#8e8e93", fontFamily: "monospace" }}>{phishDomain}</div></div>}
                                  {phishIP && <div style={{ flex: 1 }}><div style={{ fontSize: 8, color: "#a1a1aa", marginBottom: 1 }}>SENDING IP</div><div style={{ fontSize: 10, color: "#8e8e93", fontFamily: "monospace" }}>{phishIP}</div></div>}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Auth results (SPF / DKIM / DMARC / ARC) */}
                          {isMailPhish && Object.keys(phishAuth).length > 0 && (
                            <div style={{ marginBottom: 8 }}>
                              <div style={{ fontSize: 8, color: "#a1a1aa", fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>EMAIL AUTHENTICATION</div>
                              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                {["spf","dkim","dmarc"].map(k => phishAuth[k] != null && (
                                  <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "#f7f7f8", border: `1px solid ${phishAuth[k] === "pass" ? "#16a34a44" : "#dc262644"}`, color: phishAuth[k] === "pass" ? "#16a34a" : "#dc2626" }}>
                                    {authIcon(phishAuth[k])}{k.toUpperCase()} {String(phishAuth[k])}
                                  </span>
                                ))}
                                {!!phishAuth.arcPresent && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "#f7f7f8", border: "1px solid #4f46e544", color: "#4f46e5" }}>{authIcon(true)}ARC</span>}
                                {!!phishAuth.dmarcPolicy && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "#f7f7f8", border: "1px solid #f9731444", color: "#ea580c" }}>DMARC p={String(phishAuth.dmarcPolicy)}</span>}
                              </div>
                            </div>
                          )}

                          {/* Threat signals */}
                          {phishSignals.length > 0 && (
                            <div style={{ marginBottom: 8 }}>
                              <div style={{ fontSize: 8, color: "#a1a1aa", fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>THREAT SIGNALS ({phishSignals.length})</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 160, overflowY: "auto" }}>
                                {phishSignals.map((s, si) => (
                                  <div key={si} style={{ display: "flex", gap: 6, padding: "5px 8px", borderRadius: 6, background: sevBg[s.sev] ?? "#fafafa", border: `1px solid ${sevColor[s.sev] ?? "#f4f4f5"}33` }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={sevColor[s.sev] ?? "#8e8e93"} strokeWidth="1.8"/></svg>
                                    <div style={{ flex: 1 }}>
                                      <span style={{ fontSize: 8, fontWeight: 700, color: sevColor[s.sev] ?? "#8e8e93", marginRight: 5, textTransform: "uppercase" }}>{s.sev}</span>
                                      <span style={{ fontSize: 10, color: "#18181b", lineHeight: 1.4 }}>{s.text}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Active flags */}
                          {flagsActive.length > 0 && (
                            <div>
                              <div style={{ fontSize: 8, color: "#a1a1aa", fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>RISK FLAGS</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                                {flagsActive.map((f, fi) => (
                                  <span key={fi} style={{ fontSize: 8, padding: "2px 7px", borderRadius: 20, background: "#fbf5ef", border: "1px solid #f9731433", color: "#ea580c" }}>{f}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Site phishing: rich detection data */}
                          {!isMailPhish && (() => {
                            const spv = (lbl: string) => inc.details.find(x => x.label === lbl)?.value ?? "";
                            const isPhishSite    = spv("_isPhishSite") === "true";
                            const siteUrl        = spv("_psite_url");
                            const siteScore      = spv("_psite_score");
                            const siteRisk       = spv("_psite_riskScore");
                            const siteVerdict    = spv("_psite_verdict");
                            const siteStatus2    = spv("_psite_status");
                            const ssl: Record<string,unknown>  = (() => { try { return JSON.parse(spv("_psite_ssl") || "{}"); } catch { return {}; } })();
                            const whois: Record<string,unknown> = (() => { try { return JSON.parse(spv("_psite_whois") || "{}"); } catch { return {}; } })();
                            const goog: Record<string,unknown>  = (() => { try { return JSON.parse(spv("_psite_google") || "{}"); } catch { return {}; } })();
                            const tank: Record<string,unknown>  = (() => { try { return JSON.parse(spv("_psite_tankphish") || "{}"); } catch { return {}; } })();
                            const slData: Record<string,unknown> = (() => { try { return JSON.parse(spv("_psite_securelint") || "{}"); } catch { return {}; } })();
                            const trans: Record<string,unknown>  = (() => { try { return JSON.parse(spv("_psite_transparency") || "{}"); } catch { return {}; } })();

                            const statusColor = (s: string) => s === "safe" ? "#16a34a" : s === "unsafe" || s === "danger" ? "#dc2626" : s === "suspicious" ? "#ea580c" : "#8e8e93";
                            const tick  = (ok: unknown) => ok ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#16a34a" strokeWidth="1.8"/><path d="M8 12l3 3 5-5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                                               : <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#dc2626" strokeWidth="1.8"/><path d="M15 9l-6 6M9 9l6 6" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/></svg>;

                            if (!isPhishSite) return typeCounts.map(([type, cnt], ti) => (
                              <div key={ti} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", borderRadius: 7, background: "#f7f7f8", border: "1px solid #fafafa" }}>
                                <span style={{ fontSize: 10, color: "#fb923c", fontWeight: 600, flex: 1 }}>{type}</span>
                                {cnt > 1 && <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 10, background: "#fbf4ef", border: "1px solid #ea580c33", color: "#ea580c", flexShrink: 0, marginLeft: 6 }}>×{cnt}</span>}
                              </div>
                            ));

                            return (
                              <>
                                {/* URL + verdict row */}
                                {siteUrl && (
                                  <div style={{ padding: "7px 10px", background: "#f9f6f2", border: "1px solid #f9731444", borderRadius: 7, marginBottom: 8 }}>
                                    <div style={{ fontSize: 8, color: "#a1a1aa", marginBottom: 2 }}>PHISHING URL</div>
                                    <div style={{ fontSize: 10, color: "#b91c1c", fontFamily: "monospace", wordBreak: "break-all", fontWeight: 600 }}>{siteUrl}</div>
                                  </div>
                                )}

                                {/* Scores row */}
                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                                  {siteScore   && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "#fef2f2", border: "1px solid #dc262644", color: "#dc2626", fontWeight: 700 }}>Score {siteScore}/100</span>}
                                  {siteRisk    && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "#fbf5ef", border: "1px solid #f9731444", color: "#ea580c", fontWeight: 700 }}>Risk {siteRisk}/100</span>}
                                  {siteVerdict && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "#fafafa", border: "1px solid #f4f4f5", color: statusColor(siteVerdict), fontWeight: 600, textTransform: "capitalize" }}>{siteVerdict}</span>}
                                  {siteStatus2 && siteStatus2 !== siteVerdict && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "#fafafa", border: "1px solid #f4f4f5", color: statusColor(siteStatus2), textTransform: "capitalize" }}>{siteStatus2}</span>}
                                </div>

                                {/* Detection engines */}
                                <div style={{ marginBottom: 8 }}>
                                  <div style={{ fontSize: 8, color: "#a1a1aa", fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>DETECTION ENGINES</div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    {/* Google Safe Browsing */}
                                    {goog.score != null && (
                                      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 8px", background: "#f7f7f8", border: "1px solid #fafafa", borderRadius: 6 }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" stroke="#4285f4" strokeWidth="1.6"/><circle cx="12" cy="12" r="4" fill="#4285f4"/></svg>
                                        <span style={{ fontSize: 10, color: "#8e8e93", flex: 1 }}>Google Safe Browsing</span>
                                        <span style={{ fontSize: 9, color: goog.severity === "low" ? "#16a34a" : "#dc2626", fontFamily: "monospace" }}>score {String(goog.score)}</span>
                                        {!!goog.severity && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 10, background: goog.severity === "low" ? "#f1faf6" : "#fef2f2", color: goog.severity === "low" ? "#16a34a" : "#dc2626" }}>{String(goog.severity)}</span>}
                                      </div>
                                    )}
                                    {/* PhishTank */}
                                    {(tank.is_phish != null || tank.verified != null) && (
                                      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 8px", background: "#f7f7f8", border: `1px solid ${tank.is_phish ? "#dc262633" : "#fafafa"}`, borderRadius: 6 }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z" fill={tank.is_phish ? "#dc2626" : "#a1a1aa"}/></svg>
                                        <span style={{ fontSize: 10, color: "#8e8e93", flex: 1 }}>PhishTank</span>
                                        {tick(tank.is_phish === false)}
                                        <span style={{ fontSize: 9, color: tank.is_phish ? "#dc2626" : "#16a34a" }}>{tank.is_phish ? "phishing detected" : "clean"}</span>
                                        {!!tank.verified && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 10, background: "#f3f2f9", color: "#7c3aed" }}>verified</span>}
                                      </div>
                                    )}
                                    {/* SecureLint */}
                                    {slData.type != null && (
                                      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 8px", background: "#f7f7f8", border: "1px solid #4338ca33", borderRadius: 6 }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke="#4f46e5" strokeWidth="1.8"/></svg>
                                        <span style={{ fontSize: 10, color: "#8e8e93", flex: 1 }}>SecureLint AI</span>
                                        <span style={{ fontSize: 9, color: "#4f46e5", fontFamily: "monospace" }}>{String(slData.type)}</span>
                                        {!!slData.action && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 10, background: "#f1f1fa", border: "1px solid #4338ca33", color: "#4f46e5" }}>{String(slData.action)}</span>}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* SSL + WHOIS in 2 cols */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                  {/* SSL */}
                                  {Object.keys(ssl).length > 0 && (
                                    <div style={{ padding: "8px 10px", background: "#f7f7f8", border: "1px solid #fafafa", borderRadius: 8 }}>
                                      <div style={{ fontSize: 8, color: "#a1a1aa", fontWeight: 700, letterSpacing: 0.5, marginBottom: 5 }}>SSL / TLS</div>
                                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                          {tick(ssl.hasHttps)}<span style={{ fontSize: 9, color: ssl.hasHttps ? "#16a34a" : "#dc2626" }}>HTTPS</span>
                                        </div>
                                        {!!ssl.tlsVersion && <div style={{ fontSize: 9, color: "#52525b" }}>TLS: <span style={{ color: "#8e8e93" }}>{String(ssl.tlsVersion)}</span></div>}
                                        {!!ssl.issuer && <div style={{ fontSize: 9, color: "#52525b" }}>Issuer: <span style={{ color: "#8e8e93" }}>{String(ssl.issuer)}</span></div>}
                                        {ssl.daysLeft != null && <div style={{ fontSize: 9, color: "#52525b" }}>Expires in: <span style={{ color: Number(ssl.daysLeft) < 30 ? "#ea580c" : "#16a34a" }}>{String(ssl.daysLeft)}d</span></div>}
                                      </div>
                                    </div>
                                  )}
                                  {/* WHOIS */}
                                  {Object.keys(whois).length > 0 && (
                                    <div style={{ padding: "8px 10px", background: "#f7f7f8", border: "1px solid #fafafa", borderRadius: 8 }}>
                                      <div style={{ fontSize: 8, color: "#a1a1aa", fontWeight: 700, letterSpacing: 0.5, marginBottom: 5 }}>DOMAIN WHOIS</div>
                                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                        {whois.ageDays != null && <div style={{ fontSize: 9, color: "#52525b" }}>Age: <span style={{ color: Number(whois.ageDays) < 30 ? "#dc2626" : "#8e8e93", fontWeight: 600 }}>{String(whois.ageDays)} days</span></div>}
                                        {!!whois.registrationDate && <div style={{ fontSize: 9, color: "#52525b" }}>Reg: <span style={{ color: "#8e8e93" }}>{String(whois.registrationDate)}</span></div>}
                                        {!!whois.registrar && <div style={{ fontSize: 9, color: "#52525b" }}>Registrar: <span style={{ color: "#8e8e93" }}>{String(whois.registrar)}</span></div>}
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                                          {tick(!whois.privacyProtected)}<span style={{ fontSize: 9, color: "#52525b" }}>Privacy {whois.privacyProtected ? "protected" : "public"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Transparency report flags */}
                                {(trans.phishing || trans.malware || trans.harmfulRedirects || trans.dangerousDownloads) && (
                                  <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                                    {!!trans.phishing          && <span style={{ fontSize: 8, padding: "2px 7px", borderRadius: 20, background: "#fef2f2", border: "1px solid #dc262633", color: "#dc2626" }}>phishing</span>}
                                    {!!trans.malware           && <span style={{ fontSize: 8, padding: "2px 7px", borderRadius: 20, background: "#fef2f2", border: "1px solid #dc262633", color: "#dc2626" }}>malware</span>}
                                    {!!trans.harmfulRedirects  && <span style={{ fontSize: 8, padding: "2px 7px", borderRadius: 20, background: "#fbf5ef", border: "1px solid #f9731433", color: "#ea580c" }}>harmful redirects</span>}
                                    {!!trans.dangerousDownloads && <span style={{ fontSize: 8, padding: "2px 7px", borderRadius: 20, background: "#fbf5ef", border: "1px solid #f9731433", color: "#ea580c" }}>dangerous downloads</span>}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </>
                      );
                    })() : isExtension ? (
                      <ExtensionActivityCard inc={inc} />
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 7, background: "#f1f9f5", border: "1px solid #cfefde", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke="#16a34a" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#18181b" }}>Secret Types Detected</span>
                        </div>
                        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5, maxHeight: 180 }}>
                          {typeCounts.map(([type, cnt], ti) => (
                            <div key={ti} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", borderRadius: 7, background: "#f7f7f8", border: "1px solid #fafafa" }}>
                              <span style={{ fontSize: 10, color: "#0d9488", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{type}</span>
                              <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 10, background: "#f0faf8", border: "1px solid #0d948833", color: "#0d9488", flexShrink: 0, marginLeft: 6 }}>×{cnt}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ── Browser & Device Info ── */}
                {bi && (
                  <div style={card}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "#fafafa", border: "1px solid #fafafa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#2563eb" strokeWidth="1.8"/><path d="M8 21h8M12 17v4" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#18181b" }}>Browser & Device Information</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      {[
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#a1a1aa"/></svg>, label: "OS", value: bi.os },
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="#a1a1aa" strokeWidth="1.8"/><circle cx="12" cy="18" r="1" fill="#a1a1aa"/></svg>, label: "Device Type", value: bi.deviceType },
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#a1a1aa" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" stroke="#a1a1aa" strokeWidth="1.8"/><path d="M12 2a10 10 0 010 20M2 12h20" stroke="#a1a1aa" strokeWidth="1.4"/></svg>, label: "Browser", value: bi.browserName },
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="#a1a1aa"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" stroke="#a1a1aa" strokeWidth="1.8" strokeLinecap="round"/></svg>, label: "Browser Version", value: bi.browserVersion?.replace("Version ", "").replace(" (Official Build) (arm)", " (arm)") },
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#a1a1aa" strokeWidth="1.8"/><path d="M8 3v18M3 8h18" stroke="#a1a1aa" strokeWidth="1.4"/></svg>, label: "Viewport Width", value: bi.viewportWidth ? `${bi.viewportWidth}` : undefined },
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="#a1a1aa" strokeWidth="1.8" strokeLinecap="round"/><rect x="3" y="3" width="18" height="18" rx="2" stroke="#a1a1aa" strokeWidth="1.4"/></svg>, label: "Viewport Height", value: bi.viewportHeight ? `${bi.viewportHeight}` : undefined },
                      ].filter(r => r.value).map((row, ri) => (
                        <div key={ri} style={{ padding: "8px 10px", background: "#f7f7f8", borderRadius: 8, border: "1px solid #fafafa" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                            {row.icon}
                            <span style={{ fontSize: 9, color: "#a1a1aa", fontWeight: 600 }}>{row.label}</span>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b", wordBreak: "break-word", lineHeight: 1.3 }}>{row.value}</div>
                        </div>
                      ))}
                      {/* Browser ID — full width */}
                      {browserId && (
                        <div style={{ gridColumn: "1 / -1", padding: "8px 10px", background: "#f7f7f8", borderRadius: 8, border: "1px solid #fafafa" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="8" rx="5" ry="7" stroke="#a1a1aa" strokeWidth="1.6"/><path d="M7 8c0 3 2.24 5 5 5s5-2 5-5" stroke="#a1a1aa" strokeWidth="1.4"/><circle cx="12" cy="8" r="1.5" fill="#a1a1aa"/></svg>
                            <span style={{ fontSize: 9, color: "#a1a1aa", fontWeight: 600 }}>Browser ID</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#8e8e93", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{browserId}</span>
                            <button title="Copy Browser ID" onClick={() => navigator.clipboard.writeText(browserId)}
                              style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#71717a" strokeWidth="1.8"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#71717a" strokeWidth="1.8"/></svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Browser ID + Scanner Version ── */}
                {(browserId || extVer) && (
                  <div style={{ ...card, display: "flex", alignItems: "stretch", gap: 0, padding: 0, overflow: "hidden" }}>
                    {/* Browser ID */}
                    {browserId && (
                      <div style={{ flex: 1, padding: "14px 16px", borderRight: extVer ? "1px solid #fafafa" : "none", display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f4fa", border: "1px solid #d1daee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 1C8.5 1 5.5 3.5 5.5 7c0 2 .8 3.8 2 5" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/>
                            <path d="M12 1c3.5 0 6.5 2.5 6.5 6 0 2-.8 3.8-2 5" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/>
                            <path d="M8.5 10c-.3-1-.5-2-.5-3 0-2.2 1.8-4 4-4s4 1.8 4 4c0 1-.2 2-.5 3" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/>
                            <path d="M10 13c-.2-.9-.5-1.9-.5-3" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/>
                            <path d="M14 13c.2-.9.5-1.9.5-3" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/>
                            <path d="M12 13v8" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/>
                            <path d="M9 16h6" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/>
                            <path d="M10 19h4" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: 10, color: "#52525b", fontWeight: 500, marginBottom: 4 }}>Browser ID</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#18181b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{browserId}</span>
                            <button title="Copy Browser ID" onClick={() => navigator.clipboard.writeText(browserId)}
                              style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 3, display: "flex", alignItems: "center" }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#52525b" strokeWidth="1.8"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#52525b" strokeWidth="1.8"/></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Scanner Version */}
                    {extVer && (
                      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f4fa", border: "1px solid #d1daee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="#2563eb" strokeWidth="1.8"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "#52525b", fontWeight: 500, marginBottom: 4 }}>Scanner Version</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#4f46e5" }}>v{extVer}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Timeline ── */}
                <div style={{ ...card }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#18181b", marginBottom: 2 }}>Timeline</div>
                  <div style={{ fontSize: 10, color: "#52525b", marginBottom: 14 }}>{dateLabel}</div>

                  {/* helper: timeline connector line */}
                  {(() => {
                    const connector = <div style={{ flex: 1, width: 2, background: "#e4e4e7", minHeight: 20, marginTop: 3 }} />;
                    const stepIcon = (bg: string, border: string, svgEl: React.ReactNode) => (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: bg, border: `2px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {svgEl}
                        </div>
                        {connector}
                      </div>
                    );
                    const lastIcon = (bg: string, border: string, svgEl: React.ReactNode) => (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: bg, border: `2px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {svgEl}
                        </div>
                      </div>
                    );
                    const urlBlock = (
                      (pageUrl || pageTitle) ? (
                        <div style={{ marginTop: 8, padding: "7px 10px", borderRadius: 7, background: "#f7f7f8", border: "1px solid #e4e4e7", display: "flex", flexDirection: "column", gap: 4 }}>
                          {pageUrl && <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="1.6"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="#2563eb" strokeWidth="1.6"/></svg>
                            <a href={pageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "#2563eb", wordBreak: "break-all", lineHeight: 1.45, textDecoration: "none" }}>{pageUrl}</a>
                          </div>}
                          {pageTitle && <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#8e8e93" strokeWidth="1.6"/></svg>
                            <span style={{ fontSize: 10, color: "#8e8e93", lineHeight: 1.45 }}>{pageTitle}</span>
                          </div>}
                        </div>
                      ) : null
                    );
                    const biChip = (icon: React.ReactNode, text: string, color = "#8e8e93", border = "#e4e4e7") => (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, color, background: "#f7f7f8", border: `1px solid ${border}`, borderRadius: 20, padding: "2px 8px" }}>
                        {icon}{text}
                      </span>
                    );
                    const chromeIcon = <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#4285f4"/><path d="M12 8h8.6A10 10 0 0112 2V8z" fill="#ea4335"/><path d="M12 8H3.4A10 10 0 0012 22V8z" fill="#34a853" transform="rotate(-120 12 12)"/><path d="M12 8H3.4A10 10 0 0012 22V8z" fill="#fbbc05" transform="rotate(120 12 12)"/></svg>;
                    const osIcon = (os: string) => os.toLowerCase().includes("mac")
                      ? <svg width="9" height="9" viewBox="0 0 24 24" fill="#8e8e93"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                      : <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#8e8e93" strokeWidth="1.8"/><path d="M8 21h8M12 17v4" stroke="#8e8e93" strokeWidth="1.8" strokeLinecap="round"/></svg>;
                    const slIcon = <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke="#4f46e5" strokeWidth="1.8" strokeLinejoin="round"/></svg>;
                    const vpIcon = <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="14" rx="2" stroke="#52525b" strokeWidth="1.6"/></svg>;
                    const biChips = bi && (bi.browserName || bi.os) ? (
                      <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {bi.browserName && biChip(chromeIcon, bi.browserName.replace("Google Chrome","Chrome").replace("Mozilla Firefox","Firefox").replace("Microsoft Edge","Edge"), "#8e8e93")}
                        {bi.os && biChip(osIcon(bi.os), bi.os, "#8e8e93")}
                        {bi.viewportWidth && bi.viewportHeight && biChip(vpIcon, `${bi.viewportWidth}×${bi.viewportHeight}`, "#52525b")}
                        {extVer && biChip(slIcon, `SecureLint v${extVer}`, "#4f46e5", "#4338ca44")}
                      </div>
                    ) : null;

                    /* ── EMAIL DLP TIMELINE ── */
                    if (isEmailDlp) return (
                      <>
                        {/* Step 1: Mail client opened */}
                        <div style={{ display: "flex", gap: 12 }}>
                          {stepIcon("#f0f4fb", "#2563eb", <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" stroke="#2563eb" strokeWidth="1.6"/></svg>)}
                          <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedAt}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>Mail client opened</div>
                            <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>{inc.email}</div>
                            {urlBlock}
                            {biChips}
                          </div>
                        </div>

                        {/* Step 2: Cross-domain email detected */}
                        <div style={{ display: "flex", gap: 12 }}>
                          {stepIcon("#fbf3ef", "#ea580c", <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ea580c" strokeWidth="1.6" strokeLinecap="round"/></svg>)}
                          <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>Cross-domain email detected</div>
                            <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>SecureLint extension detected outbound recipients</div>
                            {recipients.length > 0 && (
                              <div style={{ marginTop: 7, display: "flex", flexDirection: "column", gap: 3 }}>
                                {recipients.map((r, ri) => (
                                  <div key={ri} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 6, background: "#f7f7f8", border: "1px solid #e4e4e7" }}>
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#ea580c"/></svg>
                                    <span style={{ fontSize: 10, color: "#8e8e93", fontFamily: "monospace" }}>{r}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Step 3: Action */}
                        <div style={{ display: "flex", gap: 12 }}>
                          {lastIcon(`${ac.dot}22`, ac.dot, <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={ac.dot} strokeWidth="1.8"/><path d="M9 12l2 2 4-4" stroke={ac.dot} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
                          <div style={{ paddingBottom: 4, flex: 1 }}>
                            <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>Email <span style={{ color: ac.color }}>{ac.label}</span> by SecureLint</div>
                            <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>Cross-domain transmission policy enforced</div>
                          </div>
                        </div>
                      </>
                    );

                    /* ── PHISHING TIMELINE ── */
                    if (isPhishing) {
                      const dpv = (lbl: string) => inc.details.find(x => x.label === lbl)?.value ?? "";
                      const isMailPhish  = dpv("_isPhishMail") === "true";
                      const phishSubject = dpv("_phish_subject");
                      const phishFrom    = dpv("_phish_from");
                      const phishFromDisp= dpv("_phish_fromDisp");
                      const phishScore   = dpv("_phish_score");
                      const phishVerdict = dpv("_phish_verdict");
                      const phishIncType = dpv("_phish_incType");

                      /* determine if it's Gmail or Outlook */
                      const isGmail   = pageUrl.includes("mail.google.com");
                      const isOutlook = pageUrl.includes("outlook.");
                      const mailClient = isGmail ? "Gmail" : isOutlook ? "Outlook" : "Mail client";

                      if (isMailPhish) {
                        return (
                          <>
                            {/* Step 1: User opened mail */}
                            <div style={{ display: "flex", gap: 12 }}>
                              {stepIcon("#f0f4fb", "#2563eb", <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" stroke="#2563eb" strokeWidth="1.6"/></svg>)}
                              <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedAt}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>User opened {mailClient}</div>
                                <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>{inc.email}</div>
                                {urlBlock}
                                {biChips}
                              </div>
                            </div>

                            {/* Step 2: Phishing email identified */}
                            <div style={{ display: "flex", gap: 12 }}>
                              {stepIcon("#fef2f2", "#dc2626", <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" stroke="#dc2626" strokeWidth="1.4"/><path d="M12 10v4M12 18h.01" stroke="#dc2626" strokeWidth="1.8"/></svg>)}
                              <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#dc2626" }}>
                                  SecureLint v{extVer || "?"} detected phishing email{phishIncType ? ` (${phishIncType.replace(/_/g," ")})` : ""}
                                </div>
                                {phishSubject && <div style={{ fontSize: 11, color: "#b91c1c", marginTop: 3, fontWeight: 600, wordBreak: "break-word" }}>"{phishSubject}"</div>}
                                {phishFrom && (
                                  <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 9, color: "#52525b" }}>From:</span>
                                    <span style={{ fontSize: 9, color: "#8e8e93", fontFamily: "monospace" }}>{phishFrom}</span>
                                    {phishFromDisp && <span style={{ fontSize: 9, color: "#ea580c" }}>as "{phishFromDisp}"</span>}
                                  </div>
                                )}
                                {phishScore && <span style={{ marginTop: 5, display: "inline-flex", fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "#fef2f2", border: "1px solid #dc262633", color: "#dc2626", fontWeight: 700 }}>Risk {phishScore}/100 — {phishVerdict || "Malicious"}</span>}
                              </div>
                            </div>

                            {/* Step 3: User alerted */}
                            <div style={{ display: "flex", gap: 12 }}>
                              {lastIcon(`${ac.dot}22`, ac.dot, <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke={ac.dot} strokeWidth="1.8"/><path d="M9 12l2 2 4-4" stroke={ac.dot} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
                              <div style={{ paddingBottom: 4, flex: 1 }}>
                                <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>
                                  <span style={{ color: ac.color }}>{ac.label}</span> — Phishing threat flagged
                                </div>
                                <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 3 }}>
                                  SecureLint alerted user to phishing email in {mailClient} inbox. Threat intelligence + AI mail scoring applied.
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      }

                      /* Site phishing flow */
                      const pSiteUrl   = dpv("_psite_url");
                      const pSiteScore = dpv("_psite_score");
                      const pSiteVerdict = dpv("_psite_verdict");
                      const actualSiteUrl = pSiteUrl || pageUrl;
                      return (
                        <>
                          {/* Step 1: User opened new tab and navigated */}
                          <div style={{ display: "flex", gap: 12 }}>
                            {stepIcon("#f0f4fb", "#2563eb", <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#2563eb" strokeWidth="1.8"/><path d="M8 21h8M12 17v4" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/></svg>)}
                            <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedAt}</div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>User opened new browser tab</div>
                              <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>{inc.email}</div>
                              {/* Show actual phishing URL if available, otherwise fallback */}
                              {actualSiteUrl && (
                                <div style={{ marginTop: 5 }}>
                                  <div style={{ fontSize: 9, color: "#a1a1aa", marginBottom: 2 }}>Navigated to</div>
                                  <a href={actualSiteUrl} target="_blank" rel="noopener noreferrer"
                                    style={{ fontSize: 10, color: "#b91c1c", wordBreak: "break-all", textDecoration: "none", display: "flex", alignItems: "flex-start", gap: 4 }}
                                    onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                                    onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                                  >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ marginTop: 1, flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="#b91c1c" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                    {actualSiteUrl}
                                  </a>
                                  {pageTitle && pageTitle !== "New Tab" && <div style={{ fontSize: 9, color: "#a1a1aa", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pageTitle}</div>}
                                </div>
                              )}
                              {biChips}
                            </div>
                          </div>

                          {/* Step 2: Phishing site detected */}
                          <div style={{ display: "flex", gap: 12 }}>
                            {stepIcon("#fef2f2", "#dc2626", <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="1.6"/></svg>)}
                            <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#dc2626" }}>SecureLint v{extVer || "?"} detected phishing site</div>
                              <div style={{ fontSize: 11, color: "#b91c1c", marginTop: 3, wordBreak: "break-all" }}>{actualSiteUrl}</div>
                              <div style={{ marginTop: 5, display: "flex", gap: 5, flexWrap: "wrap" }}>
                                {pSiteScore   && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "#fef2f2", border: "1px solid #dc262633", color: "#dc2626", fontWeight: 700 }}>Score {pSiteScore}/100</span>}
                                {pSiteVerdict && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "#fafafa", border: "1px solid #f4f4f5", color: "#b91c1c", textTransform: "capitalize" }}>{pSiteVerdict}</span>}
                              </div>
                            </div>
                          </div>

                          {/* Step 3: Action taken */}
                          <div style={{ display: "flex", gap: 12 }}>
                            {lastIcon(`${ac.dot}22`, ac.dot, <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke={ac.dot} strokeWidth="1.8"/><path d="M9 12l2 2 4-4" stroke={ac.dot} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
                            <div style={{ paddingBottom: 4, flex: 1 }}>
                              <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>Access <span style={{ color: ac.color }}>{ac.label}</span> by SecureLint WAF</div>
                              <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>Threat intelligence, PhishTank, and AI scoring enforced. User protected from phishing site.</div>
                            </div>
                          </div>
                        </>
                      );
                    }

                    /* ── EXTENSION TIMELINE ── */
                    if (isExtension) {
                      const dExt = (lbl: string) => inc.details.find(x => x.label === lbl)?.value ?? "";
                      const extName      = dExt("_extName")    || inc.preview || "";
                      const extId        = dExt("_extId")      || dExt("Extension ID");
                      const extVersion   = dExt("_extVersion") || dExt("Ext Version");
                      const trigger      = dExt("_extTrigger") || inc.secretType;
                      const cwsUrl       = dExt("_cwsUrl");
                      const riskScore    = dExt("_riskScore");
                      const malCnt       = Number(dExt("_maliciousCnt")  || 0);
                      const susCnt       = Number(dExt("_suspiciousCnt") || 0);
                      const totalExt     = Number(dExt("_totalExts")     || 0);
                      const isBlacklist  = !!cwsUrl || inc.secretType === "Blacklisted Extension Visit";
                      const isMalicious  = malCnt > 0 || inc.secretType === "Malicious Extension" || inc.secretType === "Blacklisted Extension";
                      const step2Color   = isBlacklist ? "#dc2626" : isMalicious ? "#dc2626" : susCnt > 0 ? "#ea580c" : "#7c3aed";
                      const step2Bg      = (isBlacklist || isMalicious) ? "#fef2f2" : "#f3f2f9";
                      const step2Border  = (isBlacklist || isMalicious) ? "#dc2626" : "#7c3aed";

                      /* Clickable CWS link helper */
                      const cwsLink = (id: string, label: string) => (
                        <a href={`https://chromewebstore.google.com/detail/${id}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: "#2563eb", textDecoration: "none", fontFamily: "monospace", fontSize: 9, display: "inline-flex", alignItems: "center", gap: 3 }}
                          onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                          onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                        >
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/></svg>
                          {label}
                        </a>
                      );

                      /* Step-1 context per trigger */
                      const isUninstall  = trigger === "uninstall";
                      const isInstall    = trigger === "install";
                      const isSync       = trigger === "sync";
                      const step1Label   = isBlacklist
                        ? "User navigated to Chrome Web Store"
                        : isUninstall
                          ? "User opened browser Extensions page"
                          : isInstall
                            ? "User visited Chrome Web Store"
                            : "Browser session active";

                      const step2Label = isBlacklist
                        ? "Blacklisted extension detected by SecureLint"
                        : isMalicious
                          ? "Malicious extension identified"
                          : isUninstall
                            ? "User initiated extension removal"
                            : isInstall
                              ? "Extension installation initiated"
                              : isSync
                                ? "Extension inventory scanned by SecureLint"
                                : `Extension ${trigger}`;

                      /* Step-3 outcome label */
                      const step3Heading = isBlacklist
                        ? <><span style={{ color: "#dc2626" }}>Blocked</span> — Extension blacklist policy applied</>
                        : isUninstall
                          ? <><span style={{ color: ac.color }}>Uninstalled</span> — Extension removed from browser</>
                          : isInstall
                            ? <><span style={{ color: ac.color }}>Installed</span> — Extension added to browser profile</>
                            : isSync
                              ? <><span style={{ color: ac.color }}>Synced</span> — Extension inventory updated</>
                              : <>Event <span style={{ color: ac.color }}>{ac.label}</span> recorded</>;

                      const step3Sub = isBlacklist
                        ? `SecureLint v${extVer || "?"} intercepted and blocked the extension visit from Chrome Web Store`
                        : isUninstall
                          ? `${extName || "Extension"} (v${extVersion || "?"}) was removed from Chrome at this time`
                          : isInstall
                            ? `${extName || "Extension"} (v${extVersion || "?"}) successfully installed and logged`
                            : isSync
                              ? `Extension inventory report processed — ${totalExt > 0 ? `${totalExt} extensions` : "policy compliant"}`
                              : `SecureLint recorded the extension event for audit`;

                      return (
                        <>
                          {/* Step 1 — user context */}
                          <div style={{ display: "flex", gap: 12 }}>
                            {stepIcon("#f0f5fa", "#2563eb", <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#2563eb" strokeWidth="1.8"/><path d="M8 21h8M12 17v4" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/></svg>)}
                            <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedAt}</div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>{step1Label}</div>
                              <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>{inc.email}</div>
                              {/* tab URL — clickable for CWS links, plain for chrome:// etc */}
                              {isBlacklist && cwsUrl ? (
                                <div style={{ marginTop: 5 }}>
                                  <div style={{ fontSize: 9, color: "#a1a1aa", marginBottom: 2 }}>Chrome Web Store URL</div>
                                  <a href={cwsUrl} target="_blank" rel="noopener noreferrer"
                                    style={{ fontSize: 10, color: "#2563eb", wordBreak: "break-all", textDecoration: "none", display: "flex", alignItems: "flex-start", gap: 4 }}
                                    onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                                    onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                                  >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ marginTop: 1, flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                    {cwsUrl}
                                  </a>
                                </div>
                              ) : urlBlock}
                              {biChips}
                            </div>
                          </div>

                          {/* Step 2: Extension identified */}
                          <div style={{ display: "flex", gap: 12 }}>
                            {stepIcon(step2Bg, step2Border, <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke={step2Border} strokeWidth="1.6"/><path d="M8 9h8M8 12h8M8 15h5" stroke={step2Border} strokeWidth="1.4" strokeLinecap="round"/></svg>)}
                            <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: step2Color }}>{step2Label}</div>
                              {extName && <div style={{ fontSize: 11, color: (isBlacklist || isMalicious) ? "#b91c1c" : "#7c3aed", marginTop: 3, fontWeight: 600, wordBreak: "break-word" }}>{extName}</div>}
                              {/* Extension ID — clickable CWS link + version chip */}
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                                {extId && cwsLink(extId, extId)}
                                {extVersion && <span style={{ fontSize: 9, color: "#52525b", background: "#fafafa", border: "1px solid #f4f4f5", borderRadius: 20, padding: "1px 6px" }}>v{extVersion}</span>}
                                {riskScore && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 20, background: "#fef2f2", border: "1px solid #dc262633", color: "#dc2626" }}>Risk {riskScore}/100</span>}
                              </div>
                              {/* risk counts for sync */}
                              {isSync && (totalExt > 0 || malCnt > 0 || susCnt > 0) && (
                                <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                                  {totalExt > 0  && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "#f3f2f9", border: "1px solid #4c1d9544", color: "#7c3aed" }}>{totalExt} total</span>}
                                  {malCnt > 0    && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "#fef2f2", border: "1px solid #dc262644", color: "#dc2626", fontWeight: 700 }}>⚠ {malCnt} malicious</span>}
                                  {susCnt > 0    && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "#fbf5ef", border: "1px solid #ea580c44", color: "#ea580c" }}>⚠ {susCnt} suspicious</span>}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Step 3: Outcome */}
                          <div style={{ display: "flex", gap: 12 }}>
                            {lastIcon(`${ac.dot}22`, ac.dot, <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke={ac.dot} strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={ac.dot} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
                            <div style={{ paddingBottom: 4, flex: 1 }}>
                              <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>{step3Heading}</div>
                              <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 3 }}>{step3Sub}</div>
                            </div>
                          </div>
                        </>
                      );
                    }

                    /* ── SECRET DETECTION TIMELINE (default) ── */
                    return (
                      <>
                        {/* Step 1: Browser session */}
                        <div style={{ display: "flex", gap: 12 }}>
                          {stepIcon("#f0f5fa", "#2563eb", <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#2563eb" strokeWidth="1.8"/><path d="M8 21h8M12 17v4" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/></svg>)}
                          <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedAt}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>Browser session active</div>
                            <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>SecureLint monitoring: {inc.email}</div>
                            {urlBlock}
                            {biChips}
                          </div>
                        </div>

                        {/* Step 2: Secret detected */}
                        <div style={{ display: "flex", gap: 12 }}>
                          {stepIcon("#fbf5ef", "#ea580c", <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="8" y="2" width="8" height="4" rx="1" stroke="#ea580c" strokeWidth="1.6"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="#ea580c" strokeWidth="1.6"/><path d="M9 12h6M9 16h4" stroke="#ea580c" strokeWidth="1.6" strokeLinecap="round"/></svg>)}
                          <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>
                              {inc.secretTypes.length > 1 ? `${inc.count} secrets detected — ${inc.secretTypes.length} types` : `${inc.secretType} detected${hasMany ? ` — ${inc.count} occurrences` : ""}`}
                            </div>
                            {hasMany && (
                              <div style={{ marginTop: 8 }}>
                                <div style={{ maxHeight: showAllOccs ? 260 : 130, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
                                  {(showAllOccs ? inc.occurrences : inc.occurrences.slice(0, SHOW_LIMIT)).map((occ, oi) => (
                                    <div key={oi} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", borderRadius: 6, background: "#f7f7f8", border: "1px solid #e4e4e7", flexShrink: 0 }}>
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1h.01c1.71 0 3.1 1.39 3.1 3.1v2z" fill="#ea580c"/></svg>
                                      <span style={{ fontSize: 10, color: "#8e8e93", flexShrink: 0, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{occ.secretType}</span>
                                      <span style={{ fontFamily: "monospace", fontSize: 10, color: "#18181b", flex: 1, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{occ.preview}</span>
                                      <span style={{ fontSize: 9, color: "#52525b", flexShrink: 0, whiteSpace: "nowrap" }}>{occ.detectedTime?.split("·").pop()?.trim() ?? occ.detectedAt}</span>
                                    </div>
                                  ))}
                                </div>
                                {inc.count > SHOW_LIMIT && (
                                  <button onClick={() => setShowAllOccs(v => !v)}
                                    style={{ marginTop: 5, display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 12, border: "1px solid #0d948844", background: "#f0faf8", color: "#0d9488", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                                    {showAllOccs ? "↑ Collapse" : `+${inc.count - SHOW_LIMIT} more occurrences`}
                                  </button>
                                )}
                              </div>
                            )}
                            {!hasMany && <div style={{ fontFamily: "monospace", fontSize: 11, color: "#8e8e93", marginTop: 3, wordBreak: "break-all" }}>{inc.preview}</div>}
                          </div>
                        </div>

                        {/* Step 3: Action */}
                        <div style={{ display: "flex", gap: 12 }}>
                          {lastIcon(`${ac.dot}22`, ac.dot, <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={ac.dot} strokeWidth="1.8"/><path d="M9 12l2 2 4-4" stroke={ac.dot} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
                          <div style={{ paddingBottom: 4 }}>
                            <div style={{ fontSize: 9, color: "#52525b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>Action: <span style={{ color: ac.color }}>{ac.label}</span></div>
                            <div style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>SecureLint Security Policy</div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* ── Base64 screenshot images (if any) ── */}
                {base64Images.length > 0 && (
                  <div style={{ ...card }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#18181b", marginBottom: 10 }}>Evidence Screenshot</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {base64Images.map((src, i) => (
                        <img key={i} src={src} alt={`Evidence ${i + 1}`} style={{ width: "100%", borderRadius: 8, border: "1px solid #fafafa" }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* bottom breathing room */}
                <div style={{ height: 8 }} />
              </div>
            </>
          );
        })()}
      </div>

      {/* Bottom analytics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div style={{ ...cs, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Severity Distribution</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sevBrk.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: "#0a0a0a" }}>{s.name}</span>
                  <span style={{ fontSize: 11, color: "#52525b", fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#f4f4f5", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: PIE_C[i % PIE_C.length], width: `${Math.max(4, (s.value / Math.max(1, filtered.length)) * 100)}%`, transition: "width .4s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...cs, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Action Breakdown</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {statusBrk.map((s, i) => {
              const c = alertStatusConfig[s.name]?.color ?? "#52525b";
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: "#0a0a0a" }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: "#52525b", fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "#f4f4f5", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, background: c, width: `${Math.max(4, (s.value / Math.max(1, filtered.length)) * 100)}%`, transition: "width .4s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ ...cs, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Incident Timeline</div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={trendData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "#e9e9ec" }}
                contentStyle={{ background: "#f4f4f5", border: "1px solid #e9e9ec", borderRadius: 8, fontSize: 11, color: "#0a0a0a", padding: "6px 10px" }}
                itemStyle={{ color: "#0d9488" }}
                formatter={(v: unknown) => [`${v}`, "Incidents"]}
              />
              <Bar dataKey="count" fill="#0d9488" radius={[3, 3, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
