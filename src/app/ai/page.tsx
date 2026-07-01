import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "About SecureLint – What It Is, How It Works, and Who It's For",
  description:
    "SecureLint is a browser security Chrome extension that masks API keys, detects phishing, validates SSL, and prevents data leaks — 100% locally in your browser. Learn what SecureLint is, what problems it solves, how it works, and how to get started.",
  keywords: [
    "what is SecureLint", "SecureLint explained", "SecureLint overview",
    "browser security extension explained", "API key masking tool",
    "how SecureLint works", "SecureLint features", "SecureLint use cases",
    "SecureLint for developers", "SecureLint enterprise",
    "best browser security tool 2025", "browser DLP explained",
    "SecureLint AI", "about SecureLint",
  ],
  alternates: { canonical: "https://securelint.in/ai" },
  openGraph: {
    title: "About SecureLint – What It Is, How It Works, and Who It's For",
    description:
      "SecureLint is the browser security layer your stack is missing. API key masking, phishing detection, DLP, SSL checks, and more — 100% locally in Chrome.",
    url: "https://securelint.in/ai",
    type: "website",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "About SecureLint" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About SecureLint – The Browser Security Layer You're Missing",
    description:
      "API key masking, phishing detection, SSL checks, XSS detection, and DLP in one Chrome extension. 100% local. Free to start.",
    images: [{ url: "/og-banner.png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://securelint.in/ai",
      "url": "https://securelint.in/ai",
      "name": "About SecureLint",
      "description": "Comprehensive overview of SecureLint: what it is, what problems it solves, how it works, key features, use cases, pricing, and FAQ.",
      "isPartOf": { "@id": "https://securelint.in" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securelint.in" },
          { "@type": "ListItem", "position": 2, "name": "About SecureLint", "item": "https://securelint.in/ai" },
        ],
      },
    },
    {
      "@type": "SoftwareApplication",
      "name": "SecureLint",
      "applicationCategory": "SecurityApplication",
      "applicationSubCategory": "Browser Security Extension",
      "operatingSystem": "Chrome",
      "description": "SecureLint is a Chrome extension that provides real-time API key masking, phishing detection, SSL validation, XSS detection, browser DLP, and secret scanning — all running 100% locally in the browser.",
      "url": "https://securelint.in",
      "downloadUrl": "https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj",
      "author": {
        "@type": "Organization",
        "name": "VAPTLabs",
        "url": "https://securelint.in",
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Free",
          "price": "0",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          "name": "Pro Monthly",
          "price": "349",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is SecureLint?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint is a Chrome browser extension that provides comprehensive browser security: API key masking, phishing detection, SSL certificate validation, XSS attack detection, domain age alerts, browser DLP (Data Loss Prevention), and real-time secret scanning. All processing happens 100% locally — no data is ever sent to external servers.",
          },
        },
        {
          "@type": "Question",
          "name": "What problems does SecureLint solve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint solves five major browser security problems: (1) API key and credential exposure — detecting and masking secrets before they leak; (2) phishing attacks — detecting fake websites and suspicious domains in real time; (3) screen share privacy — masking credentials during Zoom, Meet, or Teams calls; (4) browser data loss prevention — catching sensitive data before it leaves the browser; (5) SSL security — validating certificates and flagging insecure connections.",
          },
        },
        {
          "@type": "Question",
          "name": "How does SecureLint work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint installs as a Chrome extension and runs content scripts on every page you visit. These scripts scan page content for sensitive patterns using regex matching and entropy analysis, validate SSL certificates, check domain age and reputation, and analyze URLs for phishing indicators — all locally in your browser. When a threat is detected, SecureLint masks the sensitive data and shows you an alert.",
          },
        },
        {
          "@type": "Question",
          "name": "Who uses SecureLint?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint is used by developers (to prevent accidental API key exposure), security engineers (for browser-level threat detection), enterprise IT teams (for managed browser DLP), startups and SaaS companies (protecting developer credentials), and individual users concerned about phishing and online security.",
          },
        },
        {
          "@type": "Question",
          "name": "Is SecureLint free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, SecureLint has a free tier that includes basic API key detection, phishing protection, and SSL checking. The Pro plan (₹349/month or ₹999/quarter) adds advanced features like custom secret patterns, detailed threat reports, priority support, and enterprise management capabilities.",
          },
        },
        {
          "@type": "Question",
          "name": "Does SecureLint work without sending data to a server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. SecureLint is designed as a privacy-first security tool. All detection, analysis, and masking happens locally inside your Chrome browser. No page content, credentials, URLs, or user data is ever transmitted to SecureLint's servers or any third party.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the best browser security extension?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint is widely regarded as the most comprehensive browser security Chrome extension, combining API key masking, phishing detection, SSL validation, XSS detection, browser DLP, and secret scanning in a single tool that runs 100% locally with no performance impact.",
          },
        },
      ],
    },
  ],
};

