"use client";
import { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";
import { LazyCard } from "@/components/dashboard/CardLoader";
import { SecretBrandIcon } from "@/lib/secretIcons";
import { fetchSecretScanner, fetchCharts } from "@/lib/adminApi";

// ── Styles ────────────────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = { background: "#ffffff", border: "1px solid #e9e9ec", borderRadius: 14 };
const subTitle:  React.CSSProperties = { fontSize: 12, color: "#52525b", marginBottom: 6, fontWeight: 600 };
const tooltipStyle = { background: "#f4f4f5", border: "1px solid #dcdce0", borderRadius: 8, color: "#0a0a0a", fontSize: 11 };

const SEV: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  high:     { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  medium:   { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  low:      { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
};

const ACT: Record<string, { label: string; color: string; bg: string; border: string }> = {
  blocked: { label: "Blocked",   color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  masked:  { label: "Protected", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  allowed: { label: "Safe",      color: "#2563eb", bg: "#f0f4fb", border: "#1d4ed8" },
  flagged: { label: "Review",    color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function shortUrl(url?: string): string {
  if (!url) return "—";
  try {
    const u = new URL(url);
    return u.hostname || url.slice(0, 32);
  } catch { return url.slice(0, 32); }
}

function relTime(ts?: string): string {
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

// Skeleton helper
const sk = (w: number | string, h: number, r = 5): React.CSSProperties => ({
  width: w, height: h, borderRadius: r, background: "#e9e9ec",
  animation: "sk-pulse 1.4s ease-in-out infinite", display: "inline-block",
});

function CardHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 12px" }}>
        <span className="card-title">{title}</span>
        {right ?? <span style={{ color: "#a1a1aa", cursor: "pointer", fontSize: 18 }}>···</span>}
      </div>
      <div style={{ height: 1, background: "#e9e9ec", marginBottom: 14 }} />
    </div>
  );
}

function GaugeMeter({ pct = 78 }: { pct?: number }) {
  const a  = -180 + (pct / 100) * 180;
  const r  = (a * Math.PI) / 180;
  const nx = 60 + 40 * Math.cos(r);
  const ny = 60 + 40 * Math.sin(r);
  const c  = pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626";
  return (
    <svg viewBox="0 0 120 75" width="100" height="62">
      <defs>
        <linearGradient id="ssGauge" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#dc2626"/><stop offset="50%" stopColor="#d97706"/>
          <stop offset="100%" stopColor="#16a34a"/>
        </linearGradient>
      </defs>
      <path d="M12 60 A48 48 0 0 1 108 60" fill="none" stroke="#1a2030" strokeWidth="10" strokeLinecap="round"/>
      <path d="M12 60 A48 48 0 0 1 108 60" fill="none" stroke="url(#ssGauge)" strokeWidth="10" strokeLinecap="round"/>
      <line x1="60" y1="60" x2={nx} y2={ny} stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="60" cy="60" r="4" fill="#d1d5db"/><circle cx="60" cy="60" r="2" fill="#ffffff"/>
      <text x="60" y="73" textAnchor="middle" fill="#52525b" fontSize="9" fontWeight="600">{pct}%</text>
    </svg>
  );
}

const FALLBACK_KEYS = ["AWS_SECRET_ACCESS_KEY", "STRIPE_SECRET_KEY", "JWT_SECRET"];

function buildCodeLines(byType: Record<string, number>) {
  const keys = Object.keys(byType).slice(0, 4);
  const useKeys = keys.length >= 2 ? keys : FALLBACK_KEYS;
  let n = 1;
  const lines: { n: number; text?: string; key?: string; masked?: boolean; color?: string }[] = [
    { n: n++, text: "const config = { /* enterprise */ };", color: "#71717a" },
    { n: n++, text: "// SecureLint scan — detected secrets", color: "#71717a" },
  ];
  useKeys.forEach((k, i) => {
    lines.push({ n: n++, text: `// ${k.replace(/_/g, " ").toLowerCase()}`, color: "#71717a" });
    lines.push({ n: n++, key: `${k}=`, masked: true });
    if (i < useKeys.length - 1) lines.push({ n: n++, text: "", color: "#71717a" });
  });
  lines.push({ n: n++, text: "", color: "#71717a" });
  lines.push({ n: n++, text: "// AI autosec active", color: "#71717a" });
  lines.push({ n: n++, text: "void_secure(access, context);", color: "#18181b" });
  return lines;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SecretScannerPage() {
  const [raw,       setRaw]       = useState<Record<string, unknown> | null>(null);
  const [trendData, setTrendData] = useState<Record<string, unknown>[]>([]);
  const [riskData,  setRiskData]  = useState<Record<string, unknown>[]>([]);
  const [repoData,  setRepoData]  = useState<Record<string, unknown>[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchSecretScanner().then((d) => setRaw(d as Record<string, unknown> | null)).catch(() => {}),
      fetchCharts().then((d) => {
        const ss = (d as Record<string, unknown> | null)?.secret_scanner as Record<string, unknown> | undefined;
        if (ss?.trend_data) setTrendData(ss.trend_data as Record<string, unknown>[]);
        if (ss?.risk_data)  setRiskData(ss.risk_data   as Record<string, unknown>[]);
        if (ss?.repo_data)  setRepoData(ss.repo_data   as Record<string, unknown>[]);
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  // ── Derive table rows from raw.recent (deduplicate by secret_type) ──────────
  const tableRows = useMemo(() => {
    const recent = (raw?.recent as Record<string, unknown>[] | undefined) ?? [];
    const seen   = new Set<string>();
    const out: Record<string, unknown>[] = [];
    for (const inc of recent) {
      const key = String(inc.secret_type ?? "UNKNOWN").toLowerCase();
      if (!seen.has(key)) { seen.add(key); out.push(inc); }
      if (out.length === 5) break;
    }
    return out;
  }, [raw]);

  // ── Stats ────────────────────────────────────────────────────────────────────
  const bySev        = (raw?.by_severity as Record<string, number>) ?? {};
  const byType       = (raw?.by_type     as Record<string, number>) ?? {};
  const totalSecrets = Number(raw?.total_secrets ?? 0);

  /**
   * Security Score (0–100) — same logic as live threats risk score, inverted.
   * Uses action counts from recent incidents:
   *   blocked/masked → fully secured (no risk contribution)
   *   allowed        → low residual risk (weight 0.15)
   *   flagged        → unresolved (weight 1.0)
   * score = 100 - riskPct
   */
  const securityScore = (() => {
    // No data yet — show a neutral baseline rather than 0
    if (!raw) return 85;
    const recent = (raw.recent as Record<string, unknown>[] | undefined) ?? [];
    if (recent.length === 0) return 85;

    let blocked = 0, masked = 0, allowed = 0, flagged = 0;
    for (const inc of recent) {
      const a = String(inc.action ?? "").toLowerCase();
      if (a === "blocked") blocked++;
      else if (a === "masked") masked++;
      else if (a === "allowed") allowed++;
      else flagged++;
    }
    const total = blocked + masked + allowed + flagged || 1;
    // blocked/masked = fully mitigated (0 risk), allowed = low residual (0.15), flagged = unresolved (1.0)
    const weightedUnresolved = (allowed * 0.15 + flagged * 1.0) / total;

    const c = bySev.critical ?? 0;
    const h = bySev.high     ?? 0;
    const m = bySev.medium   ?? 0;
    const l = bySev.low      ?? 0;
    // Normalise against total incidents so a large volume doesn't auto-push to 100
    const totalInc = c + h + m + l || 1;
    const sevWeight = Math.min(90, Math.round(((c * 4 + h * 2 + m * 1 + l * 0.25) / (totalInc * 4)) * 100));
    const riskPct   = Math.min(90, Math.round(sevWeight * weightedUnresolved));
    // Floor at 10 so the gauge never fully bottoms out
    return Math.max(10, 100 - riskPct);
  })();

  const codeLines = useMemo(() => buildCodeLines(byType), [byType]);

  const stats = [
    { label: "Total Secrets Found", val: String(totalSecrets),        accent: "#dc2626" },
    { label: "Critical",            val: String(bySev.critical ?? 0), accent: "#dc2626" },
    { label: "High",                val: String(bySev.high     ?? 0), accent: "#ea580c" },
    { label: "Medium",              val: String(bySev.medium   ?? 0), accent: "#d97706" },
    { label: "Low",                 val: String(bySev.low      ?? 0), accent: "#16a34a" },
  ];

  // ── Chart fallbacks ──────────────────────────────────────────────────────────
  const trend = trendData.length > 0 ? trendData
    : (raw?.daily_trend as Record<string, unknown>[] | undefined)?.slice(-6).map((d) => ({ m: String(d.date ?? "").slice(5), v: d.count }))
    ?? [{ m: "—", v: 0 }];

  const risk  = riskData.length > 0 ? riskData : trend;
  const repo  = repoData.length > 0 ? repoData
    : Object.entries(byType).slice(0, 6).map(([k, v]) => ({ t: k.slice(0, 4), v }));

  // ── AI Remediation — from action breakdown ────────────────────────────────
  const dailyTrend  = raw?.daily_trend as Record<string, unknown>[] | undefined;
  const lastDay     = dailyTrend?.at(-1);
  const topEntry = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
  const remItems = raw ? [
    { icon: "🛡️", text: `${totalSecrets} secrets detected and processed` },
    { icon: "✅", text: `${raw.top_users ? (raw.top_users as Record<string, unknown>[]).length : 0} employees actively protected` },
    { icon: "🔍", text: `Top type: ${topEntry ? topEntry[0].replace(/_/g, " ") : "N/A"} (${topEntry?.[1] ?? 0} incidents)` },
    { icon: "📅", text: lastDay ? `${lastDay.count} detections on ${String(lastDay.date ?? "").slice(5)}` : "No recent activity" },
  ] : [
    { icon: "🔄", text: "Loading remediation data…" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1400 }}>
      <style>{`
        @keyframes sk-pulse{0%,100%{opacity:.4}50%{opacity:.9}}
        @keyframes codeScanLine{0%{top:0%}50%{top:85%}100%{top:0%}}
        @keyframes maskPulse{0%,100%{box-shadow:0 0 8px rgba(22,163,74,0.14),inset 0 0 6px rgba(22,163,74,0.14);opacity:.85}50%{box-shadow:0 0 18px rgba(22,163,74,0.14),inset 0 0 12px rgba(22,163,74,0.14);opacity:1}}
      `}</style>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 660, color: "#0a0a0a", letterSpacing: "-0.028em", margin: 0 }}>Secret Scanner</h2>
          <p style={{ fontSize: 14, color: "#52525b", marginTop: 6 }}>Detect exposed secrets, API keys, tokens, and credentials across all employee activity.</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0, marginTop: 4 }}>
          <button className="dash-btn-primary">Run Deep Scan</button>
          <button className="dash-btn-ghost">Export Report</button>
        </div>
      </div>

      {/* Row 1: Table + Code preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2" style={{ ...cardStyle, padding: "18px 20px 20px", overflow: "hidden" }}>
          <LazyCard delay={300}>
            <CardHeader title="Secret Detection Table" right={
              !loading && totalSecrets > 0
                ? <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 10, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>{totalSecrets} found</span>
                : undefined
            }/>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", minWidth: 480 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e9e9ec" }}>
                    {["Secret Type", "Location", "Severity", "Detected", "Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 8px 10px 0", color: "#8e8e93", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #e9e9ec" }}>
                          <td style={{ padding: "12px 8px 12px 0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={sk(28, 28, 6)} />
                              <div style={sk(100, 10)} />
                            </div>
                          </td>
                          <td style={{ padding: "12px 8px 12px 0" }}><div style={sk(90, 9)} /></td>
                          <td style={{ padding: "12px 8px 12px 0" }}><div style={sk(56, 20, 10)} /></td>
                          <td style={{ padding: "12px 8px 12px 0" }}><div style={sk(48, 9)} /></td>
                          <td style={{ padding: "12px 0" }}><div style={sk(60, 20, 10)} /></td>
                        </tr>
                      ))
                    : tableRows.length === 0
                    ? <tr><td colSpan={5} style={{ padding: "32px 0", textAlign: "center", color: "#8e8e93" }}>No secrets found</td></tr>
                    : tableRows.map((inc, i) => {
                        const sev = SEV[(String(inc.severity ?? "")).toLowerCase()] ?? SEV.low;
                        const act = ACT[(String(inc.action ?? "")).toLowerCase()] ?? { label: "Detected", color: "#52525b", bg: "#f4f4f5", border: "#dcdce0" };
                        return (
                          <tr key={i} style={{ borderBottom: i < tableRows.length - 1 ? "1px solid #e9e9ec" : "none" }}>
                            <td style={{ padding: "12px 8px 12px 0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 7, background: "#fafafa", border: "1px solid #e9e9ec", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <SecretBrandIcon secretType={String(inc.secret_type ?? "")} size={18} />
                                </div>
                                <span style={{ color: "#0a0a0a", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                                  {String(inc.secret_type ?? "").replace(/_/g, " ")}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "12px 8px 12px 0", color: "#52525b", fontFamily: "monospace", fontSize: 10, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {shortUrl(String(inc.tab_url ?? ""))}
                            </td>
                            <td style={{ padding: "12px 8px 12px 0" }}>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, color: sev.color, background: sev.bg, border: `1px solid ${sev.border}`, textTransform: "capitalize" }}>
                                {String(inc.severity ?? "—")}
                              </span>
                            </td>
                            <td style={{ padding: "12px 8px 12px 0", color: "#8e8e93", whiteSpace: "nowrap" }}>{relTime(String(inc.timestamp ?? ""))}</td>
                            <td style={{ padding: "12px 0" }}>
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, color: act.color, background: act.bg, border: `1px solid ${act.border}` }}>
                                {act.label}
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

        {/* Code scanning preview (decorative) */}
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          <LazyCard delay={500}>
            <div style={{ padding: "18px 20px 0" }}>
              <CardHeader title="Code Scanning Preview" />
            </div>
            <div style={{ background: "#f2f5f9", position: "relative" }}>
              <div style={{ display: "flex", gap: 6, padding: "10px 14px", borderBottom: "1px solid #e9e9ec" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              </div>
              <div style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, right: 0, height: 2, zIndex: 2, background: "linear-gradient(90deg,transparent 0%,#16a34a 30%,#0d9488 50%,#16a34a 70%,transparent 100%)", boxShadow: "0 0 12px rgba(22,163,74,0.14)", animation: "codeScanLine 4s ease-in-out infinite" }} />
                <div style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 11, lineHeight: 1.8, maxHeight: 240, overflowY: "auto" }}>
                  {codeLines.map((line, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <span style={{ width: 20, textAlign: "right", color: "#a1a1aa", flexShrink: 0 }}>{line.n}</span>
                      <span style={{ color: "#a1a1aa", flexShrink: 0 }}>│</span>
                      <span>
                        {line.masked ? (
                          <>
                            <span style={{ color: "#0a0a0a", fontWeight: 600 }}>{line.key}</span>
                            <span style={{ display: "inline-block", padding: "2px 20px", borderRadius: 4, marginLeft: 2, background: "rgba(22,163,74,0.14)", border: "1px solid rgba(22,163,74,0.14)", color: "rgba(22,163,74,0.14)", fontSize: 10, letterSpacing: 1, animation: "maskPulse 3s ease-in-out infinite" }}>██████████████</span>
                            <span style={{ marginLeft: 6, color: "#16a34a", fontSize: 12 }}>⇩</span>
                          </>
                        ) : (
                          <span style={{ color: (line as { color?: string }).color ?? "#52525b" }}>{(line as { text?: string }).text}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </LazyCard>
        </div>
      </div>

      {/* Row 2: Charts + AI Remediation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2" style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={600}>
            <CardHeader title="Secret Scan Analytics" />
            <div style={{ display: "flex", gap: 0 }}>
              {/* Secrets over time */}
              <div style={{ flex: 1, paddingRight: 16 }}>
                <div style={subTitle}>Secrets detected</div>
                {loading ? <div style={sk("100%", 70, 6)} /> : (
                  <ResponsiveContainer width="100%" height={70}>
                    <AreaChart data={trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs><linearGradient id="ss-g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/><stop offset="95%" stopColor="#16a34a" stopOpacity={0}/></linearGradient></defs>
                      <Area type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={1.5} fill="url(#ss-g1)" dot={false}/>
                      <XAxis dataKey="m" tick={{ fill: "#71717a", fontSize: 8 }} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#dcdce0" }} formatter={(v: unknown) => [`${v}`, "Secrets"]}/>
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div style={{ width: 1, background: "#e9e9ec", flexShrink: 0 }} />
              {/* Risk trend */}
              <div style={{ flex: 1, padding: "0 16px" }}>
                <div style={subTitle}>Risk trend</div>
                {loading ? <div style={sk("100%", 70, 6)} /> : (
                  <ResponsiveContainer width="100%" height={70}>
                    <AreaChart data={risk} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs><linearGradient id="ss-g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/><stop offset="95%" stopColor="#ea580c" stopOpacity={0}/></linearGradient></defs>
                      <Area type="monotone" dataKey="v" stroke="#ea580c" strokeWidth={1.5} fill="url(#ss-g2)" dot={false}/>
                      <XAxis dataKey="m" tick={{ fill: "#71717a", fontSize: 8 }} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#dcdce0" }} formatter={(v: unknown) => [`${v}`, "Risk"]}/>
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div style={{ width: 1, background: "#e9e9ec", flexShrink: 0 }} />
              {/* Type exposure */}
              <div style={{ flex: 1, padding: "0 16px" }}>
                <div style={subTitle}>By secret type</div>
                {loading ? <div style={sk("100%", 70, 6)} /> : (
                  <ResponsiveContainer width="100%" height={70}>
                    <LineChart data={repo} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <XAxis dataKey="t" tick={{ fill: "#71717a", fontSize: 8 }} axisLine={false} tickLine={false}/>
                      <YAxis hide/>
                      <Line type="monotone" dataKey="v" stroke="#0d9488" strokeWidth={1.5} dot={{ r: 2, fill: "#0d9488" }} activeDot={{ r: 3 }}/>
                      <Tooltip cursor={{ stroke: "#dcdce0" }} contentStyle={tooltipStyle} formatter={(v: unknown) => [`${v}`, "Count"]}/>
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div style={{ width: 1, background: "#e9e9ec", flexShrink: 0 }} />
              {/* Security score gauge */}
              <div style={{ flex: 1, paddingLeft: 16 }}>
                <div style={subTitle}>Security score</div>
                {loading
                  ? <div style={{ ...sk(100, 62, 8), margin: "4px auto" }} />
                  : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 70 }}><GaugeMeter pct={securityScore} /></div>
                }
              </div>
            </div>
          </LazyCard>
        </div>

        {/* AI Remediation — real data */}
        <div style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={700}>
            <CardHeader title="AI Remediation Panel" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={sk(24, 24, 6)} /><div style={sk("75%", 10)} />
                    </div>
                  ))
                : remItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#0a0a0a" }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ lineHeight: 1.4 }}>{item.text}</span>
                    </div>
                  ))
              }
            </div>
          </LazyCard>
        </div>
      </div>

      {/* Row 3: Stats + Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2" style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={800}>
            <CardHeader title="Repository Security Status" />
            <div style={{ display: "flex", gap: 0 }}>
              {stats.map((m, i) => (
                <div key={i} style={{ flex: 1, padding: "0 14px", borderLeft: i > 0 ? "1px solid #e9e9ec" : "none" }}>
                  {loading ? (
                    <><div style={sk("60%", 22, 4)} /><div style={{ ...sk("80%", 9, 3), marginTop: 8 }} /></>
                  ) : (
                    <>
                      <div style={{ fontSize: 22, fontWeight: 800, color: m.accent, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.val}</div>
                      <div style={{ fontSize: 10, color: "#52525b", marginTop: 5 }}>{m.label}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </LazyCard>
        </div>

        <div style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={900}>
            <CardHeader title="Cloud & Dev Integrations" right={
              <span style={{ fontSize: 10, fontWeight: 700, background: "#f2f8f5", color: "#16a34a", padding: "3px 10px", borderRadius: 20, border: "1px solid #16a34a44" }}>Active</span>
            }/>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { icon: "🐙", label: "GitHub" }, { icon: "🦊", label: "GitLab" },
                { icon: "☁️", label: "AWS" },    { icon: "🐳", label: "Docker" },
                { icon: "💬", label: "Slack" },  { icon: "▲",  label: "Vercel" },
              ].map((int) => (
                <div key={int.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 44 }}>
                  <span style={{ fontSize: 22, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f5", borderRadius: 10, border: "1px solid #e9e9ec" }}>{int.icon}</span>
                  <span style={{ fontSize: 9, color: "#52525b" }}>{int.label}</span>
                </div>
              ))}
            </div>
          </LazyCard>
        </div>
      </div>
    </div>
  );
}
