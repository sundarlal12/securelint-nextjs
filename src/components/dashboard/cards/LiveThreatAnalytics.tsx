"use client";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { LazyCard } from "@/components/dashboard/CardLoader";

type DataPoint = Record<string, unknown>;

interface Props {
  weekActivity?:      DataPoint[];
  hubWeekly?:         DataPoint[];
  severityBreakdown?: Record<string, number>; // {critical,high,medium,low} counts
  actionBreakdown?:   Record<string, number>; // {blocked,masked,allowed,flagged} counts
  loading?:           boolean;
}

const sk = (w: number | string, h: number, r = 5): React.CSSProperties => ({
  width: w, height: h, borderRadius: r, background: "#1b222c",
  animation: "sk-pulse 1.4s ease-in-out infinite",
});

const tooltipStyle = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, color: "#e6edf3", fontSize: 11 };
const barCursor    = { fill: "rgba(255,255,255,0.05)" };
const itemStyle    = { color: "#e6edf3" };
const labelStyle   = { color: "#c9d1d9", fontWeight: 700 };

const subTitle: React.CSSProperties = { fontSize: 12, color: "#c9d1d9", marginBottom: 8, fontWeight: 700 };

function GaugeMeter({ pct = 62 }: { pct?: number }) {
  // pct 0–100 maps to 0–180 degrees sweep
  const angle = -180 + (pct / 100) * 180;
  const rad   = (angle * Math.PI) / 180;
  const nx    = 90 + 58 * Math.cos(rad);
  const ny    = 90 + 58 * Math.sin(rad);
  const color = pct < 35 ? "#4ade80" : pct < 65 ? "#f59e0b" : "#ef4444";
  return (
    <svg viewBox="0 0 180 110" width="160" height="100">
      <defs>
        <linearGradient id="gArc2" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor="#4ade80" />
          <stop offset="40%"  stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="#1a2030" strokeWidth="16" strokeLinecap="round"/>
      <path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="url(#gArc2)" strokeWidth="16" strokeLinecap="round"/>
      <line x1="90" y1="90" x2={nx} y2={ny} stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="90" cy="90" r="6" fill="#d1d5db"/>
      <circle cx="90" cy="90" r="3" fill="#0d1117"/>
      <text x="90" y="106" textAnchor="middle" fill="#8b949e" fontSize="11" fontWeight="600">{pct}%</text>
    </svg>
  );
}

