"use client";
import React, { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────── */
type ActionValue = "DETECT" | "WARN" | "BLOCK" | "MASK";
type Group = { id: string; name: string };

interface UserSettings {
  // phishing site
  phish_detection?: boolean;
  phish_detection_alert?: boolean;
  phish_detection_block?: boolean;
  link_hover_detection?: boolean;
  domain_age_alert?: boolean;
  // phishing mail
  phish_mail_detection?: boolean;
  phish_mail_action?: string;
  // waf / url
  waf_social_domain?: string[];
  // email dlp
  email_dlp_enabled?: boolean;
  email_dlp_domain?: string[];
  email_dlp_action?: string;
  // extension
  blacklist_extension?: { ids?: string[]; action?: string };
  blacklist_extension_status?: string;
  // secret masking
  masking_style?: string;
  mask_console?: boolean;
  auto_mask_textareas?: boolean;
  auto_mask_inputs?: boolean;
  auto_mask_editor?: boolean;
  overlay_input?: boolean;
  overlay_textarea?: boolean;
  overlay_editor?: boolean;
  block_network_secrets?: boolean;
  block_form_submission?: boolean;
  site_exclusions?: string[];
  site_exclusions_status?: boolean;
  global_masking_status?: boolean;
  enterprise_data_collection?: boolean;
  // plan
  Plans?: string;
  [key: string]: unknown;
}

/* ─────────────────────────────────────────────────────────────────────────
   API helpers
───────────────────────────────────────────────────────────────────────── */
const API = process.env.NEXT_PUBLIC_API_URL ?? "https://supabase-auth-fastapi.vercel.app/api";

async function apiFetch(path: string, opts?: RequestInit) {
  const token = typeof window !== "undefined" ? localStorage.getItem("sb_access_token") : null;
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts?.headers ?? {}),
    },
  });
  return res.json();
}

/* ─────────────────────────────────────────────────────────────────────────
   Control definitions
───────────────────────────────────────────────────────────────────────── */
interface ControlDef {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  tag: string;
  tagColor: string;
  bannerEl: React.ReactNode;
  statusLabel: (s: UserSettings) => string;
  isEnabled: (s: UserSettings) => boolean;
}

function PhishBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" preserveAspectRatio="none">
      <rect width="320" height="90" fill="#0f1b2d"/>
      {[20,60,100,150,200,250,290].map((x,i)=><circle key={i} cx={x} cy={20+i%3*18} r={6+i%2*3} stroke="#f9731633" strokeWidth="1.5" fill="none"/>)}
      <path d="M60 55 C80 35 110 70 140 48 C170 26 200 62 230 44 C255 30 275 50 300 38" stroke="#ef444466" strokeWidth="1.8" fill="none"/>
      <circle cx="160" cy="48" r="16" stroke="#ef4444" strokeWidth="1.8" fill="#ef444422"/>
      <path d="M153 48l5 6 9-10" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function MailBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" preserveAspectRatio="none">
      <rect width="320" height="90" fill="#0f1b2d"/>
      <rect x="80" y="18" width="160" height="54" rx="6" stroke="#f9731444" fill="#f9731411"/>
      <path d="M80 24l80 32 80-32" stroke="#f97314" strokeWidth="1.4" fill="none"/>
      <path d="M146 58l-9 9M162 58l9 9" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function WafBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" preserveAspectRatio="none">
      <rect width="320" height="90" fill="#0f1b2d"/>
      <path d="M160 10l-70 25v28c0 22 30 38 70 45 40-7 70-23 70-45V35z" stroke="#ef444455" strokeWidth="1.5" fill="#ef444411"/>
      <text x="160" y="52" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="600">⚠ Blocked</text>
    </svg>
  );
}
function UrlBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" preserveAspectRatio="none">
      <rect width="320" height="90" fill="#0f1b2d"/>
      <rect x="60" y="22" width="200" height="46" rx="8" stroke="#ef444455" fill="#ef444411"/>
      <text x="160" y="50" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="600">🚫 This site is blocked</text>
    </svg>
  );
}
function SessionBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" preserveAspectRatio="none">
      <rect width="320" height="90" fill="#0f1b2d"/>
      {[40,90,140,190,240].map((x,i)=><rect key={i} x={x} y={18+i%2*14} width="44" height="8" rx="2" fill="#1e3a5f" opacity="0.9"/>)}
      <rect x="100" y="44" width="90" height="10" rx="2" fill="#ef444455"/>
      <text x="145" y="53" textAnchor="middle" fill="#ef4444" fontSize="7">session [missing]</text>
    </svg>
  );
}
function ExtBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" preserveAspectRatio="none">
      <rect width="320" height="90" fill="#0f1b2d"/>
      {[60,120,180,240].map((x,i)=><rect key={i} x={x} y={24} width="38" height="38" rx="6" stroke="#818cf844" fill="#818cf811"/>)}
      <path d="M152 43l12-12M152 43l12 12M164 43H176" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function DlpBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" preserveAspectRatio="none">
      <rect width="320" height="90" fill="#0f1b2d"/>
      {[0,1,2].map(i=><rect key={i} x={80+i*52} y={20} width="40" height="50" rx="4" stroke="#60a5fa44" fill="#60a5fa11"/>)}
      <path d="M120 45h40M164 45h40" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 2"/>
    </svg>
  );
}
function MaskBanner() {
  return (
    <svg width="100%" height="90" viewBox="0 0 320 90" preserveAspectRatio="none">
      <rect width="320" height="90" fill="#0f1b2d"/>
      {["API_KEY=•••••••","TOKEN=••••••••","SECRET=•••••••"].map((t,i)=>(
        <text key={i} x="60" y={28+i*20} fill="#a78bfa88" fontSize="11" fontFamily="monospace">{t}</text>
      ))}
      <rect x="56" y="14" width="130" height="64" rx="4" stroke="#a78bfa44" fill="none"/>
    </svg>
  );
}

