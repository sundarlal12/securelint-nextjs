import { LazyCard } from "@/components/dashboard/CardLoader";
import { T, STATUS, cardStyle, skeleton } from "@/lib/dashboardTheme";

interface EnterpriseMetricsProps {
  total_incidents?:    number | string;
  team_members?:       number | string;
  total_devices?:      number | string;
  threats_blocked?:    number | string;
  threats_masked?:     number | string;
  critical_incidents?: number | string;
  loading?:            boolean;
}

const card: React.CSSProperties = {
  ...cardStyle,
  padding: 18, display: "flex", flexDirection: "column", gap: 14, minHeight: 340,
};

/**
 * Figures are black. A metric only earns a coloured dot when its value carries
 * a state worth reacting to — so colour on this card always means "look here".
 */
interface Metric {
  value: string;
  label: string;
  sub: string;
  dot?: string;
}

export default function EnterpriseMetrics({
  total_incidents, team_members, total_devices,
  threats_blocked, threats_masked, critical_incidents,
  loading,
}: EnterpriseMetricsProps = {}) {

  const hasData = !loading && total_devices !== undefined;

  const metrics: Metric[] = hasData
    ? [
        { value: String(total_devices      ?? 0), label: "Protected Devices",  sub: "enrolled endpoints" },
        { value: String(threats_blocked    ?? 0), label: "Threats Blocked",    sub: "all time", dot: STATUS.green },
        { value: String(threats_masked     ?? 0), label: "Secrets Masked",     sub: "all time", dot: STATUS.blue },
        { value: String(team_members       ?? 0), label: "Team Members",       sub: "protected" },
        { value: String(critical_incidents ?? 0), label: "Critical Incidents", sub: "requiring review", dot: Number(critical_incidents) > 0 ? STATUS.red : undefined },
        { value: String(total_incidents    ?? 0), label: "Total Detections",   sub: "all time" },
      ]
    : [
        { value: "—", label: "Protected Devices",  sub: "enrolled endpoints" },
        { value: "—", label: "Threats Blocked",    sub: "all time" },
        { value: "—", label: "Secrets Masked",     sub: "all time" },
        { value: "—", label: "Team Members",       sub: "protected" },
        { value: "—", label: "Critical Incidents", sub: "requiring review" },
        { value: "—", label: "Total Detections",   sub: "all time" },
      ];

  return (
    <div style={card}>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>
      <LazyCard delay={600}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="card-title">Enterprise Security Metrics</span>
          <span style={{ fontSize: 11.5, color: T.muted }}>All time</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px", flex: 1, alignContent: "start", paddingTop: 4 }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div style={skeleton("60%", 28)} />
                  <div style={{ ...skeleton("80%", 11), marginTop: 8 }} />
                </div>
              ))
            : metrics.map((m, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{
                      fontSize: 27, fontWeight: 680, letterSpacing: "-0.03em", lineHeight: 1,
                      // An em-dash at figure weight reads as a heavy black bar;
                      // grey it so "no data" doesn't shout louder than a number.
                      color: m.value === "—" ? T.dim : T.text,
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      {m.value}
                    </span>
                    {m.dot && <span style={{ width: 7, height: 7, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 11.5, color: T.text2, marginTop: 7, lineHeight: 1.45 }}>
                    {m.label}<br /><span style={{ color: T.muted }}>{m.sub}</span>
                  </div>
                </div>
              ))
          }
        </div>
      </LazyCard>
    </div>
  );
}
