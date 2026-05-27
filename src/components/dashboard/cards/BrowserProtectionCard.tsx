"use client";
import { LazyCard } from "@/components/dashboard/CardLoader";

export interface BrowserProtectionSettings {
  enable_detection?:          boolean;
  global_masking_status?:     boolean;
  auto_mask_critical?:        boolean;
  realtime_updates?:          boolean;
  block_network_secrets?:     boolean;
  block_form_submission?:     boolean;
  aggressive_email_blocking?: boolean;
  email_dlp_enabled?:         boolean;
  show_notifications?:        boolean;
  mask_console?:              boolean;
  auto_mask_textareas?:       boolean;
  auto_mask_inputs?:          boolean;
  overlay_input?:             boolean;
  overlay_textarea?:          boolean;
  overlay_editor?:            boolean;
  scan_large_docs?:           boolean;
  site_exclusions_status?:    boolean;
}

interface Props {
  settings?: BrowserProtectionSettings;
  loading?:  boolean;
}

// SVG icons for each protection feature
function IcoDetect() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IcoMask() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IcoRealtime() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IcoNetwork() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IcoEmail() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IcoNotif() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IcoForm() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IcoOverlay() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IcoConsole() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IcoSite() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

type FeatureDef = {
  key: keyof BrowserProtectionSettings;
  label: string;
  desc: string;
  Ico: React.FC;
};

const FEATURES: FeatureDef[] = [
  { key: "enable_detection",          label: "Secret Detection",           desc: "Detects secrets on all visited pages",         Ico: IcoDetect   },
  { key: "global_masking_status",     label: "Global Masking",             desc: "Master masking switch across all contexts",    Ico: IcoMask     },
  { key: "auto_mask_critical",        label: "Auto-mask Critical",         desc: "Critical secrets are masked automatically",    Ico: IcoMask     },
  { key: "realtime_updates",          label: "Real-time Monitoring",       desc: "Live detection as employees type",             Ico: IcoRealtime },
  { key: "block_network_secrets",     label: "Network Secret Blocking",    desc: "Blocks XHR/fetch carrying unmasked secrets",   Ico: IcoNetwork  },
  { key: "block_form_submission",     label: "Form Submission Block",      desc: "Prevents forms submitting detected secrets",   Ico: IcoForm     },
  { key: "aggressive_email_blocking", label: "Aggressive Email Blocking",  desc: "Enhanced intercept for Gmail/Outlook/Yahoo",   Ico: IcoEmail    },
  { key: "email_dlp_enabled",         label: "Email DLP",                  desc: "Data-loss prevention on outbound email",       Ico: IcoEmail    },
  { key: "show_notifications",        label: "Browser Notifications",      desc: "Alerts when a secret is detected",             Ico: IcoNotif    },
  { key: "mask_console",              label: "Console Masking",            desc: "Masks secrets in browser dev console",         Ico: IcoConsole  },
  { key: "overlay_input",             label: "Overlay on Inputs",          desc: "SecureLint icon on <input> fields",            Ico: IcoOverlay  },
  { key: "site_exclusions_status",    label: "Site Exclusions Active",     desc: "Org allowlist is currently enforced",          Ico: IcoSite     },
];

const sk = (w: number | string, h: number, r = 6): React.CSSProperties => ({
  width: w, height: h, borderRadius: r, background: "#1b222c",
  animation: "sk-pulse 1.4s ease-in-out infinite",
});

const card: React.CSSProperties = {
  background: "#10161d", border: "1px solid #1b222c", borderRadius: 12,
  padding: 16, display: "flex", flexDirection: "column", gap: 0, minHeight: 340,
};

export default function BrowserProtectionCard({ settings, loading }: Props = {}) {
  const hasSettings = !loading && settings !== undefined;

  // Only show features that are explicitly enabled; fall back to first 4 if no settings yet
  const enabled = hasSettings
    ? FEATURES.filter((f) => settings?.[f.key] === true)
    : [];

  // Cap at 4 rows always
  const visible = (enabled.length > 0 ? enabled : (hasSettings ? FEATURES : [])).slice(0, 4);

  return (
    <div style={card}>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>
      <LazyCard delay={500}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="card-title">Browser Protection</span>
            {!loading && enabled.length > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#0f2318", color: "#4ade80", border: "1px solid #4ade8022" }}>
                {enabled.length} active
              </span>
            )}
          </div>
          <button type="button" style={{ color: "#8b949e", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>···</button>
        </div>

        {/* Rows */}
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #1b222c" }}>
                <div style={sk(32, 32, 8)} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={sk("65%", 10)} />
                  <div style={sk("45%", 8)} />
                </div>
                <div style={sk(58, 20, 10)} />
              </div>
            ))
          : visible.map((feat, i) => (
              <div key={feat.key} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0",
                borderBottom: i < visible.length - 1 ? "1px solid #1b222c" : "none",
              }}>
                {/* Icon box — always green (only enabled shown) */}
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: "#0f2318", border: "1px solid #39d35344",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#39d353",
                }}>
                  <feat.Ico />
                </div>

                  {/* Label + desc */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#e6edf3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {feat.label}
                    </div>
                    <div style={{ fontSize: 10, color: "#6e7681", marginTop: 2 }}>{feat.desc}</div>
                  </div>
              </div>
            ))
        }

        {/* Footer: link to settings for the full picture */}
        {!loading && hasSettings && (
          <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #1b222c", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#6e7681" }}>
              {FEATURES.length - enabled.length} protection{FEATURES.length - enabled.length !== 1 ? "s" : ""} inactive
            </span>
            <a href="/dashboard/settings" style={{ fontSize: 10, color: "#58a6ff", textDecoration: "none", fontWeight: 600 }}>
              Manage in Settings →
            </a>
          </div>
        )}
      </LazyCard>
    </div>
  );
}
