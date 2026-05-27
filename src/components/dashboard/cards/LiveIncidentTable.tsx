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
  if (a === "blocked") return { label: "Blocked",     color: "#ef4444", bg: "#2d0a0a", border: "#7f1d1d" };
  if (a === "masked")  return { label: "Masked",      color: "#60a5fa", bg: "#0d1b2e", border: "#1d4ed8" };
  if (a === "flagged") return { label: "Flagged",     color: "#f59e0b", bg: "#2d1a00", border: "#78350f" };
  if (a === "allowed" && s !== "critical" && s !== "high")
                       return { label: "Safe",        color: "#4ade80", bg: "#0d2b17", border: "#166534" };
  return               { label: "Warning",            color: "#fb923c", bg: "#2d1200", border: "#7c2d12" };
}

// severity → badge style
const SEV_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: "#ef4444", bg: "#2d0a0a", border: "#7f1d1d" },
  high:     { color: "#f97316", bg: "#2c1200", border: "#7c2d12" },
  medium:   { color: "#f59e0b", bg: "#2d1a00", border: "#78350f" },
  low:      { color: "#4ade80", bg: "#0d2b17", border: "#166534" },
};

// ── Shimmer skeleton ──────────────────────────────────────────────────────────
const sk = (w: number | string, h: number, r = 5): React.CSSProperties => ({
  width: w, height: h, borderRadius: r, background: "#1b222c",
  animation: "sk-pulse 1.4s ease-in-out infinite", display: "inline-block",
});

const COL_HDR: React.CSSProperties = {
  padding: "8px 10px", fontSize: 10, fontWeight: 700,
  color: "#6e7681", textTransform: "uppercase", letterSpacing: "0.06em",
  borderBottom: "1px solid #21262d", whiteSpace: "nowrap",
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
    <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 14, overflow: "hidden" }}>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>
      <LazyCard delay={300}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          background: "linear-gradient(135deg,#0f1923 0%,#162230 100%)",
          borderBottom: "1px solid #21262d",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="card-title">Live Incident Table</span>
            {!loading && rows.length > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#0f2318", color: "#4ade80", border: "1px solid #4ade8022" }}>
                {rows.length} incidents
              </span>
            )}
          </div>
          <span style={{ color: "#4a5568", cursor: "pointer", fontSize: 18 }}>···</span>
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
                    <tr key={i} style={{ borderBottom: "1px solid #21262d" }}>
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
                      <td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", color: "#6e7681", fontSize: 13 }}>
                        No incidents found
                      </td>
                    </tr>
                  )
                : rows.map((inc, i) => {
                    const sev = SEV_STYLE[(inc.severity ?? "").toLowerCase()] ?? SEV_STYLE.low;
                    const sts = statusFor(inc.action, inc.severity);
                    return (
                      <tr key={inc.id ?? i} style={{ borderBottom: i < rows.length - 1 ? "1px solid #21262d" : "none" }}>
                        {/* Threat name + icon */}
                        <td style={{ padding: "12px 10px 12px 20px", maxWidth: 240 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0d1218", border: "1px solid #252d38", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <SecretBrandIcon secretType={inc.secret_type ?? ""} size={20} />
                            </div>
                            <span style={{ color: "#e6edf3", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                        <td style={{ padding: "12px 10px", color: "#8b949e", fontFamily: "monospace", fontSize: 11 }}>
                          {shortDevice(inc.browser_id)}
                        </td>

                        {/* Relative time */}
                        <td style={{ padding: "12px 10px", color: "#6e7681", whiteSpace: "nowrap" }}>
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
