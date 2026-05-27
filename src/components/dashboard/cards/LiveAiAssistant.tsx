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
      background: "#0d1117",
      border: "1px solid #21262d",
      borderRadius: 14,
      padding: "18px 20px 20px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    }}>
      <LazyCard delay={700}>
      <style>{`
        @keyframes aiPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(45,212,191,0.15), 0 0 20px rgba(45,212,191,0.05); }
          50% { box-shadow: 0 0 16px rgba(45,212,191,0.35), 0 0 40px rgba(45,212,191,0.12); }
        }
        @keyframes aiTextGlow {
          0%, 100% { text-shadow: 0 0 6px rgba(45,212,191,0.3); }
          50% { text-shadow: 0 0 14px rgba(45,212,191,0.6), 0 0 28px rgba(45,212,191,0.2); }
        }
        @keyframes aiRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span className="card-title">AI Security Assistant</span>
        <span style={{ color: "#4a5568", cursor: "pointer", fontSize: 18 }}>···</span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {actions.map((t, i) => (
            <div key={i} style={{ fontSize: 14, color: "#c9d1d9", lineHeight: 1.5 }}>
              {t}
            </div>
          ))}
        </div>
        <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
          {/* Rotating ring */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#2dd4bf55",
            borderRightColor: "#2dd4bf22",
            animation: "aiRotate 4s linear infinite",
          }} />
          {/* Pulsing circle */}
          <div style={{
            position: "absolute", inset: 4, borderRadius: "50%",
            border: "1.5px solid #2dd4bf44",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "radial-gradient(circle at 40% 40%, #15282e 0%, #0d1117 70%)",
            animation: "aiPulse 2.5s ease-in-out infinite",
          }}>
            <span style={{
              color: "#2dd4bf", fontWeight: 700, fontSize: 18,
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