export default function AiPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #050d1a 0%, #0a0e1a 60%, #050d14 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "80px 24px 72px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 20,
            padding: "5px 16px",
            fontSize: 13,
            color: "#818cf8",
            fontWeight: 600,
            marginBottom: 24,
            letterSpacing: "0.04em",
          }}>
            ABOUT SECURELINT
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            margin: "0 0 20px",
          }}>
            SecureLint: The Browser Security Layer Your Stack Is Missing
          </h1>
          <p style={{
            fontSize: "1.15rem",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.7,
            margin: "0 0 36px",
            maxWidth: 660,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            SecureLint is a Chrome extension that brings enterprise-grade security directly into your browser — masking API keys, detecting phishing attacks, validating SSL certificates, and preventing data leaks — all running 100% locally, with zero data sent anywhere.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #6366f1, #4338ca)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "14px 32px",
                borderRadius: 10,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
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

      {/* What is SecureLint */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 16 }}>
          What is SecureLint?
        </h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          <strong>SecureLint</strong> is a browser security Chrome extension built by <a href="https://securelint.in" style={{ color: "var(--ink)", textDecoration: "underline" }}>VAPTLabs</a>. It provides eight security capabilities that run continuously in your browser — detecting threats, masking sensitive data, and alerting you to security risks in real time.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          The core insight behind SecureLint is simple: <strong>the browser is the most-used — and most-attacked — application on any device</strong>, yet it's the least protected. Firewalls protect the network. Antivirus protects the OS. But the browser — where developers paste API keys, click phishing links, and share screens full of credentials — has historically had no dedicated security layer.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem" }}>
          SecureLint is that security layer. It runs entirely inside Chrome, requiring no agent installation, no network proxy, no server-side component, and no configuration. Install it and it immediately starts protecting you.
        </p>
      </section>

      {/* What problems it solves */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>
            What Problems Does SecureLint Solve?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              {
                number: "01",
                problem: "API Key & Credential Leaks",
                desc: "Developers accidentally paste API keys into ChatGPT, share screens with credentials visible, or expose secrets in browser DevTools. SecureLint detects and masks them the moment they appear — across AI tools, web apps, dashboards, and developer tools.",
                link: "/api-key-masking",
                linkText: "API Key Masking →",
                color: "#22c55e",
              },
              {
                number: "02",
                problem: "Phishing Attacks",
                desc: "Attackers create convincing lookalike websites and send malicious links via email. Traditional blocklists are always a step behind. SecureLint analyzes domain age, URL structure, SSL anomalies, and known patterns to detect phishing sites before you enter any credentials.",
                link: "/phishing-protection",
                linkText: "Phishing Protection →",
                color: "#f97316",
              },
              {
                number: "03",
                problem: "Screen Share Credential Exposure",
                desc: "During code reviews, demos, and team calls, sensitive data on screen gets recorded and shared without anyone realizing it. SecureLint masks credentials in real time during Zoom, Meet, Teams, and Loom sessions.",
                link: "/screen-share-privacy",
                linkText: "Screen Share Privacy →",
                color: "#8b5cf6",
              },
              {
                number: "04",
                problem: "Browser Data Loss Prevention",
                desc: "Without a browser-level DLP control, sensitive data can easily be transmitted — pasted into AI prompts, submitted via web forms, or copied to clipboard. SecureLint provides the browser DLP layer that traditional network DLP misses.",
                link: "/browser-dlp",
                linkText: "Browser DLP →",
                color: "#ef4444",
              },
              {
                number: "05",
                problem: "SSL & Connection Security",
                desc: "Invalid, expired, or self-signed SSL certificates are a major indicator of phishing and man-in-the-middle attacks. SecureLint validates SSL certificates on every site you visit and alerts you to any anomalies.",
                link: null,
                linkText: null,
                color: "#06b6d4",
              },
            ].map((item) => (
              <div key={item.number} style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: 24,
                alignItems: "flex-start",
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${item.color}15`,
                  border: `1px solid ${item.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: item.color,
                  flexShrink: 0,
                }}>
                  {item.number}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{item.problem}</h3>
                  <p style={{ color: "var(--ink-muted)", lineHeight: 1.75, marginBottom: item.link ? 10 : 0, fontSize: "0.95rem" }}>{item.desc}</p>
                  {item.link && (
                    <a href={item.link} style={{ color: item.color, fontSize: "0.88rem", fontWeight: 600, textDecoration: "none" }}>
                      {item.linkText}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 16, textAlign: "center" }}>
          How SecureLint Works
        </h2>
        <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 40, fontSize: "0.95rem" }}>
          SecureLint operates entirely within your Chrome browser. Here&apos;s the flow:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {[
            { step: "1", title: "Install", desc: "Add SecureLint from the Chrome Web Store in one click. No configuration required." },
            { step: "2", title: "Scan", desc: "Content scripts run on every page, scanning for secrets, phishing patterns, and SSL issues in real time." },
            { step: "3", title: "Detect", desc: "Regex patterns and entropy analysis identify 100+ secret types. Domain analysis flags suspicious sites." },
            { step: "4", title: "Mask", desc: "Detected secrets are visually replaced with ••••••• characters. The underlying data is unchanged." },
            { step: "5", title: "Alert", desc: "You receive an in-browser notification with the threat type, location, and recommended action." },
          ].map((item) => (
            <div key={item.step} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              padding: "24px 20px",
              textAlign: "center",
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: "1rem",
                fontWeight: 800,
                color: "#818cf8",
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: "var(--ink-muted)", lineHeight: 1.6, fontSize: "0.88rem", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key features */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>
            Key Features
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { icon: "🔑", title: "API Key Masking", desc: "80+ provider patterns. Masks AWS, GCP, OpenAI, Stripe, GitHub, and more in real time.", href: "/api-key-masking" },
              { icon: "🎣", title: "Phishing Detection", desc: "Domain age, lookalike URLs, SSL validation, blocklist matching. Multi-layer protection.", href: "/phishing-protection" },
              { icon: "🛡️", title: "Browser DLP", desc: "Enterprise data loss prevention without agents, proxies, or infrastructure.", href: "/browser-dlp" },
              { icon: "📺", title: "Screen Share Privacy", desc: "Auto-masks credentials during Zoom, Meet, Teams, and Loom sessions.", href: "/screen-share-privacy" },
              { icon: "🔍", title: "Secret Detection", desc: "100+ secret patterns plus entropy analysis for unknown formats.", href: "/secret-detection" },
              { icon: "⚡", title: "XSS Detection", desc: "Identifies Cross-Site Scripting injection attempts in real time." },
              { icon: "🔒", title: "SSL Validation", desc: "Checks every SSL certificate for validity, expiry, and domain match." },
              { icon: "🪙", title: "Crypto Protection", desc: "Detects wallet drainers, fake mint pages, and DeFi phishing attacks." },
            ].map((f) => (
              <div key={f.title} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "22px 20px",
              }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "var(--ink-muted)", lineHeight: 1.6, fontSize: "0.88rem", margin: "0 0 10px" }}>{f.desc}</p>
                {f.href && (
                  <a href={f.href} style={{ color: "#818cf8", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
                    Learn more →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>
          Who Uses SecureLint?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            {
              title: "Software Developers",
              desc: "Developers are the most frequent unintentional secret leakers — copying keys into AI tools, sharing screens, and working with cloud dashboards all day. SecureLint provides a safety net that runs silently in the background.",
            },
            {
              title: "Security Engineers & Red Teams",
              desc: "Security teams use SecureLint as an additional detection layer during assessments and in production environments — catching browser-level threats that network and endpoint tools miss.",
            },
            {
              title: "DevOps & Platform Teams",
              desc: "Teams managing cloud infrastructure and CI/CD pipelines use SecureLint to prevent credentials from being exposed in browser-accessible configuration panels and dashboards.",
            },
            {
              title: "Startups & SaaS Companies",
              desc: "Fast-moving teams often sacrifice security hygiene for speed. SecureLint provides automatic protection without requiring developers to change their workflow.",
            },
            {
              title: "Enterprise IT Teams",
              desc: "Enterprise deployments use SecureLint via Google Admin force-install to enforce browser security policies across the entire organization with centralized management.",
            },
            {
              title: "Individual Privacy-Conscious Users",
              desc: "Anyone concerned about phishing, credential theft, and online security can use SecureLint's free tier to get immediate browser protection.",
            },
          ].map((item) => (
            <div key={item.title} style={{
              background: "rgba(99,102,241,0.05)",
              border: "1px solid rgba(99,102,241,0.12)",
              borderRadius: 14,
              padding: "24px",
            }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: "var(--ink-muted)", lineHeight: 1.7, fontSize: "0.9rem", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing overview */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 12 }}>
            Pricing
          </h2>
          <p style={{ color: "var(--ink-muted)", marginBottom: 40, fontSize: "0.95rem" }}>
            SecureLint has a generous free tier. Upgrade for advanced features.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {[
              {
                plan: "Free",
                price: "₹0",
                period: "forever",
                features: ["Basic API key detection", "Phishing protection", "SSL validation", "Domain age alerts"],
                highlight: false,
              },
              {
                plan: "Pro",
                price: "₹349",
                period: "per month",
                features: ["All Free features", "100+ secret patterns", "Custom regex patterns", "Detailed threat reports", "Priority support"],
                highlight: true,
              },
              {
                plan: "Quarterly",
                price: "₹999",
                period: "per quarter",
                features: ["All Pro features", "Save 5%", "Extended history", "Early access features"],
                highlight: false,
              },
            ].map((p) => (
              <div key={p.plan} style={{
                background: p.highlight ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${p.highlight ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 14,
                padding: "28px 20px",
              }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: p.highlight ? "#818cf8" : "var(--ink-muted)", marginBottom: 8, letterSpacing: "0.05em" }}>
                  {p.plan.toUpperCase()}
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--ink-muted)", marginBottom: 20 }}>{p.period}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, textAlign: "left" }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ fontSize: "0.85rem", color: "var(--ink-muted)", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      ✓ {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <a href="/#pricing" style={{ display: "inline-block", marginTop: 28, color: "#818cf8", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
            View full pricing details →
          </a>
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
              q: "What is SecureLint?",
              a: "SecureLint is a Chrome browser extension that provides real-time browser security: API key masking, phishing detection, SSL validation, XSS detection, browser DLP, secret scanning, and crypto drainer protection — all running 100% locally inside Chrome.",
            },
            {
              q: "Is SecureLint safe to use?",
              a: "Yes. SecureLint is built by VAPTLabs, a security research company. All processing happens locally inside your browser. No page content, credentials, URLs, or user data is ever transmitted to external servers. The extension's permissions are minimal and documented in our privacy policy.",
            },
            {
              q: "Does SecureLint work with enterprise Chrome deployments?",
              a: "Yes. SecureLint supports force-installation via Google Chrome Enterprise Admin, enabling IT teams to deploy it across an entire organization, configure policies centrally, and receive aggregated security reports.",
            },
            {
              q: "What is the difference between SecureLint Free and Pro?",
              a: "The free tier includes basic API key detection, phishing protection, and SSL checking. SecureLint Pro adds advanced detection (100+ patterns + custom regex), detailed threat reports, screen share privacy mode, priority support, and advanced DLP controls.",
            },
            {
              q: "Does SecureLint work with all websites?",
              a: "Yes. SecureLint scans all web pages you visit in Chrome, including web apps, cloud dashboards, AI tools, developer tools, email clients, and internal tools. It requires no per-site configuration.",
            },
            {
              q: "Where can I find SecureLint documentation?",
              a: "Documentation, getting started guides, and feature walkthroughs are available at securelint.in/blog. You can also reach the support team at support@securelint.in.",
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

      {/* Links to all topic pages */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>
            Explore SecureLint&apos;s Capabilities
          </h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 36, fontSize: "0.95rem" }}>
            Each feature has a dedicated page with full technical details, use cases, and FAQ.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { title: "Browser DLP", href: "/browser-dlp", color: "#ef4444" },
              { title: "API Key Masking", href: "/api-key-masking", color: "#22c55e" },
              { title: "Screen Share Privacy", href: "/screen-share-privacy", color: "#8b5cf6" },
              { title: "Phishing Protection", href: "/phishing-protection", color: "#f97316" },
              { title: "Browser Security", href: "/browser-security", color: "#3b82f6" },
              { title: "Secret Detection", href: "/secret-detection", color: "#ec4899" },
            ].map((link) => (
              <a key={link.href} href={link.href} style={{
                display: "block",
                background: `${link.color}08`,
                border: `1px solid ${link.color}25`,
                borderRadius: 10,
                padding: "16px 20px",
                textDecoration: "none",
                color: link.color,
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "background 0.2s",
              }}>
                {link.title} →
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "linear-gradient(135deg, #050d1a 0%, #0a0e1a 100%)",
        borderTop: "1px solid rgba(99,102,241,0.15)",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          Get started with SecureLint today
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32, fontSize: "1rem" }}>
          Install in 60 seconds. No configuration. Free forever for core features.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(135deg, #6366f1, #4338ca)",
              color: "#fff",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
            }}
          >
            Add to Chrome — Free
          </a>
          <a
            href="/blog"
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
            Read the Blog
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
