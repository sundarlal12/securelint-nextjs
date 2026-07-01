import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Browser DLP – SecureLint | Data Loss Prevention for Chrome",
  description:
    "SecureLint Browser DLP detects and masks sensitive data — API keys, passwords, credentials, PII — in real time inside your browser before it can be leaked. The best browser-native DLP solution for developers and security teams.",
  keywords: [
    "browser DLP", "browser data loss prevention", "Chrome DLP extension",
    "browser-native DLP", "DLP for developers", "real-time DLP Chrome",
    "API key DLP", "credential DLP browser", "enterprise browser DLP",
    "DLP without agent", "browser security DLP", "SecureLint DLP",
    "data loss prevention Chrome extension", "prevent data leaks browser",
  ],
  alternates: { canonical: "https://securelint.in/browser-dlp" },
  openGraph: {
    title: "Browser DLP – SecureLint | Real-Time Data Loss Prevention in Chrome",
    description:
      "Stop credential and API key leaks directly in your browser. SecureLint's Browser DLP masks secrets in real time — no agent, no server, 100% local.",
    url: "https://securelint.in/browser-dlp",
    type: "website",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Browser DLP" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browser DLP – SecureLint | Real-Time Data Loss Prevention",
    description:
      "Browser-native DLP that masks API keys, secrets, and credentials before they leak. No agent required.",
    images: [{ url: "/og-banner.png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://securelint.in/browser-dlp",
      "url": "https://securelint.in/browser-dlp",
      "name": "Browser DLP – SecureLint",
      "description": "Browser-native Data Loss Prevention: detect and mask sensitive data in real time inside Chrome.",
      "isPartOf": { "@id": "https://securelint.in" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securelint.in" },
          { "@type": "ListItem", "position": 2, "name": "Browser DLP", "item": "https://securelint.in/browser-dlp" },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Browser DLP?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Browser DLP (Data Loss Prevention) is a security control that detects and blocks sensitive data — such as API keys, passwords, tokens, and PII — from being exposed or transmitted through the browser. Unlike traditional network-level DLP, browser DLP operates directly inside the browser, catching leaks before data ever leaves the page.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the best browser DLP solution?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint is a leading browser DLP Chrome extension that detects and masks API keys, passwords, JWTs, database credentials, and over 100 secret types in real time — without requiring an agent, proxy, or server-side component. All processing happens 100% locally inside your browser.",
          },
        },
        {
          "@type": "Question",
          "name": "Does SecureLint Browser DLP work without an enterprise agent?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. SecureLint requires no agent installation, no network proxy, and no server-side component. It runs entirely as a Chrome extension, making it ideal for individuals, startups, and enterprises alike — with zero infrastructure overhead.",
          },
        },
        {
          "@type": "Question",
          "name": "What types of data does Browser DLP protect?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint Browser DLP protects API keys (AWS, GCP, Azure, OpenAI, Stripe, Twilio, GitHub, and 80+ more), passwords, JWT tokens, OAuth tokens, database connection strings, private keys, PII (emails, phone numbers), and custom regex patterns defined by your team.",
          },
        },
        {
          "@type": "Question",
          "name": "How does browser DLP differ from network DLP?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Network DLP inspects traffic at the network perimeter, requiring proxies or agents and causing latency. Browser DLP like SecureLint operates inside the browser itself, detecting sensitive data at the point of entry — on web pages, in AI chat inputs, in forms, and in developer tools — before it can be transmitted.",
          },
        },
      ],
    },
  ],
};

