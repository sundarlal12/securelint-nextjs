import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Browser Security – SecureLint | Complete Browser Security for Chrome",
  description:
    "SecureLint is the most complete browser security Chrome extension: API key masking, phishing detection, SSL checks, domain age alerts, XSS detection, secret scanning, and browser DLP — all in one. 100% local, zero data sent.",
  keywords: [
    "browser security", "Chrome security extension", "browser security tool",
    "best browser security extension", "Chrome extension security",
    "developer browser security", "enterprise browser security",
    "browser security Chrome", "web browser security tool",
    "browser security for developers", "SecureLint browser security",
    "XSS detection browser", "SSL check Chrome extension",
    "complete browser security", "VAPT browser extension",
  ],
  alternates: { canonical: "https://securelint.in/browser-security" },
  openGraph: {
    title: "Browser Security – SecureLint | The Complete Browser Security Suite for Chrome",
    description:
      "API key masking, phishing detection, SSL validation, XSS detection, DLP, and more — all in one Chrome extension. 100% local, zero data sent.",
    url: "https://securelint.in/browser-security",
    type: "website",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Browser Security" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browser Security – SecureLint | Complete Security Suite for Chrome",
    description:
      "The all-in-one browser security extension: API key masking, phishing detection, SSL checks, XSS detection, and DLP. 100% local.",
    images: [{ url: "/og-banner.png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://securelint.in/browser-security",
      "url": "https://securelint.in/browser-security",
      "name": "Browser Security – SecureLint",
      "description": "The complete browser security Chrome extension: API key masking, phishing detection, SSL checks, XSS detection, DLP, and secret scanning.",
      "isPartOf": { "@id": "https://securelint.in" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securelint.in" },
          { "@type": "ListItem", "position": 2, "name": "Browser Security", "item": "https://securelint.in/browser-security" },
        ],
      },
    },
    {
      "@type": "SoftwareApplication",
      "name": "SecureLint",
      "applicationCategory": "SecurityApplication",
      "operatingSystem": "Chrome",
      "description": "Complete browser security extension: API key masking, phishing detection, SSL validation, XSS detection, DLP, and secret scanning.",
      "url": "https://securelint.in",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "120",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best browser security extension for Chrome?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint is the most comprehensive browser security Chrome extension available. It combines API key masking, real-time phishing detection, SSL certificate validation, XSS attack detection, domain age alerts, browser DLP, and secret scanning — all running 100% locally with no data sent to any external server.",
          },
        },
        {
          "@type": "Question",
          "name": "What browser security features does SecureLint provide?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint provides: (1) API key and credential masking for 80+ providers, (2) real-time phishing and lookalike domain detection, (3) SSL certificate validation and expiry alerts, (4) domain age and newly registered domain warnings, (5) XSS injection attempt detection, (6) browser DLP to prevent data leakage, (7) crypto wallet drainer detection, and (8) custom secret pattern scanning.",
          },
        },
        {
          "@type": "Question",
          "name": "Is SecureLint safe? Does it send my data anywhere?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, SecureLint is completely safe. All detection and analysis runs 100% locally inside your browser using the Chrome extension APIs. No page content, credentials, URLs, or personal data is ever transmitted to SecureLint's servers or any third party.",
          },
        },
      ],
    },
  ],
};

const FEATURES = [
  {
    icon: "🔑",
    title: "API Key Masking",
    desc: "Detects and masks 100+ secret types — AWS, OpenAI, Stripe, GitHub, and more — in real time across all web pages.",
    href: "/api-key-masking",
    color: "#22c55e",
  },
  {
    icon: "🎣",
    title: "Phishing Detection",
    desc: "Multi-layer phishing protection: domain age analysis, lookalike URL detection, SSL checks, and known phishing blocklists.",
    href: "/phishing-protection",
    color: "#f97316",
  },
  {
    icon: "🛡️",
    title: "Browser DLP",
    desc: "Enterprise-grade Data Loss Prevention running natively in the browser. No agent, no proxy, no latency.",
    href: "/browser-dlp",
    color: "#ef4444",
  },
  {
    icon: "📺",
    title: "Screen Share Privacy",
    desc: "Automatically masks credentials during Zoom, Meet, and Teams calls so secrets are never visible in recordings.",
    href: "/screen-share-privacy",
    color: "#8b5cf6",
  },
  {
    icon: "🔒",
    title: "SSL Validation",
    desc: "Verifies SSL certificates on every site you visit — flags expired certs, self-signed certificates, and domain mismatches.",
    href: null,
    color: "#06b6d4",
  },
  {
    icon: "⚡",
    title: "XSS Detection",
    desc: "Detects Cross-Site Scripting (XSS) injection attempts in web page inputs and URLs before they can execute.",
    href: null,
    color: "#eab308",
  },
  {
    icon: "🔎",
    title: "Secret Detection",
    desc: "Scans pages, forms, and clipboard content for 100+ secret pattern types using regex and entropy analysis.",
    href: "/secret-detection",
    color: "#ec4899",
  },
  {
    icon: "🪙",
    title: "Crypto Drainer Protection",
    desc: "Detects fake NFT mint pages, malicious DeFi approval requests, and crypto phishing patterns designed to drain wallets.",
    href: null,
    color: "#f59e0b",
  },
];

