"use client";
import { LazyCard } from "@/components/dashboard/CardLoader";
import { SecretBrandIcon } from "@/lib/secretIcons";
import { T, STATUS, severityTone } from "@/lib/dashboardTheme";
import { EmptyState } from "@/components/dashboard/charts/Skeletons";

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
    width: w, height: h, borderRadius: r, background: "#eeeef0",
    animation: "skeleton-pulse 1.4s ease-in-out infinite",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: "#eeeef0", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={sk("70%", 11)} />
        <div style={sk("45%", 9)} />
      </div>
      <div style={sk(64, 24, 999)} />
    </div>
  );
}

export default function LiveSecretDetection({ incidents, loading }: Props) {
  // No invented rows: the panel either lists real detections, shimmers while
  // they load, or states plainly that there are none.
  const rows: LiveSecret[] = !loading && incidents?.length ? incidents.slice(0, 5) : [];
  const isReal = rows.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", borderRadius: T.radius, overflow: "hidden", background: T.surface, border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
      <style>{`@keyframes skeleton-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>
      <LazyCard delay={200}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span className="card-title">Live Secret Detection</span>
            {/* Live indicator — the dot is the only colour in the header */}
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: isReal ? STATUS.green : T.dim, animation: isReal ? "skeleton-pulse 2s ease-in-out infinite" : "none" }} />
              <span style={{ fontSize: 10, color: isReal ? STATUS.green : T.dim, fontWeight: 620, letterSpacing: "0.06em" }}>
                {loading ? "LOADING" : isReal ? "LIVE" : "IDLE"}
              </span>
            </span>
          </div>
          <span style={{ fontSize: 11.5, color: T.muted }}>Top 5</span>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkRow key={i} />)
            : rows.length === 0
            ? <EmptyState
                height={220}
                message="No secrets detected"
                hint="Detections from protected endpoints will appear here in real time."
              />
            : rows.map((inc, i) => {
                const sev = severityTone(inc.severity);
                const secretLabel = inc.secret_type?.replace(/_/g, " ") ?? "Unknown Secret";

                return (
                  <div key={inc.id ?? i} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "15px 20px",
                    borderBottom: i < rows.length - 1 ? `1px solid ${T.border}` : "none",
                    transition: "background .15s",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = T.inset}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    {/* Brand icon */}
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: T.inset, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <SecretBrandIcon secretType={inc.secret_type ?? ""} size={24} />
                    </div>

                    {/* Secret name + time */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 570, color: T.text, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3, textTransform: "capitalize" }}>
                        {secretLabel.toLowerCase()}
                      </div>
                      <div style={{ fontSize: 11.5, color: T.muted }}>
                        {fmtTime(inc.timestamp)}
                      </div>
                    </div>

                    {/* Severity badge — the row's only saturated element */}
                    <span style={{ fontSize: 11, fontWeight: 620, color: sev.color, background: sev.bg, border: `1px solid ${sev.border}`, borderRadius: 999, padding: "4px 11px", flexShrink: 0, textTransform: "capitalize" }}>
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
