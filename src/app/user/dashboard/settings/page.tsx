"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCachedProfile, getCachedSettings, revalidateProfile } from "@/lib/userCache";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://securelint-api.vercel.app";
const G      = "#1a7f37";
const BORDER = "#e5e7eb";
const TEXT   = "#111827";
const MUTED  = "#6b7280";

function StatusBadge({ on }: { on: boolean }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:5,
      padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700, flexShrink:0,
      background: on ? "#f0fdf4" : "#f3f4f6",
      color: on ? G : MUTED,
      border:`1px solid ${on ? "#86efac" : BORDER}`,
    }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background: on ? G : "#d1d5db" }} />
      {on ? "Enabled" : "Disabled"}
    </div>
  );
}

function SettingRow({ label, desc, on, last }: { label:string; desc?:string; on:boolean; last?:boolean }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
      padding:"14px 20px",
      borderBottom: last ? "none" : `1px solid ${BORDER}`,
    }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:600, color:TEXT, marginBottom:desc ? 2 : 0 }}>{label}</div>
        {desc && <div style={{ fontSize:12, color:MUTED }}>{desc}</div>}
      </div>
      <StatusBadge on={on} />
    </div>
  );
}

function SettingsSection({ title, icon, children }: { title:string; icon:string; children:React.ReactNode }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h2 style={{ fontSize:15, fontWeight:700, color:TEXT, margin:0 }}>{title}</h2>
      </div>
      <div style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:12, overflow:"hidden" }}>
        {children}
      </div>
    </div>
  );
}

const SECTIONS = [
  {
    title:"Detection", icon:"🔍",
    rows:[
      { key:"enable_detection",  label:"Enable Detection",     desc:"Master toggle for all detection features" },
      { key:"detect_critical",   label:"Critical Severity",    desc:"Flag critical-severity secrets and threats" },
      { key:"detect_high",       label:"High Severity",        desc:"Flag high-severity secrets and threats" },
      { key:"detect_medium",     label:"Medium Severity",      desc:"Flag medium-severity secrets and threats" },
      { key:"detect_low",        label:"Low Severity",         desc:"Flag low-severity secrets and threats" },
      { key:"scan_large_docs",   label:"Scan Large Documents", desc:"Include large files and documents in scans" },
    ],
  },
  {
    title:"Masking & Protection", icon:"🛡️",
    rows:[
      { key:"auto_mask_critical",       label:"Auto-mask Critical Secrets",   desc:"Automatically hide critical secrets in the UI" },
      { key:"auto_mask_textareas",      label:"Auto-mask Textareas",          desc:"Mask sensitive content in textarea fields" },
      { key:"auto_mask_inputs",         label:"Auto-mask Input Fields",       desc:"Mask sensitive content in input fields" },
      { key:"mask_console",             label:"Mask Console Output",          desc:"Redact secrets from browser console logs" },
      { key:"block_network_secrets",    label:"Block Network Secrets",        desc:"Block requests that contain exposed secrets" },
      { key:"block_form_submission",    label:"Block Unsafe Form Submission", desc:"Prevent forms with secrets from being submitted" },
      { key:"aggressive_email_blocking",label:"Aggressive Email Blocking",    desc:"Block emails detected as phishing or suspicious" },
    ],
  },
  {
    title:"Overlay", icon:"🪟",
    rows:[
      { key:"overlay_input",    label:"Input Overlay",    desc:"Show warning overlay on unsafe input fields" },
      { key:"overlay_textarea", label:"Textarea Overlay", desc:"Show warning overlay on unsafe textarea fields" },
      { key:"overlay_editor",   label:"Editor Overlay",   desc:"Show warning overlay in code editors" },
    ],
  },
  {
    title:"Notifications", icon:"🔔",
    rows:[
      { key:"show_notifications",label:"Show Notifications", desc:"Display in-browser security notifications" },
      { key:"notify_critical",   label:"Notify on Critical", desc:"Alert when a critical severity event occurs" },
      { key:"notify_high",       label:"Notify on High",     desc:"Alert when a high severity event occurs" },
    ],
  },
  {
    title:"Dashboard & UI", icon:"📊",
    rows:[
      { key:"show_risk_score",      label:"Show Risk Score",      desc:"Display risk score on dashboard cards" },
      { key:"show_recent_activity", label:"Show Recent Activity", desc:"Show recent activity feed on dashboard" },
      { key:"realtime_updates",     label:"Real-time Updates",    desc:"Refresh dashboard data in real time" },
      { key:"animated_charts",      label:"Animated Charts",      desc:"Enable chart animations" },
      { key:"auto_refresh",         label:"Auto-refresh",         desc:"Automatically refresh the dashboard" },
      { key:"preserve_context",     label:"Preserve Context",     desc:"Maintain AI assistant conversation context" },
    ],
  },
];

