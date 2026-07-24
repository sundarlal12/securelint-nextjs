"use client";
import { LazyCard } from "@/components/dashboard/CardLoader";

const actions = [
  "Credential leak blocked",
  "Threat quarantined",
  "Browser protection enabled",
  "AI scanning active",
];

export default function LiveAiAssistant() {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e9e9ec",
      borderRadius: 14,
      padding: "18px 20px 20px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    }}>
      <LazyCard delay={700}>
      <style>{`
        @keyframes aiPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(13,148,136,0.12), 0 0 20px rgba(13,148,136,0.12); }
          50% { box-shadow: 0 0 16px rgba(13,148,136,0.12), 0 0 40px rgba(13,148,136,0.12); }
        }
        @keyframes aiTextGlow {
          0%, 100% { text-shadow: 0 0 6px rgba(13,148,136,0.12); }
          50% { text-shadow: 0 0 14px rgba(13,148,136,0.12), 0 0 28px rgba(13,148,136,0.12); }
        }
        @keyframes aiRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span className="card-title">AI Security Assistant</span>
        <span style={{ color: "#a1a1aa", cursor: "pointer", fontSize: 18 }}>···</span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {actions.map((t, i) => (
            <div key={i} style={{ fontSize: 14, color: "#18181b", lineHeight: 1.5 }}>
              {t}
            </div>
          ))}
        </div>
        <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
          {/* Rotating ring */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#0d948855",
            borderRightColor: "#0d948822",
            animation: "aiRotate 4s linear infinite",
          }} />
          {/* Pulsing circle */}
          <div style={{
            position: "absolute", inset: 4, borderRadius: "50%",
            border: "1.5px solid #0d948844",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "radial-gradient(circle at 40% 40%, #f2f7f9 0%, #ffffff 70%)",
            animation: "aiPulse 2.5s ease-in-out infinite",
          }}>
            <span style={{
              color: "#0d9488", fontWeight: 700, fontSize: 18,
              animation: "aiTextGlow 2.5s ease-in-out infinite",
            }}>
              AI
            </span>
          </div>
        </div>
      </div>
      </LazyCard>
    </div>
  );
}
