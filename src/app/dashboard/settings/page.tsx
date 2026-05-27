"use client";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { LazyCard } from "@/components/dashboard/CardLoader";
import { fetchSettings, updateSettings } from "@/lib/adminApi";

const cs: React.CSSProperties = { background: "#0d1117", border: "1px solid #21262d", borderRadius: 14 };

// ── Exact DB column names → UI toggle keys (1-to-1, no invented names) ──────
const DB_BOOL_COLS: Record<string, string> = {
  show_risk_score:           "showRiskScore",
  show_recent_activity:      "showRecentActivity",
  animated_charts:           "animatedCharts",
  auto_refresh:              "autoRefresh",
  enable_detection:          "enableDetection",
  auto_mask_critical:        "autoMaskCritical",
  show_notifications:        "showNotifications",
  mask_console:              "maskConsole",
  scan_large_docs:           "scanLargeDocs",
  realtime_updates:          "realtimeUpdates",
  auto_mask_editor:          "autoMaskEditor",
  site_exclusions_status:    "siteExclusionsStatus",
  global_masking_status:     "globalMaskingStatus",
  enterprise_data_collection:"enterpriseDataCollection",
  email_dlp_enabled:         "emailDlpEnabled",
  preserve_context:          "preserveContext",
  auto_mask_textareas:       "autoMaskTextareas",
  auto_mask_inputs:          "autoMaskInputs",
  overlay_input:             "overlayInput",
  overlay_textarea:          "overlayTextarea",
  overlay_editor:            "overlayEditor",
  block_network_secrets:     "blockNetworkSecrets",
  block_form_submission:     "blockFormSubmission",
  aggressive_email_blocking: "aggressiveEmailBlocking",
  detect_critical:           "detectCritical",
  detect_high:               "detectHigh",
  detect_medium:             "detectMedium",
  detect_low:                "detectLow",
  notify_critical:           "notifyCritical",
  notify_high:               "notifyHigh",
};

const defaultToggles: Record<string, boolean> = {
  showRiskScore: true, showRecentActivity: true, animatedCharts: true, autoRefresh: true,
  enableDetection: true, autoMaskCritical: true, showNotifications: true,
  maskConsole: false, scanLargeDocs: false, realtimeUpdates: true,
  autoMaskEditor: true, siteExclusionsStatus: false, globalMaskingStatus: true,
  enterpriseDataCollection: true, emailDlpEnabled: true,
  preserveContext: true, autoMaskTextareas: true, autoMaskInputs: false,
  overlayInput: true, overlayTextarea: true, overlayEditor: true,
  blockNetworkSecrets: true, blockFormSubmission: true, aggressiveEmailBlocking: true,
  detectCritical: true, detectHigh: true, detectMedium: true, detectLow: false,
  notifyCritical: true, notifyHigh: true,
};

type Section = "dashboard" | "detection" | "masking" | "overlay" | "network" | "severity" | "notifications" | "enterprise";

