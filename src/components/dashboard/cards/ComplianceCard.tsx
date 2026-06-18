"use client";
import { LazyCard } from "@/components/dashboard/CardLoader";

// ── PCI DSS and NIST use inline SVG (no image available) ─────────────────────
function PCIDSSIcon() {
  return (
    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
      <rect width="36" height="36" rx="8" fill="#1a1f2e"/>
      <rect x="5" y="10" width="26" height="16" rx="2" stroke="#60a5fa" strokeWidth="1.5" fill="#0d1b3e"/>
      <rect x="5" y="14" width="26" height="4" fill="#1d4ed8" opacity="0.6"/>
      <rect x="8" y="11" width="5" height="4" rx="1" stroke="#fcd34d" strokeWidth="1" fill="#78350f" opacity="0.8"/>
      <text x="4" y="34" fontSize="6" fontWeight="800" fill="#60a5fa" fontFamily="Arial">PCI DSS</text>
    </svg>
  );
}
function NISTIcon() {
  return (
    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
      <rect width="36" height="36" rx="8" fill="#1a1a2e"/>
      <path d="M18 7l12 6H6l12-6z" fill="#a78bfa"/>
      <rect x="8"  y="13" width="4" height="10" fill="#7c3aed" opacity="0.8"/>
      <rect x="14" y="13" width="4" height="10" fill="#7c3aed" opacity="0.8"/>
      <rect x="20" y="13" width="4" height="10" fill="#7c3aed" opacity="0.8"/>
      <rect x="6"  y="23" width="24" height="2" fill="#a78bfa"/>
      <text x="6" y="34" fontSize="7" fontWeight="800" fill="#c4b5fd" fontFamily="Arial">NIST</text>
    </svg>
  );
}

type CompItem =
  | { label: string; img: string; status: string; color: string; Icon?: never }
  | { label: string; Icon: React.FC; status: string; color: string; img?: never };

const compItems: CompItem[] = [
  { label: "SOC 2",     img: "/icons/soc2.png",  status: "Compliant", color: "#60a5fa" },
  { label: "ISO 27034", img: "/icons/iso.png",   status: "Compliant", color: "#fcd34d" },
  { label: "GDPR",      img: "/icons/gdpr.jpeg", status: "Compliant", color: "#93c5fd" },
  { label: "PCI DSS",  img: "/icons/pci.png",      status: "Compliant", color: "#60a5fa" },
];

// Integration logos
function GithubSVG() {
  return <svg viewBox="0 0 24 24" fill="#e6edf3" width="18" height="18"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;
}
function GitLabSVG() {
  return <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 014.82 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0118.6 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.51L23 13.45a.84.84 0 01-.35.94z" fill="#FCA326"/></svg>;
}

function JiraSVG() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="#2684FF"><path d="M11.571 11.513H0a5.218 5.218 0 005.232 5.215h2.13v2.057A5.215 5.215 0 0012.575 24V12.518a1.005 1.005 0 00-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 005.215 5.214h2.129v2.058a5.218 5.218 0 005.215 5.214V6.758a1.001 1.001 0 00-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 005.215 5.215h2.129v2.057A5.215 5.215 0 0024 12.483V1.005A1.001 1.001 0 0023.013 0Z"/></svg>;
}

function EmailSVG() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <rect width="24" height="24" rx="4" fill="#1a82e2"/>
      <path d="M4 8l8 5 8-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="3" y="7" width="18" height="12" rx="2" stroke="#fff" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

const integLogos = [
  { label: "GitHub", El: GithubSVG },
  { label: "GitLab", El: GitLabSVG },
  { label: "AWS",    El: () => <svg viewBox="0 0 44 22" width="36" height="18"><text x="0" y="16" fontSize="14" fontWeight="900" fill="#FF9900" fontFamily="Arial,sans-serif">aws</text><path d="M2 19 Q22 24 42 19" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round"/><polygon points="39,17 43,19 39,21" fill="#FF9900"/></svg> },
  { label: "Jira",   El: JiraSVG },
  { label: "Slack",  El: () => <svg viewBox="0 0 24 24" width="20" height="20"><path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.52 2.528 2.528 0 01-2.522-2.52 2.528 2.528 0 012.522-2.52h2.52v2.52zm1.271 0a2.528 2.528 0 012.521-2.52 2.528 2.528 0 012.521 2.52v6.313a2.528 2.528 0 01-2.521 2.52 2.528 2.528 0 01-2.521-2.52v-6.313z" fill="#E01E5A"/><path d="M8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312z" fill="#36C5F0"/><path d="M18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.271 0a2.528 2.528 0 01-2.521 2.521 2.528 2.528 0 01-2.521-2.521V2.522A2.528 2.528 0 0115.164 0a2.528 2.528 0 012.521 2.522v6.312z" fill="#2EB67D"/><path d="M15.164 18.956a2.528 2.528 0 012.521 2.522A2.528 2.528 0 0115.164 24a2.528 2.528 0 01-2.521-2.522v-2.522h2.521zm0-1.271a2.528 2.528 0 01-2.521-2.521 2.528 2.528 0 012.521-2.521h6.313A2.528 2.528 0 0124 15.164a2.528 2.528 0 01-2.523 2.521h-6.313z" fill="#ECB22E"/></svg> },
  { label: "Email",  El: EmailSVG },
];

const subCard: React.CSSProperties = { background: "#10161d", border: "1px solid #1b222c", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", flex: 1 };
const menuBtn: React.CSSProperties = { color: "#8b949e", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1 };

export default function ComplianceCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 340 }}>

      {/* Compliance Panel */}
      <div style={subCard}>
        <LazyCard delay={700}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span className="card-title">Compliance Panel</span>
            <button type="button" style={menuBtn}>···</button>
          </div>

          {/* 4 compliance badges — horizontal row, circular, no text label (text is inside the badge images) */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 4 }}>
            {compItems.map((c) => (
              <div key={c.label} style={{
                width: 58, height: 58, borderRadius: "50%",
                overflow: "hidden", background: "#0d1218",
                flexShrink: 0,
              }}>
                {c.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.img}
                    alt={c.label}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {c.Icon && <c.Icon />}
                  </div>
                )}
              </div>
            ))}
          </div>
        </LazyCard>
      </div>

      {/* DevSecOps Integrations */}
      <div style={subCard}>
        <LazyCard delay={800}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span className="card-title">DevSecOps Integrations</span>
            <button type="button" style={menuBtn}>···</button>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", paddingTop: 4 }}>
            {integLogos.map((item) => (
              <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 40, height: 40, background: "#0d1218", borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid #1b222c", overflow: "hidden",
                }}>
                  <item.El />
                </div>
                <span style={{ fontSize: 9, color: "#8b949e" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </LazyCard>
      </div>
    </div>
  );
}
