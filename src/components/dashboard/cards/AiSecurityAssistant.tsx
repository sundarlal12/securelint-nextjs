import { Sparkles, ShieldCheck, Clipboard } from "lucide-react";
import { LazyCard } from "@/components/dashboard/CardLoader";
import { T, STATUS, TONE, cardStyle } from "@/lib/dashboardTheme";

const items = [
  { Icon: Sparkles,    text: "AI detected suspicious credential exposure", sub: "available" },
  { Icon: ShieldCheck, text: "Remediation recommendation available",       sub: "available" },
  { Icon: Clipboard,   text: "Clipboard masking active",                   sub: "available" },
];

const card: React.CSSProperties = {
  ...cardStyle,
  padding: 18, display: "flex", flexDirection: "column", gap: 16, minHeight: 340,
};

export default function AiSecurityAssistant() {
  return (
    <div style={card}>
      <LazyCard delay={400}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <span className="card-title" style={{ paddingTop: 2 }}>AI Security Assistant</span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 560,
          color: TONE.green.color, background: TONE.green.bg,
          border: `1px solid ${TONE.green.border}`, borderRadius: 999, padding: "4px 10px", flexShrink: 0,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS.green, display: "inline-block" }} />
          Protected
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
            {/* Neutral icon chip — the status pill above already carries the colour */}
            <span style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: T.inset, border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <item.Icon size={14} strokeWidth={1.9} color={T.text} />
            </span>
            <div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.45, fontWeight: 480 }}>{item.text}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: T.inset, border: `1px solid ${T.border}`, borderRadius: 10, padding: 13, marginTop: "auto" }}>
        <p style={{ fontSize: 11.5, color: T.text2, lineHeight: 1.6, margin: 0 }}>
          AI detected protection enabled. Remediation recommendation available or clipboard masking active.
        </p>
      </div>
      </LazyCard>
    </div>
  );
}
