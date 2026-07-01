import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Secret Detection – SecureLint | Real-Time Browser Secret Scanner",
  description:
    "SecureLint detects secrets, credentials, API keys, passwords, tokens, and sensitive data in your browser in real time — using regex patterns and entropy analysis. The best secret detection tool for developers.",
  keywords: [
    "secret detection browser", "secret scanner Chrome extension",
    "credential detection tool", "detect secrets browser",
    "real-time secret detection", "API key secret detection",
    "secret scanning Chrome", "credential scanning browser",
    "hardcoded secrets browser", "secret leak detection",
    "entropy-based secret detection", "SecureLint secret detection",
    "developer secret scanner", "sensitive data detection browser",
  ],
  alternates: { canonical: "https://securelint.in/secret-detection" },
  openGraph: {
    title: "Secret Detection – SecureLint | Real-Time Credential & Secret Scanner for Chrome",
    description:
      "Detect API keys, passwords, tokens, and 100+ secret types in your browser in real time. 100% local processing — no data leaves your device.",
    url: "https://securelint.in/secret-detection",
    type: "website",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Secret Detection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Secret Detection – SecureLint | Real-Time Browser Secret Scanner",
    description:
      "Detect API keys, passwords, tokens, and secrets in real time inside Chrome. Regex + entropy analysis. 100% local.",
    images: [{ url: "/og-banner.png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://securelint.in/secret-detection",
      "url": "https://securelint.in/secret-detection",
      "name": "Secret Detection – SecureLint",
      "description": "Real-time browser secret scanner: detect API keys, passwords, tokens, and credentials using regex patterns and entropy analysis.",
      "isPartOf": { "@id": "https://securelint.in" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securelint.in" },
          { "@type": "ListItem", "position": 2, "name": "Secret Detection", "item": "https://securelint.in/secret-detection" },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is secret detection?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Secret detection is the process of automatically identifying sensitive strings — such as API keys, passwords, tokens, private keys, and database credentials — in source code, web pages, or application output. SecureLint performs browser-native secret detection in real time, scanning everything visible in Chrome for 100+ secret patterns.",
          },
        },
        {
          "@type": "Question",
          "name": "How does SecureLint detect secrets in the browser?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint uses two detection methods: (1) Regex pattern matching — a library of 100+ provider-specific patterns (AWS, OpenAI, Stripe, etc.) — and (2) Entropy analysis — detecting high-entropy random strings that are statistically likely to be secrets, even if they don't match a known pattern. Both methods run locally in real time.",
          },
        },
        {
          "@type": "Question",
          "name": "What types of secrets can SecureLint detect?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SecureLint detects API keys (80+ providers), database connection strings, JWT tokens, OAuth tokens, SSH and RSA private keys, passwords in URLs, environment variable values, high-entropy strings, and custom patterns defined by the user.",
          },
        },
        {
          "@type": "Question",
          "name": "Does secret detection work on localhost or internal tools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. SecureLint scans all web pages loaded in Chrome, including localhost, internal tools, and web-based IDEs. This is especially useful for developers who use browser-based environments like Gitpod, CodeSandbox, or internal admin dashboards.",
          },
        },
      ],
    },
  ],
};

const DETECTION_TYPES = [
  {
    method: "Provider Regex",
    description: "Exact pattern matching for known API key formats",
    examples: ["AWS AKIA...", "OpenAI sk-...", "Stripe sk_live_..."],
    confidence: "High",
    confidenceColor: "#22c55e",
  },
  {
    method: "Generic Regex",
    description: "Common credential patterns not tied to a specific provider",
    examples: ["password=...", "api_key=...", "Authorization: Bearer ..."],
    confidence: "High",
    confidenceColor: "#22c55e",
  },
  {
    method: "Entropy Analysis",
    description: "Statistical detection of high-entropy random strings",
    examples: ["Unknown token formats", "Encoded secrets", "Obfuscated keys"],
    confidence: "Medium",
    confidenceColor: "#f59e0b",
  },
  {
    method: "Custom Patterns (Pro)",
    description: "User-defined regex patterns for internal secret formats",
    examples: ["Internal project tokens", "Proprietary credentials", "Custom ID formats"],
    confidence: "User-defined",
    confidenceColor: "#8b5cf6",
  },
];