const CONTROLS: ControlDef[] = [
  {
    id: "phishing_site",
    title: "Phishing Site Detection",
    shortDesc: "Detect and block phishing websites in real time.",
    longDesc: "Detect when your employees visit malicious or phishing websites. SecureLint scans URLs on every navigation and can warn, flag, or block access based on your policy.",
    tag: "Phishing", tagColor: "#f97316",
    bannerEl: <PhishBanner />,
    isEnabled: s => !!(s.phish_detection),
    statusLabel: s => s.phish_detection ? (s.phish_detection_block ? "Block" : s.phish_detection_alert ? "Warn" : "Detect") : "Disabled",
  },
  {
    id: "phishing_mail",
    title: "Phishing Mail Detection",
    shortDesc: "AI-powered phishing email detection in Gmail & Outlook.",
    longDesc: "Scan incoming emails for phishing patterns, sender spoofing, suspicious links, and social engineering signals. Works inside Gmail and Outlook mail clients.",
    tag: "Phishing", tagColor: "#f97316",
    bannerEl: <MailBanner />,
    isEnabled: s => !!(s.phish_mail_detection),
    statusLabel: s => s.phish_mail_detection ? (s.phish_mail_action?.toUpperCase() || "Detect") : "Disabled",
  },
  {
    id: "waf_domain",
    title: "WAF Domain Blocking",
    shortDesc: "Block access to social-engineering and malicious domains.",
    longDesc: "Maintain a custom block-list of domains. When an employee navigates to a blocked domain the extension can warn or block the page.",
    tag: "Response", tagColor: "#ef4444",
    bannerEl: <WafBanner />,
    isEnabled: s => !!(s.waf_social_domain?.length),
    statusLabel: s => s.waf_social_domain?.length ? `${s.waf_social_domain.length} domain${s.waf_social_domain.length > 1 ? "s" : ""}` : "Not configured",
  },
  {
    id: "url_blocking",
    title: "URL Blocking",
    shortDesc: "Blocklist specific URLs or domain patterns.",
    longDesc: "Prevent employees from visiting specific URLs. Supports wildcards (e.g. *.example.com). Blocked pages show a policy enforcement message.",
    tag: "Response", tagColor: "#ef4444",
    bannerEl: <UrlBanner />,
    isEnabled: s => !!(s.waf_social_domain?.length),
    statusLabel: s => s.waf_social_domain?.length ? `${s.waf_social_domain.length} URL${s.waf_social_domain.length > 1 ? "s" : ""}` : "Not configured",
  },
  {
    id: "session_theft",
    title: "Session Theft Detection",
    shortDesc: "Unique marker in User Agent to detect stolen sessions.",
    longDesc: "Add a unique token to the browser User Agent string. By comparing app logs, you can identify sessions that are missing the marker — a strong indicator of session token theft.",
    tag: "Detection", tagColor: "#60a5fa",
    bannerEl: <SessionBanner />,
    isEnabled: () => false,
    statusLabel: () => "Monitoring",
  },
  {
    id: "malicious_extension",
    title: "Malicious Extension Blocking",
    shortDesc: "Block or warn for blacklisted browser extensions.",
    longDesc: "Define a list of Chrome extension IDs that violate your IT policy. SecureLint can detect, warn, or block access when a blacklisted extension is active.",
    tag: "Extensions", tagColor: "#818cf8",
    bannerEl: <ExtBanner />,
    isEnabled: s => !!(s.blacklist_extension_status && s.blacklist_extension_status !== "disabled"),
    statusLabel: s => s.blacklist_extension_status || "Not configured",
  },
  {
    id: "email_dlp",
    title: "Cross-Domain Mail Control",
    shortDesc: "Monitor outbound emails sent to external domains.",
    longDesc: "Detect when employees send emails to domains outside your organisation. Configure an allowlist of trusted external domains and choose how to respond — detect, warn, or block.",
    tag: "DLP", tagColor: "#60a5fa",
    bannerEl: <DlpBanner />,
    isEnabled: s => !!(s.email_dlp_enabled),
    statusLabel: s => s.email_dlp_enabled ? (s.email_dlp_action?.toUpperCase() || "Detect") : "Disabled",
  },
  {
    id: "secret_masking",
    title: "Secret Masking",
    shortDesc: "Auto-detect and mask secrets typed in the browser.",
    longDesc: "Automatically detect API keys, tokens, and secrets typed or pasted in the browser. Mask them in real time across text areas, input fields, code editors, and network requests.",
    tag: "Masking", tagColor: "#a78bfa",
    bannerEl: <MaskBanner />,
    isEnabled: s => !!(s.global_masking_status),
    statusLabel: s => s.global_masking_status ? (s.masking_style || "blur") : "Disabled",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   Action dropdown
───────────────────────────────────────────────────────────────────────── */
const ACTION_META: Record<string, { label: string; color: string; icon: string }> = {
  DETECT: { label: "Detect",  color: "#60a5fa", icon: "🔍" },
  WARN:   { label: "Warn",    color: "#f59e0b", icon: "⚠️" },
  BLOCK:  { label: "Block",   color: "#ef4444", icon: "🚫" },
  MASK:   { label: "Mask",    color: "#a78bfa", icon: "👁" },
};

function ActionDropdown({ choices, value, onChange }: { choices: ActionValue[]; value: ActionValue; onChange: (v: ActionValue) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = ACTION_META[value] ?? ACTION_META.DETECT;
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#0d1525", border: `1px solid ${meta.color}55`, borderRadius: 8, color: meta.color, fontSize: 13, fontWeight: 600, cursor: "pointer", minWidth: 120 }}>
        <span>{meta.icon}</span>
        <span style={{ flex: 1 }}>{meta.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: ".2s" }}><path d="M6 9l6 6 6-6" stroke={meta.color} strokeWidth="2.5" strokeLinecap="round"/></svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, background: "#0d1525", border: "1px solid #2d3748", borderRadius: 8, zIndex: 60, minWidth: 140, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,.6)" }}>
          {choices.map(c => {
            const m = ACTION_META[c];
            return (
              <button key={c} onClick={() => { onChange(c); setOpen(false); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: value === c ? `${m.color}18` : "transparent", border: "none", borderBottom: "1px solid #1a2540", color: m.color, fontSize: 13, fontWeight: value === c ? 700 : 400, cursor: "pointer", textAlign: "left" }}>
                <span>{m.icon}</span><span>{m.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Toggle switch
───────────────────────────────────────────────────────────────────────── */
function Toggle({ value, onChange, accent = "#818cf8" }: { value: boolean; onChange: (v: boolean) => void; accent?: string }) {
  return (
    <button onClick={() => onChange(!value)} style={{ width: 40, height: 22, borderRadius: 11, border: "none", background: value ? accent : "#2d3748", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: 3, left: value ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s", display: "block" }} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Section label
───────────────────────────────────────────────────────────────────────── */
function Sec({ label, info }: { label: string; info?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, marginTop: 22 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#c9d1d9" }}>{label}</span>
      {info && <span title={info} style={{ width: 16, height: 16, borderRadius: "50%", border: "1px solid #4a5568", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#64748b", cursor: "help", flexShrink: 0 }}>i</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Domain / tag list table
───────────────────────────────────────────────────────────────────────── */
function DomainTable({ values, onRemove, placeholder, onAdd, label, wildcardNote }: {
  values: string[]; onRemove: (v: string) => void; placeholder: string;
  onAdd: (v: string) => void; label: string; wildcardNote?: boolean;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onAdd(v);
    setInput("");
  };
  return (
    <div>
      {wildcardNote && (
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
          Domain entry supports the use of wildcards
          <span style={{ padding: "1px 5px", border: "1px solid #ef444466", borderRadius: 4, color: "#f87171", fontSize: 10 }}>*</span>
        </div>
      )}
      {/* Input row */}
      <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #2d3748" }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          style={{ flex: 1, padding: "9px 12px", background: "#0d1525", border: "none", color: "#c9d1d9", fontSize: 13, outline: "none" }} />
        <button onClick={add}
          style={{ padding: "9px 18px", background: "#d97706", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
          + Add
        </button>
      </div>
      {/* Table */}
      {values.length > 0 && (
        <div style={{ marginTop: 8, border: "1px solid #2d3748", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "7px 12px", background: "#111827", borderBottom: "1px solid #2d3748" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Delete</span>
          </div>
          {values.map((v, i) => (
            <div key={v} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", padding: "9px 12px", background: i % 2 === 0 ? "#0d1525" : "#0b1120", borderBottom: i < values.length - 1 ? "1px solid #1a2540" : "none" }}>
              <span style={{ fontSize: 13, color: "#c9d1d9", fontFamily: "monospace" }}>{v}</span>
              <button onClick={() => onRemove(v)} style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer", padding: "2px 6px", borderRadius: 4, transition: ".15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={e => (e.currentTarget.style.color = "#4a5568")}>
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Toggle row for settings list
───────────────────────────────────────────────────────────────────────── */
function ToggleRow({ label, value, onChange, sub }: { label: string; value: boolean; onChange: (v: boolean) => void; sub?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1a2540" }}>
      <div>
        <div style={{ fontSize: 13, color: "#c9d1d9" }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{sub}</div>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Group multi-select (enterprise only)
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
  const label = selected.length === 0 ? "All employees" : `${selected.length} group${selected.length > 1 ? "s" : ""} selected`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: "#0d1525", border: "1px solid #2d3748", borderRadius: 8, color: "#c9d1d9", fontSize: 13, cursor: "pointer" }}>
        <span>{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: ".2s" }}>
          <path d="M6 9l6 6 6-6" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#0d1525", border: "1px solid #2d3748", borderRadius: 8, zIndex: 60, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,.5)" }}>
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
   Drawer content per control
───────────────────────────────────────────────────────────────────────── */
function DrawerContent({ ctrl, settings, groups, isEnterprise, onChange }: {
  ctrl: ControlDef;
  settings: UserSettings;
  groups: Group[];
  isEnterprise: boolean;
  onChange: (patch: Partial<UserSettings>) => void;
}) {
  const [selGroups, setSelGroups] = useState<string[]>([]);
  const set = (patch: Partial<UserSettings>) => onChange(patch);

  switch (ctrl.id) {
    case "phishing_site":
      return (
        <>
          <Sec label="Enable" />
          <ToggleRow label="Enable phishing site detection" value={!!settings.phish_detection}
            onChange={v => set({ phish_detection: v })} />
          <ToggleRow label="Link hover detection" value={!!settings.link_hover_detection}
            sub="Warn when hovering over suspicious links" onChange={v => set({ link_hover_detection: v })} />
          <ToggleRow label="Domain age alert" value={!!settings.domain_age_alert}
            sub="Flag newly registered domains (< 30 days)" onChange={v => set({ domain_age_alert: v })} />

          <Sec label="Action" info="How SecureLint responds when a phishing site is detected" />
          <ActionDropdown choices={["DETECT","WARN","BLOCK"]}
            value={(settings.phish_detection_block ? "BLOCK" : settings.phish_detection_alert ? "WARN" : "DETECT") as ActionValue}
            onChange={v => set({ phish_detection_alert: v === "WARN", phish_detection_block: v === "BLOCK" })} />

          {isEnterprise && (
            <>
              <Sec label="Apply to groups" info="Leave empty to apply to all employees" />
              <GroupPicker groups={groups} selected={selGroups} onChange={setSelGroups} />
            </>
          )}

          <Sec label="Whitelist domains" info="These domains will never be flagged" />
          <DomainTable label="Domains" placeholder="example.com" wildcardNote values={[]}
            onAdd={() => {}} onRemove={() => {}} />
        </>
      );

    case "phishing_mail":
      return (
        <>
          <Sec label="Enable" />
          <ToggleRow label="Enable phishing mail detection" value={!!settings.phish_mail_detection}
            onChange={v => set({ phish_mail_detection: v })} />

          <Sec label="Action" info="How SecureLint responds to a detected phishing email" />
          <ActionDropdown choices={["DETECT","WARN","BLOCK"]}
            value={(settings.phish_mail_action?.toUpperCase() as ActionValue) || "DETECT"}
            onChange={v => set({ phish_mail_action: v.toLowerCase() })} />

          {isEnterprise && (
            <>
              <Sec label="Apply to groups" />
              <GroupPicker groups={groups} selected={selGroups} onChange={setSelGroups} />
            </>
          )}

          <Sec label="Whitelist sender domains" info="Emails from these domains will not be flagged" />
          <DomainTable label="Domains" placeholder="trusted-partner.com" wildcardNote values={[]}
            onAdd={() => {}} onRemove={() => {}} />
        </>
      );

    case "waf_domain":
    case "url_blocking": {
      const domains = settings.waf_social_domain ?? [];
      return (
        <>
          {isEnterprise && (
            <>
              <Sec label="Apply to groups" />
              <GroupPicker groups={groups} selected={selGroups} onChange={setSelGroups} />
            </>
          )}
          <Sec label="Blocked domains / URLs" info="Supports wildcards e.g. *.example.com" />
          <DomainTable label="Domains" placeholder="example.com" wildcardNote
            values={domains}
            onAdd={v => set({ waf_social_domain: [...domains, v] })}
            onRemove={v => set({ waf_social_domain: domains.filter(x => x !== v) })} />
        </>
      );
    }

    case "session_theft": {
      const token = (settings as UserSettings & { session_marker?: string }).session_marker || "";
      return (
        <>
          <Sec label="Unique marker" info="A random token injected into User Agent strings to detect session theft" />
          <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 12 }}>
            Add a unique marker to the User Agent string with the browser extension. Using app logs that contain session IDs and UA strings, you can discover session theft.
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => {
              const rand = Array.from(crypto.getRandomValues(new Uint8Array(5))).map(b => b.toString(16).padStart(2,"0")).join("").toUpperCase();
              set({ session_marker: `SL-${rand}` } as Partial<UserSettings>);
            }} style={{ padding: "9px 14px", background: "#0d1525", border: "1px solid #2d3748", borderRadius: 8, color: "#c9d1d9", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
              Generate new marker
            </button>
            <div style={{ flex: 1, padding: "9px 12px", background: "#0d1525", border: "1px solid #ef444466", borderRadius: 8, fontFamily: "monospace", fontSize: 13, color: "#f87171" }}>
              {token || "SL-XXXXXXXXXX"}
            </div>
          </div>

          <Sec label="Manually add app domains" />
          <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 10 }}>
            The extension will inject the marker on these domains to help your team analyse the logs in the target app. This can identify sessions with and without the marker.
          </p>
          <DomainTable label="Domains" placeholder="example.okta.com" wildcardNote
            values={(settings as UserSettings & { session_domains?: string[] }).session_domains || []}
            onAdd={v => set({ session_domains: [...((settings as UserSettings & { session_domains?: string[] }).session_domains || []), v] } as Partial<UserSettings>)}
            onRemove={v => set({ session_domains: ((settings as UserSettings & { session_domains?: string[] }).session_domains || []).filter(x => x !== v) } as Partial<UserSettings>)} />
        </>
      );
    }

    case "malicious_extension": {
      const bl = settings.blacklist_extension ?? {};
      const extIds: string[] = bl.ids ?? [];
      return (
        <>
          <Sec label="Action" info="How SecureLint responds when a blacklisted extension is detected" />
          <ActionDropdown choices={["DETECT","WARN","BLOCK"]}
            value={(bl.action?.toUpperCase() as ActionValue) || "BLOCK"}
            onChange={v => set({ blacklist_extension: { ...bl, action: v.toLowerCase() }, blacklist_extension_status: v.toLowerCase() })} />

          {isEnterprise && (
            <>
              <Sec label="Apply to groups" />
              <GroupPicker groups={groups} selected={selGroups} onChange={setSelGroups} />
            </>
          )}

          <Sec label="Blocked extension IDs" info="Add Chrome Web Store extension IDs from your IT policy" />
          <DomainTable label="Extension ID" placeholder="mdanidgdpmkimeiiojknlnekblgmpdll"
            values={extIds}
            onAdd={v => set({ blacklist_extension: { ...bl, ids: [...extIds, v] } })}
            onRemove={v => set({ blacklist_extension: { ...bl, ids: extIds.filter(x => x !== v) } })} />
        </>
      );
    }

    case "email_dlp": {
      const dlpDomains = settings.email_dlp_domain ?? [];
      return (
        <>
          <Sec label="Enable" />
          <ToggleRow label="Enable cross-domain mail control" value={!!settings.email_dlp_enabled}
            onChange={v => set({ email_dlp_enabled: v })} />

          <Sec label="Action" info="How SecureLint responds when cross-domain mail is detected" />
          <ActionDropdown choices={["DETECT","WARN","BLOCK"]}
            value={(settings.email_dlp_action?.toUpperCase() as ActionValue) || "DETECT"}
            onChange={v => set({ email_dlp_action: v.toLowerCase() })} />

          {isEnterprise && (
            <>
              <Sec label="Apply to groups" />
              <GroupPicker groups={groups} selected={selGroups} onChange={setSelGroups} />
            </>
          )}

          <Sec label="Allowed external domains" info="Emails to these domains will not be flagged" />
          <DomainTable label="Domains" placeholder="partner.com" wildcardNote
            values={dlpDomains}
            onAdd={v => set({ email_dlp_domain: [...dlpDomains, v] })}
            onRemove={v => set({ email_dlp_domain: dlpDomains.filter(x => x !== v) })} />
        </>
      );
    }

    case "secret_masking": {
      const style = settings.masking_style || "blur";
      const excl = settings.site_exclusions ?? [];
      return (
        <>
          <Sec label="Enable" />
          <ToggleRow label="Global masking enabled" value={!!settings.global_masking_status}
            onChange={v => set({ global_masking_status: v })} />

          <Sec label="Masking style" />
          <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
            {[["blur","Blur"],["mask","Mask (***)"],["custom","Custom"]].map(([val, lbl]) => (
              <button key={val} onClick={() => set({ masking_style: val })}
                style={{ flex: 1, padding: "8px 6px", borderRadius: 8, border: `1px solid ${style === val ? "#a78bfa" : "#2d3748"}`, background: style === val ? "#a78bfa18" : "#0d1525", color: style === val ? "#a78bfa" : "#64748b", fontSize: 12, fontWeight: style === val ? 700 : 400, cursor: "pointer" }}>
                {lbl}
              </button>
            ))}
          </div>

          <Sec label="Action" />
          <ActionDropdown choices={["DETECT","MASK"]}
            value={"MASK" as ActionValue}
            onChange={() => {}} />

          {isEnterprise && (
            <>
              <Sec label="Apply to groups" />
              <GroupPicker groups={groups} selected={selGroups} onChange={setSelGroups} />
            </>
          )}

          <Sec label="Behaviour" />
          {([
            ["mask_console",          "Mask browser console output",    "Prevents secrets from appearing in DevTools"],
            ["auto_mask_textareas",   "Auto mask text areas",           ""],
            ["auto_mask_inputs",      "Auto mask input fields",         ""],
            ["auto_mask_editor",      "Auto mask code editors",         "Monaco, CodeMirror, etc."],
            ["overlay_input",         "Overlay badge on inputs",        ""],
            ["overlay_textarea",      "Overlay badge on text areas",    ""],
            ["overlay_editor",        "Overlay badge on editors",       ""],
            ["block_network_secrets", "Block secrets in network requests",""],
            ["block_form_submission", "Block form submission with secrets",""],
            ["enterprise_data_collection","Enterprise telemetry",       "Anonymous detection events for your org dashboard"],
          ] as [keyof UserSettings, string, string][]).map(([k, lbl, sub]) => (
            <ToggleRow key={k} label={lbl} sub={sub || undefined}
              value={!!(settings[k] ?? false)}
              onChange={v => set({ [k]: v })} />
          ))}

          <Sec label="Site exclusions" />
          <ToggleRow label="Enable site exclusions" value={!!settings.site_exclusions_status}
            onChange={v => set({ site_exclusions_status: v })} />
          <div style={{ marginTop: 8 }}>
            <DomainTable label="Excluded domains" placeholder="example.com" wildcardNote
              values={excl}
              onAdd={v => set({ site_exclusions: [...excl, v] })}
              onRemove={v => set({ site_exclusions: excl.filter(x => x !== v) })} />
          </div>
        </>
      );
    }

    default:
      return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   Config Drawer shell (with slide-in animation)
───────────────────────────────────────────────────────────────────────── */
function ConfigDrawer({ ctrl, settings, groups, isEnterprise, onChange, onClose, onSave, saving }: {
  ctrl: ControlDef; settings: UserSettings; groups: Group[]; isEnterprise: boolean;
  onChange: (patch: Partial<UserSettings>) => void;
  onClose: () => void; onSave: () => void; saving: boolean;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  return (
    <>
      <style>{`
        @keyframes fadeBackdrop { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      {/* Backdrop */}
      <div onClick={handleClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 40, animation: "fadeBackdrop .25s ease" }} />

      {/* Drawer */}
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: 440,
        background: "#0b1120", borderLeft: "1px solid #1e2d45", zIndex: 50,
        display: "flex", flexDirection: "column",
        boxShadow: "-20px 0 60px rgba(0,0,0,.7)",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform .28s cubic-bezier(.4,0,.2,1)",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #1e2d45", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <button onClick={handleClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4, borderRadius: 6, lineHeight: 1 }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1e2d45")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8" }}>Configuration</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#e6edf3" }}>{ctrl.title}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, lineHeight: 1.5 }}>{ctrl.longDesc}</div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 20px" }}>
          <DrawerContent ctrl={ctrl} settings={settings} groups={groups} isEnterprise={isEnterprise} onChange={onChange} />
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #1e2d45", display: "flex", gap: 10, flexShrink: 0 }}>
          <button onClick={handleClose}
            style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #2d3748", background: "transparent", color: "#64748b", fontSize: 13, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onSave} disabled={saving}
            style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: "#818cf8", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1, transition: ".15s" }}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Control card
───────────────────────────────────────────────────────────────────────── */
function ControlCard({ ctrl, settings, onClick }: { ctrl: ControlDef; settings: UserSettings; onClick: () => void }) {
  const enabled = ctrl.isEnabled(settings);
  const modeLabel = ctrl.statusLabel(settings);
  const dotColor = enabled ? "#22c55e" : "#4a5568";

  return (
    <div onClick={onClick}
      style={{ background: "#0b1120", border: "1px solid #1e2d45", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "border-color .2s, box-shadow .2s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#3d4f6a"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,.45)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1e2d45"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
      <div style={{ height: 90, overflow: "hidden" }}>{ctrl.bannerEl}</div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3", flex: 1, paddingRight: 8 }}>{ctrl.title}</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M5 12h14M12 5l7 7-7 7" stroke="#4a5568" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: dotColor, textTransform: "capitalize" }}>Mode: {modeLabel}</span>
        </div>
        <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{ctrl.shortDesc}</div>
        <div style={{ marginTop: 10 }}>
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
  { id: "engineering", name: "Engineering" },
  { id: "hr",          name: "HR" },
  { id: "support",     name: "Support" },
  { id: "call_center", name: "Call Center" },
  { id: "finance",     name: "Finance" },
  { id: "marketing",   name: "Marketing" },
  { id: "all",         name: "All Employees" },
];

export default function ControlsPage() {
  const [settings,     setSettings]     = useState<UserSettings>({});
  const [groups,       setGroups]       = useState<Group[]>(DEFAULT_GROUPS);
  const [isEnterprise, setIsEnterprise] = useState(false);
  const [draft,        setDraft]        = useState<UserSettings>({});
  const [active,       setActive]       = useState<string | null>(null);
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState("");

  useEffect(() => {
    apiFetch("/admin/settings").then(d => {
      if (d?.settings) {
        setSettings(d.settings);
        setDraft(d.settings);
        const plan = (d.settings.Plans || "").toLowerCase();
        setIsEnterprise(plan === "enterprise");
      }
    }).catch(() => {});

    apiFetch("/admin/groups").then(d => {
      if (Array.isArray(d?.groups) && d.groups.length) setGroups(d.groups);
    }).catch(() => {});
  }, []);

  const openDrawer = (id: string) => {
    setActive(id);
    setDraft({ ...settings });
  };

  const closeDrawer = () => setActive(null);

  const handleChange = (patch: Partial<UserSettings>) => {
    setDraft(prev => ({ ...prev, ...patch }));
  };

  const save = async () => {
    setSaving(true);
    const changed: Record<string, unknown> = {};
    for (const k of Object.keys(draft)) {
      if (JSON.stringify(draft[k]) !== JSON.stringify(settings[k])) {
        changed[k] = draft[k];
      }
    }
    if (Object.keys(changed).length === 0) { closeDrawer(); setSaving(false); return; }
    try {
      await apiFetch("/admin/settings", { method: "PUT", body: JSON.stringify(changed) });
      setSettings(draft);
      setToast("Configuration saved successfully");
      setTimeout(() => setToast(""), 2500);
      closeDrawer();
    } catch {
      setToast("Failed to save — please try again");
      setTimeout(() => setToast(""), 2500);
    }
    setSaving(false);
  };

  const activeCtrl = active ? CONTROLS.find(c => c.id === active) : null;

  return (
    <div style={{ padding: "28px 32px", minHeight: "100vh", background: "#080d16" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", margin: 0 }}>Controls</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
          Configure security policies and protection controls for your organisation.
          {!isEnterprise && <span style={{ color: "#f59e0b", marginLeft: 8 }}>⭐ Group targeting requires an Enterprise plan.</span>}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
        {CONTROLS.map(ctrl => (
          <ControlCard key={ctrl.id} ctrl={ctrl} settings={settings} onClick={() => openDrawer(ctrl.id)} />
        ))}
      </div>

      {active && activeCtrl && (
        <ConfigDrawer
          ctrl={activeCtrl} settings={draft} groups={groups}
          isEnterprise={isEnterprise}
          onChange={handleChange} onClose={closeDrawer} onSave={save} saving={saving}
        />
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, background: "#1e2d45", border: "1px solid #2d3748", borderRadius: 10, padding: "12px 18px", color: "#c9d1d9", fontSize: 13, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,.5)", animation: "fadeBackdrop .2s ease" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
