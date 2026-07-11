"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────── */
type Action = "DETECT" | "WARN" | "BLOCK" | "MASK";
type Group  = { id: string; name: string };

interface ControlConfig {
  enabled: boolean;
  action?: Action;
  groups: string[];          // group ids
  domains?: string[];        // whitelist / block-list
  extensionIds?: string[];
  markerToken?: string;
  appDomains?: string[];
  settings?: Record<string, unknown>;
}

interface ControlDef {
  id: string;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  icon: React.ReactNode;
  bannerBg: string;
  bannerEl: React.ReactNode;
  hasAction?: boolean;
  actionChoices?: Action[];
  hasDomains?: boolean;
  domainLabel?: string;
  hasExtIds?: boolean;
  hasMarker?: boolean;
  hasAppDomains?: boolean;
  hasSecretSettings?: boolean;
}

/* ─────────────────────────────────────────────────────────────────────────
   API helpers
───────────────────────────────────────────────────────────────────────── */
const API = process.env.NEXT_PUBLIC_API_URL ?? "https://supabase-auth-fastapi.vercel.app/api";

async function apiFetch(path: string, opts?: RequestInit) {
  const token = typeof window !== "undefined" ? localStorage.getItem("sb_access_token") : null;
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts?.headers ?? {}) },
  });
  return res.json();
}

/* ─────────────────────────────────────────────────────────────────────────
   Banner illustrations (simple SVG placeholders themed per control)
───────────────────────────────────────────────────────────────────────── */
function PhishBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" fill="none">
      <rect width="320" height="90" fill="#0f1a2e"/>
      {[40,80,140,200,260,300].map((x,i)=><circle key={i} cx={x} cy={30+i*5} r={8} stroke="#f9731644" strokeWidth="1.5" fill="none"/>)}
      <path d="M130 45 C150 20 170 65 190 40 C210 15 230 55 250 30" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2"/>
      <circle cx="190" cy="45" r="14" stroke="#ef4444" strokeWidth="2" fill="#ef444422"/>
      <path d="M183 45l5 5 9-9" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function WafBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" fill="none">
      <rect width="320" height="90" fill="#0f1a2e"/>
      <rect x="60" y="20" width="200" height="50" rx="8" stroke="#f9731644" strokeWidth="1.5" fill="#f9731411"/>
      <text x="160" y="50" textAnchor="middle" fill="#f97316" fontSize="13" fontWeight="600">⚠ Phishing attempt blocked</text>
    </svg>
  );
}

function UrlBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" fill="none">
      <rect width="320" height="90" fill="#0f1a2e"/>
      <rect x="60" y="20" width="200" height="50" rx="8" stroke="#ef444444" strokeWidth="1.5" fill="#ef444411"/>
      <text x="160" y="50" textAnchor="middle" fill="#f87171" fontSize="13" fontWeight="600">🚫 This site is blocked</text>
    </svg>
  );
}

function SessionBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" fill="none">
      <rect width="320" height="90" fill="#0f1a2e"/>
      {[60,100,140,180,220,260].map((x,i)=><rect key={i} x={x} y={20+i%3*10} width="50" height="8" rx="2" fill="#1e3a5f" opacity={0.8}/>)}
      <rect x="100" y="42" width="80" height="12" rx="2" fill="#ef444455"/>
      <text x="140" y="52" textAnchor="middle" fill="#ef4444" fontSize="8">session [missing]</text>
    </svg>
  );
}

function ExtBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" fill="none">
      <rect width="320" height="90" fill="#0f1a2e"/>
      {[60,120,180,240].map((x,i)=><rect key={i} x={x} y={25} width="40" height="40" rx="6" stroke="#818cf844" strokeWidth="1.5" fill="#818cf811"/>)}
      <path d="M155 45l10-10M165 45l-10-10" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function MailPhishBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" fill="none">
      <rect width="320" height="90" fill="#0f1a2e"/>
      <rect x="70" y="20" width="180" height="50" rx="6" stroke="#f9731444" strokeWidth="1.5" fill="#f9731411"/>
      <path d="M70 26l90 32 90-32" stroke="#f97316" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M148 55l-8 8M160 55l8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function DlpBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" fill="none">
      <rect width="320" height="90" fill="#0f1a2e"/>
      {[0,1,2].map(i=><rect key={i} x={80+i*50} y={20} width="40" height="50" rx="4" stroke="#60a5fa44" strokeWidth="1.5" fill="#60a5fa11"/>)}
      <path d="M120 45h40M160 45h40" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 2"/>
    </svg>
  );
}

function SecretBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" fill="none">
      <rect width="320" height="90" fill="#0f1a2e"/>
      {["API_KEY=***","SECRET=***","TOKEN=***"].map((t,i)=>(
        <text key={i} x="50" y={28+i*20} fill="#a78bfa88" fontSize="11" fontFamily="monospace">{t}</text>
      ))}
      <rect x="48" y="14" width="120" height="60" rx="4" stroke="#a78bfa44" strokeWidth="1" fill="none"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Control definitions
