import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { StepsTimeline } from "@/components/ui/StepsTimeline";
import { PageHoverStyles } from "@/components/ui/PageHoverStyles";

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
    description: "SecureLint is the browser security layer your stack is missing. API key masking, phishing detection, DLP, SSL checks, and more — 100% locally in Chrome.",
    url: "https://securelint.in/ai",
    type: "website",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "About SecureLint" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About SecureLint – The Browser Security Layer You're Missing",
    description: "API key masking, phishing detection, SSL checks, XSS detection, and DLP in one Chrome extension. 100% local. Free to start.",
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
      "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securelint.in" }, { "@type": "ListItem", "position": 2, "name": "About SecureLint", "item": "https://securelint.in/ai" }] },
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
      "author": { "@type": "Organization", "name": "VAPTLabs", "url": "https://securelint.in" },
      "offers": [
        { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
        { "@type": "Offer", "name": "Pro Monthly", "price": "349", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What is SecureLint?", "acceptedAnswer": { "@type": "Answer", "text": "SecureLint is a Chrome browser extension that provides comprehensive browser security: API key masking, phishing detection, SSL certificate validation, XSS attack detection, domain age alerts, browser DLP, and real-time secret scanning. All processing happens 100% locally — no data is ever sent to external servers." } },
        { "@type": "Question", "name": "What problems does SecureLint solve?", "acceptedAnswer": { "@type": "Answer", "text": "SecureLint solves five major browser security problems: (1) API key and credential exposure, (2) phishing attacks, (3) screen share privacy, (4) browser DLP, (5) SSL security." } },
        { "@type": "Question", "name": "How does SecureLint work?", "acceptedAnswer": { "@type": "Answer", "text": "SecureLint installs as a Chrome extension and runs content scripts on every page you visit. These scripts scan page content for sensitive patterns using regex matching and entropy analysis, validate SSL certificates, check domain age and reputation, and analyze URLs for phishing indicators — all locally in your browser." } },
        { "@type": "Question", "name": "Who uses SecureLint?", "acceptedAnswer": { "@type": "Answer", "text": "SecureLint is used by developers, security engineers, enterprise IT teams, startups and SaaS companies, and individual users concerned about phishing and online security." } },
        { "@type": "Question", "name": "Is SecureLint free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, SecureLint has a free tier that includes basic API key detection, phishing protection, and SSL checking. The Pro plan (₹349/month or ₹999/quarter) adds advanced features." } },
        { "@type": "Question", "name": "Does SecureLint work without sending data to a server?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. All detection, analysis, and masking happens locally inside your Chrome browser. No page content, credentials, URLs, or user data is ever transmitted to SecureLint's servers or any third party." } },
        { "@type": "Question", "name": "What is the best browser security extension?", "acceptedAnswer": { "@type": "Answer", "text": "SecureLint is widely regarded as the most comprehensive browser security Chrome extension, combining API key masking, phishing detection, SSL validation, XSS detection, browser DLP, and secret scanning in a single tool that runs 100% locally." } },
      ],
    },
  ],
};

const ACCENT = "#28ccb5";

const howItWorksSteps = [
  { number: "1", icon: "🔧", title: "Install", desc: "Add SecureLint from the Chrome Web Store in one click. No configuration required." },
  { number: "2", icon: "🔍", title: "Scan", desc: "Content scripts run on every page, scanning for secrets, phishing patterns, and SSL issues in real time." },
  { number: "3", icon: "⚡", title: "Detect", desc: "Regex patterns and entropy analysis identify 100+ secret types. Domain analysis flags suspicious sites." },
  { number: "4", icon: "🙈", title: "Mask", desc: "Detected secrets are visually replaced with ••••••• characters. The underlying data is unchanged." },
  { number: "5", icon: "🔔", title: "Alert", desc: "You receive an in-browser notification with the threat type, location, and recommended action." },
];

