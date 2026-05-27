import { Sparkles, ShieldCheck, Clipboard } from "lucide-react";
import { LazyCard } from "@/components/dashboard/CardLoader";

const items = [
  { Icon: Sparkles, text: "AI detected suspicious credential exposure", sub: "available" },
  { Icon: ShieldCheck, text: "Remediation recommendation available", sub: "available" },
  { Icon: Clipboard, text: "Clipboard masking active", sub: "available" },
];

const card: React.CSSProperties = { background: "#10161d", border: "1px solid #1b222c", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 16, minHeight: 340 };

export default function AiSecurityAssistant() {
  return (
    <div style={card}>
      <LazyCard delay={400}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <span className="card-title" style={{ paddingTop: 2 }}>AI Security Assistant Panel</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "#3ae374",
            background: "rgba(8,34,22,0.85)", border: "1px solid rgba(19,77,47,0.8)", borderRadius: 999, padding: "4px 10px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#39d353", boxShadow: "0 0 6px rgba(57,211,83,0.8)", display: "inline-block" }} />
            Protected
          </span>
          <button type="button" style={{ color: "#8b949e", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>···</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <item.Icon size={15} strokeWidth={2} color="#39d353" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, color: "#e6edf3", lineHeight: 1.4 }}>{item.text}</div>
              <div style={{ fontSize: 10, color: "#6e7681", marginTop: 2 }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#0d1218", border: "1px solid #1b222c", borderRadius: 8, padding: 12, marginTop: "auto" }}>
        <p style={{ fontSize: 11, color: "#8b949e", lineHeight: 1.6, margin: 0 }}>
          AI detected protection enabled. Remediation recommendation available or Clipboard masking active.
        </p>
      </div>
      </LazyCard>
    </div>
  );
}