const sections: { id: Section; label: string; d: string }[] = [
  { id: "dashboard",     label: "Dashboard",          d: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" },
  { id: "detection",     label: "Detection",           d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { id: "masking",       label: "Masking",             d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M3 3l18 18" },
  { id: "overlay",       label: "Overlay",             d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { id: "network",       label: "Network Protection",  d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  { id: "severity",      label: "Severity Levels",     d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" },
  { id: "notifications", label: "Notifications",       d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
  { id: "enterprise",    label: "Enterprise Policy",   d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} style={{ position: "relative", width: 40, height: 22, borderRadius: 11, background: on ? "#39d353" : "#21262d", border: "none", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
      <span style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
    </button>
  );
}

function Row({ title, desc, uiKey, t, toggle, tag }: { title: string; desc: string; uiKey: string; t: Record<string, boolean>; toggle: (k: string) => void; tag?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #21262d" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3" }}>{title}</span>
          {tag && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#1f4a3c", color: "#39d353", border: "1px solid #39d35333" }}>{tag}</span>}
        </div>
        <div style={{ fontSize: 11, color: "#8b949e", marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
      </div>
      <Toggle on={!!t[uiKey]} onChange={() => toggle(uiKey)} />
    </div>
  );
}

function Hdr({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#e6edf3" }}>{title}</div>
      <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>{desc}</div>
      <div style={{ height: 1, background: "#21262d", marginTop: 12 }} />
    </div>
  );
}

// ── Tag-input chip editor ────────────────────────────────────────────────────
function TagInput({
  label, hint, values, onChange, placeholder,
}: {
  label: string; hint: string;
  values: string[]; onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const v = draft.trim().toLowerCase();
    if (!v || values.includes(v)) { setDraft(""); return; }
    onChange([...values, v]);
    setDraft("");
  };

  const remove = (idx: number) => onChange(values.filter((_, i) => i !== idx));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && draft === "" && values.length) remove(values.length - 1);
  };

  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid #21262d" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 10 }}>{hint}</div>
      {/* chip box */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center",
          minHeight: 42, padding: "6px 10px", borderRadius: 8,
          border: "1px solid #30363d", background: "#161b22", cursor: "text",
        }}
      >
        {values.map((v, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20,
            background: "#1f4a3c", border: "1px solid #39d35333", color: "#39d353",
            fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
          }}>
            {v}
            <button onClick={() => remove(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#39d353", padding: 0, lineHeight: 1, fontSize: 13, fontWeight: 700 }}>×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={add}
          placeholder={values.length === 0 ? (placeholder ?? "Type and press Enter or comma…") : ""}
          style={{
            flex: 1, minWidth: 140, border: "none", outline: "none",
            background: "transparent", color: "#e6edf3", fontSize: 12,
            padding: "2px 4px",
          }}
        />
      </div>
      <div style={{ fontSize: 10, color: "#6e7681", marginTop: 5 }}>Press <kbd style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 4, padding: "1px 5px", color: "#8b949e", fontFamily: "monospace" }}>Enter</kbd> or <kbd style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 4, padding: "1px 5px", color: "#8b949e", fontFamily: "monospace" }}>,</kbd> to add · <kbd style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 4, padding: "1px 5px", color: "#8b949e", fontFamily: "monospace" }}>⌫</kbd> to remove last</div>
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive]       = useState<Section>("dashboard");
  const [t, setT]                 = useState(defaultToggles);
  const [maskStyle, setMaskStyle] = useState("smart");
  const [saving, setSaving]       = useState(false);
  const [loaded, setLoaded]       = useState(false);

  // ── Array fields ────────────────────────────────────────────────────────────
  const [wafSocialDomains,     setWafSocialDomains]     = useState<string[]>([]);
  const [siteExclusions,       setSiteExclusions]       = useState<string[]>([]);
  const [enterpriseEmailDomains, setEnterpriseEmailDomains] = useState<string[]>([]);

  const toggle = (k: string) => setT(prev => ({ ...prev, [k]: !prev[k] }));

  useEffect(() => {
    fetchSettings().then((data) => {
      const raw = data as Record<string, unknown> | null;
      const s: Record<string, unknown> = (raw?.settings as Record<string, unknown>) ?? raw ?? {};
      const merged = { ...defaultToggles };
      for (const [dbCol, uiKey] of Object.entries(DB_BOOL_COLS)) {
        if (dbCol in s && typeof s[dbCol] === "boolean") merged[uiKey] = s[dbCol] as boolean;
      }
      if (typeof s.masking_style === "string") setMaskStyle(s.masking_style);

      const toStrArr = (v: unknown): string[] =>
        Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

      setWafSocialDomains(toStrArr(s.waf_social_domain));
      setSiteExclusions(toStrArr(s.site_exclusions));
      setEnterpriseEmailDomains(toStrArr(s.enterprise_email_domains));

      setT(merged);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const [dbCol, uiKey] of Object.entries(DB_BOOL_COLS)) {
        payload[dbCol] = t[uiKey] ?? false;
      }
      payload.masking_style           = maskStyle;
      payload.waf_social_domain       = wafSocialDomains;
      payload.site_exclusions         = siteExclusions;
      payload.enterprise_email_domains = enterpriseEmailDomains;
      await updateSettings(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1400 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.5px", margin: 0 }}>SETTINGS</h2>
        <p style={{ fontSize: 14, color: "#8b949e", marginTop: 6 }}>Manage your SecureLint preferences, security policies, and account configuration.</p>
      </div>

      {!loaded && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderRadius: 10, background: "#161b22", border: "1px solid #21262d", color: "#8b949e", fontSize: 12 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
            <circle cx="12" cy="12" r="9" stroke="#21262d" strokeWidth="2.5"/><path d="M12 3a9 9 0 019 9" stroke="#39d353" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Loading settings…
        </div>
      )}

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Sidebar */}
        <div style={{ flexShrink: 0, width: 200 }}>
          <div style={{ ...cs, overflow: "hidden" }}>
            <LazyCard delay={200}>
              {sections.map(s => (
                <button key={s.id} onClick={() => setActive(s.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 16px",
                  fontSize: 12, border: "none", cursor: "pointer", textAlign: "left",
                  borderBottom: "1px solid #21262d",
                  borderLeft: active === s.id ? "3px solid #39d353" : "3px solid transparent",
                  background: active === s.id ? "#161b22" : "transparent",
                  color: active === s.id ? "#e6edf3" : "#8b949e",
                  fontWeight: active === s.id ? 600 : 400, transition: "all .15s",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d={s.d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {s.label}
                </button>
              ))}
            </LazyCard>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...cs, padding: "24px" }}>
            <LazyCard delay={400}>

              {active === "dashboard" && (
                <div>
                  <Hdr title="Dashboard Settings" desc="Customize your analytics dashboard experience" />
                  <Row title="Show Risk Score"      desc="Display security risk assessment on the overview cards"  uiKey="showRiskScore"      t={t} toggle={toggle} />
                  <Row title="Show Recent Activity" desc="Display recent detections on the overview page"          uiKey="showRecentActivity" t={t} toggle={toggle} />
                  <Row title="Animated Charts"      desc="Enable smooth animations for charts and graphs"          uiKey="animatedCharts"     t={t} toggle={toggle} />
                  <Row title="Auto Refresh"         desc="Automatically refresh dashboard data every 5 minutes"   uiKey="autoRefresh"        t={t} toggle={toggle} />
                </div>
              )}

              {active === "detection" && (
                <div>
                  <Hdr title="Detection Settings" desc="Control how SecureLint detects secrets and threats across all websites" />
                  <Row title="Enable Detection"          desc="Turn secret and threat detection on or off globally"                     uiKey="enableDetection"    t={t} toggle={toggle} />
                  <Row title="Auto-mask Critical Secrets" desc="Automatically mask high-risk secrets in textareas and editors"         uiKey="autoMaskCritical"   t={t} toggle={toggle} tag="Recommended" />
                  <Row title="Auto-mask in Editors"      desc="Extend auto-masking to code editors and rich-text contenteditable elements" uiKey="autoMaskEditor" t={t} toggle={toggle} />
                  <Row title="Show Notifications"        desc="Display browser notifications when secrets are detected"                uiKey="showNotifications"  t={t} toggle={toggle} />
                  <Row title="Mask Secrets in Console"   desc="Automatically mask secrets appearing in browser developer console"     uiKey="maskConsole"        t={t} toggle={toggle} />
                  <Row title="Scan Large Documents"      desc="Enable scanning for documents over 50KB (may impact performance)"      uiKey="scanLargeDocs"      t={t} toggle={toggle} />
                  <Row title="Real-time Updates"         desc="Update masking highlights as you type (disable for better performance)" uiKey="realtimeUpdates"    t={t} toggle={toggle} />
                  <Row title="Email DLP"                 desc="Detect and prevent sensitive data from leaving the org via email"      uiKey="emailDlpEnabled"    t={t} toggle={toggle} tag="Enterprise" />
                </div>
              )}

              {active === "masking" && (
                <div>
                  <Hdr title="Masking Options" desc="Configure how and where secrets are masked" />

                  {/* Masking style selector */}
                  <div style={{ padding: "14px 0", borderBottom: "1px solid #21262d" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", marginBottom: 6 }}>Masking Style</div>
                    <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 12 }}>Controls the visual style used when a secret is masked</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {(["smart", "full", "partial"] as const).map(opt => (
                        <button key={opt} onClick={() => setMaskStyle(opt)} style={{
                          padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all .15s",
                          border: maskStyle === opt ? "1.5px solid #39d353" : "1px solid #21262d",
                          background: maskStyle === opt ? "#0f2318" : "#161b22",
                          color: maskStyle === opt ? "#39d353" : "#8b949e",
                        }}>
                          {opt === "smart" ? "Smart" : opt === "full" ? "Full (████)" : "Partial (AB..XY)"}
                          {opt === "smart" && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 8, background: "#1f4a3c", color: "#39d353" }}>Recommended</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Row title="Global Masking Status"       desc="Master switch — when off, no masking occurs anywhere"                    uiKey="globalMaskingStatus" t={t} toggle={toggle} />
                  <Row title="Preserve Context"            desc="Maintain URL structure and field names when masking"                    uiKey="preserveContext"     t={t} toggle={toggle} />
                  <Row title="Auto-masking in Textareas"   desc="Auto-mask secrets in textareas and contenteditable elements (on by default)" uiKey="autoMaskTextareas" t={t} toggle={toggle} />
                  <Row title="Auto-masking in Input Boxes" desc="Auto-mask INPUT fields — off by default to avoid breaking forms"       uiKey="autoMaskInputs"      t={t} toggle={toggle} />
                  <Row title="Auto-masking in Editors"     desc="Apply masking in code editors (VS Code Web, CodeMirror, Monaco, etc.)" uiKey="autoMaskEditor"      t={t} toggle={toggle} />
                </div>
              )}

              {active === "overlay" && (
                <div>
                  <Hdr title="Overlay Settings" desc="Control whether the SecureLint overlay icon appears on each element type" />
                  <Row title="Overlay on Input Fields"  desc="Show the overlay icon on <input> elements"                     uiKey="overlayInput"    t={t} toggle={toggle} />
                  <Row title="Overlay on Textareas"     desc="Show the overlay icon on <textarea> elements"                  uiKey="overlayTextarea" t={t} toggle={toggle} />
                  <Row title="Overlay on Editors"       desc="Show the overlay icon on contenteditable / rich-text editors"  uiKey="overlayEditor"   t={t} toggle={toggle} />
                </div>
              )}

              {active === "network" && (
                <div>
                  <Hdr title="Network Protection" desc="Control how SecureLint intercepts network requests containing secrets" />
                  <Row title="Block Network Secrets"          desc="Detect and block XHR/fetch/WebSocket requests sending unmasked secrets"  uiKey="blockNetworkSecrets"     t={t} toggle={toggle} tag="Recommended" />
                  <Row title="Block Form Submissions"         desc="Prevent form submissions that contain unmasked detected secrets"          uiKey="blockFormSubmission"     t={t} toggle={toggle} />
                  <Row title="Aggressive Email Blocking"      desc="Enhanced interception for Gmail, Outlook, and Yahoo Mail outbound emails" uiKey="aggressiveEmailBlocking" t={t} toggle={toggle} tag="Enterprise" />
                </div>
              )}

              {active === "severity" && (
                <div>
                  <Hdr title="Severity Detection Levels" desc="Choose which severity levels trigger detection, masking, and alerting" />
                  {([
                    { k: "detectCritical", label: "Critical", desc: "API keys, DB credentials, private keys — immediate risk",       c: "#dc2626" },
                    { k: "detectHigh",     label: "High",     desc: "Access tokens, OAuth secrets, webhook URLs — significant risk", c: "#c2410c" },
                    { k: "detectMedium",   label: "Medium",   desc: "Internal URLs, environment variables — moderate risk",          c: "#b45309" },
                    { k: "detectLow",      label: "Low",      desc: "Test keys, sample tokens, documentation patterns — low risk",   c: "#3f6212" },
                  ]).map(sev => (
                    <div key={sev.k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #21262d" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: sev.c, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3" }}>{sev.label}</div>
                          <div style={{ fontSize: 11, color: "#8b949e", marginTop: 2 }}>{sev.desc}</div>
                        </div>
                      </div>
                      <Toggle on={!!t[sev.k]} onChange={() => toggle(sev.k)} />
                    </div>
                  ))}
                </div>
              )}

              {active === "notifications" && (
                <div>
                  <Hdr title="Notifications" desc="Choose which severity levels trigger real-time browser notifications" />
                  <Row title="Critical Alerts" desc="Get notified immediately when a critical secret is detected" uiKey="notifyCritical" t={t} toggle={toggle} />
                  <Row title="High Alerts"     desc="Get notified when a high-severity secret is detected"        uiKey="notifyHigh"    t={t} toggle={toggle} />
                </div>
              )}

              {active === "enterprise" && (
                <div>
                  <Hdr title="Enterprise Policy" desc="Controls specific to your enterprise plan — applied across all enrolled employees" />
                  <Row title="Enterprise Data Collection"   desc="Allow anonymized threat telemetry to improve detection for your org"     uiKey="enterpriseDataCollection" t={t} toggle={toggle} tag="Enterprise" />
                  <Row title="Site Exclusions"              desc="Enable the org-wide site allowlist / exclusions list"                    uiKey="siteExclusionsStatus"     t={t} toggle={toggle} />
                  <Row title="Email DLP Enforcement"        desc="Enforce DLP policy on all outbound email activity for enrolled users"    uiKey="emailDlpEnabled"          t={t} toggle={toggle} tag="Enterprise" />
                  <Row title="Global Masking Policy"        desc="Force masking on for all enrolled users, overriding individual settings" uiKey="globalMaskingStatus"      t={t} toggle={toggle} />

                  {/* ── Array fields ───────────────────────────────────────── */}
                  <TagInput
                    label="WAF Social Domain Blocklist"
                    hint="Domains blocked by the WAF social-domain rule — employees will see a warning page when visiting these."
                    placeholder="e.g. instagram.com, tiktok.com"
                    values={wafSocialDomains}
                    onChange={setWafSocialDomains}
                  />
                  <TagInput
                    label="Site Exclusions (Allowlist)"
                    hint="Domains excluded from all SecureLint scanning and blocking for your organization."
                    placeholder="e.g. internal.company.com, staging.acme.io"
                    values={siteExclusions}
                    onChange={setSiteExclusions}
                  />
                  <TagInput
                    label="Enterprise Email Domains"
                    hint="Trusted email domains for your organization. Used for DLP policy scoping and employee identification."
                    placeholder="e.g. acme.com, acme.io"
                    values={enterpriseEmailDomains}
                    onChange={setEnterpriseEmailDomains}
                  />

                  {/* Plan badge */}
                  <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 10, background: "#0f2318", border: "1px solid #39d35333", display: "flex", alignItems: "center", gap: 12 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" stroke="#39d353" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#39d353" }}>Enterprise Plan Active</div>
                      <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>All enterprise policies and controls are available for your organization.</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save */}
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #21262d", display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={handleSave} disabled={saving} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 8,
                  border: "none", background: saving ? "#1f4a3c" : "#39d353", color: "#0d1117",
                  fontSize: 13, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.8 : 1,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                {saving && <span style={{ fontSize: 11, color: "#8b949e" }}>Updating your settings…</span>}
              </div>

            </LazyCard>
          </div>
        </div>
      </div>
    </div>
  );
}