export default function SecretDetectionPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #1a0a14 40%, #0a0e1a 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "80px 24px 72px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(236,72,153,0.12)",
            border: "1px solid rgba(236,72,153,0.3)",
            borderRadius: 20,
            padding: "5px 16px",
            fontSize: 13,
            color: "#f472b6",
            fontWeight: 600,
            marginBottom: 24,
            letterSpacing: "0.04em",
          }}>
            SECRET DETECTION
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            margin: "0 0 20px",
          }}>
            Real-Time Secret Detection in Your Browser
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
            SecureLint scans every page in Chrome for API keys, passwords, tokens, and 100+ secret types — using both regex pattern matching and entropy analysis — all in real time, 100% locally.
          </p>
          <a
            href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #ec4899, #be185d)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(236,72,153,0.35)",
            }}
          >
            Add to Chrome — Free
          </a>
        </div>
      </section>

      {/* What is secret detection */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 16 }}>
          What is secret detection?
        </h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          <strong>Secret detection</strong> is the automated identification of sensitive strings — API keys, passwords, tokens, private keys, and database credentials — in digital environments. Traditionally this is a CI/CD concern (tools like GitLeaks scan source code before commit), but browser-level secret detection is increasingly critical.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 16 }}>
          Developers spend most of their day in a browser. Secrets appear everywhere: in web app configurations, AI chat windows, cloud dashboards, browser DevTools, environment variable editors, and copied clipboard content. None of these are scanned by traditional code-level secret detectors.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.8, fontSize: "1.05rem" }}>
          SecureLint fills this gap with continuous, real-time secret detection at the browser level — catching credentials the moment they appear on any page, in any context.
        </p>
      </section>

      {/* Detection methods */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>
            Detection Methods
          </h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 40, fontSize: "0.95rem" }}>
            SecureLint uses multiple detection techniques to maximize coverage while minimizing false positives.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {DETECTION_TYPES.map((dt) => (
              <div key={dt.method} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "28px 24px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>{dt.method}</h3>
                  <span style={{
                    background: `${dt.confidenceColor}20`,
                    color: dt.confidenceColor,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 12,
                    border: `1px solid ${dt.confidenceColor}40`,
                  }}>
                    {dt.confidence}
                  </span>
                </div>
                <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: 14 }}>{dt.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {dt.examples.map((ex) => (
                    <code key={ex} style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "monospace",
                      background: "rgba(255,255,255,0.04)",
                      padding: "4px 10px",
                      borderRadius: 6,
                      display: "block",
                    }}>
                      {ex}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where secrets appear */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 40, textAlign: "center" }}>
          Where Secrets Appear in the Browser
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            { icon: "🤖", title: "AI Chat Windows", desc: "Developers paste API keys into ChatGPT, Claude, Gemini, and other AI tools to debug integrations or get help with code." },
            { icon: "☁️", title: "Cloud Dashboards", desc: "AWS Console, GCP, Azure, and other cloud provider dashboards often display credentials in settings pages and configuration panels." },
            { icon: "⚙️", title: "CI/CD Web UIs", desc: "GitHub Actions, CircleCI, Jenkins web interfaces display environment variables and secrets in pipeline configuration pages." },
            { icon: "🖥️", title: "Browser DevTools", desc: "API keys and tokens frequently appear in the Network tab (request headers), Console (log output), and Application Storage." },
            { icon: "📝", title: "Online Code Editors", desc: "Web-based IDEs (CodeSandbox, StackBlitz, Repl.it) show configuration files containing real secrets typed by developers." },
            { icon: "📄", title: "Notion & Confluence", desc: "Teams paste credentials into documentation and internal wikis, creating persistent exposure even after the key is rotated." },
          ].map((item) => (
            <div key={item.title} style={{
              background: "rgba(236,72,153,0.05)",
              border: "1px solid rgba(236,72,153,0.12)",
              borderRadius: 14,
              padding: "24px",
            }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: "var(--ink-muted)", lineHeight: 1.7, fontSize: "0.9rem", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browser vs CI vs SAST */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>
            Browser Secret Detection vs. Other Approaches
          </h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 36, fontSize: "0.95rem" }}>
            Code-level scanners only catch secrets that reach source control. Browser detection catches the ones that never should.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "var(--ink-muted)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>Scenario</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", color: "#f472b6", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>SecureLint</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", color: "var(--ink-muted)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>GitLeaks / TruffleHog</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", color: "var(--ink-muted)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>SAST Tools</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["API key pasted into ChatGPT", "✅ Detected", "❌ Never scanned", "❌ Never scanned"],
                  ["Secret in cloud dashboard UI", "✅ Detected", "❌ Never scanned", "❌ Never scanned"],
                  ["Credential in browser DevTools", "✅ Detected", "❌ Never scanned", "❌ Never scanned"],
                  ["Secret committed to git", "⚠️ If opened in browser", "✅ Detected", "✅ Detected"],
                  ["Secret in environment config file", "✅ If opened in browser", "✅ Detected", "✅ Detected"],
                  ["Real-time detection (no commit needed)", "✅", "❌", "❌"],
                  ["Works for non-developers", "✅", "❌", "❌"],
                ].map(([scenario, sl, gl, sast]) => (
                  <tr key={scenario} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 16px", color: "var(--ink)", fontWeight: 500 }}>{scenario}</td>
                    <td style={{ padding: "12px 16px", color: "#4ade80", textAlign: "center" }}>{sl}</td>
                    <td style={{ padding: "12px 16px", color: "var(--ink-muted)", textAlign: "center" }}>{gl}</td>
                    <td style={{ padding: "12px 16px", color: "var(--ink-muted)", textAlign: "center" }}>{sast}</td>
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
              q: "What is the difference between secret detection and credential scanning?",
              a: "Secret detection is the broader category — identifying any sensitive string in a digital environment. Credential scanning typically refers specifically to username/password pairs. SecureLint does both, plus API keys, tokens, private keys, and high-entropy strings.",
            },
            {
              q: "Does SecureLint detect secrets in JavaScript or HTML source?",
              a: "Yes. SecureLint scans the rendered page content, which includes values loaded by JavaScript, dynamically populated fields, and inline HTML content. It detects secrets whether they're in the visible text or in hidden form fields.",
            },
            {
              q: "Can SecureLint detect secrets in localhost applications?",
              a: "Yes. SecureLint works on all pages loaded in Chrome, including localhost, 127.0.0.1, and private network addresses. This is especially useful for developers testing local applications that load real credentials from environment files.",
            },
            {
              q: "How does entropy analysis work?",
              a: "Entropy analysis measures the randomness of a string. API keys and cryptographic secrets are typically high-entropy (very random) compared to regular text. SecureLint flags strings above a certain entropy threshold that are likely to be secrets, even if they don't match a known provider pattern.",
            },
            {
              q: "Does secret detection work in private or incognito mode?",
              a: "Secret detection works in incognito mode if you enable it in the Chrome extension settings. By default, Chrome extensions require explicit permission to run in incognito windows.",
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
        background: "linear-gradient(135deg, #1a0a14 0%, #0a0e1a 100%)",
        borderTop: "1px solid rgba(236,72,153,0.15)",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          Scan your browser for secrets in real time
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32, fontSize: "1rem" }}>
          100+ secret patterns. Entropy analysis. 100% local. Free to start.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(135deg, #ec4899, #be185d)",
              color: "#fff",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 20px rgba(236,72,153,0.3)",
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