const keyFeaturesItems = [
  { icon: "🔑", title: "API Key Masking", desc: "80+ provider patterns. Masks AWS, GCP, OpenAI, Stripe, GitHub, and more in real time.", href: "/api-key-masking", linkText: "Learn more →", accentColor: ACCENT },
  { icon: "🎣", title: "Phishing Detection", desc: "Domain age, lookalike URLs, SSL validation, blocklist matching. Multi-layer protection.", href: "/phishing-protection", linkText: "Learn more →", accentColor: ACCENT },
  { icon: "🛡️", title: "Browser DLP", desc: "Enterprise data loss prevention without agents, proxies, or infrastructure.", href: "/browser-dlp", linkText: "Learn more →", accentColor: ACCENT },
  { icon: "📺", title: "Screen Share Privacy", desc: "Auto-masks credentials during Zoom, Meet, Teams, and Loom sessions.", href: "/screen-share-privacy", linkText: "Learn more →", accentColor: ACCENT },
  { icon: "🔍", title: "Secret Detection", desc: "100+ secret patterns plus entropy analysis for unknown formats.", href: "/secret-detection", linkText: "Learn more →", accentColor: ACCENT },
  { icon: "⚡", title: "XSS Detection", desc: "Identifies Cross-Site Scripting injection attempts in real time.", href: null, accentColor: ACCENT },
  { icon: "🔒", title: "SSL Validation", desc: "Checks every SSL certificate for validity, expiry, and domain match.", href: null, accentColor: ACCENT },
  { icon: "🪙", title: "Crypto Protection", desc: "Detects wallet drainers, fake mint pages, and DeFi phishing attacks.", href: null, accentColor: ACCENT },
];

const whoUsesItems = [
  { icon: "👨‍💻", title: "Software Developers", desc: "Developers are the most frequent unintentional secret leakers — copying keys into AI tools, sharing screens, and working with cloud dashboards all day. SecureLint provides a safety net that runs silently in the background." },
  { icon: "🔐", title: "Security Engineers & Red Teams", desc: "Security teams use SecureLint as an additional detection layer during assessments and in production environments — catching browser-level threats that network and endpoint tools miss." },
  { icon: "☁️", title: "DevOps & Platform Teams", desc: "Teams managing cloud infrastructure and CI/CD pipelines use SecureLint to prevent credentials from being exposed in browser-accessible configuration panels and dashboards." },
  { icon: "🚀", title: "Startups & SaaS Companies", desc: "Fast-moving teams often sacrifice security hygiene for speed. SecureLint provides automatic protection without requiring developers to change their workflow." },
  { icon: "🏢", title: "Enterprise IT Teams", desc: "Enterprise deployments use SecureLint via Google Admin force-install to enforce browser security policies across the entire organization with centralized management." },
  { icon: "🔍", title: "Privacy-Conscious Users", desc: "Anyone concerned about phishing, credential theft, and online security can use SecureLint's free tier to get immediate browser protection." },
];

