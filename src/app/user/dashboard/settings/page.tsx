"use client";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// ── Read-only toggle badge ─────────────────────────────────────────────────
function StatusBadge({ on }: { on: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
      background: on ? "#dafbe1" : "#f6f8fa",
      color: on ? "#1a7f37" : "#57606a",
      border: `1px solid ${on ? "#1a7f3740" : "#d0d7de"}`,
      flexShrink: 0, userSelect: "none",
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: on ? "#1a7f37" : "#d0d7de",
      }} />
      {on ? "Enabled" : "Disabled"}
    </div>
  );
}

// ── Row ────────────────────────────────────────────────────────────────────
function Row({ label, desc, on }: { label: string; desc?: string; on: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "15px 20px", borderBottom: "1px solid #f0f0f0",
    }}>
      <div style={{ flex: 1, marginRight: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: "#57606a", marginTop: 2 }}>{desc}</div>}
      </div>
      <StatusBadge on={on} />
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{title}</h2>
      </div>
      <div style={{ background: "#fff", border: "1px solid #d0d7de", borderRadius: 10, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

// ── Settings field definitions ─────────────────────────────────────────────
const SECTIONS = [
  {
    title: "Detection",
    icon: "🔍",
    rows: [
      { key: "enable_detection",    label: "Enable Detection",    desc: "Master toggle for all detection features" },
      { key: "detect_critical",     label: "Critical Severity",   desc: "Flag critical-severity secrets and threats" },
      { key: "detect_high",         label: "High Severity",       desc: "Flag high-severity secrets and threats" },
      { key: "detect_medium",       label: "Medium Severity",     desc: "Flag medium-severity secrets and threats" },
      { key: "detect_low",          label: "Low Severity",        desc: "Flag low-severity secrets and threats" },
      { key: "scan_large_docs",     label: "Scan Large Documents",desc: "Include large files and documents in scans" },
    ],
  },
  {
    title: "Masking & Protection",
    icon: "🛡️",
    rows: [
      { key: "auto_mask_critical",      label: "Auto-mask Critical Secrets",  desc: "Automatically hide critical secrets in the UI" },
      { key: "auto_mask_textareas",     label: "Auto-mask Textareas",         desc: "Mask sensitive content in textarea fields" },
      { key: "auto_mask_inputs",        label: "Auto-mask Input Fields",      desc: "Mask sensitive content in input fields" },
      { key: "mask_console",            label: "Mask Console Output",         desc: "Redact secrets from browser console logs" },
      { key: "block_network_secrets",   label: "Block Network Secrets",       desc: "Block requests that contain exposed secrets" },
      { key: "block_form_submission",   label: "Block Unsafe Form Submission",desc: "Prevent forms with secrets from being submitted" },
      { key: "aggressive_email_blocking", label: "Aggressive Email Blocking", desc: "Block emails detected as phishing or suspicious" },
    ],
  },
  {
    title: "Overlay",
    icon: "🪟",
    rows: [
      { key: "overlay_input",    label: "Input Overlay",    desc: "Show warning overlay on unsafe input fields" },
      { key: "overlay_textarea", label: "Textarea Overlay", desc: "Show warning overlay on unsafe textarea fields" },
      { key: "overlay_editor",   label: "Editor Overlay",   desc: "Show warning overlay in code editors" },
    ],
  },
  {
    title: "Notifications",
    icon: "🔔",
    rows: [
      { key: "show_notifications", label: "Show Notifications",     desc: "Display in-browser security notifications" },
      { key: "notify_critical",    label: "Notify on Critical",     desc: "Alert when a critical severity event occurs" },
      { key: "notify_high",        label: "Notify on High",         desc: "Alert when a high severity event occurs" },
    ],
  },
  {
    title: "Dashboard & UI",
    icon: "📊",
    rows: [
      { key: "show_risk_score",      label: "Show Risk Score",      desc: "Display risk score on dashboard cards" },
      { key: "show_recent_activity", label: "Show Recent Activity", desc: "Show recent activity feed on dashboard" },
      { key: "realtime_updates",     label: "Real-time Updates",    desc: "Refresh dashboard data in real time" },
      { key: "animated_charts",      label: "Animated Charts",      desc: "Enable chart animations" },
      { key: "auto_refresh",         label: "Auto-refresh",         desc: "Automatically refresh the dashboard" },
      { key: "preserve_context",     label: "Preserve Context",     desc: "Maintain AI assistant conversation context" },
    ],
  },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [settings,  setSettings]  = useState<Record<string, unknown>>({});
  const [planId,    setPlanId]    = useState("free");
  const [planName,  setPlanName]  = useState("Free");
  const [planStatus,setPlanStatus]= useState("inactive");
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    const token = localStorage.getItem("user_token") || "";
    if (!token) { setLoading(false); setError("Not authenticated."); return; }

    fetch(`${API_BASE}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.error === 1) { setError(d.message || "Failed to load settings."); return; }
        setSettings(d.settings || {});
        setPlanId(d.plan?.id || "free");
        setPlanName(d.plan?.name || "Free");
        setPlanStatus(d.plan_status || "inactive");
      })
      .catch(() => setError("Could not reach the server."))
      .finally(() => setLoading(false));
  }, []);

  const get = (key: string): boolean => Boolean(settings[key]);

  const planColor = planStatus === "active" ? "#1a7f37" : "#cf222e";
  const planBg    = planStatus === "active" ? "#dafbe1" : "#ffebe9";

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 28, height: 28, border: "3px solid #d0d7de", borderTop: "3px solid #1a7f37", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 13, color: "#57606a", margin: 0 }}>
          These settings are managed by your administrator based on your subscription plan.
        </p>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", borderRadius: 8, background: "#ffebe9", border: "1px solid #cf222e40", color: "#cf222e", fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Plan banner */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px", borderRadius: 10, marginBottom: 28,
        background: planBg, border: `1px solid ${planColor}40`,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: planColor }}>
            {planName} Plan
          </div>
          <div style={{ fontSize: 12, color: "#57606a", marginTop: 2 }}>
            Subscription status: <strong style={{ color: planColor, textTransform: "capitalize" }}>{planStatus}</strong>
          </div>
        </div>
        <div style={{
          padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
          background: planStatus === "active" ? "#1a7f37" : "#cf222e",
          color: "#fff",
        }}>
          {planId.toUpperCase()}
        </div>
      </div>

      {/* Settings sections */}
      {SECTIONS.map(sec => (
        <Section key={sec.title} title={sec.title} icon={sec.icon}>
          {sec.rows.map((row, i) => (
            <div key={row.key} style={{ borderBottom: i < sec.rows.length - 1 ? undefined : "none" }}>
              <Row label={row.label} desc={row.desc} on={get(row.key)} />
            </div>
          ))}
        </Section>
      ))}

      {/* Read-only note */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "14px 18px", borderRadius: 8, background: "#f6f8fa",
        border: "1px solid #d0d7de", marginBottom: 28,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10" stroke="#57606a" strokeWidth="2"/>
          <path d="M12 8v4m0 4h.01" stroke="#57606a" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div style={{ fontSize: 13, color: "#57606a" }}>
          Settings are configured by your admin and reflect what is enabled for your account. To request changes, contact your account administrator.
        </div>
      </div>
    </div>
  );
}