───────────────────────────────────────────────────────────────────────── */
const CONTROLS: ControlDef[] = [
  {
    id: "phishing_site",
    title: "Phishing Site Detection",
    desc: "Detect and block when your employees visit malicious phishing sites in real time.",
    tag: "Phishing", tagColor: "#f97316",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#f97316" strokeWidth="1.8"/></svg>,
    bannerBg: "#0f1a2e", bannerEl: <PhishBanner/>,
    hasAction: true, actionChoices: ["DETECT","WARN","BLOCK"],
    hasDomains: true, domainLabel: "Whitelist domains",
  },
  {
    id: "phishing_mail",
    title: "Phishing Mail Detection",
    desc: "Detect phishing emails in Gmail and Outlook with AI-based mail analysis.",
    tag: "Phishing", tagColor: "#f97316",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" stroke="#f97316" strokeWidth="1.4"/></svg>,
    bannerBg: "#0f1a2e", bannerEl: <MailPhishBanner/>,
    hasAction: true, actionChoices: ["DETECT","WARN","BLOCK"],
    hasDomains: true, domainLabel: "Whitelist sender domains",
  },
  {
    id: "waf_domain",
    title: "WAF Domain Blocking",
    desc: "Block access to known malicious or social-engineering domains via the SecureLint WAF.",
    tag: "Response", tagColor: "#ef4444",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke="#ef4444" strokeWidth="1.8"/></svg>,
    bannerBg: "#0f1a2e", bannerEl: <WafBanner/>,
    hasAction: true, actionChoices: ["DETECT","WARN","BLOCK"],
    hasDomains: true, domainLabel: "Custom block-list domains",
  },
  {
    id: "url_blocking",
    title: "URL Blocking",
    desc: "Prevent employees from visiting known malicious URLs by configuring a blocklist.",
    tag: "Response", tagColor: "#ef4444",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/><path d="M4.93 4.93l14.14 14.14" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    bannerBg: "#0f1a2e", bannerEl: <UrlBanner/>,
    hasAction: true, actionChoices: ["DETECT","WARN","BLOCK"],
    hasDomains: true, domainLabel: "Blocked URLs / domains",
  },
  {
    id: "session_theft",
    title: "Session Theft Detection",
    desc: "Add a unique marker to User Agent strings to detect session token theft in app logs.",
    tag: "Detection", tagColor: "#60a5fa",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#60a5fa" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    bannerBg: "#0f1a2e", bannerEl: <SessionBanner/>,
    hasMarker: true, hasAppDomains: true,
  },
  {
    id: "malicious_extension",
    title: "Malicious Extension Blocking",
    desc: "Block or warn when employees install blacklisted browser extensions per IT policy.",
    tag: "Extensions", tagColor: "#818cf8",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#818cf8" strokeWidth="1.8"/><path d="M8 9h8M8 12h8M8 15h5" stroke="#818cf8" strokeWidth="1.4" strokeLinecap="round"/></svg>,
    bannerBg: "#0f1a2e", bannerEl: <ExtBanner/>,
    hasAction: true, actionChoices: ["DETECT","WARN","BLOCK"],
    hasExtIds: true,
  },
  {
    id: "email_dlp",
    title: "Cross-Domain Mail Control",
    desc: "Monitor and control outbound emails to detect data leakage via cross-domain recipients.",
    tag: "DLP", tagColor: "#60a5fa",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    bannerBg: "#0f1a2e", bannerEl: <DlpBanner/>,
    hasAction: true, actionChoices: ["DETECT","WARN","BLOCK"],
    hasDomains: true, domainLabel: "Allowed external domains",
  },
  {
    id: "secret_masking",
    title: "Secret Masking",
    desc: "Automatically detect and mask secrets, API keys, and tokens typed in the browser.",
    tag: "Masking", tagColor: "#a78bfa",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="8" y="2" width="8" height="4" rx="1" stroke="#a78bfa" strokeWidth="1.6"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="#a78bfa" strokeWidth="1.6"/></svg>,
    bannerBg: "#0f1a2e", bannerEl: <SecretBanner/>,
    hasAction: true, actionChoices: ["DETECT","MASK"],
    hasSecretSettings: true,
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   Multi-select group dropdown
───────────────────────────────────────────────────────────────────────── */
function GroupPicker({ groups, selected, onChange }: { groups: Group[]; selected: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  const label = selected.length === 0 ? "All employees" : selected.length === groups.length ? "All groups" : `${selected.length} group${selected.length > 1 ? "s" : ""} selected`;
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: "#0d1525", border: "1px solid #2d3748", borderRadius: 8, color: "#c9d1d9", fontSize: 13, cursor: "pointer" }}>
        <span>{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: ".2s" }}><path d="M6 9l6 6 6-6" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#0d1525", border: "1px solid #2d3748", borderRadius: 8, zIndex: 50, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,.5)" }}>
          {groups.map(g => (
            <label key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", cursor: "pointer", borderBottom: "1px solid #1a2540" }}>
              <input type="checkbox" checked={selected.includes(g.id)} onChange={() => toggle(g.id)}
                style={{ width: 14, height: 14, accentColor: "#818cf8", cursor: "pointer" }} />
              <span style={{ fontSize: 13, color: "#c9d1d9", textTransform: "capitalize" }}>{g.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Tag list input (domains / extension IDs / app domains)
───────────────────────────────────────────────────────────────────────── */
function TagInput({ label, placeholder, values, onChange }: { label: string; placeholder: string; values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput("");
  };
  const remove = (v: string) => onChange(values.filter(x => x !== v));
  return (
    <div>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", gap: 6 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          style={{ flex: 1, padding: "8px 10px", background: "#0d1525", border: "1px solid #2d3748", borderRadius: 8, color: "#c9d1d9", fontSize: 12, outline: "none" }} />
        <button onClick={add} style={{ padding: "8px 14px", background: "#1e2d45", border: "1px solid #2d3748", borderRadius: 8, color: "#60a5fa", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>+ Add</button>
      </div>
      {values.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
          {values.map(v => (
            <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "#1a2540", border: "1px solid #2d3748", color: "#94a3b8" }}>
              {v}
              <button onClick={() => remove(v)} style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer", padding: 0, lineHeight: 1, fontSize: 12 }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Action selector
───────────────────────────────────────────────────────────────────────── */
function ActionPicker({ choices, value, onChange }: { choices: Action[]; value: Action; onChange: (v: Action) => void }) {
  const colors: Record<string, string> = { DETECT: "#60a5fa", WARN: "#f59e0b", BLOCK: "#ef4444", MASK: "#a78bfa" };
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {choices.map(c => (
        <button key={c} onClick={() => onChange(c)}
          style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${value === c ? colors[c] : "#2d3748"}`, background: value === c ? `${colors[c]}18` : "#0d1525", color: value === c ? colors[c] : "#64748b", fontSize: 12, fontWeight: value === c ? 700 : 400, cursor: "pointer", transition: ".15s" }}>
          {c}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Toggle row
───────────────────────────────────────────────────────────────────────── */
function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a2540" }}>
      <span style={{ fontSize: 12, color: "#94a3b8" }}>{label.replace(/_/g, " ")}</span>
      <button onClick={() => onChange(!value)} style={{ width: 38, height: 20, borderRadius: 10, border: "none", background: value ? "#818cf8" : "#2d3748", cursor: "pointer", position: "relative", transition: ".2s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 2, left: value ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: ".2s" }} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Config Drawer
───────────────────────────────────────────────────────────────────────── */
function ConfigDrawer({ ctrl, groups, cfg, onChange, onClose, onSave, saving }: {
  ctrl: ControlDef; groups: Group[]; cfg: ControlConfig;
  onChange: (c: ControlConfig) => void;
  onClose: () => void; onSave: () => void; saving: boolean;
}) {
  const sec = (lbl: string) => (
    <div style={{ fontSize: 10, color: "#4a5568", fontWeight: 700, letterSpacing: 0.8, marginTop: 18, marginBottom: 8 }}>{lbl}</div>
  );

  const sm = cfg.settings as Record<string, unknown> ?? {};
  const setSm = (k: string, v: unknown) => onChange({ ...cfg, settings: { ...sm, [k]: v } });

  return (
    <>
      {/* backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 40 }} />

      {/* drawer */}
      <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 420, background: "#0b1120", borderLeft: "1px solid #1e2d45", zIndex: 50, display: "flex", flexDirection: "column", boxShadow: "-16px 0 60px rgba(0,0,0,.7)" }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #1e2d45", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 7, padding: "2px 7px", borderRadius: 20, background: `${ctrl.tagColor}18`, border: `1px solid ${ctrl.tagColor}44`, color: ctrl.tagColor, fontWeight: 700 }}>{ctrl.tag}</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3", marginTop: 4 }}>Configuration</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{ctrl.title}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {/* Enable toggle */}
          {!ctrl.hasMarker && (
            <>
              {sec("STATUS")}
              <ToggleRow label="Enable control" value={cfg.enabled} onChange={v => onChange({ ...cfg, enabled: v })} />
            </>
          )}

          {/* Action */}
          {ctrl.hasAction && ctrl.actionChoices && (
            <>
              {sec("ACTION")}
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>Choose how SecureLint responds when this control triggers.</div>
              <ActionPicker choices={ctrl.actionChoices} value={cfg.action ?? ctrl.actionChoices[0]} onChange={v => onChange({ ...cfg, action: v })} />
            </>
          )}

          {/* Groups */}
          {!ctrl.hasMarker && (
            <>
              {sec("APPLY TO GROUPS")}
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>Leave blank to apply to all employees.</div>
              <GroupPicker groups={groups} selected={cfg.groups} onChange={v => onChange({ ...cfg, groups: v })} />
            </>
          )}

          {/* Domains */}
          {ctrl.hasDomains && (
            <>
              {sec(ctrl.domainLabel?.toUpperCase() ?? "DOMAINS")}
              <TagInput label="" placeholder="example.com" values={cfg.domains ?? []} onChange={v => onChange({ ...cfg, domains: v })} />
            </>
          )}

          {/* Extension IDs */}
          {ctrl.hasExtIds && (
            <>
              {sec("BLOCKED EXTENSION IDs")}
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>Add Chrome extension IDs to block per IT policy. Supports wildcards.</div>
              <TagInput label="" placeholder="mdanidgdpmkimeiiojknlnekblgmpdll" values={cfg.extensionIds ?? []} onChange={v => onChange({ ...cfg, extensionIds: v })} />
            </>
          )}

          {/* Session theft marker */}
          {ctrl.hasMarker && (
            <>
              {sec("SESSION MARKER")}
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>A unique token is injected into User Agent strings. Use app logs to detect sessions without this marker.</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ flex: 1, padding: "9px 12px", background: "#0d1525", border: "1px solid #2d3748", borderRadius: 8, fontFamily: "monospace", fontSize: 12, color: "#818cf8" }}>
                  {cfg.markerToken || "SL-xxxxxxxx-xxxx"}
                </div>
                <button onClick={() => {
                  const rand = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => b.toString(16).padStart(2,"0")).join("").toUpperCase();
                  onChange({ ...cfg, markerToken: `SL-${rand}` });
                }} style={{ padding: "9px 12px", background: "#1e2d45", border: "1px solid #2d3748", borderRadius: 8, color: "#60a5fa", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Generate new
                </button>
              </div>

              {sec("MONITORED APP DOMAINS")}
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>The extension injects the marker on these domains. Supports wildcards (e.g. <code style={{ color: "#94a3b8" }}>*.okta.com</code>).</div>
              <TagInput label="" placeholder="example.okta.com" values={cfg.appDomains ?? []} onChange={v => onChange({ ...cfg, appDomains: v })} />
            </>
          )}

          {/* Secret masking advanced settings */}
          {ctrl.hasSecretSettings && (
            <>
              {sec("MASKING STYLE")}
              <div style={{ display: "flex", gap: 6 }}>
                {["blur","mask","custom"].map(s => (
                  <button key={s} onClick={() => setSm("masking_style", s)}
                    style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${sm.masking_style === s ? "#a78bfa" : "#2d3748"}`, background: sm.masking_style === s ? "#a78bfa18" : "#0d1525", color: sm.masking_style === s ? "#a78bfa" : "#64748b", fontSize: 11, fontWeight: sm.masking_style === s ? 700 : 400, cursor: "pointer" }}>
                    {s === "blur" ? "Blur" : s === "mask" ? "Mask (***)" : "Custom"}
                  </button>
                ))}
              </div>

              {sec("BEHAVIOUR TOGGLES")}
              {[
                ["mask_console",          "Mask browser console output"],
                ["auto_mask_textareas",   "Auto mask text areas"],
                ["auto_mask_inputs",      "Auto mask input fields"],
                ["auto_mask_editor",      "Auto mask code editors"],
                ["overlay_input",         "Overlay badge on inputs"],
                ["overlay_textarea",      "Overlay badge on text areas"],
                ["overlay_editor",        "Overlay badge on editors"],
                ["block_network_secrets", "Block secrets in network requests"],
                ["block_form_submission", "Block form submission with secrets"],
                ["global_masking_status", "Global masking enabled"],
                ["enterprise_data_collection","Enterprise telemetry"],
              ].map(([k, lbl]) => (
                <ToggleRow key={k} label={lbl} value={!!(sm[k] ?? false)} onChange={v => setSm(k, v)} />
              ))}

              {sec("SITE EXCLUSIONS")}
              <ToggleRow label="site_exclusions_status" value={!!(sm.site_exclusions_status ?? false)} onChange={v => setSm("site_exclusions_status", v)} />
              <div style={{ marginTop: 8 }}>
                <TagInput label="" placeholder="example.com" values={(sm.site_exclusions as string[]) ?? []} onChange={v => setSm("site_exclusions", v)} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #1e2d45", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #2d3748", background: "transparent", color: "#64748b", fontSize: 13, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onSave} disabled={saving}
            style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: "#818cf8", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : "Save Configuration"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Control card
───────────────────────────────────────────────────────────────────────── */
function ControlCard({ ctrl, cfg, onClick }: { ctrl: ControlDef; cfg: ControlConfig; onClick: () => void }) {
  const isEnabled = cfg.enabled || ctrl.hasMarker;
  const modeLabel = ctrl.hasAction && cfg.action ? cfg.action : ctrl.hasMarker ? "Active" : isEnabled ? "Enabled" : "Disabled";
  const modeColor = !isEnabled && !ctrl.hasMarker ? "#4a5568" : cfg.action === "BLOCK" ? "#ef4444" : cfg.action === "WARN" ? "#f59e0b" : cfg.action === "MASK" ? "#a78bfa" : "#22c55e";

  return (
    <div onClick={onClick} style={{ background: "#0b1120", border: "1px solid #1e2d45", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "border-color .2s, box-shadow .2s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#2d3748"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,.4)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1e2d45"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
      {/* Banner */}
      <div style={{ height: 90, overflow: "hidden" }}>
        {ctrl.bannerEl}
      </div>
      {/* Body */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3" }}>{ctrl.title}</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#4a5568" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: modeColor, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: modeColor }}>Mode: {modeLabel}</span>
        </div>
        <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{ctrl.desc}</div>
        <div style={{ marginTop: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: `${ctrl.tagColor}18`, border: `1px solid ${ctrl.tagColor}33`, color: ctrl.tagColor }}>
            {ctrl.tag}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────────────────── */
const DEFAULT_GROUPS: Group[] = [
  { id: "engineering",  name: "Engineering" },
  { id: "hr",           name: "HR" },
  { id: "support",      name: "Support" },
  { id: "call_center",  name: "Call Center" },
  { id: "finance",      name: "Finance" },
  { id: "marketing",    name: "Marketing" },
  { id: "all",          name: "All Employees" },
];

const defaultCfg = (): ControlConfig => ({ enabled: false, groups: [], action: "BLOCK", domains: [], extensionIds: [], appDomains: [], markerToken: "", settings: {} });

export default function ControlsPage() {
  const [groups,   setGroups]   = useState<Group[]>(DEFAULT_GROUPS);
  const [configs,  setConfigs]  = useState<Record<string, ControlConfig>>(() =>
    Object.fromEntries(CONTROLS.map(c => [c.id, defaultCfg()]))
  );
  const [active,   setActive]   = useState<string | null>(null);
  const [draft,    setDraft]    = useState<ControlConfig | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState("");

  const activeCtrl = active ? CONTROLS.find(c => c.id === active) : null;

  /* Load from API */
  useEffect(() => {
    apiFetch("/admin/controls").then(d => {
      if (d?.controls) setConfigs(prev => ({ ...prev, ...d.controls }));
    }).catch(() => {});
    apiFetch("/admin/groups").then(d => {
      if (Array.isArray(d?.groups) && d.groups.length) setGroups(d.groups);
    }).catch(() => {});
  }, []);

  const openDrawer = (id: string) => {
    setActive(id);
    setDraft({ ...defaultCfg(), ...configs[id] });
  };

  const closeDrawer = () => { setActive(null); setDraft(null); };

  const save = async () => {
    if (!active || !draft) return;
    setSaving(true);
    try {
      await apiFetch("/admin/controls", {
        method: "PUT",
        body: JSON.stringify({ control_id: active, config: draft }),
      });
      setConfigs(prev => ({ ...prev, [active]: draft }));
      setToast("Configuration saved");
      setTimeout(() => setToast(""), 2500);
      closeDrawer();
    } catch {
      setToast("Failed to save");
      setTimeout(() => setToast(""), 2500);
    }
    setSaving(false);
  };

  return (
    <div style={{ padding: "28px 32px", minHeight: "100vh", background: "#080d16" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Controls</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
          Configure security policies, detection rules, and protection controls for your organisation.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
        {CONTROLS.map(ctrl => (
          <ControlCard key={ctrl.id} ctrl={ctrl} cfg={configs[ctrl.id] ?? defaultCfg()} onClick={() => openDrawer(ctrl.id)} />
        ))}
      </div>

      {/* Drawer */}
      {active && activeCtrl && draft && (
        <ConfigDrawer ctrl={activeCtrl} groups={groups} cfg={draft} onChange={setDraft} onClose={closeDrawer} onSave={save} saving={saving} />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, background: "#1e2d45", border: "1px solid #2d3748", borderRadius: 10, padding: "12px 18px", color: "#c9d1d9", fontSize: 13, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,.5)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
