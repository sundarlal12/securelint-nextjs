import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Screen Share Privacy – SecureLint | Mask Secrets During Screen Sharing",
  description:
    "SecureLint automatically masks API keys, passwords, and credentials visible on screen during Zoom, Meet, or Teams calls. Protect sensitive data from being recorded or seen by meeting attendees.",
  keywords: [
    "screen share privacy", "mask secrets screen sharing", "hide credentials screen share",
    "API key masking screen recording", "secure screen sharing Chrome",
    "prevent credential leak screen share", "Zoom screen share security",
    "Google Meet privacy extension", "screen recording privacy Chrome",
    "SecureLint screen share", "browser screen share protection",
  ],
  alternates: { canonical: "https://securelint.in/screen-share-privacy" },
  openGraph: {
    title: "Screen Share Privacy – SecureLint | Auto-Mask Secrets During Calls",
    description:
      "Stop accidentally exposing API keys and passwords during screen shares. SecureLint masks credentials in real time — so they're never visible to meeting attendees or recordings.",
    url: "https://securelint.in/screen-share-privacy",
    type: "website",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Screen Share Privacy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Screen Share Privacy – SecureLint | Mask Secrets During Screen Sharing",
    description:
      "API keys and passwords masked automatically during Zoom, Meet, and Teams calls. Never expose credentials on screen again.",
    images: [{ url: "/og-banner.png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://securelint.in/screen-share-privacy",
      "url": "https://securelint.in/screen-share-privacy",
      "name": "Screen Share Privacy – SecureLint",
      "description": "Automatically mask API keys and passwords during screen sharing sessions to prevent credential exposure.",
      "isPartOf": { "@id": "https://securelint.in" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securelint.in" },
          { "@type": "ListItem", "position": 2, "name": "Screen Share Privacy", "item": "https://securelint.in/screen-share-privacy" },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How can I hide API keys during screen sharing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint automatically detects and masks API keys, passwords, and credentials visible in your browser during screen sharing sessions. Install the Chrome extension and SecureLint will replace secrets with ••••••••• characters in real time, so they're never visible to meeting attendees or in recordings.",
          },
        },
        {
          "@type": "Question",
          "name": "Does SecureLint protect credentials during Zoom calls?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. SecureLint works across all screen sharing tools — Zoom, Google Meet, Microsoft Teams, Loom, and any other recording software — because it masks secrets at the browser level, not the stream level. Whatever is masked in your browser is masked in the screen share.",
          },
        },
        {
          "@type": "Question",
          "name": "What types of secrets does SecureLint mask during screen shares?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint masks API keys (AWS, OpenAI, Stripe, GitHub, etc.), database passwords, JWT tokens, OAuth credentials, SSH keys, and any other sensitive pattern visible on your screen — all in real time.",
          },
        },
      ],
    },
  ],
};

