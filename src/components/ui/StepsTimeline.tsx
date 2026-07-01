"use client";
import { useState, useEffect } from "react";

export interface StepItem {
  number: string;
  icon: string;
  title: string;
  desc: string;
}

interface StepsTimelineProps {
  steps: StepItem[];
  accentColor?: string;
}

export function StepsTimeline({ steps, accentColor = "#28ccb5" }: StepsTimelineProps) {
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = windowWidth < 640;

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {steps.map((step, i) => (
          <div key={step.number} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {/* Track column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 52 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: `0 4px 16px ${accentColor}40`,
                flexShrink: 0,
              }}>
                {step.icon}
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 2,
                  flexGrow: 1,
                  minHeight: 32,
                  background: `linear-gradient(180deg, ${accentColor}80, rgba(255,255,255,0.06))`,
                  margin: "6px 0",
                }} />
              )}
            </div>

            {/* Card */}
            <div style={{
              flex: 1,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              padding: "18px 20px",
              marginBottom: i < steps.length - 1 ? 6 : 0,
              boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateX(4px)";
              el.style.boxShadow = "0 8px 28px rgba(0,0,0,0.22)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateX(0)";
              el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.14)";
            }}
            >
              <div style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: accentColor,
                marginBottom: 6,
                letterSpacing: "0.1em",
              }}>
                STEP {step.number}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginBottom: 8, marginTop: 0 }}>
                {step.title}
              </h3>
              <p style={{ color: "var(--ink-muted)", lineHeight: 1.65, fontSize: "0.9rem", margin: 0 }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop: horizontal timeline
  return (
    <div style={{ position: "relative" }}>
      {/* Horizontal connector line */}
      <div style={{
        position: "absolute",
        top: 40,
        left: `calc(${100 / (steps.length * 2)}% + 10px)`,
        right: `calc(${100 / (steps.length * 2)}% + 10px)`,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${accentColor}50, ${accentColor}, ${accentColor}50, transparent)`,
        zIndex: 0,
      }} />

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
        gap: 20,
        position: "relative",
        zIndex: 1,
      }}>
        {steps.map((step) => (
          <div
            key={step.number}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}
          >
            {/* Circle */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${accentColor}22, ${accentColor}08)`,
                border: `2px solid ${accentColor}50`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                boxShadow: `0 4px 20px ${accentColor}22`,
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "scale(1.12)";
                el.style.boxShadow = `0 8px 32px ${accentColor}45`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "scale(1)";
                el.style.boxShadow = `0 4px 20px ${accentColor}22`;
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>{step.icon}</span>
              <span style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                color: accentColor,
                letterSpacing: "0.06em",
              }}>
                {step.number}
              </span>
            </div>

            {/* Card */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "20px 18px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                width: "100%",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-5px)";
                el.style.boxShadow = "0 14px 36px rgba(0,0,0,0.22)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.14)";
              }}
            >
              <h3 style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 8,
                marginTop: 0,
              }}>
                {step.title}
              </h3>
              <p style={{
                color: "var(--ink-muted)",
                lineHeight: 1.65,
                fontSize: "0.85rem",
                margin: 0,
              }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