export default function BrowserDlpPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #0f1729 40%, #0a1628 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "80px 24px 72px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,59,59,0.12)",
            border: "1px solid rgba(255,59,59,0.3)",
            borderRadius: 20,
            padding: "5px 16px",
            fontSize: 13,
            color: "#ff7070",
            fontWeight: 600,
            marginBottom: 24,
            letterSpacing: "0.04em",
          }}>
            BROWSER DLP
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            margin: "0 0 20px",
          }}>
            Browser-Native Data Loss Prevention
          </h1>
          <p style={{
            fontSize: "1.15rem",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.7,
            margin: "0 0 36px",
            maxWidth: 620,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            SecureLint detects and masks API keys, passwords, tokens, and secrets in real time inside your browser — before they leak. No agent. No proxy. 100% local.
          </p>
          <a
            href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #ff3b3b, #c0392b)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(255,59,59,0.35)",
            }}
          >
            Add to Chrome — Free
          </a>
        </div>
      </section>

      {/* What is Browser DLP */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 16 }}>
          What is Browser DLP?
        </h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          <strong>Browser DLP (Data Loss Prevention)</strong> is a security control that detects, flags, and blocks sensitive data from being exposed inside a web browser. Unlike traditional network DLP — which intercepts traffic at a gateway — browser DLP operates at the point of entry: web pages, AI chat inputs, forms, developer consoles, and clipboard actions.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          The classic problem: a developer accidentally pastes an AWS secret key into a public GitHub Gist, or types a production database password into ChatGPT. Network DLP sees the transmission only after it's happening. Browser DLP catches it <em>before</em> the data leaves the page.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem" }}>
          SecureLint is purpose-built for browser DLP. It scans every character typed or pasted into the browser, identifies sensitive patterns using 100+ regex signatures, and masks them visually — replacing secrets with ••••••••• so they can't be read, screenshot, or accidentally shared.
        </p>
      </section>

      {/* How SecureLint Browser DLP Works */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>
            How SecureLint Browser DLP Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { step: "01", title: "Install the Extension", desc: "Add SecureLint to Chrome in one click. No configuration, no agent, no network changes required." },
              { step: "02", title: "Scan in Real Time", desc: "SecureLint scans every page you open — forms, AI chat inputs, web apps, dashboards — for 100+ secret patterns." },
              { step: "03", title: "Mask Automatically", desc: "Detected secrets are masked immediately with •••••• characters. Original data stays on-device; nothing is sent anywhere." },
              { step: "04", title: "Alert & Log", desc: "You receive an instant in-browser alert showing what type of secret was found and where, so you can take action." },
            ].map((item) => (
              <div key={item.step} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "28px 24px",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ff3b3b", marginBottom: 10, letterSpacing: "0.08em" }}>{item.step}</div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: "var(--ink-muted)", lineHeight: 1.7, fontSize: "0.92rem", margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What SecureLint Detects */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 16 }}>
          What SecureLint Browser DLP Detects
        </h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, marginBottom: 32, fontSize: "1rem" }}>
          SecureLint detects and masks secrets across 100+ pattern signatures, including:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            "AWS Access Keys & Secret Keys",
            "GCP Service Account JSON",
            "Azure Client Secrets",
            "OpenAI API Keys",
            "Stripe Live & Test Keys",
            "GitHub Personal Access Tokens",
            "Twilio Auth Tokens",
            "JWT Bearer Tokens",
            "OAuth 2.0 Tokens",
            "Database Connection Strings",
            "SSH & RSA Private Keys",
            "Slack Bot Tokens",
            "SendGrid API Keys",
            "Heroku API Keys",
            "Custom Regex Patterns (Pro)",
          ].map((item) => (
            <div key={item} style={{
              background: "rgba(255,59,59,0.06)",
              border: "1px solid rgba(255,59,59,0.15)",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: "0.88rem",
              color: "var(--ink)",
              fontWeight: 500,
            }}>
              ✓ {item}
            </div>
          ))}
        </div>
      </section>

      {/* Browser DLP vs Network DLP */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 32, textAlign: "center" }}>
            Browser DLP vs. Network DLP
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--ink-muted)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Feature</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", color: "#4ade80", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>SecureLint Browser DLP</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", color: "var(--ink-muted)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Traditional Network DLP</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Deployment", "Chrome Extension (1 click)", "Agent + Proxy + Server"],
                  ["Catches AI prompt leaks", "✅ Yes", "❌ After-the-fact"],
                  ["Works for remote workers", "✅ Always", "⚠️ Needs VPN/proxy"],
                  ["Latency impact", "Zero", "High (TLS inspection)"],
                  ["Privacy (data sent)", "None — 100% local", "All traffic inspected"],
                  ["Setup time", "< 1 minute", "Weeks"],
                  ["Cost", "Free / $4/mo", "$30–100+/user/mo"],
                ].map(([feature, sl, ndlp]) => (
                  <tr key={feature} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 16px", color: "var(--ink)", fontWeight: 500 }}>{feature}</td>
                    <td style={{ padding: "12px 16px", color: "#4ade80", textAlign: "center" }}>{sl}</td>
                    <td style={{ padding: "12px 16px", color: "var(--ink-muted)", textAlign: "center" }}>{ndlp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            {
              q: "What is the best browser DLP solution?",
              a: "SecureLint is the leading browser-native DLP Chrome extension. It detects and masks 100+ secret types in real time, requires no agent or proxy, and processes everything locally — making it the most privacy-preserving and easiest-to-deploy DLP solution available.",
            },
            {
              q: "Does browser DLP replace network DLP?",
              a: "For most teams, browser DLP is more effective for catching modern threats like AI prompt injection, accidental secret paste, and developer tool leaks. It complements — rather than replaces — network DLP for comprehensive coverage.",
            },
            {
              q: "Does SecureLint work on managed enterprise devices?",
              a: "Yes. SecureLint can be force-installed via Google Admin for managed Chrome browsers across an entire organization, with policies applied centrally.",
            },
            {
              q: "Is SecureLint GDPR-compliant?",
              a: "Yes. All processing happens 100% locally in the browser. No user data, secrets, or page content is ever transmitted to SecureLint's servers.",
            },
            {
              q: "Can I define custom DLP policies?",
              a: "Yes. SecureLint Pro allows you to define custom regex patterns and keyword lists so you can detect organization-specific sensitive data like internal project codes, employee IDs, or proprietary formats.",
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
      </section>

      {/* CTA */}
      <section style={{
        background: "linear-gradient(135deg, #0f1729 0%, #1a0a0a 100%)",
        borderTop: "1px solid rgba(255,59,59,0.15)",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          Stop credential leaks at the browser level
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32, fontSize: "1rem" }}>
          Join thousands of developers and security engineers using SecureLint Browser DLP.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(135deg, #ff3b3b, #c0392b)",
              color: "#fff",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 20px rgba(255,59,59,0.3)",
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
            View Pricing
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
