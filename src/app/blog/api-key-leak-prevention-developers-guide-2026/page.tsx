import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import s from "../[slug]/article.module.css";

export const metadata: Metadata = {
  title: "The Developer's Complete Guide to Preventing API Key Leaks in the Browser (2026) — SecureLint Blog",
  description: "API keys accidentally pasted into Slack, live demos, or public repos cause massive breaches. This guide covers every vector — and how SecureLint's real-time masking closes them all automatically.",
  keywords: "api key leak prevention developers, prevent api key exposure browser, developer security secrets management, securelint developer guide, aws key leak prevention 2026, github secret scanning",
  authors: [{ name: "SecureLint Research Team", url: "https://securelint.in" }],
  alternates: { canonical: "https://securelint.in/blog/api-key-leak-prevention-developers-guide-2026" },
  openGraph: {
    type: "article", url: "https://securelint.in/blog/api-key-leak-prevention-developers-guide-2026",
    title: "The Developer's Complete Guide to Preventing API Key Leaks in the Browser (2026)",
    description: "Every leak vector — Slack pastes, live demos, web editors, screen shares — covered with real prevention steps and how SecureLint closes each gap automatically.",
    publishedTime: "2026-05-26", siteName: "SecureLint",
    images: [{ url: "https://securelint.in/og-banner.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://securelint.in/og-banner.png"],
    title: "Developer Guide: Prevent API Key Leaks in the Browser (2026)",
    description: "Every browser-based leak vector — Slack, screen share, web editors, live demos — and how to close them all." },
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "The Developer's Complete Guide to Preventing API Key Leaks in the Browser (2026)",
  description: "A comprehensive guide covering every browser-based API key leak vector and how SecureLint's real-time masking closes them automatically.",
  datePublished: "2026-05-26", dateModified: "2026-05-26",
  image: "https://securelint.in/og-banner.png",
  author: { "@type": "Organization", name: "SecureLint Research Team", url: "https://securelint.in" },
  publisher: { "@type": "Organization", name: "SecureLint by VAPTLabs", logo: { "@type": "ImageObject", url: "https://securelint.in/icons/icon-128.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://securelint.in/blog/api-key-leak-prevention-developers-guide-2026" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": "https://securelint.in" } },
    { "@type": "ListItem", position: 2, name: "Blog", item: { "@type": "WebPage", "@id": "https://securelint.in/blog" } },
    { "@type": "ListItem", position: 3, name: "API Key Leak Prevention Guide", item: { "@type": "WebPage", "@id": "https://securelint.in/blog/api-key-leak-prevention-developers-guide-2026" } },
  ],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the most common cause of API key leaks in 2026?",
      acceptedAnswer: { "@type": "Answer", text: "According to breach reports, the most common causes remain: accidental commits to public Git repositories (often through web-based editors), credential pastes in team communication tools like Slack, and exposure during screen sharing in demos or support calls. SecureLint addresses all three: it masks credentials in web editors and Slack, and activates Meeting Mode during screen share." } },
    { "@type": "Question", name: "Should I rotate an API key the moment SecureLint detects and masks it?",
      acceptedAnswer: { "@type": "Answer", text: "Masking prevents future exposure but does not undo any exposure that already occurred. If SecureLint detects a credential that has already been visible (for example, in a Notion page that has been shared, or a Slack message already sent), you should treat it as potentially compromised and rotate it immediately. SecureLint's detection event log shows exactly where and when each credential was detected to help you assess the exposure window." } },
    { "@type": "Question", name: "How does SecureLint handle credentials in VS Code Web and GitHub's web editor?",
      acceptedAnswer: { "@type": "Answer", text: "SecureLint injects a content script into VS Code Web (vscode.dev), GitHub.dev, and CodeSandbox, and watches the editor's text content via MutationObserver. When a credential pattern appears, SecureLint overlays a blur mask on the matched text. The underlying file content in the editor is unchanged — only the visual display is masked. This prevents screen-share exposure without interfering with editing or saving." } },
  ],
};

const TOC = [
  { id: "the-cost-of-a-leak",       label: "What an API key leak actually costs" },
  { id: "leak-vectors",             label: "The 8 browser-based leak vectors" },
  { id: "vector-1-screen-share",    label: "Vector 1: Screen sharing" },
  { id: "vector-2-web-editors",     label: "Vector 2: Web-based code editors" },
  { id: "vector-3-slack",           label: "Vector 3: Team communication tools" },
  { id: "vector-4-notion",          label: "Vector 4: Docs and wikis" },
  { id: "vector-5-browser-history", label: "Vector 5: Browser history and autofill" },
  { id: "vector-6-extensions",      label: "Vector 6: Malicious extensions" },
  { id: "securelint-prevention",    label: "How SecureLint closes all 6 vectors" },
  { id: "faq",                      label: "Frequently asked questions" },
];

export default function ApiKeyLeakPreventionPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SiteHeader />
      <div className={s.page}><div className={s.outer}>
        <nav className={s.toc} aria-label="Table of contents">
          <div className={s.tocInner}>
            <p className={s.tocTitle}>Table of Contents</p>
            <ul className={s.tocList}>{TOC.map(i => <li key={i.id} className={s.tocItem}><a href={`#${i.id}`} className={s.tocLink}>{i.label}</a></li>)}</ul>
          </div>
        </nav>
        <article className={s.article}>
          <header className={s.header}>
            <address className={s.authorRow} aria-label="Author">
              <div className={s.avatar}><img src="https://securelint.in/icons/icon-128.png" alt="SecureLint" className={s.avatarImg} /></div>
              <div className={s.authorInfo}>
                <p className={s.authorName}>SecureLint Research Team</p>
                <p className={s.authorRole}>VAPTLabs Security Research</p>
                <div className={s.authorMeta}><time dateTime="2026-05-26">May 26, 2026</time><span>·</span><span>9 min read</span></div>
              </div>
            </address>
            <h1 className={s.h1}>The Developer&apos;s Complete Guide to Preventing API Key Leaks in the Browser (2026)</h1>
          </header>

          <div className={s.coverBanner} style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#4338ca 60%,#312e81 100%)" }} aria-hidden="true">
            <span className={s.coverBannerDeco1} style={{ background: "#a5b4fc" }} />
            <span className={s.coverBannerDeco2} style={{ background: "#a5b4fc" }} />
            <span className={s.coverBannerText}>API Key Leak Prevention<br /><span style={{ color: "#a5b4fc" }}>Complete Developer Guide 2026</span></span>
          </div>

          <div className={s.prose}>
            <p>A developer shares their screen during a standup. A production AWS key is visible for three seconds in a tab that auto-opened during the demo. Within six hours, a bot has scanned GitHub, found nothing — but the attacker who was on the call has already spun up 47 EC2 instances for a cryptocurrency mining operation. The bill: $34,000 before anyone notices.</p>
            <p>This is not hypothetical. It is a pattern that recurs hundreds of times a year, and the overwhelming majority of victims are developers doing their jobs — not making careless mistakes. The browser is a credential-hostile environment that was not designed with secrets management in mind. This guide covers every leak vector and how to close them.</p>

            <h2 id="the-cost-of-a-leak">What an API key leak actually costs</h2>
            <p>The direct financial impact of a leaked cloud key is immediate and severe:</p>
            <ul>
              <li><strong>AWS</strong> — Attackers spin up GPU instances for cryptocurrency mining or ML training. A leaked key can accumulate $10,000–$100,000 in charges within 24 hours. AWS will sometimes waive charges for first-time incidents but this is not guaranteed.</li>
              <li><strong>GCP / Azure</strong> — Similar compute abuse patterns. GCP charges are particularly fast-accumulating due to TPU and GPU availability.</li>
              <li><strong>Stripe</strong> — A leaked live secret key allows an attacker to issue full refunds to any card, create payouts to attacker-controlled accounts, and read your entire customer and transaction database.</li>
              <li><strong>OpenAI / Anthropic</strong> — API key abuse runs up inference costs in minutes. A leaked key with a high rate limit can cost thousands in API calls before you notice.</li>
              <li><strong>GitHub</strong> — A leaked PAT with <code>repo</code> scope gives full read/write access to every private repository. One hour of access is enough to exfiltrate your entire codebase.</li>
            </ul>

            <h2 id="leak-vectors">The 8 browser-based leak vectors</h2>
            <p>Most developer security content focuses on Git-based leaks (committing keys to repositories). But the browser has become the primary work environment for modern developers, creating a new set of exposure vectors that pre-date most security tooling:</p>

            <h2 id="vector-1-screen-share">Vector 1: Screen sharing during meetings</h2>
            <p>The most common and most underestimated vector. A developer shares their entire screen during a demo, standup, or pair programming session. Any open tab containing a dashboard with API keys, a terminal with environment variables, or a cloud console is visible to everyone on the call — and potentially recorded.</p>
            <p><strong>SecureLint&apos;s fix:</strong> Meeting Mode activates automatically when Zoom, Google Meet, or Teams is detected. All credentials across every open tab are blurred before the screen share stream begins. The blur lifts automatically when the call ends.</p>

            <h2 id="vector-2-web-editors">Vector 2: Web-based code editors and cloud shells</h2>
            <p>VS Code Web, GitHub.dev, CodeSandbox, Google Cloud Shell, and Replit are standard developer tools — and all run in a browser tab where credentials can appear in editor buffers, terminal output, and environment variable panels.</p>
            <p><strong>SecureLint&apos;s fix:</strong> SecureLint&apos;s content script monitors all web-based editors and masks credential patterns in editor buffers, terminal output panels, and environment variable displays in real time.</p>

            <h2 id="vector-3-slack">Vector 3: Team communication tools</h2>
            <p>Developers frequently paste credentials directly into Slack, Microsoft Teams, or Discord to quickly share them with a colleague — intending to delete the message afterwards but often forgetting. Slack message history is retained by default and may be accessible to workspace admins, exported for compliance, or exposed in a Slack data breach.</p>
            <p><strong>SecureLint&apos;s fix:</strong> SecureLint masks credentials in the Slack message composer, Teams message input, and Discord message box before they are sent. A warning notification appears asking you to confirm you intend to send credential content.</p>

            <h2 id="vector-4-notion">Vector 4: Documentation and wiki tools</h2>
            <p>Notion pages, Confluence wikis, and GitHub README files are some of the most common places developers accidentally store API keys for &ldquo;temporary&rdquo; reference — where they remain indefinitely, shared across entire organisations.</p>
            <p><strong>SecureLint&apos;s fix:</strong> SecureLint masks credentials as they are typed into Notion, Confluence, and any <code>contenteditable</code> element on the web. The credential is masked in your view and a detection event is logged so you can review what was nearly exposed.</p>

            <h2 id="vector-5-browser-history">Vector 5: Browser history and URL parameters</h2>
            <p>Some APIs accept credentials as URL query parameters. Any request made with <code>?api_key=sk_live_xxx</code> in the URL is stored in the browser&apos;s history, potentially synced across devices, and visible to any extension that reads browser history. This is an anti-pattern, but it is common in older APIs and is frequently used during quick testing.</p>
            <p><strong>SecureLint&apos;s fix:</strong> SecureLint detects credential patterns in the current page URL and address bar and masks them in the browser&apos;s URL display. Detection events are also generated so you can identify and replace URL-embedded credentials with more secure patterns.</p>

            <h2 id="vector-6-extensions">Vector 6: Malicious browser extensions</h2>
            <p>A browser extension with <code>&lt;all_urls&gt;</code> and <code>clipboardRead</code> permissions can silently read every API key that appears on any page you visit, and every credential you copy to your clipboard. This is a passive, always-on attack that requires no user interaction beyond having the extension installed.</p>
            <p><strong>SecureLint&apos;s fix:</strong> SecureLint audits all installed extensions against its threat intelligence database, scores them for permission risk, and alerts on extensions with high-risk permission combinations. Known-malicious extensions are blocked from running.</p>

            <h2 id="securelint-prevention">How SecureLint closes all 6 vectors</h2>
            <div className={s.checklist}>
              <ul>
                <li><span className={s.checkIcon}>✅</span><span><strong>Screen share (Meeting Mode)</strong> — Auto-activates on Zoom / Meet / Teams, blurs all credentials across every open tab</span></li>
                <li><span className={s.checkIcon}>✅</span><span><strong>Web editors</strong> — Real-time masking in VS Code Web, GitHub.dev, CodeSandbox, Cloud Shell</span></li>
                <li><span className={s.checkIcon}>✅</span><span><strong>Slack / Teams / Discord</strong> — Masks credentials in message composers, warns before sending</span></li>
                <li><span className={s.checkIcon}>✅</span><span><strong>Notion / Confluence / wikis</strong> — Masks credentials in all contenteditable inputs</span></li>
                <li><span className={s.checkIcon}>✅</span><span><strong>URL parameters</strong> — Detects and masks credentials in the address bar and URL query strings</span></li>
                <li><span className={s.checkIcon}>✅</span><span><strong>Malicious extensions</strong> — Extension audit, permission risk scoring, auto-block of known-malicious extensions</span></li>
              </ul>
            </div>
          </div>

          <section className={s.faqSection} aria-labelledby="faq">
            <h2 id="faq" className={s.faqTitle}>Frequently asked questions</h2>
            <div className={s.faqItem}>
              <p className={s.faqQ}>What is the most common cause of API key leaks in 2026?</p>
              <p className={s.faqA}>The most common causes remain: accidental commits through web-based editors, credential pastes in Slack, and exposure during screen sharing in demos. SecureLint addresses all three: masks credentials in web editors and Slack, and activates Meeting Mode during screen shares.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Should I rotate an API key the moment SecureLint detects and masks it?</p>
              <p className={s.faqA}>Masking prevents future exposure but does not undo past exposure. If the credential was visible before SecureLint masked it — in a shared Notion page, a sent Slack message — treat it as potentially compromised and rotate immediately. SecureLint&apos;s event log shows exactly where and when each credential was detected.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>How does SecureLint handle credentials in VS Code Web and GitHub&apos;s web editor?</p>
              <p className={s.faqA}>SecureLint injects a content script into VS Code Web, GitHub.dev, and CodeSandbox and watches the editor&apos;s text content via MutationObserver. When a credential appears, it overlays a blur mask on the matched text. The underlying file content is unchanged — only the visual display is masked, preventing screen-share exposure without interfering with editing.</p>
            </div>
          </section>
        </article>
      </div></div>
      <SiteFooter />
    </>
  );
}
