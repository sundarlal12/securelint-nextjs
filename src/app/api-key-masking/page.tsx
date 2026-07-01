import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "API Key Masking – SecureLint | Detect & Hide API Keys in Chrome",
  description:
    "SecureLint automatically detects and masks API keys, tokens, and credentials in your browser in real time. Prevent accidental exposure of AWS, OpenAI, Stripe, GitHub, and 80+ API key formats.",
  keywords: [
    "API key masking", "API key detector Chrome", "hide API keys browser",
    "mask API keys extension", "API key exposure detection", "API key leak prevention",
    "real-time API key detection", "AWS key masking Chrome", "OpenAI key masking",
    "Stripe key detection", "GitHub token masking", "SecureLint API key masking",
    "prevent API key leak", "credential masking browser",
  ],
  alternates: { canonical: "https://securelint.in/api-key-masking" },
  openGraph: {
    title: "API Key Masking – SecureLint | Real-Time API Key Detection & Masking",
    description:
      "Automatically detect and mask API keys, tokens, and secrets in your browser. Supports 80+ providers. 100% local — nothing is sent to any server.",
    url: "https://securelint.in/api-key-masking",
    type: "website",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint API Key Masking" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "API Key Masking – SecureLint | Stop API Key Leaks in Chrome",
    description:
      "Real-time API key masking for Chrome. Detect and hide AWS, OpenAI, Stripe, GitHub keys and 80+ more before they leak.",
    images: [{ url: "/og-banner.png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://securelint.in/api-key-masking",
      "url": "https://securelint.in/api-key-masking",
      "name": "API Key Masking – SecureLint",
      "description": "Real-time API key detection and masking inside Chrome. Supports 80+ providers with 100% local processing.",
      "isPartOf": { "@id": "https://securelint.in" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securelint.in" },
          { "@type": "ListItem", "position": 2, "name": "API Key Masking", "item": "https://securelint.in/api-key-masking" },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is API key masking?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "API key masking is the process of detecting and hiding API keys, tokens, and credentials in your browser or application so they cannot be accidentally read, screenshot, or shared. SecureLint masks secrets by replacing them with ••••••••• characters in real time.",
          },
        },
        {
          "@type": "Question",
          "name": "How does SecureLint detect API keys?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint uses a library of 100+ regex patterns and entropy analysis to identify API keys and secrets across web pages, forms, and AI chat inputs. When a pattern matches, the extension masks the value visually within milliseconds.",
          },
        },
        {
          "@type": "Question",
          "name": "Which API key formats does SecureLint support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint detects API keys from AWS, GCP, Azure, OpenAI, Anthropic, Stripe, Twilio, GitHub, GitLab, Slack, SendGrid, Heroku, Shopify, HubSpot, and 70+ more providers — plus generic high-entropy token detection.",
          },
        },
        {
          "@type": "Question",
          "name": "Does SecureLint send my API keys to any server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. All detection and masking happens 100% locally inside your browser. SecureLint never transmits your API keys, secrets, or page content to any external server.",
          },
        },
      ],
    },
  ],
};

const PROVIDERS = [
  { name: "AWS", pattern: "AKIA[0-9A-Z]{16}", color: "#FF9900" },
  { name: "OpenAI", pattern: "sk-[A-Za-z0-9]{48}", color: "#10a37f" },
  { name: "Stripe", pattern: "sk_live_[A-Za-z0-9]{24}", color: "#635bff" },
  { name: "GitHub", pattern: "ghp_[A-Za-z0-9]{36}", color: "#2dba4e" },
  { name: "Twilio", pattern: "SK[0-9a-f]{32}", color: "#f22f46" },
  { name: "Google Cloud", pattern: "AIza[0-9A-Za-z-_]{35}", color: "#4285f4" },
  { name: "Slack", pattern: "xoxb-[0-9]{11}-[A-Za-z0-9]{24}", color: "#4A154B" },
  { name: "SendGrid", pattern: "SG.[A-Za-z0-9]{22}", color: "#00b3e3" },
  { name: "Heroku", pattern: "[0-9a-f]{8}-[0-9a-f]{4}-…", color: "#79589f" },
  { name: "Azure", pattern: "client_secret=[A-Za-z0-9]{32}", color: "#0078d4" },
  { name: "JWT Tokens", pattern: "eyJ[A-Za-z0-9_-]{32}…", color: "#d63aff" },
  { name: "SSH Private Keys", pattern: "-----BEGIN RSA…", color: "#e67e22" },
];

