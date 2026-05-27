"use client";
import { LazyCard } from "@/components/dashboard/CardLoader";
import { SecretBrandIcon } from "@/lib/secretIcons";

export interface LiveSecret {
  id?: number | string;
  secret_type?: string;
  severity?: string;
  action?: string;
  timestamp?: string;
  user_email?: string;
  tab_title?: string;
  tab_url?: string;
}

interface Props {
  incidents?: LiveSecret[];
  loading?: boolean;
}

// ── severity → badge colours ─────────────────────────────────────────────────
const SEV: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: "#ef4444", bg: "#2d0a0a", border: "#7f1d1d" },
  high:     { color: "#f97316", bg: "#2c1200", border: "#7c2d12" },
  medium:   { color: "#f59e0b", bg: "#2d1a00", border: "#78350f" },
  low:      { color: "#4ade80", bg: "#0d2b17", border: "#166534" },
};

function fmtTime(ts?: string) {
  if (!ts) return "—";
  try {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) +
      " · " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  } catch { return ts; }
}

// Skeleton row while loading
function SkRow() {
  const sk = (w: number | string, h = 10, r = 5): React.CSSProperties => ({
    width: w, height: h, borderRadius: r, background: "#1b222c",
    animation: "skeleton-pulse 1.4s ease-in-out infinite",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderBottom: "1px solid #1b222c" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "#1b222c", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={sk("70%", 11)} />
        <div style={sk("45%", 9)} />
      </div>
      <div style={sk(60, 24, 8)} />
    </div>
  );
}

// ── Fallback placeholder rows shown when no real data yet ────────────────────
const PLACEHOLDER: LiveSecret[] = [
  { secret_type: "GITHUB_TOKEN",  severity: "critical", action: "masked",  timestamp: new Date(Date.now() - 5  * 60_000).toISOString(), user_email: "employee@org.com" },
  { secret_type: "AWS_ACCESS_KEY", severity: "high",    action: "blocked", timestamp: new Date(Date.now() - 18 * 60_000).toISOString(), user_email: "dev@org.com" },
  { secret_type: "STRIPE_KEY",    severity: "high",     action: "masked",  timestamp: new Date(Date.now() - 47 * 60_000).toISOString(), user_email: "finance@org.com" },
  { secret_type: "JWT_TOKEN",     severity: "medium",   action: "flagged", timestamp: new Date(Date.now() - 92 * 60_000).toISOString(), user_email: "backend@org.com" },
  { secret_type: "SLACK_WEBHOOK", severity: "medium",   action: "masked",  timestamp: new Date(Date.now() - 130 * 60_000).toISOString(), user_email: "ops@org.com" },
];

export default function LiveSecretDetection({ incidents, loading }: Props) {
  const rows: LiveSecret[] = (!loading && incidents && incidents.length > 0)
    ? incidents.slice(0, 5)
    : (loading ? [] : PLACEHOLDER);

  const isReal = !loading && incidents && incidents.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", borderRadius: 16, overflow: "hidden", background: "#10161d", border: "1px solid #1b222c" }}>
      <style>{`@keyframes skeleton-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>
      <LazyCard delay={200}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#1a0a0a", borderBottom: "1px solid #2a1515" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="card-title">Live Secret Detection Panel</span>
            {/* live dot */}
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: isReal ? "#4ade80" : "#8b949e", boxShadow: isReal ? "0 0 6px #4ade8088" : "none", animation: isReal ? "skeleton-pulse 2s ease-in-out infinite" : "none" }} />
              <span style={{ fontSize: 9, color: isReal ? "#4ade80" : "#6e7681", fontWeight: 700, letterSpacing: "0.05em" }}>
                {isReal ? "LIVE" : "SAMPLE"}
              </span>
            </span>
          </div>
          <span style={{ fontSize: 11, color: "#8b949e" }}>Top 5 </span>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkRow key={i} />)
            : rows.map((inc, i) => {
                const sev = SEV[inc.severity?.toLowerCase() ?? ""] ?? SEV.low;
                const secretLabel = inc.secret_type?.replace(/_/g, " ") ?? "Unknown Secret";

                return (
                  <div key={inc.id ?? i} style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
                    borderBottom: i < rows.length - 1 ? "1px solid #1b222c" : "none",
                  }}>
                    {/* Brand icon */}
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#0d1218", border: "1px solid #252d38", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <SecretBrandIcon secretType={inc.secret_type ?? ""} size={28} />
                    </div>

                    {/* Secret name + time */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#e6edf3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>
                        {secretLabel}
                      </div>
                      <div style={{ fontSize: 12, color: "#6e7681" }}>
                        {fmtTime(inc.timestamp)}
                      </div>
                    </div>

                    {/* Severity badge only */}
                    <span style={{ fontSize: 12, fontWeight: 700, color: sev.color, background: sev.bg, border: `1px solid ${sev.border}`, borderRadius: 8, padding: "5px 14px", letterSpacing: "0.02em", flexShrink: 0, textTransform: "capitalize" }}>
                      {inc.severity ?? "—"}
                    </span>
                  </div>
                );
              })}
        </div>
      </LazyCard>
    </div>
  );
}
