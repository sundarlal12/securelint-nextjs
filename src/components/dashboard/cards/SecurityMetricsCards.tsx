"use client";
import { LazyCard } from "@/components/dashboard/CardLoader";

interface Props {
  total_devices?:      number;
  threats_blocked?:    number;
  threats_masked?:     number;
  critical_incidents?: number;
  loading?:            boolean;
}

const sk = (w: number | string, h: number, r = 5): React.CSSProperties => ({
  width: w, height: h, borderRadius: r, background: "#e9e9ec",
  animation: "sk-pulse 1.4s ease-in-out infinite",
});

export default function SecurityMetricsCards({ total_devices, threats_blocked, threats_masked, critical_incidents, loading }: Props = {}) {
  const metrics = [
    { label: "Protected Devices",  value: total_devices      ?? "—",  accent: "#0d9488" },
    { label: "Threats Blocked",    value: threats_blocked    ?? "—",  accent: "#dc2626" },
    { label: "Secrets Masked",     value: threats_masked     ?? "—",  accent: "#2563eb" },
    { label: "Critical Incidents", value: critical_incidents ?? "—",  accent: "#ea580c" },
  ];

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e9e9ec", borderRadius: 14, padding: "16px 20px 20px" }}>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>
      <LazyCard delay={800}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span className="card-title">Security Metrics</span>
          <span style={{ color: "#a1a1aa", cursor: "pointer", fontSize: 18 }}>···</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 10px" }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: "#fafafa", border: "1px solid #e9e9ec" }}>
              {loading ? (
                <>
                  <div style={sk("70%", 22, 5)} />
                  <div style={{ ...sk("90%", 9, 4), marginTop: 8 }} />
                </>
              ) : (
                <>
                  <div style={{ fontSize: 24, fontWeight: 800, color: m.accent, lineHeight: 1 }}>
                    {String(m.value)}
                  </div>
                  <div style={{ fontSize: 10, color: "#52525b", marginTop: 5, lineHeight: 1.3 }}>
                    {m.label}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </LazyCard>
    </div>
  );
}
