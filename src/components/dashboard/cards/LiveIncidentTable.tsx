"use client";
import { useMemo } from "react";
import { SecretBrandIcon } from "@/lib/secretIcons";
import { LazyCard } from "@/components/dashboard/CardLoader";

export interface RawIncident {
  id?: number | string;
  secret_type?: string;
  severity?: string;
  action?: string;
  timestamp?: string;
  browser_id?: string;
  user_email?: string;
  tab_url?: string;
  tab_title?: string;
}

interface Props {
  incidents?: RawIncident[];
  loading?:   boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function threatName(raw: RawIncident): string {
  const st = (raw.secret_type ?? "").toLowerCase();
  if (st === "url_visit" || st === "phishing") return "Phishing Page Blocked";
  if (st === "email_recipient")               return "Email DLP Alert";
  const label = (raw.secret_type ?? "UNKNOWN").replace(/_/g, " ");
  // Capitalise first word for readability
  return label.charAt(0) + label.slice(1).toLowerCase() + " Detected";
}

function shortDevice(browserId?: string): string {
  if (!browserId || browserId === "unknown") return "—";
  return browserId.slice(0, 10) + (browserId.length > 10 ? "…" : "");
}

function relativeTime(ts?: string): string {
  if (!ts) return "—";
  try {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60_000);
    if (m < 1)  return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return "—"; }
}

// action → status label + style
function statusFor(action?: string, severity?: string): { label: string; color: string; bg: string; border: string } {
  const a = (action ?? "").toLowerCase();
  const s = (severity ?? "").toLowerCase();
  if (a === "blocked") return { label: "Blocked",     color: "#dc2626", bg: "#fef2f2", border: "#fecaca" };
  if (a === "masked")  return { label: "Masked",      color: "#2563eb", bg: "#f0f4fb", border: "#1d4ed8" };
  if (a === "flagged") return { label: "Flagged",     color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
  if (a === "allowed" && s !== "critical" && s !== "high")
                       return { label: "Safe",        color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" };
  return               { label: "Warning",            color: "#fb923c", bg: "#fef4ed", border: "#fed7aa" };
}

// severity → badge style
const SEV_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  high:     { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  medium:   { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  low:      { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
};

// ── Shimmer skeleton ──────────────────────────────────────────────────────────
const sk = (w: number | string, h: number, r = 5): React.CSSProperties => ({
  width: w, height: h, borderRadius: r, background: "#e9e9ec",
  animation: "sk-pulse 1.4s ease-in-out infinite", display: "inline-block",
});

const COL_HDR: React.CSSProperties = {
  padding: "8px 10px", fontSize: 10, fontWeight: 700,
  color: "#8e8e93", textTransform: "uppercase", letterSpacing: "0.06em",
  borderBottom: "1px solid #e9e9ec", whiteSpace: "nowrap",
};

export default function LiveIncidentTable({ incidents, loading }: Props = {}) {
  const rows = useMemo(() => {
    const seenType = new Set<string>();
    const unique: RawIncident[] = [];
    for (const inc of (incidents ?? [])) {
      // One row per secret_type — keeps the most recent occurrence (API is ordered desc)
      const key = (inc.secret_type ?? "UNKNOWN").toLowerCase();
      if (!seenType.has(key)) { seenType.add(key); unique.push(inc); }
      if (unique.length === 5) break;
    }
    return unique;
  }, [incidents]);

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e9e9ec", borderRadius: 14, overflow: "hidden" }}>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>
      <LazyCard delay={300}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          background: "linear-gradient(135deg,#fafafa 0%,#f4f4f5 100%)",
          borderBottom: "1px solid #e9e9ec",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="card-title">Live Incident Table</span>
            {!loading && rows.length > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#f0fdf4", color: "#16a34a", border: "1px solid #16a34a22" }}>
                {rows.length} incidents
              </span>
            )}
          </div>
          <span style={{ color: "#a1a1aa", cursor: "pointer", fontSize: 18 }}>···</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", minWidth: 560 }}>
            <thead>
              <tr>
                <th style={{ ...COL_HDR, paddingLeft: 20 }}>Threat</th>
                <th style={COL_HDR}>Severity</th>
                <th style={COL_HDR}>Device ID</th>
                <th style={COL_HDR}>Time</th>
                <th style={{ ...COL_HDR, textAlign: "right", paddingRight: 20 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e9e9ec" }}>
                      <td style={{ padding: "14px 10px 14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={sk(32, 32, 8)} />
                          <div style={sk("120px", 11)} />
                        </div>
                      </td>
                      <td style={{ padding: "14px 10px" }}><div style={sk(60, 20, 10)} /></td>
                      <td style={{ padding: "14px 10px" }}><div style={sk(80, 10)} /></td>
                      <td style={{ padding: "14px 10px" }}><div style={sk(50, 10)} /></td>
                      <td style={{ padding: "14px 20px 14px 10px", textAlign: "right" }}><div style={{ ...sk(70, 20, 10), marginLeft: "auto" }} /></td>
                    </tr>
                  ))
                : rows.length === 0
                ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", color: "#8e8e93", fontSize: 13 }}>
                        No incidents found
                      </td>
                    </tr>
                  )
                : rows.map((inc, i) => {
                    const sev = SEV_STYLE[(inc.severity ?? "").toLowerCase()] ?? SEV_STYLE.low;
                    const sts = statusFor(inc.action, inc.severity);
                    return (
                      <tr key={inc.id ?? i} style={{ borderBottom: i < rows.length - 1 ? "1px solid #e9e9ec" : "none" }}>
                        {/* Threat name + icon */}
                        <td style={{ padding: "12px 10px 12px 20px", maxWidth: 240 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fafafa", border: "1px solid #e9e9ec", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <SecretBrandIcon secretType={inc.secret_type ?? ""} size={20} />
                            </div>
                            <span style={{ color: "#0a0a0a", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {threatName(inc)}
                            </span>
                          </div>
                        </td>

                        {/* Severity badge */}
                        <td style={{ padding: "12px 10px", whiteSpace: "nowrap" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, color: sev.color, background: sev.bg, border: `1px solid ${sev.border}`, textTransform: "capitalize" }}>
                            {inc.severity ?? "—"}
                          </span>
                        </td>

                        {/* Device ID (shortened browser_id) */}
                        <td style={{ padding: "12px 10px", color: "#52525b", fontFamily: "monospace", fontSize: 11 }}>
                          {shortDevice(inc.browser_id)}
                        </td>

                        {/* Relative time */}
                        <td style={{ padding: "12px 10px", color: "#8e8e93", whiteSpace: "nowrap" }}>
                          {relativeTime(inc.timestamp)}
                        </td>

                        {/* Status badge */}
                        <td style={{ padding: "12px 20px 12px 10px", textAlign: "right", whiteSpace: "nowrap" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20, color: sts.color, background: sts.bg, border: `1px solid ${sts.border}` }}>
                            {sts.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </LazyCard>
    </div>
  );
}
