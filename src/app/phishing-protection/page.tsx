import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { PageHoverStyles } from "@/components/ui/PageHoverStyles";

export const metadata: Metadata = {
  title: "Phishing Protection – SecureLint | Real-Time Anti-Phishing Chrome Extension",
  description: "SecureLint detects phishing websites, suspicious new domains, lookalike URLs, and malicious links in real time — before you click. The best anti-phishing Chrome extension for developers and enterprises.",
  keywords: ["phishing protection Chrome","anti-phishing Chrome extension","real-time phishing detection","phishing website detector","browser phishing protection","phishing link detection","lookalike domain detection","suspicious domain alert","phishing email Chrome","phishing detection extension","SecureLint phishing","new domain age check","crypto phishing protection","malicious URL detection Chrome"],
  alternates: { canonical: "https://securelint.in/phishing-protection" },
  openGraph: { title: "Phishing Protection – SecureLint | Real-Time Anti-Phishing for Chrome", description: "Detect phishing sites, lookalike domains, and malicious links before you click. SecureLint's real-time phishing protection runs 100% locally in your browser.", url: "https://securelint.in/phishing-protection", type: "website", images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Phishing Protection" }] },
  twitter: { card: "summary_large_image", title: "Phishing Protection – SecureLint | Real-Time Anti-Phishing Chrome Extension", description: "Stop phishing attacks before you click. SecureLint detects lookalike domains, suspicious new sites, and malicious links in real time.", images: [{ url: "/og-banner.png" }] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": "https://securelint.in/phishing-protection", "url": "https://securelint.in/phishing-protection", "name": "Phishing Protection – SecureLint", "description": "Real-time phishing website detection, domain age checks, and lookalike URL analysis — directly in your browser.", "isPartOf": { "@id": "https://securelint.in" }, "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securelint.in" }, { "@type": "ListItem", "position": 2, "name": "Phishing Protection", "item": "https://securelint.in/phishing-protection" }] } },
    { "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "What is the best anti-phishing Chrome extension?", "acceptedAnswer": { "@type": "Answer", "text": "SecureLint is a leading anti-phishing Chrome extension that detects phishing websites, lookalike domains, suspicious new domains, and malicious URLs in real time." } }, { "@type": "Question", "name": "How does SecureLint detect phishing websites?", "acceptedAnswer": { "@type": "Answer", "text": "SecureLint uses multiple detection layers: domain age analysis, lookalike domain detection, SSL certificate validation, known phishing domain blocklists, and heuristic URL pattern analysis." } }, { "@type": "Question", "name": "Can SecureLint detect phishing links in emails?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. When you open Gmail, Outlook, or any webmail client in Chrome, SecureLint scans all links on the page and flags any that match phishing patterns." } }] },
  ],
};

const ACCENT = "#28ccb5";

const detectionItems = [
  { icon: "📅", title: "Domain Age Analysis", desc: "Newly registered domains (less than 30 days old) are flagged with a prominent warning. Most phishing sites are created hours before attacks launch.", titleColor: "#f97316" },
  { icon: "🔤", title: "Lookalike Domain Detection", desc: "SecureLint uses Levenshtein distance and homoglyph analysis to detect URLs that closely resemble popular legitimate domains — e.g. paypa1.com, g00gle.com.", titleColor: "#f97316" },
  { icon: "🔒", title: "SSL Certificate Check", desc: "SecureLint verifies SSL certificates for anomalies — self-signed certificates, expired certs, and mismatched domain names are flagged immediately.", titleColor: "#f97316" },
  { icon: "🚫", title: "Known Phishing Blocklist", desc: "Domains from known phishing databases are blocked automatically. The blocklist is updated continuously with new threat intelligence.", titleColor: "#f97316" },
  { icon: "🔗", title: "Malicious Link Scanning", desc: "All links on a page — in emails, chat apps, and web pages — are scanned for phishing patterns before you hover or click.", titleColor: "#f97316" },
  { icon: "🪙", title: "Crypto Drainer Detection", desc: "SecureLint detects known crypto wallet drainer patterns and fake NFT mint pages that attempt to steal cryptocurrency through malicious approvals.", titleColor: "#f97316" },
];

const audienceItems = [
  { icon: "👨‍💻", title: "Developers", desc: "Developers are prime targets for supply-chain phishing — fake npm registry pages, spoofed GitHub login pages, and credential-harvesting developer tools." },
  { icon: "💰", title: "Finance & Accounting Teams", desc: "Attackers specifically target finance staff with convincing bank portal spoofs and invoice fraud campaigns designed to capture login credentials." },
  { icon: "🏢", title: "Enterprise IT & Security", desc: "Security teams use SecureLint to provide an additional detection layer on managed devices — catching phishing attempts that bypass email filters." },
  { icon: "🪙", title: "Crypto Users & Traders", desc: "Crypto wallet phishing is at an all-time high. SecureLint's drainer detection specifically targets the fake minting and swap pages attackers use to steal funds." },
];

export default function PhishingProtectionPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PageHoverStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#0a0e1a 0%,#1a0a0a 40%,#0a0e1a 100%)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "100px 24px 90px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.30)", borderRadius: 20, padding: "5px 18px", fontSize: 13, color: "#fb923c", fontWeight: 600, marginBottom: 28, letterSpacing: "0.05em" }}>PHISHING PROTECTION</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.12, margin: "0 0 22px" }}>Real-Time Phishing Protection in Your Browser</h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.75, margin: "0 0 40px", maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>SecureLint detects phishing websites, lookalike domains, newly registered suspicious URLs, and malicious links — in real time, before you click, 100% locally in your browser.</p>
          <a href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj" target="_blank" rel="noopener noreferrer" className="sl-btn-primary" style={{ display: "inline-block", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "15px 36px", borderRadius: 12, textDecoration: "none", boxShadow: "0 12px 30px rgba(40,204,181,0.30)" }}>
            Add to Chrome — Free
          </a>
        </div>
      </section>

      {/* What is phishing */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 18 }}>What is phishing and why is it still so effective?</h2>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem", marginBottom: 18 }}>Phishing is the #1 cause of data breaches globally. Attackers create convincing fake websites — often identical copies of real services — and trick users into entering credentials, clicking malicious links, or downloading malware.</p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem", marginBottom: 18 }}>Modern phishing attacks are sophisticated: they use recently registered domains (so blocklists haven&apos;t caught up), typosquatted URLs (e.g. <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>arnazon.com</code> instead of <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>amazon.com</code>), and valid SSL certificates (so the padlock icon provides false confidence).</p>
        <p style={{ color: "var(--ink-muted)", lineHeight: 1.85, fontSize: "1.05rem" }}>Traditional anti-phishing solutions rely on blocklists that are always a step behind. SecureLint uses real-time heuristic analysis to detect <em>new</em> phishing attempts before they appear on any list.</p>
      </section>

      {/* Detection methods – Carousel */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>Multi-Layer Phishing Detection</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 44, fontSize: "0.95rem" }}>Six independent detection layers — so new threats are caught even before blocklists know about them.</p>
          <CardCarousel items={detectionItems} accentColor={ACCENT} cardBg="rgba(249,115,22,0.04)" />
        </div>
      </section>

      {/* Who it protects – Carousel */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 12, textAlign: "center" }}>Who Needs Browser Phishing Protection?</h2>
          <p style={{ color: "var(--ink-muted)", textAlign: "center", marginBottom: 44, fontSize: "0.95rem" }}>Phishing targets everyone — but some roles are hit hardest.</p>
          <CardCarousel items={audienceItems} accentColor={ACCENT} cardBg="rgba(251,146,60,0.04)" />
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,1.9rem)", fontWeight: 800, color: "var(--ink)", marginBottom: 48, textAlign: "center" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { q: "What is the best anti-phishing Chrome extension?", a: "SecureLint is one of the most comprehensive browser phishing protection tools available. It combines domain age analysis, lookalike URL detection, SSL verification, blocklist matching, and crypto drainer detection — all running locally in the browser without sending any data to external servers." },
              { q: "Does SecureLint detect phishing links in Gmail or Outlook?", a: "Yes. SecureLint scans all links visible on any web page, including Gmail, Outlook Web, and other webmail clients. Phishing links in emails are flagged with a warning indicator before you click them." },
              { q: "How is SecureLint different from Chrome's built-in Safe Browsing?", a: "Chrome Safe Browsing checks URLs against a blocklist that is updated periodically. SecureLint adds real-time heuristic analysis — detecting new phishing sites, lookalike domains, and suspicious new registrations that haven't appeared on any blocklist yet." },
              { q: "Can SecureLint detect crypto phishing attacks?", a: "Yes. SecureLint includes specific detection for crypto wallet drainer patterns — fake token mint pages, malicious approval prompts, and spoofed DeFi platform interfaces that are designed to steal cryptocurrency." },
              { q: "Is SecureLint phishing protection available for free?", a: "Basic phishing detection, domain age alerts, and suspicious link scanning are available in the free tier. Advanced features like custom blocklists, detailed threat reports, and enterprise policy management are available in SecureLint Pro." },
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
      <section style={{ background: "linear-gradient(135deg,#1a0a0a 0%,#0a0e1a 100%)", borderTop: `1px solid ${ACCENT}20`, padding: "100px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2rem)", fontWeight: 800, color: "#fff", marginBottom: 18 }}>Stop phishing attacks before they start</h2>
        <p style={{ color: "rgba(255,255,255,0.58)", marginBottom: 40, fontSize: "1rem", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>Real-time detection. No blocklist delays. 100% local processing.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://chromewebstore.google.com/detail/securelint/bblhbkigoamdlmidfenheijiehhkpfmj" target="_blank" rel="noopener noreferrer" className="sl-btn-primary" style={{ background: ACCENT, color: "#fff", fontWeight: 700, padding: "15px 36px", borderRadius: 12, textDecoration: "none", fontSize: "1rem", boxShadow: "0 12px 30px rgba(40,204,181,0.30)" }}>
            Add to Chrome — Free
          </a>
          <a href="/browser-security" className="sl-btn-secondary" style={{ background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600, padding: "15px 36px", borderRadius: 12, textDecoration: "none", fontSize: "1rem", border: "1px solid rgba(255,255,255,0.14)" }}>
            See All Security Features
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
