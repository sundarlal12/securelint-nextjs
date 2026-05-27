import { LazyCard } from "@/components/dashboard/CardLoader";

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
  background: "#10161d", border: "1px solid #1b222c", borderRadius: 12,
  padding: 16, display: "flex", flexDirection: "column", gap: 12, minHeight: 340,
};

const sk = (w: number | string, h = 28): React.CSSProperties => ({
  width: w, height: h, borderRadius: 6, background: "#1b222c",
  animation: "sk-pulse 1.4s ease-in-out infinite",
});

export default function EnterpriseMetrics({
  total_incidents, team_members, total_devices,
  threats_blocked, threats_masked, critical_incidents,
  loading,
}: EnterpriseMetricsProps = {}) {

  const hasData = !loading && total_devices !== undefined;

  const metrics = hasData
    ? [
        { value: String(total_devices      ?? 0),  label: "Protected Devices",   sub: "enrolled endpoints" },
        { value: String(threats_blocked    ?? 0),  label: "Threats Blocked",      sub: "all time" },
        { value: String(threats_masked     ?? 0),  label: "Secrets Masked",        sub: "all time", accent: "#60a5fa" },
        { value: String(team_members       ?? 0),  label: "Team Members",          sub: "protected" },
        { value: String(critical_incidents ?? 0),  label: "Critical Incidents",    sub: "requiring review", accent: "#ef4444" },
        { value: String(total_incidents    ?? 0),  label: "Total Detections",      sub: "all time" },
      ]
    : [
        { value: "—", label: "Protected Devices",  sub: "enrolled endpoints" },
        { value: "—", label: "Threats Blocked",     sub: "all time" },
        { value: "—", label: "Secrets Masked",       sub: "all time" },
        { value: "—", label: "Team Members",         sub: "protected" },
        { value: "—", label: "Critical Incidents",   sub: "requiring review" },
        { value: "—", label: "Total Detections",     sub: "all time" },
      ];

  return (
    <div style={card}>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>
      <LazyCard delay={600}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="card-title">Enterprise Security Metrics</span>
          <button type="button" style={{ color: "#8b949e", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>···</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px", flex: 1, alignContent: "start", paddingTop: 4 }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div style={sk("60%")} />
                  <div style={{ ...sk("80%", 11), marginTop: 8 }} />
                </div>
              ))
            : metrics.map((m, i) => (
                <div key={i}>
                  <div style={{
                    fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1,
                    color: (m as { accent?: string }).accent ?? "#2dd4bf",
                  }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: 11, color: "#8b949e", marginTop: 5, lineHeight: 1.4 }}>
                    {m.label}<br /><span style={{ color: "#6e7681" }}>{m.sub}</span>
                  </div>
                </div>
              ))
          }
        </div>
      </LazyCard>
    </div>
  );
}
