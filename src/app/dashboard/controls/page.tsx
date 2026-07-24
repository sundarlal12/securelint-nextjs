"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchSettings, fetchGroups, createGroup,
  upsertGroupPolicyBatch, fetchGroupPolicy, fetchAllGroupPolicies,
} from "@/lib/adminApi";

/* ─────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────── */
type ActionValue = "DETECT" | "WARN" | "BLOCK" | "MASK" | "OFF";
type Group = { id: string; group_name: string; member_count?: number; members?: { user_id: string; email: string }[] };

interface UserSettings {
  phish_detection?: boolean;
  phish_detection_alert?: boolean;
  phish_detection_block?: boolean;
  link_hover_detection?: boolean;
  domain_age_alert?: boolean;
  phish_site_whitelist?: string[];       // whitelist domains for phishing site detection
  phish_mail_detection?: boolean;
  phish_mail_action?: string;
  phish_mail_whitelist?: string[];       // whitelist sender domains for phishing mail
  session_marker?: string;
  session_domains?: string[];
  waf_social_domain?: string[];
  email_dlp_enabled?: boolean;
  email_dlp_domain?: string[];
  email_dlp_action?: string;
  blacklist_extension?: string[];
  blacklist_extension_status?: string;
  enable_detection?: boolean;
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
  enterprise_email_domains?: string[];
  extension_scrape_data?: boolean;
  password_breach_data?: boolean;
  blur_web?: boolean;
  Plans?: string;
  /** Maps control_id → list of group IDs the control applies to */
  control_groups?: Record<string, string[]>;
  [key: string]: unknown;
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

/* ── Banners ────────────────────────────────────────────────────────────── */
const Svg = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 320 90" preserveAspectRatio="xMidYMid slice">
    <rect width="320" height="90" fill="#0a1628"/>
    {children}
    <rect width="320" height="90" fill={`${color}08`}/>
  </svg>
);
const banners = {
  phishing_site: <Svg color="#ea580c">
    {[20,70,130,200,260,300].map((x,i)=><circle key={i} cx={x} cy={15+i%3*22} r={7+i%2*4} stroke="#ea580c33" strokeWidth="1.5" fill="none"/>)}
    <circle cx="160" cy="48" r="18" stroke="#dc2626" strokeWidth="1.8" fill="#dc262618"/>
    <path d="M153 48l5 6 9-10" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M60 55C90 35 120 68 150 48s60 14 90-4" stroke="#dc262666" strokeWidth="1.5" fill="none"/>
  </Svg>,
  phishing_mail: <Svg color="#ea580c">
    <rect x="75" y="20" width="170" height="52" rx="6" stroke="#f9731455" fill="#f9731412"/>
    <path d="M75 26l85 30 85-30" stroke="#f97314" strokeWidth="1.5" fill="none"/>
    <path d="M148 60l-9 9M170 60l9 9" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
  </Svg>,
  waf_domain: <Svg color="#dc2626">
    <path d="M160 12L90 36v27c0 22 30 36 70 43 40-7 70-21 70-43V36z" stroke="#dc262655" strokeWidth="1.5" fill="#dc262612"/>
    <text x="160" y="53" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="600">⚠ Blocked</text>
  </Svg>,
  url_blocking: <Svg color="#dc2626">
    <rect x="55" y="22" width="210" height="46" rx="8" stroke="#dc262655" fill="#dc262612"/>
    <text x="160" y="50" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="600">🚫 This site is blocked</text>
  </Svg>,
  session_theft: <Svg color="#2563eb">
    {[40,90,145,195,248].map((x,i)=><rect key={i} x={x} y={18+i%2*16} width="46" height="8" rx="2" fill="#1e3a5f" opacity="0.9"/>)}
    <rect x="98" y="46" width="94" height="12" rx="2" fill="#dc262650"/>
    <text x="145" y="56" textAnchor="middle" fill="#dc2626" fontSize="8">session [missing]</text>
  </Svg>,
  malicious_extension: <Svg color="#4f46e5">
    {[58,116,176,236].map((x,i)=><rect key={i} x={x} y={26} width="38" height="38" rx="6" stroke="#4f46e544" fill="#4f46e512"/>)}
    <path d="M150 45l13-13M150 45l13 13" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
  </Svg>,
  email_dlp: <Svg color="#2563eb">
    {[0,1,2].map(i=><rect key={i} x={80+i*54} y={20} width="42" height="50" rx="5" stroke="#2563eb44" fill="#2563eb11"/>)}
    <path d="M122 45h40M164 45h40" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 2"/>
  </Svg>,
  secret_masking: <Svg color="#7c3aed">
    {["API_KEY=•••••","TOKEN=••••••","SECRET=•••••"].map((t,i)=>(
      <text key={i} x="62" y={30+i*20} fill="#7c3aed88" fontSize="11" fontFamily="monospace">{t}</text>
    ))}
    <rect x="58" y="16" width="130" height="64" rx="4" stroke="#7c3aed44" fill="none"/>
  </Svg>,
  enterprise_data: <Svg color="#0d9488">
    {[60,120,180,240].map((x,i)=><circle key={i} cx={x} cy={45} r={12+i%3*4} stroke="#0d948833" strokeWidth="1.5" fill="#0d948810"/>)}
    <path d="M100 45h120M130 32h60M130 58h60" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/>
  </Svg>,
  blur_secrets: <Svg color="#fb923c">
    {["████████","██████████","███████"].map((t,i)=>(
      <text key={i} x="90" y={28+i*22} fill="#fb923c55" fontSize="13" fontFamily="monospace">{t}</text>
    ))}
    <rect x="82" y="14" width="160" height="62" rx="5" stroke="#fb923c44" fill="none"/>
    <circle cx="240" cy="16" r="6" fill="#fb923c55"/>
  </Svg>,
};

/**
 * CDN banner images per control. Falls back to the hand-drawn SVG banner
 * above for any control without an image (e.g. secret_masking).
 */
const bannerImages: Record<string, string> = {
  phishing_site:       "https://ik.imagekit.io/securelint/securelint_dashboard/phishing-site.png",
  phishing_mail:       "https://ik.imagekit.io/securelint/securelint_dashboard/phishing-email.png",
  waf_domain:          "https://ik.imagekit.io/securelint/securelint_dashboard/waf-domain.png",
  session_theft:       "https://ik.imagekit.io/securelint/securelint_dashboard/session-theft.png",
  malicious_extension: "https://ik.imagekit.io/securelint/securelint_dashboard/malicious-extension.png",
  email_dlp:           "https://ik.imagekit.io/securelint/securelint_dashboard/email-dlp.png",
  enterprise_data:     "https://ik.imagekit.io/securelint/securelint_dashboard/data-collection1.jpg",
  blur_secrets:        "https://ik.imagekit.io/securelint/securelint_dashboard/blur-secret-meeting-mode.jpg",
  secret_masking:      "https://ik.imagekit.io/securelint/securelint_dashboard/secret-masking.jpg",
};

