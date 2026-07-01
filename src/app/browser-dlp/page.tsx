import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StepsTimeline } from "@/components/ui/StepsTimeline";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { PageHoverStyles } from "@/components/ui/PageHoverStyles";

export const metadata: Metadata = {
  title: "Browser DLP – SecureLint | Data Loss Prevention for Chrome",
  description: "SecureLint Browser DLP detects and masks sensitive data — API keys, passwords, credentials, PII — in real time inside your browser before it can be leaked. The best browser-native DLP solution for developers and security teams.",
  keywords: ["browser DLP", "browser data loss prevention", "Chrome DLP extension", "browser-native DLP", "DLP for developers", "real-time DLP Chrome", "API key DLP", "credential DLP browser", "enterprise browser DLP", "DLP without agent", "browser security DLP", "SecureLint DLP", "data loss prevention Chrome extension", "prevent data leaks browser"],
  alternates: { canonical: "https://securelint.in/browser-dlp" },
  openGraph: { title: "Browser DLP – SecureLint | Real-Time Data Loss Prevention in Chrome", description: "Stop credential and API key leaks directly in your browser. SecureLint's Browser DLP masks secrets in real time — no agent, no server, 100% local.", url: "https://securelint.in/browser-dlp", type: "website", images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Browser DLP" }] },
  twitter: { card: "summary_large_image", title: "Browser DLP – SecureLint | Real-Time Data Loss Prevention", description: "Browser-native DLP that masks API keys, secrets, and credentials before they leak. No agent required.", images: [{ url: "/og-banner.png" }] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": "https://securelint.in/browser-dlp", "url": "https://securelint.in/browser-dlp", "name": "Browser DLP – SecureLint", "description": "Browser-native Data Loss Prevention: detect and mask sensitive data in real time inside Chrome.", "isPartOf": { "@id": "https://securelint.in" }, "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securelint.in" }, { "@type": "ListItem", "position": 2, "name": "Browser DLP", "item": "https://securelint.in/browser-dlp" }] } },
    { "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "What is Browser DLP?", "acceptedAnswer": { "@type": "Answer", "text": "Browser DLP (Data Loss Prevention) is a security control that detects and blocks sensitive data — such as API keys, passwords, tokens, and PII — from being exposed or transmitted through the browser." } }, { "@type": "Question", "name": "What is the best browser DLP solution?", "acceptedAnswer": { "@type": "Answer", "text": "SecureLint is a leading browser DLP Chrome extension that detects and masks API keys, passwords, JWTs, database credentials, and over 100 secret types in real time — without requiring an agent, proxy, or server-side component." } }, { "@type": "Question", "name": "Does SecureLint Browser DLP work without an enterprise agent?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. SecureLint requires no agent installation, no network proxy, and no server-side component. It runs entirely as a Chrome extension." } }, { "@type": "Question", "name": "How does browser DLP differ from network DLP?", "acceptedAnswer": { "@type": "Answer", "text": "Network DLP inspects traffic at the network perimeter, requiring proxies or agents. Browser DLP like SecureLint operates inside the browser itself, detecting sensitive data at the point of entry." } }] },
  ],
};

const ACCENT = "#28ccb5";

const steps = [
  { number: "01", icon: "🔧", title: "Install the Extension", desc: "Add SecureLint to Chrome in one click. No configuration, no agent, no network changes required." },
  { number: "02", icon: "🔍", title: "Scan in Real Time", desc: "SecureLint scans every page you open — forms, AI chat inputs, web apps, dashboards — for 100+ secret patterns." },
  { number: "03", icon: "🙈", title: "Mask Automatically", desc: "Detected secrets are masked immediately with •••••• characters. Original data stays on-device; nothing is sent anywhere." },
  { number: "04", icon: "🔔", title: "Alert & Log", desc: "You receive an instant in-browser alert showing what type of secret was found and where, so you can take action." },
];

const detectedItems = [
  { title: "AWS Access Keys & Secret Keys", desc: "AKIA[0-9A-Z]{16} — Detects all AWS IAM access keys and secret keys in real time.", titleColor: "#FF9900" },
  { title: "GCP Service Account JSON", desc: "Full JSON credential files and individual GCP API tokens detected across all page contexts.", titleColor: "#4285f4" },
  { title: "Azure Client Secrets", desc: "Azure AD application client secrets and connection strings masked before exposure.", titleColor: "#0078d4" },
  { title: "OpenAI API Keys", desc: "sk-[A-Za-z0-9]{48} — All OpenAI API key formats detected at the character level.", titleColor: "#10a37f" },
  { title: "Stripe Live & Test Keys", desc: "sk_live_ and sk_test_ prefixed keys intercepted before they appear in forms or prompts.", titleColor: "#635bff" },
  { title: "GitHub Personal Access Tokens", desc: "ghp_, gho_, ghu_, ghs_ token formats all covered with precise pattern matching.", titleColor: "#2dba4e" },
  { title: "JWT Bearer Tokens", desc: "eyJ-prefixed base64-encoded JWTs detected via structure analysis and entropy checks.", titleColor: "#d63aff" },
  { title: "Database Connection Strings", desc: "postgres://, mysql://, mongodb:// URIs with embedded credentials masked across all contexts.", titleColor: "#e67e22" },
  { title: "SSH & RSA Private Keys", desc: "-----BEGIN RSA PRIVATE KEY----- and similar PEM-encoded keys detected across page content.", titleColor: "#e67e22" },
  { title: "Slack Bot Tokens", desc: "xoxb- and xoxp- prefixed Slack tokens detected in web apps and clipboard content.", titleColor: "#a78bfa" },
  { title: "Twilio Auth Tokens", desc: "SK[0-9a-f]{32} Twilio API key SIDs and auth tokens masked automatically.", titleColor: "#f22f46" },
  { title: "Custom Regex Patterns (Pro)", desc: "Define your own patterns for internal tokens, proprietary credentials, or custom ID formats.", titleColor: ACCENT },
];

export default function BrowserDlpPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PageHoverStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0e1a 0%,#0f1729 40%,#0a1628 100%)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "100px 24px 90px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,59,59,0.12)", border: "1px solid rgba(255,59,59,0.30)", borderRadius: 20, padding: "5px 18px", fontSize: 13, color: "#ff7070", fontWeight: 600, marginBottom: 28, letterSpacing: "0.05em" }}>BROWSER DLP</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.12, margin: "0 0 22px" }}>Browser-Native Data Loss Prevention</h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.75, margin: "0 0 40px", maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
            SecureLint detects and masks API keys, passwords, tokens, and secrets in real time inside your browser — before they leak. No agent. No proxy. 100% local.
          </p>
          <a href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj" target="_blank" rel="noopener noreferrer" className="sl-btn-primary" style={{ display: "inline-block", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "15px 36px", borderRadius: 12, textDecoration: "none", boxShadow: "0 12px 30px rgba(40,204,181,0.30)" }}>
            Add to Chrome — Free
          </a>
        </div>
      </section>

      {/* What is Browser DLP */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 18 }}>What is Browser DLP?</h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem", marginBottom: 18 }}><strong>Browser DLP (Data Loss Prevention)</strong> is a security control that detects, flags, and blocks sensitive data from being exposed inside a web browser. Unlike traditional network DLP — which intercepts traffic at a gateway — browser DLP operates at the point of entry: web pages, AI chat inputs, forms, developer consoles, and clipboard actions.</p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem", marginBottom: 18 }}>The classic problem: a developer accidentally pastes an AWS secret key into a public GitHub Gist, or types a production database password into ChatGPT. Network DLP sees the transmission only after it&apos;s happening. Browser DLP catches it <em>before</em> the data leaves the page.</p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem" }}>SecureLint is purpose-built for browser DLP. It scans every character typed or pasted into the browser, identifies sensitive patterns using 100+ regex signatures, and masks them visually — replacing secrets with ••••••••• so they can&apos;t be read, screenshot, or accidentally shared.</p>
      </section>

      {/* How It Works – Timeline */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>How SecureLint Browser DLP Works</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 56, fontSize: "0.95rem" }}>Four steps from install to protection — zero configuration needed.</p>
          <StepsTimeline steps={steps} accentColor={ACCENT} />
        </div>
      </section>

      {/* What Detects – Carousel */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>What SecureLint Browser DLP Detects</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 44, fontSize: "0.95rem" }}>100+ pattern signatures covering every major cloud provider, SaaS platform, and credential format.</p>
          <CardCarousel items={detectedItems} accentColor={ACCENT} cardBg="rgba(255,59,59,0.04)" />
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>Browser DLP vs. Network DLP</h2>
          <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  <th style={{ textAlign: "left", padding: "14px 20px", color: "var(--ink-muted)", fontWeight: 600 }}>Feature</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", color: ACCENT, fontWeight: 700 }}>SecureLint Browser DLP</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", color: "var(--ink-muted)", fontWeight: 600 }}>Traditional Network DLP</th>
                </tr>
              </thead>
              <tbody>
                {[["Deployment","Chrome Extension (1 click)","Agent + Proxy + Server"],["Catches AI prompt leaks","✅ Yes","❌ After-the-fact"],["Works for remote workers","✅ Always","⚠️ Needs VPN/proxy"],["Latency impact","Zero","High (TLS inspection)"],["Privacy (data sent)","None — 100% local","All traffic inspected"],["Setup time","< 1 minute","Weeks"],["Cost","Free / $4/mo","$30–100+/user/mo"]].map(([f,sl,ndlp],i) => (
                  <tr key={f} style={{ background: i%2===0?"transparent":"rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "13px 20px", color: "var(--ink)", fontWeight: 500 }}>{f}</td>
                    <td style={{ padding: "13px 20px", color: "#4ade80", textAlign: "center" }}>{sl}</td>
                    <td style={{ padding: "13px 20px", color: "var(--ink-muted)", textAlign: "center" }}>{ndlp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 48, textAlign: "center" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { q: "What is the best browser DLP solution?", a: "SecureLint is the leading browser-native DLP Chrome extension. It detects and masks 100+ secret types in real time, requires no agent or proxy, and processes everything locally — making it the most privacy-preserving and easiest-to-deploy DLP solution available." },
              { q: "Does browser DLP replace network DLP?", a: "For most teams, browser DLP is more effective for catching modern threats like AI prompt injection, accidental secret paste, and developer tool leaks. It complements — rather than replaces — network DLP for comprehensive coverage." },
              { q: "Does SecureLint work on managed enterprise devices?", a: "Yes. SecureLint can be force-installed via Google Admin for managed Chrome browsers across an entire organization, with policies applied centrally." },
              { q: "Is SecureLint GDPR-compliant?", a: "Yes. All processing happens 100% locally in the browser. No user data, secrets, or page content is ever transmitted to SecureLint's servers." },
              { q: "Can I define custom DLP policies?", a: "Yes. SecureLint Pro allows you to define custom regex patterns and keyword lists so you can detect organization-specific sensitive data like internal project codes, employee IDs, or proprietary formats." },
            ].map(({ q, a }) => (
              <div key={q} className="sl-faq-card" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "24px 28px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", marginBottom: 10, marginTop: 0 }}>{q}</h3>
                <p style={{ color: "var(--ink-muted)", lineHeight: 1.78, margin: 0, fontSize: "0.95rem" }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg,#0f1729 0%,#1a0a0a 100%)", borderTop: `1px solid ${ACCENT}20`, padding: "100px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2rem)", fontWeight: 800, color: "#fff", marginBottom: 18 }}>Stop credential leaks at the browser level</h2>
        <p style={{ color: "rgba(255,255,255,0.58)", marginBottom: 40, fontSize: "1rem", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>Join thousands of developers and security engineers using SecureLint Browser DLP.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj" target="_blank" rel="noopener noreferrer" className="sl-btn-primary" style={{ background: ACCENT, color: "#fff", fontWeight: 700, padding: "15px 36px", borderRadius: 12, textDecoration: "none", fontSize: "1rem", boxShadow: "0 12px 30px rgba(40,204,181,0.30)" }}>
            Add to Chrome — Free
          </a>
          <a href="/#pricing" className="sl-btn-secondary" style={{ background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600, padding: "15px 36px", borderRadius: 12, textDecoration: "none", fontSize: "1rem", border: "1px solid rgba(255,255,255,0.14)" }}>
            View Pricing
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
