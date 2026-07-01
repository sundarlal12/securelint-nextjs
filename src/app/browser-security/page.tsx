import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { PageHoverStyles } from "@/components/ui/PageHoverStyles";

export const metadata: Metadata = {
  title: "Browser Security – SecureLint | Complete Browser Security for Chrome",
  description: "SecureLint is the most complete browser security Chrome extension: API key masking, phishing detection, SSL checks, domain age alerts, XSS detection, secret scanning, and browser DLP — all in one. 100% local, zero data sent.",
  keywords: ["browser security","Chrome security extension","browser security tool","best browser security extension","Chrome extension security","developer browser security","enterprise browser security","browser security Chrome","web browser security tool","browser security for developers","SecureLint browser security","XSS detection browser","SSL check Chrome extension","complete browser security","VAPT browser extension"],
  alternates: { canonical: "https://securelint.in/browser-security" },
  openGraph: { title: "Browser Security – SecureLint | The Complete Browser Security Suite for Chrome", description: "API key masking, phishing detection, SSL validation, XSS detection, DLP, and more — all in one Chrome extension. 100% local, zero data sent.", url: "https://securelint.in/browser-security", type: "website", images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Browser Security" }] },
  twitter: { card: "summary_large_image", title: "Browser Security – SecureLint | Complete Security Suite for Chrome", description: "The all-in-one browser security extension: API key masking, phishing detection, SSL checks, XSS detection, and DLP. 100% local.", images: [{ url: "/og-banner.png" }] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": "https://securelint.in/browser-security", "url": "https://securelint.in/browser-security", "name": "Browser Security – SecureLint", "description": "The complete browser security Chrome extension: API key masking, phishing detection, SSL checks, XSS detection, DLP, and secret scanning.", "isPartOf": { "@id": "https://securelint.in" }, "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securelint.in" }, { "@type": "ListItem", "position": 2, "name": "Browser Security", "item": "https://securelint.in/browser-security" }] } },
    { "@type": "SoftwareApplication", "name": "SecureLint", "applicationCategory": "SecurityApplication", "operatingSystem": "Chrome", "description": "Complete browser security extension.", "url": "https://securelint.in", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" }, "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "120" } },
    { "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "What is the best browser security extension for Chrome?", "acceptedAnswer": { "@type": "Answer", "text": "SecureLint is the most comprehensive browser security Chrome extension available. It combines API key masking, real-time phishing detection, SSL certificate validation, XSS attack detection, domain age alerts, browser DLP, and secret scanning — all running 100% locally." } }, { "@type": "Question", "name": "Is SecureLint safe? Does it send my data anywhere?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, SecureLint is completely safe. All detection and analysis runs 100% locally inside your browser. No page content, credentials, URLs, or personal data is ever transmitted to SecureLint's servers or any third party." } }] },
  ],
};

const ACCENT = "#28ccb5";

const featureItems = [
  { icon: "🔑", title: "API Key Masking", desc: "Detects and masks 100+ secret types — AWS, OpenAI, Stripe, GitHub, and more — in real time across all web pages.", href: "/api-key-masking", linkText: "Learn more →", accentColor: "#22c55e" },
  { icon: "🎣", title: "Phishing Detection", desc: "Multi-layer phishing protection: domain age analysis, lookalike URL detection, SSL checks, and known phishing blocklists.", href: "/phishing-protection", linkText: "Learn more →", accentColor: "#f97316" },
  { icon: "🛡️", title: "Browser DLP", desc: "Enterprise-grade Data Loss Prevention running natively in the browser. No agent, no proxy, no latency.", href: "/browser-dlp", linkText: "Learn more →", accentColor: "#ef4444" },
  { icon: "📺", title: "Screen Share Privacy", desc: "Automatically masks credentials during Zoom, Meet, and Teams calls so secrets are never visible in recordings.", href: "/screen-share-privacy", linkText: "Learn more →", accentColor: "#8b5cf6" },
  { icon: "🔒", title: "SSL Validation", desc: "Verifies SSL certificates on every site you visit — flags expired certs, self-signed certificates, and domain mismatches.", href: null, accentColor: "#06b6d4" },
  { icon: "⚡", title: "XSS Detection", desc: "Detects Cross-Site Scripting (XSS) injection attempts in web page inputs and URLs before they can execute.", href: null, accentColor: "#eab308" },
  { icon: "🔎", title: "Secret Detection", desc: "Scans pages, forms, and clipboard content for 100+ secret pattern types using regex and entropy analysis.", href: "/secret-detection", linkText: "Learn more →", accentColor: "#ec4899" },
  { icon: "🪙", title: "Crypto Drainer Protection", desc: "Detects fake NFT mint pages, malicious DeFi approval requests, and crypto phishing patterns designed to drain wallets.", href: null, accentColor: "#f59e0b" },
];

export default function BrowserSecurityPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PageHoverStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0e1a 0%,#050d1a 50%,#0a0a14 100%)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "100px 24px 90px", textAlign: "center" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.30)", borderRadius: 20, padding: "5px 18px", fontSize: 13, color: "#60a5fa", fontWeight: 600, marginBottom: 28, letterSpacing: "0.05em" }}>BROWSER SECURITY</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.12, margin: "0 0 22px" }}>The Complete Browser Security Suite for Chrome</h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.75, margin: "0 0 40px", maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>SecureLint is the only Chrome extension that combines API key masking, phishing detection, SSL validation, XSS detection, browser DLP, and secret scanning in a single tool — running 100% locally, with zero data sent to any server.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj" target="_blank" rel="noopener noreferrer" className="sl-btn-primary" style={{ display: "inline-block", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "15px 36px", borderRadius: 12, textDecoration: "none", boxShadow: "0 12px 30px rgba(40,204,181,0.30)" }}>
              Add to Chrome — Free
            </a>
            <a href="/#pricing" className="sl-btn-secondary" style={{ display: "inline-block", background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600, fontSize: "1rem", padding: "15px 36px", borderRadius: 12, textDecoration: "none", border: "1px solid rgba(255,255,255,0.14)" }}>
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Why browser security matters */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 18 }}>Why browser security is your most critical security layer</h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem", marginBottom: 18 }}>The browser is the most-used application on almost every device — and the most attacked. Developers live in their browser: writing code, accessing cloud dashboards, using AI tools, reviewing pull requests, and managing infrastructure. Yet most security tools focus on endpoints, networks, and servers.</p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem", marginBottom: 18 }}>The browser is where API keys get accidentally pasted into ChatGPT. It&apos;s where phishing pages are visited. It&apos;s where passwords are typed into fake login forms. It&apos;s where secrets appear in network request logs. It&apos;s where XSS attacks execute malicious scripts.</p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem" }}>SecureLint brings enterprise-grade security controls directly into the browser — addressing threats at their source, not after the fact.</p>
      </section>

      {/* All features – Carousel */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>Everything SecureLint Protects Against</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 44, fontSize: "0.95rem" }}>Eight security capabilities. One extension. Zero infrastructure.</p>
          <CardCarousel items={featureItems} accentColor={ACCENT} />
        </div>
      </section>

      {/* Comparison */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>SecureLint vs. Other Browser Security Solutions</h2>
          <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  <th style={{ textAlign: "left", padding: "14px 20px", color: "var(--ink-muted)", fontWeight: 600 }}>Capability</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", color: ACCENT, fontWeight: 700 }}>SecureLint</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", color: "var(--ink-muted)", fontWeight: 600 }}>Chrome Safe Browsing</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", color: "var(--ink-muted)", fontWeight: 600 }}>Enterprise CASB</th>
                </tr>
              </thead>
              <tbody>
                {[["API key masking","✅","❌","⚠️ Partial"],["Real-time phishing detection","✅","✅ Blocklist only","✅"],["SSL validation","✅","✅","✅"],["XSS detection","✅","❌","⚠️ Partial"],["Domain age alerts","✅","❌","❌"],["Browser DLP","✅","❌","✅ With agent"],["Screen share privacy","✅","❌","❌"],["100% local processing","✅","❌ (sends URLs)","❌ (proxy required)"],["Setup time","< 1 minute","Built-in","Weeks"],["Cost","Free / $4/mo","Free","$30–100+/user/mo"]].map(([cap,sl,csb,casb],i) => (
                  <tr key={cap} style={{ background: i%2===0?"transparent":"rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "12px 20px", color: "var(--ink)", fontWeight: 500 }}>{cap}</td>
                    <td style={{ padding: "12px 20px", color: "#4ade80", textAlign: "center" }}>{sl}</td>
                    <td style={{ padding: "12px 20px", color: "var(--ink-muted)", textAlign: "center" }}>{csb}</td>
                    <td style={{ padding: "12px 20px", color: "var(--ink-muted)", textAlign: "center" }}>{casb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 48, textAlign: "center" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { q: "What is the best browser security extension for Chrome?", a: "SecureLint is the most comprehensive browser security extension for Chrome. It combines 8 security capabilities — API key masking, phishing detection, SSL validation, XSS detection, DLP, secret scanning, domain age alerts, and crypto protection — in a single extension that runs 100% locally." },
              { q: "Is SecureLint VAPT-compliant?", a: "SecureLint performs continuous browser-level VAPT checks — scanning for XSS vulnerabilities, SSL issues, exposed credentials, phishing indicators, and insecure configurations — making it suitable for environments that require VAPT as part of their security posture." },
              { q: "Can I deploy SecureLint across my entire organization?", a: "Yes. SecureLint can be force-installed via Google Chrome Enterprise Admin for managed devices, with central policy management, custom rules, and usage reporting available in the Enterprise plan." },
              { q: "Does SecureLint slow down my browser?", a: "No. SecureLint is designed for minimal performance impact. All analysis runs asynchronously using Chrome's content script APIs and never blocks page rendering." },
              { q: "How is SecureLint different from a VPN or endpoint security?", a: "VPNs protect network traffic; endpoint security protects the operating system. SecureLint specifically protects the browser — the application layer where most modern threats originate." },
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
      <section style={{ background: "linear-gradient(135deg,#050d1a 0%,#0a0e1a 100%)", borderTop: `1px solid ${ACCENT}20`, padding: "100px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2rem)", fontWeight: 800, color: "#fff", marginBottom: 18 }}>Secure your browser in 60 seconds</h2>
        <p style={{ color: "rgba(255,255,255,0.58)", marginBottom: 40, fontSize: "1rem", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>8 security capabilities. One extension. Free to start.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj" target="_blank" rel="noopener noreferrer" className="sl-btn-primary" style={{ background: ACCENT, color: "#fff", fontWeight: 700, padding: "15px 36px", borderRadius: 12, textDecoration: "none", fontSize: "1rem", boxShadow: "0 12px 30px rgba(40,204,181,0.30)" }}>
            Add to Chrome — Free
          </a>
          <a href="/#pricing" className="sl-btn-secondary" style={{ background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600, padding: "15px 36px", borderRadius: 12, textDecoration: "none", fontSize: "1rem", border: "1px solid rgba(255,255,255,0.14)" }}>
            View Plans
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