export default function LiveThreatAnalytics({ weekActivity, hubWeekly, severityBreakdown, actionBreakdown, loading }: Props = {}) {
  // Threat trend: derive from weekActivity (Mon-Sun count)
  const trend: DataPoint[] = weekActivity && weekActivity.length > 0
    ? weekActivity.map((d) => ({ t: String(d.n ?? ""), v: Number(d.v ?? 0) }))
    : [
        { t: "Mon", v: 5 }, { t: "Tue", v: 12 }, { t: "Wed", v: 8 },
        { t: "Thu", v: 15 }, { t: "Fri", v: 10 }, { t: "Sat", v: 4 }, { t: "Sun", v: 7 },
      ];

  // Attack frequency: use hub_weekly stacked (secrets+phishing+dlp per day)
  const freqData: DataPoint[] = hubWeekly && hubWeekly.length > 0
    ? hubWeekly.map((d) => ({
        d: String(d.day ?? ""),
        v: Number(d.secrets ?? 0) + Number(d.phishing ?? 0) + Number(d.dlp ?? 0),
      }))
    : [
        { d: "Mon", v: 6 }, { d: "Tue", v: 4 }, { d: "Wed", v: 9 },
        { d: "Thu", v: 5 }, { d: "Fri", v: 8 }, { d: "Sat", v: 2 }, { d: "Sun", v: 3 },
      ];

  // AI detection: secrets/phishing/dlp split per day from hub_weekly
  const aiData: DataPoint[] = hubWeekly && hubWeekly.length > 0
    ? hubWeekly.map((d) => ({ name: String((d.day as string ?? "").slice(0, 2)), v: Number(d.secrets ?? 0) }))
    : [{ name: "Mo", v: 4 }, { name: "Tu", v: 7 }, { name: "We", v: 3 }, { name: "Th", v: 9 }, { name: "Fr", v: 6 }, { name: "Sa", v: 2 }, { name: "Su", v: 1 }];

  /**
   * Risk Score (0–100)
   *
   * Blocked / masked = SecureLint stopped them → they REDUCE risk.
   * Allowed / flagged = slipped through or unresolved → they ADD risk.
   *
   * Formula:
   *   exposedScore  = unmitigated incidents weighted by severity
   *   protectedRate = (blocked + masked) / total   (0–1)
   *   rawRisk       = exposedScore × (1 − protectedRate)
   *   risk%         = min(100, round(rawRisk / 50 × 100))
   *
   * An org where everything is blocked/masked scores near 0% (secure).
   * An org where nothing is intercepted scores based purely on severity volume.
   */
  const riskPct = (() => {
    const sev = severityBreakdown ?? {};
    const act = actionBreakdown   ?? {};

    const blocked = act.blocked ?? 0;
    const masked  = act.masked  ?? 0;
    const allowed = act.allowed ?? 0;  // safe pass-through — not a risk
    const flagged = act.flagged ?? 0;  // unresolved — contributes to risk
    const total   = blocked + masked + allowed + flagged;

    // If we have real action data, use proper formula
    if (total > 0) {
      // Risk weights per action:
      //   blocked / masked → 0    (fully stopped by SecureLint)
      //   allowed          → 0.15 (passed through — low but non-zero residual risk)
      //   flagged          → 1.0  (unresolved — full risk contribution)
      const weightedUnresolved = (allowed * 0.15 + flagged * 1.0) / total;

      // Severity weight of the full incident set (potential exposure)
      const c = sev.critical ?? 0;
      const h = sev.high     ?? 0;
      const m = sev.medium   ?? 0;
      const l = sev.low      ?? 0;
      const severityWeight = Math.min(100, Math.round(((c * 4 + h * 2 + m * 1 + l * 0.25) / 50) * 100));

      // Final: severity × weighted-unresolved fraction
      // If only allowed (no flagged) → risk = severityWeight × 0.15 → roughly 10–20%
      return Math.min(100, Math.round(severityWeight * weightedUnresolved));
    }

    // No action data yet — assume low baseline risk proportional to volume
    const vol = freqData.reduce((s, d) => s + Number(d.v), 0);
    return Math.min(25, Math.round((vol / 70) * 25));   // cap at 25% when data missing
  })();

  return (
    <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 14, padding: "18px 20px 20px", height: "100%", display: "flex", flexDirection: "column" }}>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>
      <LazyCard delay={600}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span className="card-title">Threat Analytics</span>
          <span style={{ color: "#4a5568", cursor: "pointer", fontSize: 18 }}>···</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px", flex: 1 }}>

          {/* Threat trend (Mon-Sun area) */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={subTitle}>Threat trend</div>
            {loading ? <div style={sk("100%", 95, 6)} /> : (
              <div style={{ flex: 1, minHeight: 95 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ltTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#2dd4bf" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="t" tick={{ fill: "#6b7280", fontSize: 8 }} axisLine={false} tickLine={false} interval={0}/>
                    <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={labelStyle} formatter={(v: unknown) => [`${v} incidents`, "Threats"]}/>
                    <Area type="monotone" dataKey="v" stroke="#2dd4bf" strokeWidth={2} fill="url(#ltTrend)" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* AI detection (secrets per day) */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={subTitle}>AI detection</div>
            {loading ? <div style={sk("100%", 95, 6)} /> : (
              <div style={{ flex: 1, minHeight: 95 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aiData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 8 }} axisLine={false} tickLine={false} interval={0}/>
                    <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false}/>
                    <Tooltip cursor={barCursor} contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={labelStyle} formatter={(v: unknown) => [`${v}`, "Secrets"]}/>
                    <Bar dataKey="v" fill="#2dd4bf" radius={[3, 3, 0, 0]} barSize={14}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Attack frequency (total per day) */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={subTitle}>Attack frequency</div>
            {loading ? <div style={sk("100%", 95, 6)} /> : (
              <div style={{ flex: 1, minHeight: 95 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={freqData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="20%">
                    <XAxis dataKey="d" tick={{ fill: "#6b7280", fontSize: 8 }} axisLine={false} tickLine={false} interval={0}/>
                    <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false}/>
                    <Tooltip cursor={barCursor} contentStyle={tooltipStyle} itemStyle={itemStyle} labelStyle={labelStyle} formatter={(v: unknown) => [`${v}`, "Incidents"]}/>
                    <Bar dataKey="v" fill="#58a6ff" radius={[3, 3, 0, 0]} barSize={14}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Risk score gauge */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={subTitle}>Risk score</div>
            {loading
              ? <div style={{ ...sk(160, 95, 8), margin: "0 auto" }} />
              : <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 95 }}><GaugeMeter pct={riskPct}/></div>
            }
          </div>

        </div>
      </LazyCard>
    </div>
  );
}
