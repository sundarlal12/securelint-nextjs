import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { PageHoverStyles } from "@/components/ui/PageHoverStyles";

export const metadata: Metadata = {
  title: "Secret Detection – SecureLint | Real-Time Browser Secret Scanner",
  description: "SecureLint detects secrets, credentials, API keys, passwords, tokens, and sensitive data in your browser in real time — using regex patterns and entropy analysis. The best secret detection tool for developers.",
  keywords: ["secret detection browser","secret scanner Chrome extension","credential detection tool","detect secrets browser","real-time secret detection","API key secret detection","secret scanning Chrome","credential scanning browser","hardcoded secrets browser","secret leak detection","entropy-based secret detection","SecureLint secret detection","developer secret scanner","sensitive data detection browser"],
  alternates: { canonical: "https://securelint.in/secret-detection" },
  openGraph: { title: "Secret Detection – SecureLint | Real-Time Credential & Secret Scanner for Chrome", description: "Detect API keys, passwords, tokens, and 100+ secret types in your browser in real time. 100% local processing — no data leaves your device.", url: "https://securelint.in/secret-detection", type: "website", images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Secret Detection" }] },
  twitter: { card: "summary_large_image", title: "Secret Detection – SecureLint | Real-Time Browser Secret Scanner", description: "Detect API keys, passwords, tokens, and secrets in real time inside Chrome. Regex + entropy analysis. 100% local.", images: [{ url: "/og-banner.png" }] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": "https://securelint.in/secret-detection", "url": "https://securelint.in/secret-detection", "name": "Secret Detection – SecureLint", "description": "Real-time browser secret scanner: detect API keys, passwords, tokens, and credentials using regex patterns and entropy analysis.", "isPartOf": { "@id": "https://securelint.in" }, "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securelint.in" }, { "@type": "ListItem", "position": 2, "name": "Secret Detection", "item": "https://securelint.in/secret-detection" }] } },
    { "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "What is secret detection?", "acceptedAnswer": { "@type": "Answer", "text": "Secret detection is the process of automatically identifying sensitive strings — such as API keys, passwords, tokens, private keys, and database credentials — in source code, web pages, or application output." } }, { "@type": "Question", "name": "How does SecureLint detect secrets in the browser?", "acceptedAnswer": { "@type": "Answer", "text": "SecureLint uses two detection methods: (1) Regex pattern matching — a library of 100+ provider-specific patterns — and (2) Entropy analysis — detecting high-entropy random strings that are statistically likely to be secrets." } }, { "@type": "Question", "name": "Does secret detection work on localhost or internal tools?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. SecureLint scans all web pages loaded in Chrome, including localhost, internal tools, and web-based IDEs." } }] },
  ],
};

const ACCENT = "#28ccb5";

const DETECTION_METHODS = [
  { title: "Provider Regex", badge: "HIGH PRECISION", badgeColor: "#22c55e", desc: "Exact pattern matching for known API key formats — AWS AKIA..., OpenAI sk-..., Stripe sk_live_... and 80+ more provider-specific signatures.", titleColor: "#22c55e" },
  { title: "Generic Regex", badge: "BROAD COVERAGE", badgeColor: "#22c55e", desc: "Common credential patterns not tied to a specific provider — password=..., api_key=..., Authorization: Bearer ... — catch-all patterns for custom implementations.", titleColor: "#22c55e" },
  { title: "Entropy Analysis", badge: "UNKNOWN FORMATS", badgeColor: "#f59e0b", desc: "Statistical detection of high-entropy random strings. API keys and cryptographic secrets are typically much more random than regular text — flagged by their statistical profile.", titleColor: "#f59e0b" },
  { title: "Custom Patterns (Pro)", badge: "PRO", badgeColor: ACCENT, desc: "User-defined regex patterns for internal secret formats — proprietary tokens, internal project IDs, custom credential schemas specific to your organization.", titleColor: ACCENT },
];

const whereSecretsItems = [
  { icon: "🤖", title: "AI Chat Windows", desc: "Developers paste API keys into ChatGPT, Claude, Gemini, and other AI tools to debug integrations or get help with code." },
  { icon: "☁️", title: "Cloud Dashboards", desc: "AWS Console, GCP, Azure, and other cloud provider dashboards often display credentials in settings pages and configuration panels." },
  { icon: "⚙️", title: "CI/CD Web UIs", desc: "GitHub Actions, CircleCI, Jenkins web interfaces display environment variables and secrets in pipeline configuration pages." },
  { icon: "🖥️", title: "Browser DevTools", desc: "API keys and tokens frequently appear in the Network tab (request headers), Console (log output), and Application Storage." },
  { icon: "📝", title: "Online Code Editors", desc: "Web-based IDEs (CodeSandbox, StackBlitz, Repl.it) show configuration files containing real secrets typed by developers." },
  { icon: "📄", title: "Notion & Confluence", desc: "Teams paste credentials into documentation and internal wikis, creating persistent exposure even after the key is rotated." },
];

export default function SecretDetectionPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PageHoverStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0e1a 0%,#1a0a14 40%,#0a0e1a 100%)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "100px 24px 90px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.30)", borderRadius: 20, padding: "5px 18px", fontSize: 13, color: "#f472b6", fontWeight: 600, marginBottom: 28, letterSpacing: "0.05em" }}>SECRET DETECTION</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.12, margin: "0 0 22px" }}>Real-Time Secret Detection in Your Browser</h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.75, margin: "0 0 40px", maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>SecureLint scans every page in Chrome for API keys, passwords, tokens, and 100+ secret types — using both regex pattern matching and entropy analysis — all in real time, 100% locally.</p>
          <a href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj" target="_blank" rel="noopener noreferrer" className="sl-btn-primary" style={{ display: "inline-block", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "15px 36px", borderRadius: 12, textDecoration: "none", boxShadow: "0 12px 30px rgba(40,204,181,0.30)" }}>
            Add to Chrome — Free
          </a>
        </div>
      </section>

      {/* What is secret detection */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 18 }}>What is secret detection?</h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem", marginBottom: 18 }}><strong>Secret detection</strong> is the automated identification of sensitive strings — API keys, passwords, tokens, private keys, and database credentials — in digital environments. Traditionally this is a CI/CD concern (tools like GitLeaks scan source code before commit), but browser-level secret detection is increasingly critical.</p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem", marginBottom: 18 }}>Developers spend most of their day in a browser. Secrets appear everywhere: in web app configurations, AI chat windows, cloud dashboards, browser DevTools, environment variable editors, and copied clipboard content. None of these are scanned by traditional code-level secret detectors.</p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem" }}>SecureLint fills this gap with continuous, real-time secret detection at the browser level — catching credentials the moment they appear on any page, in any context.</p>
      </section>

      {/* Detection Methods – Grid */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>Detection Methods</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 44, fontSize: "0.95rem" }}>Multiple detection techniques to maximize coverage while minimizing false positives.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {DETECTION_METHODS.map((dt) => (
              <div key={dt.title} className="sl-hover-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: dt.titleColor ?? "var(--ink)", margin: 0 }}>{dt.title}</h3>
                  <span style={{ background: `${dt.badgeColor}20`, color: dt.badgeColor, fontSize: "0.72rem", fontWeight: 800, padding: "3px 10px", borderRadius: 12, border: `1px solid ${dt.badgeColor}40`, letterSpacing: "0.05em", flexShrink: 0 }}>{dt.badge}</span>
                </div>
                <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem", lineHeight: 1.7, margin: 0 }}>{dt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where Secrets Appear – Carousel */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>Where Secrets Appear in the Browser</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 44, fontSize: "0.95rem" }}>Six contexts where credentials show up unexpectedly — all scanned by SecureLint.</p>
          <CardCarousel items={whereSecretsItems} accentColor={ACCENT} cardBg="rgba(236,72,153,0.04)" />
        </div>
      </section>

      {/* Browser vs CI vs SAST Table */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>Browser Secret Detection vs. Other Approaches</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 40, fontSize: "0.95rem", maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>Code-level scanners only catch secrets that reach source control. Browser detection catches the ones that never should.</p>
          <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  <th style={{ textAlign: "left", padding: "14px 20px", color: "var(--ink-muted)", fontWeight: 600 }}>Scenario</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", color: ACCENT, fontWeight: 700 }}>SecureLint</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", color: "var(--ink-muted)", fontWeight: 600 }}>GitLeaks / TruffleHog</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", color: "var(--ink-muted)", fontWeight: 600 }}>SAST Tools</th>
                </tr>
              </thead>
              <tbody>
                {[["API key pasted into ChatGPT","✅ Detected","❌ Never scanned","❌ Never scanned"],["Secret in cloud dashboard UI","✅ Detected","❌ Never scanned","❌ Never scanned"],["Credential in browser DevTools","✅ Detected","❌ Never scanned","❌ Never scanned"],["Secret committed to git","⚠️ If opened in browser","✅ Detected","✅ Detected"],["Real-time detection (no commit needed)","✅","❌","❌"],["Works for non-developers","✅","❌","❌"]].map(([s,sl,gl,sast],i) => (
                  <tr key={s} style={{ background: i%2===0?"transparent":"rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "12px 20px", color: "var(--ink)", fontWeight: 500 }}>{s}</td>
                    <td style={{ padding: "12px 20px", color: "#4ade80", textAlign: "center" }}>{sl}</td>
                    <td style={{ padding: "12px 20px", color: "var(--ink-muted)", textAlign: "center" }}>{gl}</td>
                    <td style={{ padding: "12px 20px", color: "var(--ink-muted)", textAlign: "center" }}>{sast}</td>
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
              { q: "What is the difference between secret detection and credential scanning?", a: "Secret detection is the broader category — identifying any sensitive string in a digital environment. Credential scanning typically refers specifically to username/password pairs. SecureLint does both, plus API keys, tokens, private keys, and high-entropy strings." },
              { q: "Does SecureLint detect secrets in JavaScript or HTML source?", a: "Yes. SecureLint scans the rendered page content, which includes values loaded by JavaScript, dynamically populated fields, and inline HTML content." },
              { q: "Can SecureLint detect secrets in localhost applications?", a: "Yes. SecureLint works on all pages loaded in Chrome, including localhost, 127.0.0.1, and private network addresses. This is especially useful for developers testing local applications that load real credentials from environment files." },
              { q: "How does entropy analysis work?", a: "Entropy analysis measures the randomness of a string. API keys and cryptographic secrets are typically high-entropy (very random) compared to regular text. SecureLint flags strings above a certain entropy threshold that are likely to be secrets, even if they don't match a known provider pattern." },
              { q: "Does secret detection work in private or incognito mode?", a: "Secret detection works in incognito mode if you enable it in the Chrome extension settings. By default, Chrome extensions require explicit permission to run in incognito windows." },
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
      <section style={{ background: "linear-gradient(135deg,#1a0a14 0%,#0a0e1a 100%)", borderTop: `1px solid ${ACCENT}20`, padding: "100px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2rem)", fontWeight: 800, color: "#fff", marginBottom: 18 }}>Scan your browser for secrets in real time</h2>
        <p style={{ color: "rgba(255,255,255,0.58)", marginBottom: 40, fontSize: "1rem", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>100+ secret patterns. Entropy analysis. 100% local. Free to start.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj" target="_blank" rel="noopener noreferrer" className="sl-btn-primary" style={{ background: ACCENT, color: "#fff", fontWeight: 700, padding: "15px 36px", borderRadius: 12, textDecoration: "none", fontSize: "1rem", boxShadow: "0 12px 30px rgba(40,204,181,0.30)" }}>
            Add to Chrome — Free
          </a>
          <a href="/browser-dlp" className="sl-btn-secondary" style={{ background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600, padding: "15px 36px", borderRadius: 12, textDecoration: "none", fontSize: "1rem", border: "1px solid rgba(255,255,255,0.14)" }}>
            Learn about Browser DLP
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