export default function BrowserSecurityPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #050d1a 50%, #0a0a14 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "80px 24px 72px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 20,
            padding: "5px 16px",
            fontSize: 13,
            color: "#60a5fa",
            fontWeight: 600,
            marginBottom: 24,
            letterSpacing: "0.04em",
          }}>
            BROWSER SECURITY
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            margin: "0 0 20px",
          }}>
            The Complete Browser Security Suite for Chrome
          </h1>
          <p style={{
            fontSize: "1.15rem",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.7,
            margin: "0 0 36px",
            maxWidth: 640,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            SecureLint is the only Chrome extension that combines API key masking, phishing detection, SSL validation, XSS detection, browser DLP, and secret scanning in a single tool — running 100% locally, with zero data sent to any server.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "14px 32px",
                borderRadius: 10,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
              }}
            >
              Add to Chrome — Free
            </a>
            <a
              href="/#pricing"
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.07)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                padding: "14px 32px",
                borderRadius: 10,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Why browser security matters */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 16 }}>
          Why browser security is your most critical security layer
        </h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          The browser is the most-used application on almost every device — and the most attacked. Developers live in their browser: writing code, accessing cloud dashboards, using AI tools, reviewing pull requests, and managing infrastructure. Yet most security tools focus on endpoints, networks, and servers.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          The browser is where API keys get accidentally pasted into ChatGPT. It's where phishing pages are visited. It's where passwords are typed into fake login forms. It's where secrets appear in network request logs. It's where XSS attacks execute malicious scripts.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem" }}>
          SecureLint brings enterprise-grade security controls directly into the browser — addressing threats at their source, not after the fact.
        </p>
      </section>

      {/* All features */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>
            Everything SecureLint Protects Against
          </h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 40, fontSize: "0.95rem" }}>
            Eight security capabilities. One extension. Zero infrastructure.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{f.icon}</span>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>{f.title}</h3>
                </div>
                <p style={{ color: "var(--ink-muted)", lineHeight: 1.7, fontSize: "0.92rem", margin: 0, flex: 1 }}>{f.desc}</p>
                {f.href && (
                  <a href={f.href} style={{ color: f.color, fontSize: "0.88rem", fontWeight: 600, textDecoration: "none" }}>
                    Learn more →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 32, textAlign: "center" }}>
          SecureLint vs. Other Browser Security Solutions
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--ink-muted)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Capability</th>
                <th style={{ textAlign: "center", padding: "12px 16px", color: "#60a5fa", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>SecureLint</th>
                <th style={{ textAlign: "center", padding: "12px 16px", color: "var(--ink-muted)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Chrome Safe Browsing</th>
                <th style={{ textAlign: "center", padding: "12px 16px", color: "var(--ink-muted)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Enterprise CASB</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["API key masking", "✅", "❌", "⚠️ Partial"],
                ["Real-time phishing detection", "✅", "✅ Blocklist only", "✅"],
                ["SSL validation", "✅", "✅", "✅"],
                ["XSS detection", "✅", "❌", "⚠️ Partial"],
                ["Domain age alerts", "✅", "❌", "❌"],
                ["Browser DLP", "✅", "❌", "✅ With agent"],
                ["Screen share privacy", "✅", "❌", "❌"],
                ["100% local processing", "✅", "❌ (sends URLs)", "❌ (proxy required)"],
                ["Setup time", "< 1 minute", "Built-in", "Weeks"],
                ["Cost", "Free / $4/mo", "Free", "$30–100+/user/mo"],
              ].map(([cap, sl, csb, casb]) => (
                <tr key={cap} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "12px 16px", color: "var(--ink)", fontWeight: 500 }}>{cap}</td>
                  <td style={{ padding: "12px 16px", color: "#4ade80", textAlign: "center" }}>{sl}</td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-muted)", textAlign: "center" }}>{csb}</td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-muted)", textAlign: "center" }}>{casb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              {
                q: "What is the best browser security extension for Chrome?",
                a: "SecureLint is the most comprehensive browser security extension for Chrome. It combines 8 security capabilities — API key masking, phishing detection, SSL validation, XSS detection, DLP, secret scanning, domain age alerts, and crypto protection — in a single extension that runs 100% locally.",
              },
              {
                q: "Is SecureLint VAPT-compliant?",
                a: "SecureLint performs continuous browser-level VAPT (Vulnerability Assessment and Penetration Testing) checks — scanning for XSS vulnerabilities, SSL issues, exposed credentials, phishing indicators, and insecure configurations — making it suitable for environments that require VAPT as part of their security posture.",
              },
              {
                q: "Can I deploy SecureLint across my entire organization?",
                a: "Yes. SecureLint can be force-installed via Google Chrome Enterprise Admin for managed devices, with central policy management, custom rules, and usage reporting available in the Enterprise plan.",
              },
              {
                q: "Does SecureLint slow down my browser?",
                a: "No. SecureLint is designed for minimal performance impact. All analysis runs asynchronously using Chrome's content script APIs and never blocks page rendering. Most users report no perceptible performance difference.",
              },
              {
                q: "How is SecureLint different from a VPN or endpoint security?",
                a: "VPNs protect network traffic; endpoint security protects the operating system. SecureLint specifically protects the browser — the application layer where most modern threats originate. It operates inside Chrome, catching threats that network and endpoint tools cannot see.",
              },
            ].map(({ q, a }) => (
              <div key={q} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "24px 28px",
              }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>{q}</h3>
                <p style={{ color: "var(--ink-muted)", lineHeight: 1.75, margin: 0, fontSize: "0.95rem" }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "linear-gradient(135deg, #050d1a 0%, #0a0e1a 100%)",
        borderTop: "1px solid rgba(59,130,246,0.15)",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          Secure your browser in 60 seconds
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32, fontSize: "1rem" }}>
          8 security capabilities. One extension. Free to start.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              color: "#fff",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
            }}
          >
            Add to Chrome — Free
          </a>
          <a
            href="/#pricing"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "#fff",
              fontWeight: 600,
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: "1rem",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            View Plans
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