export default function ApiKeyMaskingPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #0d1a0f 40%, #0a0e1a 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "80px 24px 72px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 20,
            padding: "5px 16px",
            fontSize: 13,
            color: "#4ade80",
            fontWeight: 600,
            marginBottom: 24,
            letterSpacing: "0.04em",
          }}>
            API KEY MASKING
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            margin: "0 0 20px",
          }}>
            Detect &amp; Mask API Keys in Your Browser — Automatically
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
            SecureLint identifies API keys and secrets from 80+ providers in real time. The moment a secret appears on a page — in a form, AI prompt, or web app — SecureLint masks it before it can be seen, screenshot, or shared.
          </p>
          <a
            href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
            }}
          >
            Add to Chrome — Free
          </a>
        </div>
      </section>

      {/* Problem statement */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 16 }}>
          Why API key leaks are so common — and so damaging
        </h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          API keys are the crown jewels of any development environment. A single exposed AWS key can drain your cloud account. A leaked Stripe key can trigger fraudulent charges. A compromised OpenAI key can result in thousands of dollars in unexpected API bills.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          The most common causes aren't sophisticated attacks — they're human error: pasting a key into the wrong browser tab, accidentally sharing a screen during a meeting, typing credentials into an AI chat window, or copying a secret into a public Notion doc.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem" }}>
          SecureLint catches these moments <strong>before they become incidents</strong>. It monitors your browser activity for API key patterns and masks them the instant they're detected.
        </p>
      </section>

      {/* Provider Grid */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>
            80+ API Key Formats Detected
          </h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 40, fontSize: "0.95rem" }}>
            SecureLint ships with detection signatures for the most common cloud providers, SaaS platforms, and developer tools.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {PROVIDERS.map((p) => (
              <div key={p.name} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "18px 20px",
              }}>
                <div style={{ fontWeight: 700, color: p.color, marginBottom: 6, fontSize: "0.95rem" }}>{p.name}</div>
                <code style={{
                  display: "block",
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}>
                  {p.pattern}
                </code>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginTop: 28, fontSize: "0.9rem" }}>
            + 70 more providers. Pro plan adds custom regex patterns for your internal systems.
          </p>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>
          Where API Key Masking Matters Most
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {[
            {
              icon: "🤖",
              title: "AI Chat Inputs",
              desc: "Developers routinely paste API keys into ChatGPT, Claude, or Gemini to debug integrations. SecureLint intercepts and masks them before they reach the AI's context window.",
            },
            {
              icon: "📺",
              title: "Screen Sharing",
              desc: "During code reviews or demos, secrets visible on screen can be captured by attendees. SecureLint masks them in real time so they're never visible.",
            },
            {
              icon: "📋",
              title: "Clipboard Leaks",
              desc: "Copied API keys can be accidentally pasted into the wrong application. SecureLint's clipboard monitoring detects secret patterns at paste time.",
            },
            {
              icon: "🌐",
              title: "Web Applications",
              desc: "Cloud dashboards, CI/CD tools, and admin panels often display API keys. SecureLint masks them site-wide so they're protected even in your own tools.",
            },
            {
              icon: "📝",
              title: "Notes & Docs",
              desc: "Secrets pasted into Notion, Google Docs, or Confluence are masked, preventing public sharing or link exposure.",
            },
            {
              icon: "🖥️",
              title: "Browser DevTools",
              desc: "API keys logged to the console or visible in network requests are masked to prevent shoulder surfing and recording.",
            },
          ].map((item) => (
            <div key={item.title} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              padding: "28px 24px",
            }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{item.icon}</div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: "var(--ink-muted)", lineHeight: 1.7, fontSize: "0.92rem", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
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
                q: "What is API key masking?",
                a: "API key masking is the process of automatically detecting and hiding API keys, tokens, and credentials so they cannot be accidentally read, screenshot, or shared. SecureLint replaces detected secrets with ••••••••• characters in real time.",
              },
              {
                q: "Does SecureLint work with custom API key formats?",
                a: "Yes. SecureLint Pro allows you to define custom regex patterns for internal tokens or proprietary credential formats specific to your organization.",
              },
              {
                q: "Can SecureLint mask API keys in ChatGPT or Claude?",
                a: "Yes. SecureLint monitors all browser text inputs, including AI chat interfaces. If you type or paste an API key into ChatGPT, Claude, or any other AI assistant, SecureLint will detect and mask it.",
              },
              {
                q: "Does masking affect the functionality of the page?",
                a: "No. SecureLint only masks the visual display of secrets. The underlying data is unchanged and the page continues to function normally. You can toggle masking on and off via the extension popup.",
              },
              {
                q: "How many API key formats does SecureLint support?",
                a: "SecureLint ships with 100+ detection signatures covering 80+ providers, including AWS, GCP, Azure, OpenAI, Stripe, GitHub, Twilio, SendGrid, Heroku, Slack, and many more. The library is regularly updated with new providers.",
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
        background: "linear-gradient(135deg, #0a1a0f 0%, #0a0e1a 100%)",
        borderTop: "1px solid rgba(34,197,94,0.15)",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          Never expose an API key again
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32, fontSize: "1rem" }}>
          Install SecureLint in 60 seconds and start masking credentials automatically.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
            }}
          >
            Add to Chrome — Free
          </a>
          <a
            href="/browser-dlp"
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
            Learn about Browser DLP
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