export default function ScreenSharePrivacyPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #0e0a1a 40%, #0a0e1a 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "80px 24px 72px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: 20,
            padding: "5px 16px",
            fontSize: 13,
            color: "#a78bfa",
            fontWeight: 600,
            marginBottom: 24,
            letterSpacing: "0.04em",
          }}>
            SCREEN SHARE PRIVACY
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            margin: "0 0 20px",
          }}>
            Stop Exposing Secrets During Screen Shares
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
            SecureLint automatically masks API keys, passwords, and credentials visible on your screen during Zoom, Google Meet, Teams, or Loom calls — before attendees or recordings can capture them.
          </p>
          <a
            href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(139,92,246,0.35)",
            }}
          >
            Add to Chrome — Free
          </a>
        </div>
      </section>

      {/* The problem */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 16 }}>
          The #1 way developers accidentally expose credentials
        </h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          It happens all the time: a developer opens a terminal, runs a command with an API key in it, and realizes mid-screen-share that their AWS secret key just appeared in plain text in front of 20 people on a Zoom call.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          Or a security engineer walks through a web app during an audit, and a production database password shows up in the network tab. Or a developer demos a cloud dashboard, not realizing that API keys are visible in the settings panel.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem" }}>
          These are not edge cases. Screen-share credential exposure is one of the most frequent causes of real-world API key leaks — and it's almost entirely preventable.
        </p>
      </section>

      {/* How it works */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>
            How SecureLint Protects Your Screen Share
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              {
                icon: "🔍",
                title: "Scan Every Page",
                desc: "SecureLint continuously scans all browser content — web apps, dashboards, terminals, DevTools — for 100+ sensitive patterns.",
              },
              {
                icon: "🙈",
                title: "Mask Instantly",
                desc: "Detected secrets are replaced with ••••••••• characters in milliseconds. The masking applies before any screen recording can capture the value.",
              },
              {
                icon: "🔔",
                title: "Alert You",
                desc: "SecureLint shows a discreet notification telling you exactly what was detected and where, so you can investigate if needed.",
              },
              {
                icon: "🔓",
                title: "Unmask On Demand",
                desc: "You can reveal a masked secret with a single click in the extension popup — only on your local device, never in the screen share stream.",
              },
            ].map((item) => (
              <div key={item.title} style={{
                background: "rgba(255,255,255,0.03)",
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
        </div>
      </section>

      {/* Platforms */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 16, textAlign: "center" }}>
          Works with Every Screen Sharing Tool
        </h2>
        <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 36, fontSize: "0.95rem" }}>
          Because SecureLint masks at the browser level, it protects your screen share regardless of what platform you use.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {[
            "Zoom", "Google Meet", "Microsoft Teams",
            "Loom", "Webex", "Slack Huddles",
            "Discord", "OBS Studio", "Any recording software",
          ].map((platform) => (
            <div key={platform} style={{
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.15)",
              borderRadius: 10,
              padding: "14px 18px",
              textAlign: "center",
              fontSize: "0.92rem",
              color: "var(--ink)",
              fontWeight: 500,
            }}>
              {platform}
            </div>
          ))}
        </div>
      </section>

      {/* Scenarios */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>
            Real Scenarios Where This Prevents Incidents
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              {
                scenario: "Code review with the team",
                risk: "A team member pulls up a config file containing production database credentials while sharing their screen.",
                protection: "SecureLint masks the password in the editor's web view before the screen share begins — attendees only see •••••••.",
              },
              {
                scenario: "Security audit walkthrough",
                risk: "A penetration tester walks through a cloud dashboard showing AWS secret keys in the settings panel.",
                protection: "SecureLint automatically masks the keys on the dashboard, preventing them from appearing in the audit recording.",
              },
              {
                scenario: "Customer onboarding demo",
                risk: "A sales engineer shows the product's API integration flow, accidentally revealing API credentials in the browser network tab.",
                protection: "SecureLint masks all secrets detected in DevTools, ensuring only ••• appears in the screen recording.",
              },
              {
                scenario: "Remote developer onboarding",
                risk: "A new hire is guided through environment setup over a screen share, and their mentor's API keys become visible.",
                protection: "SecureLint masks credentials in the terminal web view, preventing accidental exposure to the new hire.",
              },
            ].map((item) => (
              <div key={item.scenario} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "24px 28px",
              }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>
                  Scenario: {item.scenario}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: "0.78rem", color: "#f87171", fontWeight: 600, marginBottom: 6, letterSpacing: "0.05em" }}>WITHOUT SECURELINT</div>
                    <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{item.risk}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.78rem", color: "#4ade80", fontWeight: 600, marginBottom: 6, letterSpacing: "0.05em" }}>WITH SECURELINT</div>
                    <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{item.protection}</p>
                  </div>
                </div>
              </div>
            ))}
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
              q: "How can I hide API keys during screen sharing?",
              a: "Install SecureLint from the Chrome Web Store. It automatically detects and masks API keys, passwords, and credentials visible in any browser page — so they appear as ••••••• to anyone watching your screen share.",
            },
            {
              q: "Does SecureLint work during Zoom, Meet, or Teams calls?",
              a: "Yes. SecureLint works at the browser level, so it protects your screen share regardless of which video conferencing tool you use — Zoom, Google Meet, Microsoft Teams, Webex, Slack, or any other platform.",
            },
            {
              q: "Can I still see my own credentials after masking?",
              a: "Yes. You can reveal any masked secret by clicking the SecureLint icon in your Chrome toolbar. The reveal happens only on your local device and does not affect what screen share attendees see.",
            },
            {
              q: "Does this affect the performance of video calls?",
              a: "No. SecureLint's masking is purely visual — it modifies DOM elements to replace text. This has no impact on network performance, video quality, or application functionality.",
            },
            {
              q: "Does SecureLint protect secrets in browser DevTools?",
              a: "Yes. SecureLint masks secrets visible in the browser console, network tab, and application storage panels — common places where API keys appear during developer screen shares.",
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
        background: "linear-gradient(135deg, #0e0a1a 0%, #0a0e1a 100%)",
        borderTop: "1px solid rgba(139,92,246,0.15)",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          Share your screen with confidence
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32, fontSize: "1rem" }}>
          Never worry about accidentally exposing credentials during a call again.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 20px rgba(139,92,246,0.3)",
            }}
          >
            Add to Chrome — Free
          </a>
          <a
            href="/api-key-masking"
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
            Learn about API Key Masking
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