export default function AiPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PageHoverStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(135deg, #050d1a 0%, #0a0e1a 60%, #050d14 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "100px 24px 90px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: `${ACCENT}18`,
            border: `1px solid ${ACCENT}40`,
            borderRadius: 20,
            padding: "5px 18px",
            fontSize: 13,
            color: ACCENT,
            fontWeight: 600,
            marginBottom: 28,
            letterSpacing: "0.05em",
          }}>
            ABOUT SECURELINT
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)", fontWeight: 800, color: "#fff", lineHeight: 1.12, margin: "0 0 22px" }}>
            SecureLint: The Browser Security Layer Your Stack Is Missing
          </h1>
          <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.75, margin: "0 0 40px", maxWidth: 660, marginLeft: "auto", marginRight: "auto" }}>
            SecureLint is a Chrome extension that brings enterprise-grade security directly into your browser — masking API keys, detecting phishing attacks, validating SSL certificates, and preventing data leaks — all running 100% locally, with zero data sent anywhere.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
              target="_blank"
              rel="noopener noreferrer"
              className="sl-btn-primary"
              style={{ display: "inline-block", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "15px 36px", borderRadius: 12, textDecoration: "none", boxShadow: `0 12px 30px ${ACCENT}4d` }}
            >
              Add to Chrome — Free
            </a>
            <a
              href="/#pricing"
              className="sl-btn-secondary"
              style={{ display: "inline-block", background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600, fontSize: "1rem", padding: "15px 36px", borderRadius: 12, textDecoration: "none", border: "1px solid rgba(255,255,255,0.14)" }}
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ── What is SecureLint ── */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 18 }}>What is SecureLint?</h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem", marginBottom: 18 }}>
          <strong>SecureLint</strong> is a browser security Chrome extension built by <a href="https://securelint.in" style={{ color: "var(--ink)", textDecoration: "underline" }}>VAPTLabs</a>. It provides eight security capabilities that run continuously in your browser — detecting threats, masking sensitive data, and alerting you to security risks in real time.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem", marginBottom: 18 }}>
          The core insight behind SecureLint is simple: <strong>the browser is the most-used — and most-attacked — application on any device</strong>, yet it&apos;s the least protected. Firewalls protect the network. Antivirus protects the OS. But the browser — where developers paste API keys, click phishing links, and share screens full of credentials — has historically had no dedicated security layer.
        </p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem" }}>
          SecureLint is that security layer. It runs entirely inside Chrome, requiring no agent installation, no network proxy, no server-side component, and no configuration. Install it and it immediately starts protecting you.
        </p>
      </section>

      {/* ── What Problems It Solves ── */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>What Problems Does SecureLint Solve?</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 52, fontSize: "0.95rem", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>Five critical browser security gaps — all addressed in a single extension.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {[
              { number: "01", problem: "API Key & Credential Leaks", desc: "Developers accidentally paste API keys into ChatGPT, share screens with credentials visible, or expose secrets in browser DevTools. SecureLint detects and masks them the moment they appear.", link: "/api-key-masking", linkText: "API Key Masking →", color: "#22c55e" },
              { number: "02", problem: "Phishing Attacks", desc: "Attackers create convincing lookalike websites and send malicious links via email. Traditional blocklists are always a step behind. SecureLint analyzes domain age, URL structure, SSL anomalies, and known patterns.", link: "/phishing-protection", linkText: "Phishing Protection →", color: "#f97316" },
              { number: "03", problem: "Screen Share Credential Exposure", desc: "During code reviews, demos, and team calls, sensitive data on screen gets recorded and shared without anyone realizing it. SecureLint masks credentials in real time during Zoom, Meet, Teams, and Loom sessions.", link: "/screen-share-privacy", linkText: "Screen Share Privacy →", color: "#8b5cf6" },
              { number: "04", problem: "Browser Data Loss Prevention", desc: "Without a browser-level DLP control, sensitive data can easily be transmitted — pasted into AI prompts, submitted via web forms, or copied to clipboard. SecureLint provides the browser DLP layer that traditional network DLP misses.", link: "/browser-dlp", linkText: "Browser DLP →", color: "#ef4444" },
              { number: "05", problem: "SSL & Connection Security", desc: "Invalid, expired, or self-signed SSL certificates are a major indicator of phishing and man-in-the-middle attacks. SecureLint validates SSL certificates on every site you visit and alerts you to any anomalies.", link: null, linkText: null, color: "#06b6d4" },
            ].map((item) => (
              <div key={item.number} style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 24, alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${item.color}12`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 800, color: item.color, flexShrink: 0, boxShadow: `0 4px 16px ${item.color}18` }}>
                  {item.number}
                </div>
                <div className="sl-problem-item" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px 28px" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ink)", marginBottom: 10, marginTop: 0 }}>{item.problem}</h3>
                  <p style={{ color: "var(--ink-muted)", lineHeight: 1.78, marginBottom: item.link ? 12 : 0, fontSize: "0.95rem", margin: item.link ? "0 0 12px" : 0 }}>{item.desc}</p>
                  {item.link && <a href={item.link} style={{ color: item.color, fontSize: "0.88rem", fontWeight: 600, textDecoration: "none" }}>{item.linkText}</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How SecureLint Works – Timeline ── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>How SecureLint Works</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 56, fontSize: "0.95rem" }}>SecureLint operates entirely within your Chrome browser. Here&apos;s the flow:</p>
          <StepsTimeline steps={howItWorksSteps} accentColor={ACCENT} />
        </div>
      </section>

      {/* ── Key Features – Carousel ── */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>Key Features</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 44, fontSize: "0.95rem" }}>Eight security capabilities. One extension. Zero infrastructure.</p>
          <CardCarousel items={keyFeaturesItems} accentColor={ACCENT} />
        </div>
      </section>

      {/* ── Who Uses SecureLint – Carousel ── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>Who Uses SecureLint?</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 44, fontSize: "0.95rem" }}>From solo developers to enterprise security teams.</p>
          <CardCarousel items={whoUsesItems} accentColor={ACCENT} cardBg={`${ACCENT}06`} />
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12 }}>Pricing</h2>
          <p style={{ color: "var(--ink-muted)", marginBottom: 48, fontSize: "0.95rem" }}>SecureLint has a generous free tier. Upgrade for advanced features.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
            {[
              { plan: "Free", price: "₹0", period: "forever", features: ["Basic API key detection", "Phishing protection", "SSL validation", "Domain age alerts"], highlight: false },
              { plan: "Pro", price: "₹349", period: "per month", features: ["All Free features", "100+ secret patterns", "Custom regex patterns", "Detailed threat reports", "Priority support"], highlight: true },
              { plan: "Quarterly", price: "₹999", period: "per quarter", features: ["All Pro features", "Save 5%", "Extended history", "Early access features"], highlight: false },
            ].map((p) => (
              <div key={p.plan} className="sl-pricing-card" style={{ background: p.highlight ? `${ACCENT}12` : "rgba(255,255,255,0.03)", border: `1px solid ${p.highlight ? `${ACCENT}45` : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "32px 24px", boxShadow: p.highlight ? `0 8px 32px ${ACCENT}18` : "none" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: p.highlight ? ACCENT : "var(--ink-muted)", marginBottom: 10, letterSpacing: "0.06em" }}>{p.plan.toUpperCase()}</div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--ink-muted)", marginBottom: 22 }}>{p.period}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, textAlign: "left" }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ fontSize: "0.85rem", color: "var(--ink-muted)", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>✓&nbsp; {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <a href="/#pricing" style={{ display: "inline-block", marginTop: 32, color: ACCENT, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>View full pricing details →</a>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 48, textAlign: "center" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { q: "What is SecureLint?", a: "SecureLint is a Chrome browser extension that provides real-time browser security: API key masking, phishing detection, SSL validation, XSS detection, browser DLP, secret scanning, and crypto drainer protection — all running 100% locally inside Chrome." },
              { q: "Is SecureLint safe to use?", a: "Yes. SecureLint is built by VAPTLabs, a security research company. All processing happens locally inside your browser. No page content, credentials, URLs, or user data is ever transmitted to external servers." },
              { q: "Does SecureLint work with enterprise Chrome deployments?", a: "Yes. SecureLint supports force-installation via Google Chrome Enterprise Admin, enabling IT teams to deploy it across an entire organization, configure policies centrally, and receive aggregated security reports." },
              { q: "What is the difference between SecureLint Free and Pro?", a: "The free tier includes basic API key detection, phishing protection, and SSL checking. SecureLint Pro adds advanced detection (100+ patterns + custom regex), detailed threat reports, screen share privacy mode, priority support, and advanced DLP controls." },
              { q: "Does SecureLint work with all websites?", a: "Yes. SecureLint scans all web pages you visit in Chrome, including web apps, cloud dashboards, AI tools, developer tools, email clients, and internal tools. It requires no per-site configuration." },
              { q: "Where can I find SecureLint documentation?", a: "Documentation, getting started guides, and feature walkthroughs are available at securelint.in/blog. You can also reach the support team at support@securelint.in." },
            ].map(({ q, a }) => (
              <div key={q} className="sl-faq-card" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "24px 28px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", marginBottom: 10, marginTop: 0 }}>{q}</h3>
                <p style={{ color: "var(--ink-muted)", lineHeight: 1.78, margin: 0, fontSize: "0.95rem" }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explore Capabilities ── */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>Explore SecureLint&apos;s Capabilities</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 40, fontSize: "0.95rem" }}>Each feature has a dedicated page with full technical details, use cases, and FAQ.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { title: "Browser DLP", href: "/browser-dlp", color: "#ef4444" },
              { title: "API Key Masking", href: "/api-key-masking", color: "#22c55e" },
              { title: "Screen Share Privacy", href: "/screen-share-privacy", color: "#8b5cf6" },
              { title: "Phishing Protection", href: "/phishing-protection", color: "#f97316" },
              { title: "Browser Security", href: "/browser-security", color: "#3b82f6" },
              { title: "Secret Detection", href: "/secret-detection", color: "#ec4899" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="sl-link-pill" style={{ display: "block", background: `${link.color}08`, border: `1px solid ${link.color}28`, borderRadius: 12, padding: "18px 22px", textDecoration: "none", color: link.color, fontWeight: 600, fontSize: "0.95rem" }}>
                {link.title} →
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(135deg, #050d1a 0%, #0a0e1a 100%)", borderTop: `1px solid ${ACCENT}20`, padding: "100px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: 18 }}>Get started with SecureLint today</h2>
        <p style={{ color: "rgba(255,255,255,0.58)", marginBottom: 40, fontSize: "1rem", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>Install in 60 seconds. No configuration. Free forever for core features.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj"
            target="_blank"
            rel="noopener noreferrer"
            className="sl-btn-primary"
            style={{ background: ACCENT, color: "#fff", fontWeight: 700, padding: "15px 36px", borderRadius: 12, textDecoration: "none", fontSize: "1rem", boxShadow: `0 12px 30px ${ACCENT}4d` }}
          >
            Add to Chrome — Free
          </a>
          <a href="/blog" className="sl-btn-secondary" style={{ background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600, padding: "15px 36px", borderRadius: 12, textDecoration: "none", fontSize: "1rem", border: "1px solid rgba(255,255,255,0.14)" }}>
            Read the Blog
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