export default function SettingsPage() {
  const [settings,   setSettings]   = useState<Record<string, unknown>>({});
  const [planName,   setPlanName]   = useState("Basic");
  const [planStatus, setPlanStatus] = useState("inactive");
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  // Suppress unused warning — API_BASE kept for future direct calls
  void API_BASE;

  useEffect(() => {
    const token = localStorage.getItem("user_token") || "";
    if (!token) { setLoading(false); setError("Not authenticated."); return; }

    // ── 1. Show cached data instantly ──
    const cachedProfile  = getCachedProfile();
    const cachedSettings = getCachedSettings();
    if (cachedProfile) {
      setSettings(cachedSettings);
      setPlanName(cachedProfile.plan?.name || "Basic");
      setPlanStatus(cachedProfile.plan_status || "inactive");
      setLoading(false);
    }

    // ── 2. Revalidate silently in background ──
    revalidateProfile(token).then(fresh => {
      if (!fresh) return;
      setSettings(fresh.settings || {});
      setPlanName(fresh.plan?.name || "Basic");
      setPlanStatus(fresh.plan_status || "inactive");
    }).catch(() => {
      if (!cachedProfile) setError("Could not reach the server.");
    }).finally(() => setLoading(false));
  }, []);

  const get = (key:string):boolean => Boolean(settings[key]);

  if (loading) return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ height:32, width:120, borderRadius:8, marginBottom:24, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200%", animation:"shimmer 1.4s infinite" }} />
      {[1,2,3].map(i => <div key={i} style={{ height:180, borderRadius:12, marginBottom:20, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200%", animation:"shimmer 1.4s infinite" }} />)}
    </div>
  );

  const isActive = planStatus === "active";

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:TEXT, margin:0, letterSpacing:"-0.5px" }}>Settings</h1>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="#d1d5db" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="3" stroke="#d1d5db" strokeWidth="1.5"/>
        </svg>
      </div>
      <p style={{ fontSize:14, color:MUTED, marginBottom:28 }}>
        These settings are managed by your administrator based on your subscription plan.
      </p>

      {error && (
        <div style={{ padding:"12px 16px", borderRadius:10, background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:20 }}>
          {error}
        </div>
      )}

      {/* Plan banner */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12,
        padding:"14px 20px", borderRadius:12, marginBottom:32,
        background: isActive ? "#f0fdf4" : "#fef2f2",
        border:`1px solid ${isActive ? "#86efac" : "#fca5a5"}`,
      }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color: isActive ? G : "#dc2626" }}>{planName} Plan</div>
          <div style={{ fontSize:12, color:MUTED, marginTop:2 }}>
            Status:{" "}
            <strong style={{ color: isActive ? G : "#dc2626", textTransform:"capitalize" }}>{planStatus}</strong>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {!isActive && (
            <Link href="/user/dashboard/subscription"
              style={{ fontSize:13, color:G, fontWeight:700, textDecoration:"none", padding:"6px 14px", borderRadius:8, background:"#fff", border:`1px solid ${G}30` }}>
              Upgrade →
            </Link>
          )}
          <span style={{ fontSize:11, fontWeight:800, padding:"3px 12px", borderRadius:20, background: isActive ? G : "#dc2626", color:"#fff" }}>
            {isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
      </div>

      {/* Settings sections */}
      {SECTIONS.map(sec => (
        <SettingsSection key={sec.title} title={sec.title} icon={sec.icon}>
          {sec.rows.map((row, i) => (
            <SettingRow
              key={row.key}
              label={row.label}
              desc={row.desc}
              on={get(row.key)}
              last={i === sec.rows.length - 1}
            />
          ))}
        </SettingsSection>
      ))}

      {/* Read-only info */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"14px 18px", borderRadius:10, background:"#f9fafb", border:`1px solid ${BORDER}` }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}>
          <circle cx="12" cy="12" r="9" stroke="#9ca3af" strokeWidth="2"/>
          <path d="M12 8v4m0 4h.01" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p style={{ fontSize:13, color:MUTED, margin:0, lineHeight:1.6 }}>
          Settings reflect what your admin has enabled for your account. To request changes, contact{" "}
          <a href="mailto:contact@vaptlabs.com" style={{ color:G, fontWeight:600, textDecoration:"none" }}>contact@vaptlabs.com</a>.
        </p>
      </div>
    </div>
  );
}