/**
 * Maps each control ID to the user_settings field names it owns.
 * Used to extract only the relevant fields when writing group policies.
 */
const CONTROL_FIELDS_MAP: Record<string, (keyof UserSettings)[]> = {
  phishing_site:       ["phish_detection","phish_detection_alert","phish_detection_block","link_hover_detection","domain_age_alert","phish_site_whitelist"],
  phishing_mail:       ["phish_mail_detection","phish_mail_action","phish_mail_whitelist"],
  waf_domain:          ["waf_social_domain"],
  session_theft:       ["session_marker","session_domains"],
  malicious_extension: ["blacklist_extension","blacklist_extension_status"],
  email_dlp:           ["email_dlp_enabled","email_dlp_domain","email_dlp_action"],
  secret_masking:      ["enable_detection","global_masking_status","masking_style","mask_console","auto_mask_textareas","auto_mask_inputs","auto_mask_editor","overlay_input","overlay_textarea","overlay_editor","block_network_secrets","block_form_submission","site_exclusions","site_exclusions_status"],
  enterprise_data:     ["enterprise_data_collection","enterprise_email_domains","extension_scrape_data","password_breach_data"],
  blur_secrets:        ["blur_web"],
};

const CONTROLS: ControlDef[] = [
  {
    id:"phishing_site",title:"Phishing Site Detection",
    shortDesc:"Detect and block phishing websites in real time.",
    longDesc:"Detect when employees visit malicious or phishing websites. SecureLint scans URLs on every navigation and can warn, flag, or block access based on your policy.",
    tag:"Phishing",tagColor:"#ea580c",bannerEl:banners.phishing_site,
    isEnabled:s=>!!(s.phish_detection),
    statusLabel:s=>s.phish_detection?(s.phish_detection_block?"Block":s.phish_detection_alert?"Warn":"Detect"):"Disabled",
  },
  {
    id:"phishing_mail",title:"Phishing Mail Detection",
    shortDesc:"AI-powered phishing email detection in Gmail & Outlook.",
    longDesc:"Scan incoming emails for phishing patterns, sender spoofing, and social engineering signals. Works inside Gmail and Outlook mail clients.",
    tag:"Phishing",tagColor:"#ea580c",bannerEl:banners.phishing_mail,
    isEnabled:s=>!!(s.phish_mail_detection),
    statusLabel:s=>s.phish_mail_detection?(s.phish_mail_action?.toUpperCase()||"Detect"):"Disabled",
  },
  {
    id:"waf_domain",title:"Domain & URL Blocking",
    shortDesc:"Block access to specific domains, URLs, or social-engineering sites.",
    longDesc:"Maintain a custom blocklist of domains and URLs. Supports wildcards (e.g. *.example.com). When an employee navigates to a blocked address the extension warns or blocks the page per your policy.",
    tag:"Response",tagColor:"#dc2626",bannerEl:banners.waf_domain,
    isEnabled:s=>!!(s.waf_social_domain?.length),
    statusLabel:s=>s.waf_social_domain?.length?`${s.waf_social_domain.length} domain${s.waf_social_domain.length>1?"s":""}`:"Not configured",
  },
  {
    id:"session_theft",title:"Session Theft Detection",
    shortDesc:"Unique marker in User Agent to detect stolen sessions.",
    longDesc:"Add a unique token to the browser User Agent string. By comparing app logs you can identify sessions missing the marker — a strong indicator of session token theft.",
    tag:"Detection",tagColor:"#2563eb",bannerEl:banners.session_theft,
    isEnabled:()=>false,statusLabel:()=>"Monitoring",
  },
  {
    id:"malicious_extension",title:"Malicious Extension Blocking",
    shortDesc:"Block or warn for blacklisted browser extensions.",
    longDesc:"Define a list of Chrome extension IDs that violate your IT policy. SecureLint can detect, warn, or block when a blacklisted extension is active.",
    tag:"Extensions",tagColor:"#4f46e5",bannerEl:banners.malicious_extension,
    isEnabled:s=>!!(s.blacklist_extension_status&&s.blacklist_extension_status!=="disabled"),
    statusLabel:s=>s.blacklist_extension_status||"Not configured",
  },
  {
    id:"email_dlp",title:"Cross-Domain Mail Control",
    shortDesc:"Monitor outbound emails sent to external domains.",
    longDesc:"Detect when employees send emails outside your organisation. Configure an allowlist of trusted external domains and choose how to respond.",
    tag:"DLP",tagColor:"#2563eb",bannerEl:banners.email_dlp,
    isEnabled:s=>!!(s.email_dlp_enabled),
    statusLabel:s=>s.email_dlp_enabled?(s.email_dlp_action?.toUpperCase()||"Detect"):"Disabled",
  },
  {
    id:"secret_masking",title:"Secret Masking",
    shortDesc:"Auto-detect and mask secrets typed in the browser.",
    longDesc:"Automatically detect API keys, tokens, and secrets typed or pasted in the browser. Mask them in real time across inputs, text areas, code editors, and network requests.",
    tag:"Masking",tagColor:"#7c3aed",bannerEl:banners.secret_masking,
    isEnabled:s=>!!(s.global_masking_status),
    statusLabel:s=>s.global_masking_status?(s.masking_style||"blur"):"Disabled",
  },
  {
    id:"enterprise_data",title:"Enterprise Data Collection",
    shortDesc:"Control what telemetry and data the extension collects for your org.",
    longDesc:"Configure which data points the SecureLint extension reports to your organisation dashboard — extension scraping, password breach checks, email domain collection, and anonymous telemetry. Fine-grained control per group.",
    tag:"Enterprise",tagColor:"#0d9488",bannerEl:banners.enterprise_data,
    isEnabled:s=>!!(s.enterprise_data_collection||s.extension_scrape_data||s.password_breach_data),
    statusLabel:s=>(s.enterprise_data_collection||s.extension_scrape_data||s.password_breach_data)?"Active":"Disabled",
  },
  {
    id:"blur_secrets",title:"Blur Secrets in Meeting Mode",
    shortDesc:"Auto-blur browser content when screen sharing is detected.",
    longDesc:"When the SecureLint extension detects screen sharing or a web-based video meeting, it automatically blurs sensitive browser content — preventing accidental exposure of secrets, tokens, and PII to other meeting participants.",
    tag:"Privacy",tagColor:"#fb923c",bannerEl:banners.blur_secrets,
    isEnabled:s=>!!(s.blur_web),
    statusLabel:s=>s.blur_web?"Enabled":"Disabled",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   Action dropdown — rich with icon + description (matches screenshot)
───────────────────────────────────────────────────────────────────────── */
const ACTION_DEFS: Record<string, { label: string; color: string; desc: string; icon: React.ReactNode }> = {
  OFF:    { label:"Off",    color:"#52525b", desc:"Disables this feature for selected employees.", icon:(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v6M6.3 5.3a8 8 0 100 13.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
  )},
  DETECT: { label:"Detect", color:"#2563eb", desc:"Scans and logs the activity without interrupting the user.", icon:(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M16.5 16.5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
  )},
  WARN:   { label:"Warn",   color:"#d97706", desc:"Alerts the employee with a browser notification before proceeding.", icon:(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3H20.5a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
  )},
  BLOCK:  { label:"Block",  color:"#dc2626", desc:"Disables and blocks access for the selected employees or extensions.", icon:(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 12H6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
  )},
  MASK:   { label:"Mask",   color:"#7c3aed", desc:"Masks the secret in real time, keeping the raw value hidden.", icon:(
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
  )},
};

function ActionDropdown({ choices, value, onChange }: { choices: ActionValue[]; value: ActionValue; onChange: (v: ActionValue) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = ACTION_DEFS[value] ?? ACTION_DEFS.DETECT;

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <button onClick={() => setOpen(o => !o)}
        style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#fafafa", border:`1px solid ${current.color}55`, borderRadius:8, color:current.color, fontSize:14, fontWeight:600, cursor:"pointer", transition:".15s" }}>
        <span style={{ color:current.color, display:"flex", alignItems:"center" }}>{current.icon}</span>
        <span style={{ flex:1, textAlign:"left" }}>{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform:open?"rotate(180deg)":"none", transition:".2s", flexShrink:0 }}>
          <path d="M6 9l6 6 6-6" stroke={current.color} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:"#fbfbfc", border:"1px solid #e4e4e7", borderRadius:10, zIndex:60, overflow:"hidden", boxShadow:"0 12px 32px rgba(16,17,20,0.32)" }}>
          <div style={{ padding:"8px 14px 6px", fontSize:10, fontWeight:700, color:"#a1a1aa", letterSpacing:0.8, textTransform:"uppercase" }}>Select</div>
          {choices.map((c, i) => {
            const m = ACTION_DEFS[c];
            const isSelected = c === value;
            return (
              <button key={c} onClick={() => { onChange(c); setOpen(false); }}
                style={{ width:"100%", display:"flex", alignItems:"flex-start", gap:12, padding:"10px 14px", background: isSelected ? `${m.color}15` : "transparent", border:"none", borderTop: i === 0 ? "1px solid #fafafa" : "1px solid #fafafa", cursor:"pointer", textAlign:"left" }}>
                <span style={{ color:m.color, display:"flex", alignItems:"center", marginTop:2, flexShrink:0 }}>{m.icon}</span>
                <span>
                  <div style={{ fontSize:13, fontWeight: isSelected ? 700 : 500, color: isSelected ? m.color : "#18181b" }}>{m.label}</div>
                  <div style={{ fontSize:11, color:"#52525b", marginTop:2, lineHeight:1.4 }}>{m.desc}</div>
                </span>
                {isSelected && <span style={{ marginLeft:"auto", color:m.color, fontSize:16, alignSelf:"center" }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Domain table with persistent local state
───────────────────────────────────────────────────────────────────────── */
function DomainTable({ initValues, onCommit, placeholder, label, wildcardNote }: {
  initValues: string[]; onCommit: (v: string[]) => void;
  placeholder: string; label: string; wildcardNote?: boolean;
}) {
  const [values, setValues] = useState<string[]>(initValues);
  const [input,  setInput]  = useState("");

  // Sync back to parent whenever values change
  useEffect(() => { onCommit(values); }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) setValues(prev => [...prev, v]);
    setInput("");
  };
  const remove = (v: string) => setValues(prev => prev.filter(x => x !== v));

  return (
    <div>
      {wildcardNote && (
        <div style={{ fontSize:11, color:"#52525b", marginBottom:8, display:"flex", alignItems:"center", gap:5 }}>
          Domain entry supports the use of wildcards
          <span style={{ padding:"1px 5px", border:"1px solid #dc262655", borderRadius:4, color:"#dc2626", fontSize:10 }}>*</span>
        </div>
      )}
      <div style={{ display:"flex", borderRadius:8, overflow:"hidden", border:"1px solid #e4e4e7" }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          style={{ flex:1, padding:"10px 12px", background:"#fafafa", border:"none", color:"#18181b", fontSize:13, outline:"none" }} />
        <button onClick={add}
          style={{ padding:"10px 18px", background:"#0a0a0a", border:"none", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
          + Add
        </button>
      </div>
      {values.length > 0 && (
        <div style={{ marginTop:8, border:"1px solid #e4e4e7", borderRadius:8, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 60px", padding:"7px 12px", background:"#fafafa", borderBottom:"1px solid #e4e4e7" }}>
            <span style={{ fontSize:11, fontWeight:700, color:"#8e8e93", textTransform:"uppercase", letterSpacing:.5 }}>{label}</span>
            <span style={{ fontSize:11, fontWeight:700, color:"#8e8e93", textTransform:"uppercase", letterSpacing:.5 }}>Delete</span>
          </div>
          {values.map((v, i) => (
            <div key={v} style={{ display:"grid", gridTemplateColumns:"1fr 60px", alignItems:"center", padding:"9px 12px", background:i%2===0?"#fafafa":"#fbfbfc", borderBottom:i<values.length-1?"1px solid #fafafa":"none" }}>
              <span style={{ fontSize:13, color:"#18181b", fontFamily:"monospace", wordBreak:"break-all" }}>{v}</span>
              <button onClick={() => remove(v)}
                style={{ background:"none", border:"none", color:"#a1a1aa", cursor:"pointer", padding:"2px 8px", borderRadius:4, fontSize:16, lineHeight:1 }}
                onMouseEnter={e => (e.currentTarget.style.color="#dc2626")}
                onMouseLeave={e => (e.currentTarget.style.color="#a1a1aa")}>
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
   Toggle + ToggleRow
───────────────────────────────────────────────────────────────────────── */
function Toggle({ value, onChange, accent="#4f46e5" }: { value:boolean; onChange:(v:boolean)=>void; accent?:string }) {
  return (
    <button onClick={() => onChange(!value)}
      style={{ width:40, height:22, borderRadius:11, border:"none", background:value?accent:"#e4e4e7", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
      <span style={{ position:"absolute", top:3, left:value?19:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s", display:"block" }}/>
    </button>
  );
}
function ToggleRow({ label, sub, value, onChange }: { label:string; sub?:string; value:boolean; onChange:(v:boolean)=>void }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #fafafa" }}>
      <div style={{ flex:1, paddingRight:12 }}>
        <div style={{ fontSize:13, color:"#18181b" }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:"#52525b", marginTop:2, lineHeight:1.4 }}>{sub}</div>}
      </div>
      <Toggle value={value} onChange={onChange}/>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Section heading
───────────────────────────────────────────────────────────────────────── */
function Sec({ label, info }: { label:string; info?:string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:22, marginBottom:10 }}>
      <span style={{ fontSize:13, fontWeight:700, color:"#18181b" }}>{label}</span>
      {info && <span title={info} style={{ width:16, height:16, borderRadius:"50%", border:"1px solid #a1a1aa", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#52525b", cursor:"help" }}>i</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Group picker — shows groups from API with member counts + inline create
───────────────────────────────────────────────────────────────────────── */
function GroupPicker({ groups, selected, onChange, onGroupCreated }: {
  groups: Group[]; selected: string[]; onChange: (v: string[]) => void;
  onGroupCreated?: (g: Group) => void;
}) {
  const [open,       setOpen]       = useState(false);
  const [search,     setSearch]     = useState("");
  const [newName,    setNewName]    = useState("");
  const [creating,   setCreating]   = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);

  const filtered = groups.filter(g =>
    g.group_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      const res = await createGroup(name) as { group?: Group } | null;
      if (res?.group) {
        onGroupCreated?.(res.group);
        setNewName("");
        setShowCreate(false);
      }
    } finally {
      setCreating(false);
    }
  };

  const label = selected.length === 0
    ? "All employees"
    : `${selected.length} group${selected.length > 1 ? "s" : ""} selected`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 8, color: "#18181b", fontSize: 13, cursor: "pointer" }}>
        <span>{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: ".2s" }}>
          <path d="M6 9l6 6 6-6" stroke="#52525b" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fbfbfc", border: "1px solid #e4e4e7", borderRadius: 10, zIndex: 60, overflow: "hidden", boxShadow: "0 12px 32px rgba(16,17,20,0.32)", maxHeight: 320, display: "flex", flexDirection: "column" }}>

          {/* Search */}
          <div style={{ padding: "8px 10px", borderBottom: "1px solid #fafafa" }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search groups…"
              style={{ width: "100%", padding: "6px 10px", background: "#fafafa", border: "1px solid #e4e4e7", borderRadius: 6, color: "#18181b", fontSize: 12, outline: "none" }} />
          </div>

          {/* Group list */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 && (
              <div style={{ padding: "14px 12px", fontSize: 12, color: "#a1a1aa", textAlign: "center" }}>
                No groups found
              </div>
            )}
            {filtered.map(g => (
              <label key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", cursor: "pointer", borderBottom: "1px solid #fafafa" }}>
                <input type="checkbox" checked={selected.includes(g.id)}
                  onChange={() => toggle(g.id)}
                  style={{ width: 14, height: 14, accentColor: "#4f46e5", cursor: "pointer", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, color: "#18181b" }}>{g.group_name}</span>
                <span style={{ fontSize: 11, color: "#a1a1aa", background: "#fafafa", padding: "2px 7px", borderRadius: 20 }}>
                  {g.member_count ?? 0} members
                </span>
              </label>
            ))}
          </div>

          {/* Create new group */}
          <div style={{ borderTop: "1px solid #fafafa", padding: "8px 10px" }}>
            {!showCreate ? (
              <button onClick={() => setShowCreate(true)}
                style={{ width: "100%", padding: "7px", background: "transparent", border: "1px dashed #e4e4e7", borderRadius: 6, color: "#52525b", fontSize: 12, cursor: "pointer", textAlign: "center" }}>
                + Create new group
              </button>
            ) : (
              <div style={{ display: "flex", gap: 6 }}>
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleCreate()}
                  placeholder="Group name…" autoFocus
                  style={{ flex: 1, padding: "7px 10px", background: "#fafafa", border: "1px solid #0a0a0a", borderRadius: 6, color: "#18181b", fontSize: 12, outline: "none" }} />
                <button onClick={handleCreate} disabled={creating}
                  style={{ padding: "7px 12px", background: "#0a0a0a", border: "none", borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 700, cursor: creating ? "wait" : "pointer" }}>
                  {creating ? "…" : "Add"}
                </button>
                <button onClick={() => { setShowCreate(false); setNewName(""); }}
                  style={{ padding: "7px 10px", background: "transparent", border: "1px solid #e4e4e7", borderRadius: 6, color: "#52525b", fontSize: 12, cursor: "pointer" }}>
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Drawer content per control
───────────────────────────────────────────────────────────────────────── */
function DrawerContent({ ctrl, settings, groups, onChange, onGroupCreated }: {
  ctrl:ControlDef; settings:UserSettings; groups:Group[];
  onChange:(patch:Partial<UserSettings>)=>void;
  onGroupCreated:(g:Group)=>void;
}) {
  // Safely parse control_groups — the API may return it as a JSON string if
  // the DB row still holds a legacy double-encoded value.
  const safeControlGroups = (() => {
    let cg = settings.control_groups as unknown;
    if (typeof cg === "string") {
      try { cg = JSON.parse(cg as string); } catch { cg = {}; }
    }
    return (cg && typeof cg === "object" && !Array.isArray(cg))
      ? (cg as Record<string, string[]>)
      : {} as Record<string, string[]>;
  })();

  const [selGroups, setSelGroups] = useState<string[]>(
    () => safeControlGroups[ctrl.id] ?? []
  );
  const set = (patch:Partial<UserSettings>) => onChange(patch);

  const handleGroupChange = (ids: string[]) => {
    setSelGroups(ids);
    onChange({ control_groups: { ...safeControlGroups, [ctrl.id]: ids } });
  };

  switch (ctrl.id) {

    case "phishing_site": return (
      <>
        <Sec label="Status" />
        <ToggleRow label="Enable phishing site detection" value={!!settings.phish_detection} onChange={v=>set({phish_detection:v})}/>
        <ToggleRow label="Link hover detection" sub="Warn when hovering over suspicious links" value={!!settings.link_hover_detection} onChange={v=>set({link_hover_detection:v})}/>
        <ToggleRow label="Domain age alert" sub="Flag newly registered domains (< 30 days)" value={!!settings.domain_age_alert} onChange={v=>set({domain_age_alert:v})}/>

        <Sec label="Action" info="How SecureLint responds when a phishing site is detected"/>
        <ActionDropdown choices={["DETECT","WARN","BLOCK"]}
          value={(settings.phish_detection_block?"BLOCK":settings.phish_detection_alert?"WARN":"DETECT") as ActionValue}
          onChange={v=>set({phish_detection_alert:v==="WARN", phish_detection_block:v==="BLOCK"})}/>

        <Sec label="Apply to groups" info="Leave empty to apply to all employees"/>
        <GroupPicker groups={groups} selected={selGroups} onChange={handleGroupChange} onGroupCreated={onGroupCreated}/>

        <Sec label="Whitelist domains" info="Visits to these domains will never be flagged"/>
        <DomainTable label="Domains" placeholder="example.com" wildcardNote
          initValues={settings.phish_site_whitelist ?? []}
          onCommit={v=>set({phish_site_whitelist:v})}/>
      </>
    );

    case "phishing_mail": return (
      <>
        <Sec label="Status"/>
        <ToggleRow label="Enable phishing mail detection" value={!!settings.phish_mail_detection} onChange={v=>set({phish_mail_detection:v})}/>

        <Sec label="Action" info="How SecureLint responds to a detected phishing email"/>
        <ActionDropdown choices={["DETECT","WARN","BLOCK"]}
          value={(settings.phish_mail_action?.toUpperCase() as ActionValue)||"DETECT"}
          onChange={v=>set({phish_mail_action:v.toLowerCase()})}/>

        <Sec label="Apply to groups"/>
        <GroupPicker groups={groups} selected={selGroups} onChange={handleGroupChange} onGroupCreated={onGroupCreated}/>

        <Sec label="Whitelist sender domains" info="Emails from these domains will not be flagged"/>
        <DomainTable label="Domains" placeholder="trusted-partner.com" wildcardNote
          initValues={settings.phish_mail_whitelist ?? []}
          onCommit={v=>set({phish_mail_whitelist:v})}/>
      </>
    );

    case "waf_domain": {
      const domains = settings.waf_social_domain ?? [];
      return (
        <>
          <Sec label="Action" info="How SecureLint responds when a blocked domain is visited"/>
          <ActionDropdown choices={["WARN","BLOCK"]}
            value={domains.length?"BLOCK":"WARN"}
            onChange={()=>{}}/>

          <Sec label="Apply to groups"/>
          <GroupPicker groups={groups} selected={selGroups} onChange={handleGroupChange} onGroupCreated={onGroupCreated}/>

          <Sec label="Blocked domains / URLs" info="Supports wildcards e.g. *.example.com"/>
          <DomainTable label="Domain / URL" placeholder="socialsite.com or *.example.com" wildcardNote
            initValues={domains}
            onCommit={v=>set({waf_social_domain:v})}/>
        </>
      );
    }

    case "session_theft": return (
      <>
        <Sec label="Unique marker" info="A random token injected into User Agent strings to detect session theft"/>
        <p style={{ fontSize:12, color:"#52525b", lineHeight:1.5, marginBottom:12 }}>
          Add a unique marker to the User Agent string with the browser extension. Using app logs that contain session IDs and UA strings, you can discover session theft.
        </p>
        <div style={{ display:"flex", gap:8, alignItems:"stretch" }}>
          <button onClick={() => {
            const rand = Array.from(crypto.getRandomValues(new Uint8Array(5))).map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase();
            set({ session_marker: `SL-${rand}` });
          }} style={{ padding:"10px 14px", background:"#fafafa", border:"1px solid #e4e4e7", borderRadius:8, color:"#18181b", fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>
            Generate new marker
          </button>
          <div style={{ flex:1, padding:"10px 12px", background:"#fafafa", border:"1px solid #dc262666", borderRadius:8, fontFamily:"monospace", fontSize:13, color:"#dc2626" }}>
            {settings.session_marker || "SL-XXXXXXXXXX"}
          </div>
        </div>

        <Sec label="Apply to groups"/>
        <GroupPicker groups={groups} selected={selGroups} onChange={handleGroupChange} onGroupCreated={onGroupCreated}/>

        <Sec label="App domains" info="The marker will be injected on these domains"/>
        <p style={{ fontSize:12, color:"#52525b", lineHeight:1.5, marginBottom:10 }}>
          The extension injects the marker on these domains. Cross-reference session IDs in your app logs to detect sessions without the marker.
        </p>
        <DomainTable label="Domains" placeholder="example.okta.com" wildcardNote
          initValues={settings.session_domains ?? []}
          onCommit={v=>set({ session_domains: v })}/>
      </>
    );

    case "malicious_extension": {
      // Valid shape is a plain array of extension IDs; the action lives
      // solely in blacklist_extension_status (no nested {ids, action} object).
      const _rawBl = settings.blacklist_extension ?? [];
      const extIds: string[] = Array.isArray(_rawBl)
        ? _rawBl
        // Normalize legacy shapes: strip numeric/stale keys from the old
        // {ids, action} object / double-encode bug.
        : Array.isArray((_rawBl as { ids?: string[] }).ids)
          ? (_rawBl as { ids: string[] }).ids
          : Object.entries(_rawBl as Record<string, unknown>)
              .filter(([k]) => /^\d+$/.test(k))
              .map(([, v]) => v as string);
      const action = settings.blacklist_extension_status || "detect";
      return (
        <>
          <Sec label="Action" info="How SecureLint responds when a blacklisted extension is detected"/>
          <ActionDropdown choices={["DETECT","WARN","BLOCK"]}
            value={(action.toUpperCase() as ActionValue)||"BLOCK"}
            onChange={v=>set({blacklist_extension_status:v.toLowerCase()})}/>

          <Sec label="Apply to groups"/>
          <GroupPicker groups={groups} selected={selGroups} onChange={handleGroupChange} onGroupCreated={onGroupCreated}/>

          <Sec label="Blocked extension IDs" info="Add Chrome Web Store extension IDs from your IT policy"/>
          <DomainTable label="Extension ID" placeholder="mdanidgdpmkimeiiojknlnekblgmpdll"
            initValues={extIds}
            onCommit={v=>set({blacklist_extension:v})}/>
        </>
      );
    }

    case "email_dlp": {
      const dlpDomains = settings.email_dlp_domain ?? [];
      return (
        <>
          <Sec label="Status"/>
          <ToggleRow label="Enable cross-domain mail control" value={!!settings.email_dlp_enabled} onChange={v=>set({email_dlp_enabled:v})}/>

          <Sec label="Action" info="How SecureLint responds when cross-domain mail is detected"/>
          <ActionDropdown choices={["DETECT","WARN","BLOCK"]}
            value={(settings.email_dlp_action?.toUpperCase() as ActionValue)||"DETECT"}
            onChange={v=>set({email_dlp_action:v.toLowerCase()})}/>

          <Sec label="Apply to groups"/>
          <GroupPicker groups={groups} selected={selGroups} onChange={handleGroupChange} onGroupCreated={onGroupCreated}/>

          <Sec label="Allowed external domains" info="Emails to these domains will not be flagged"/>
          <DomainTable label="Domains" placeholder="partner.com" wildcardNote
            initValues={dlpDomains}
            onCommit={v=>set({email_dlp_domain:v})}/>
        </>
      );
    }

    case "secret_masking": {
      const style = settings.masking_style||"blur";
      const excl  = settings.site_exclusions??[];
      return (
        <>
          <Sec label="Status"/>
          <ToggleRow label="Enable secret detection" sub="Master toggle for all detection features" value={!!settings.enable_detection} onChange={v=>set({enable_detection:v})}/>
          <ToggleRow label="Global masking enabled" value={!!settings.global_masking_status} onChange={v=>set({global_masking_status:v})}/>

          <Sec label="Masking style"/>
          <div style={{ display:"flex", gap:6, marginBottom:4 }}>
            {[["blur","Blur"],["mask","Mask (***)"],["custom","Custom"]].map(([val,lbl])=>(
              <button key={val} onClick={()=>set({masking_style:val})}
                style={{ flex:1, padding:"8px 6px", borderRadius:8, border:`1px solid ${style===val?"#7c3aed":"#e4e4e7"}`, background:style===val?"#7c3aed18":"#fafafa", color:style===val?"#7c3aed":"#52525b", fontSize:12, fontWeight:style===val?700:400, cursor:"pointer" }}>
                {lbl}
              </button>
            ))}
          </div>

          <Sec label="Action"/>
          <ActionDropdown choices={["DETECT","MASK"]} value={"MASK" as ActionValue} onChange={()=>{}}/>

          <Sec label="Apply to groups"/>
          <GroupPicker groups={groups} selected={selGroups} onChange={handleGroupChange} onGroupCreated={onGroupCreated}/>

          <Sec label="Behaviour"/>
          {([
            ["mask_console","Mask browser console output","Prevents secrets from appearing in DevTools"],
            ["auto_mask_textareas","Auto mask text areas",""],
            ["auto_mask_inputs","Auto mask input fields",""],
            ["auto_mask_editor","Auto mask code editors","Monaco, CodeMirror, etc."],
            ["overlay_input","Overlay badge on inputs",""],
            ["overlay_textarea","Overlay badge on text areas",""],
            ["overlay_editor","Overlay badge on editors",""],
            ["block_network_secrets","Block secrets in network requests",""],
            ["block_form_submission","Block form submission with secrets",""],
            ["enterprise_data_collection","Enterprise telemetry","Anonymous detection events for your org dashboard"],
          ] as [keyof UserSettings,string,string][]).map(([k,lbl,sub])=>(
            <ToggleRow key={String(k)} label={lbl} sub={sub||undefined}
              value={!!(settings[k]??false)} onChange={v=>set({[k]:v})}/>
          ))}

          <Sec label="Site exclusions"/>
          <ToggleRow label="Enable site exclusions" value={!!settings.site_exclusions_status} onChange={v=>set({site_exclusions_status:v})}/>
          <div style={{ marginTop:8 }}>
            <DomainTable label="Excluded domains" placeholder="example.com" wildcardNote
              initValues={excl}
              onCommit={v=>set({site_exclusions:v})}/>
          </div>
        </>
      );
    }

    case "enterprise_data": return (
      <>
        <Sec label="Status"/>
        <ToggleRow label="Enterprise telemetry"
          sub="Send anonymous detection events to your org dashboard"
          value={!!settings.enterprise_data_collection}
          onChange={v=>set({enterprise_data_collection:v})}/>
        <ToggleRow label="Extension scraping data"
          sub="Collect installed-extension inventory from managed browsers"
          value={!!settings.extension_scrape_data}
          onChange={v=>set({extension_scrape_data:v})}/>
        <ToggleRow label="Password breach checks"
          sub="Check whether employee passwords appear in known breach databases"
          value={!!settings.password_breach_data}
          onChange={v=>set({password_breach_data:v})}/>

        <Sec label="Apply to groups" info="Leave empty to apply to all employees"/>
        <GroupPicker groups={groups} selected={selGroups} onChange={handleGroupChange} onGroupCreated={onGroupCreated}/>

        <Sec label="Allowed email domains" info="Domains recognised as internal — used for email DLP classification"/>
        <DomainTable label="Domain" placeholder="yourcompany.com"
          initValues={settings.enterprise_email_domains ?? []}
          onCommit={v=>set({enterprise_email_domains:v})}/>
      </>
    );

    case "blur_secrets": return (
      <>
        <Sec label="Status"/>
        <ToggleRow label="Blur secrets in meeting mode"
          sub="Auto-blur browser content when screen sharing or a video meeting is detected"
          value={!!settings.blur_web}
          onChange={v=>set({blur_web:v})}/>

        <Sec label="Apply to groups" info="Leave empty to apply to all employees"/>
        <GroupPicker groups={groups} selected={selGroups} onChange={handleGroupChange} onGroupCreated={onGroupCreated}/>

        <div style={{ marginTop:12, padding:"12px 14px", background:"#fafafa", borderRadius:8, border:"1px solid #e4e4e7" }}>
          <p style={{ fontSize:12, color:"#8e8e93", margin:0, lineHeight:1.6 }}>
            When enabled, the SecureLint extension detects active screen-sharing sessions
            (Google Meet, Zoom, Teams web) and applies a blur overlay across browser tabs
            that may contain secrets, tokens, or PII — protecting sensitive content from
            accidental exposure during meetings.
          </p>
        </div>
      </>
    );

    default: return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   Config Drawer with slide-in animation
───────────────────────────────────────────────────────────────────────── */
function ConfigDrawer({ ctrl, settings, groups, onChange, onClose, onSave, saving, onGroupCreated }: {
  ctrl:ControlDef; settings:UserSettings; groups:Group[];
  onChange:(patch:Partial<UserSettings>)=>void;
  onClose:()=>void; onSave:()=>void; saving:boolean;
  onGroupCreated:(g:Group)=>void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(()=>setVisible(true)); return ()=>cancelAnimationFrame(id); }, []);

  const close = () => { setVisible(false); setTimeout(onClose, 280); };

  return (
    <>
      <style>{`@keyframes fdIn{from{opacity:0}to{opacity:1}}`}</style>
      <div onClick={close} style={{ position:"fixed", inset:0, background:"rgba(16,17,20,0.32)", zIndex:40, animation:"fdIn .25s ease" }}/>
      <div style={{
        position:"fixed", right:0, top:0, bottom:0, width:440,
        background:"#fbfbfc", borderLeft:"1px solid #f4f4f5",
        zIndex:50, display:"flex", flexDirection:"column",
        boxShadow:"-20px 0 60px rgba(16,17,20,0.32)",
        transform: visible?"translateX(0)":"translateX(100%)",
        transition:"transform .28s cubic-bezier(.4,0,.2,1)",
      }}>
        {/* Header */}
        <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid #f4f4f5", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <button onClick={close}
              style={{ background:"none", border:"none", color:"#52525b", cursor:"pointer", padding:"4px 6px", borderRadius:6, lineHeight:1, display:"flex" }}
              onMouseEnter={e=>(e.currentTarget.style.background="#f4f4f5")}
              onMouseLeave={e=>(e.currentTarget.style.background="none")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
            </button>
            <span style={{ fontSize:13, fontWeight:600, color:"#52525b" }}>Configuration</span>
          </div>
          <div style={{ fontSize:17, fontWeight:800, color:"#0a0a0a" }}>{ctrl.title}</div>
          <div style={{ fontSize:12, color:"#52525b", marginTop:5, lineHeight:1.5 }}>{ctrl.longDesc}</div>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"4px 20px 20px" }}>
          <DrawerContent ctrl={ctrl} settings={settings} groups={groups} onChange={onChange} onGroupCreated={onGroupCreated}/>
        </div>

        {/* Footer */}
        <div style={{ padding:"14px 20px", borderTop:"1px solid #f4f4f5", display:"flex", gap:10, flexShrink:0 }}>
          <button onClick={close}
            style={{ flex:1, padding:"10px", borderRadius:8, border:"1px solid #e4e4e7", background:"transparent", color:"#52525b", fontSize:13, cursor:"pointer" }}>
            Cancel
          </button>
          <button onClick={onSave} disabled={saving}
            style={{ flex:2, padding:"10px", borderRadius:8, border:"none", background:"#0a0a0a", color:"#fff", fontSize:13, fontWeight:700, cursor:saving?"wait":"pointer", opacity:saving?.7:1 }}>
            {saving?"Saving…":"Save"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Control card
───────────────────────────────────────────────────────────────────────── */
function ControlCard({ ctrl, settings, groupCount, onClick }: {
  ctrl:ControlDef; settings:UserSettings; groupCount:number; onClick:()=>void;
}) {
  const configured = groupCount > 0;
  const modeLabel  = ctrl.statusLabel(settings);
  const dotColor   = configured ? "#16a34a" : "#a1a1aa";
  const bannerImg  = bannerImages[ctrl.id];
  return (
    <div onClick={onClick} className="sl-ctrl-card"
      style={{ background:"#ffffff", border:"1px solid #e9e9ec", borderRadius:14, overflow:"hidden", cursor:"pointer", transition:"border-color .2s, box-shadow .2s" }}
      onMouseEnter={e=>{ (e.currentTarget as HTMLDivElement).style.borderColor="#dcdce0"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 24px rgba(16,17,20,0.10)"; }}
      onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.borderColor="#e9e9ec"; (e.currentTarget as HTMLDivElement).style.boxShadow="none"; }}>
      {/* Several source mockups have a white browser-chrome bezel baked into the
          pixels (~20% of height top, ~18% bottom, ~3% each side). Crop it away by
          oversizing the image inside an overflow-hidden frame, rather than
          fading it out — gradient overlays leave a visible haze on a light card
          and read as a rendering artefact rather than a deliberate edge. */}
      <div className="sl-ctrl-banner" style={{ height:150, overflow:"hidden", background:"#f4f4f5", position:"relative" }}>
        {bannerImg
          ? <img src={bannerImg} alt={ctrl.title} loading="lazy"
              style={{
                position:"absolute", left:"-6%", top:"-26%",
                width:"112%", height:"156%",
                // Tailwind preflight sets `img { max-width: 100% }`, which would
                // clamp the 112% back to the frame and reopen a gap on the right.
                maxWidth:"none",
                objectFit:"cover", display:"block",
              }}/>
          : ctrl.bannerEl}
      </div>
      <div style={{ padding:"14px 16px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#0a0a0a", flex:1, paddingRight:8 }}>{ctrl.title}</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:2 }}><path d="M5 12h14M12 5l7 7-7 7" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:dotColor, flexShrink:0 }}/>
          <span style={{ fontSize:11, fontWeight:600, color:dotColor, textTransform:"capitalize" }}>
            {configured ? `Mode: ${modeLabel} · ${groupCount} group${groupCount>1?"s":""}` : "Not configured"}
          </span>
        </div>
        <div style={{ fontSize:11, color:"#52525b", lineHeight:1.5 }}>{ctrl.shortDesc}</div>
        <div style={{ marginTop:10 }}>
          <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, background:`${ctrl.tagColor}18`, border:`1px solid ${ctrl.tagColor}33`, color:ctrl.tagColor }}>
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
/** Derive control→group[] mapping from all group policies in the org. */
function deriveControlGroups(
  policies: { group_id: string; settings: Record<string, unknown> }[],
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const pol of policies) {
    for (const [ctrlId, fields] of Object.entries(CONTROL_FIELDS_MAP)) {
      if (fields.some(f => f in pol.settings)) {
        if (!result[ctrlId]) result[ctrlId] = [];
        if (!result[ctrlId].includes(pol.group_id)) result[ctrlId].push(pol.group_id);
      }
    }
  }
  return result;
}

/** Merge a group policy's settings for a specific control into a base draft. */
function mergeControlPolicy(
  base: Record<string, unknown>,
  policy: Record<string, unknown>,
  ctrlId: string,
): Record<string, unknown> {
  const merged = { ...base };
  for (const field of CONTROL_FIELDS_MAP[ctrlId] ?? []) {
    if (field in policy) merged[field] = policy[field];
  }
  return merged;
}

export default function ControlsPage() {
  // `settings` used only for card grid display (isEnabled / statusLabel).
  // Control fields shown in drawers come from the group policy, not admin's settings.
  const [settings,       setSettings]       = useState<UserSettings>({});
  const [draft,          setDraft]          = useState<UserSettings>({});
  const [groups,         setGroups]         = useState<Group[]>([]);
  // controlGroups derived from enterprise_group_policy — never written to admin/settings
  const [controlGroups,  setControlGroups]  = useState<Record<string, string[]>>({});
  const [active,         setActive]         = useState<string | null>(null);
  const [saving,         setSaving]         = useState(false);
  const [toast,          setToast]          = useState<{ msg: string; ok: boolean } | null>(null);

  const loadPolicies = useCallback(() => {
    return (fetchAllGroupPolicies() as Promise<Record<string, unknown> | null>).then(d => {
      const rows = (d?.policies ?? []) as { group_id: string; settings: Record<string, unknown> }[];
      setControlGroups(deriveControlGroups(rows));
    });
  }, []);

  useEffect(() => {
    // Fetch admin's settings for card grid display only (no writes back)
    fetchSettings().then((d: Record<string, unknown> | null) => {
      if (!d) return;
      const s = (d.settings ?? d) as UserSettings;
      setSettings(s);
    });
    fetchGroups().then((d: Record<string, unknown> | null) => {
      if (Array.isArray(d?.groups)) setGroups(d.groups as Group[]);
    });
    loadPolicies();
  }, [loadPolicies]);

  const handleGroupCreated = useCallback((g: Group) => {
    setGroups(prev => [...prev, g]);
  }, []);

  const deepLinked = useRef(false);

  /**
   * Open the drawer for a control.
   * Pre-loads the first group's policy for this control so the drawer shows
   * what's actually configured for employees, not admin's own defaults.
   */
  const openDrawer = async (id: string) => {
    setActive(id);
    const base: Record<string, unknown> = {};  // start empty — not admin's settings

    const firstGroup = (controlGroups[id] ?? [])[0];
    if (firstGroup) {
      const policyRes = await fetchGroupPolicy(firstGroup) as Record<string, unknown> | null;
      const policy = policyRes?.policy;
      if (policy && typeof policy === "object" && !Array.isArray(policy)) {
        Object.assign(base, mergeControlPolicy({}, policy as Record<string, unknown>, id));
      }
    }

    // Carry the current group selection into the draft so GroupPicker reflects it
    base.control_groups = { ...controlGroups, [id]: controlGroups[id] ?? [] };
    setDraft(base as UserSettings);
  };

  const closeDrawer = () => setActive(null);
  const handleChange = (patch: Partial<UserSettings>) => setDraft(prev => ({ ...prev, ...patch }));

  /**
   * Deep link: /dashboard/controls?control=<id> opens that control's drawer, so
   * a search result lands on the specific control rather than on the grid.
   *
   * Reads location directly rather than useSearchParams, which would require a
   * Suspense boundary and breaks this project's `output: "export"` build.
   * Declared after openDrawer so the reference is initialised, and gated on
   * controlGroups because openDrawer preloads the first group's policy.
   */
  /* eslint-disable react-hooks/set-state-in-effect --
     openDrawer sets state, but the trigger is the URL — an external system only
     readable after mount under `output: "export"`. Guarded to run at most once. */
  useEffect(() => {
    if (deepLinked.current) return;
    const id = new URLSearchParams(window.location.search).get("control");
    if (!id || !CONTROLS.some(c => c.id === id)) return;
    deepLinked.current = true;
    openDrawer(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlGroups]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const save = async () => {
    if (!active) return;
    setSaving(true);

    // ── 1. All fields for this control from draft ──────────────────────────
    const ctrlFields = CONTROL_FIELDS_MAP[active] ?? [];
    const ctrlSettings: Record<string, unknown> = {};
    for (const field of ctrlFields) {
      const val = (draft as Record<string, unknown>)[field];
      if (val !== undefined) ctrlSettings[field] = val;
    }

    // ── 2. Resolve selected groups from local controlGroups state ──────────
    // (draft.control_groups is maintained in DrawerContent via handleGroupChange)
    let _cg = draft.control_groups as unknown;
    if (typeof _cg === "string") { try { _cg = JSON.parse(_cg as string); } catch { _cg = {}; } }
    const _cgsafe = (_cg && typeof _cg === "object" && !Array.isArray(_cg))
      ? (_cg as Record<string, string[]>)
      : {} as Record<string, string[]>;
    const selectedGroups: string[] = _cgsafe[active] ?? [];

    // ── 3. Write to enterprise_group_policy ONLY (no admin/settings write) ─
    let policySaved = false;
    if (Object.keys(ctrlSettings).length) {
      const res = await upsertGroupPolicyBatch(selectedGroups, ctrlSettings);
      policySaved = res !== null;
    } else {
      policySaved = true;
    }

    if (policySaved) {
      setToast({ msg: "Configuration saved", ok: true });
      closeDrawer();
      // Update local controlGroups state from fresh policies (no admin/settings call)
      loadPolicies();
    } else {
      setToast({ msg: "Failed to save — please try again", ok: false });
    }
    setTimeout(() => setToast(null), 2800);
    setSaving(false);
  };

  const activeCtrl = active ? CONTROLS.find(c => c.id === active) : null;

  return (
    <div style={{ padding: "28px 32px", minHeight: "100vh", background: "#f1f4fa" }}>
      <style>{`
        .sl-ctrl-banner img { transform: scale(1); transition: transform .45s cubic-bezier(.4,0,.2,1); }
        .sl-ctrl-card:hover .sl-ctrl-banner img { transform: scale(1.15); }
      `}</style>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0a0a0a", margin: 0 }}>Controls</h1>
        <p style={{ fontSize: 13, color: "#52525b", marginTop: 6 }}>
          Configure security policies and protection controls for your organisation.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: 20 }}>
        {CONTROLS.map(ctrl => {
          // Show configured-group count from group policies (authoritative source)
          const groupCount = (controlGroups[ctrl.id] ?? []).length;
          return (
            <ControlCard key={ctrl.id} ctrl={ctrl} settings={settings}
              groupCount={groupCount}
              onClick={() => openDrawer(ctrl.id)} />
          );
        })}
      </div>

      {active && activeCtrl && (
        <ConfigDrawer
          ctrl={activeCtrl} settings={draft} groups={groups}
          onChange={handleChange} onClose={closeDrawer} onSave={save}
          saving={saving} onGroupCreated={handleGroupCreated}
        />
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, background: toast.ok ? "#f2f8f2" : "#f8f3f3", border: `1px solid ${toast.ok ? "#16a34a44" : "#dc262644"}`, borderRadius: 10, padding: "12px 18px", color: toast.ok ? "#86efac" : "#b91c1c", fontSize: 13, zIndex: 100, boxShadow: "0 8px 24px rgba(16,17,20,0.32)", animation: "fdIn .2s ease" }}>
          {toast.ok ? "✓" : "✗"} {toast.msg}
        </div>
      )}
    </div>
  );
}
