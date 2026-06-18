import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import s from "../[slug]/article.module.css";

export const metadata: Metadata = {
  title: "How SecureLint Stops Phishing Links in Emails with Real-Time Popup Warnings — SecureLint Blog",
  description: "When you click a link inside Gmail or Outlook, SecureLint silently scores it against domain reputation, SSL status, and brand impersonation signals — then intercepts your click with a clear Unsafe Link Detected popup.",
  keywords: "phishing link popup warning, email link protection chrome, stop phishing link click, securelint link guard, unsafe link detected browser, gmail link scanner extension",
  authors: [{ name: "SecureLint Research Team", url: "https://securelint.in" }],
  alternates: { canonical: "https://securelint.in/blog/phishing-link-popup-warning-email-protection" },
  openGraph: {
    type: "article", url: "https://securelint.in/blog/phishing-link-popup-warning-email-protection",
    title: "How SecureLint Stops Phishing Links in Emails with Real-Time Popup Warnings",
    description: "Click a link in Gmail or Outlook — SecureLint scores it and intercepts with an Unsafe Link Detected popup if it's suspicious.",
    publishedTime: "2026-05-31", siteName: "SecureLint",
    images: [{ url: "https://securelint.in/og-banner.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://securelint.in/og-banner.png"],
    title: "Phishing Link Popup Warning in Gmail & Outlook — SecureLint",
    description: "Click any email link and SecureLint intercepts it with an Unsafe Link Detected popup if the destination is suspicious." },
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "How SecureLint Stops Phishing Links in Emails with Real-Time Popup Warnings",
  description: "SecureLint scores every email link click against domain reputation, SSL, and brand impersonation signals, intercepting dangerous navigations with a popup warning.",
  datePublished: "2026-05-31", dateModified: "2026-05-31",
  image: "https://securelint.in/og-banner.png",
  author: { "@type": "Organization", name: "SecureLint Research Team", url: "https://securelint.in" },
  publisher: { "@type": "Organization", name: "SecureLint by VAPTLabs", logo: { "@type": "ImageObject", url: "https://securelint.in/icons/icon-128.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://securelint.in/blog/phishing-link-popup-warning-email-protection" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": "https://securelint.in" } },
    { "@type": "ListItem", position: 2, name: "Blog", item: { "@type": "WebPage", "@id": "https://securelint.in/blog" } },
    { "@type": "ListItem", position: 3, name: "Phishing Link Warning", item: { "@type": "WebPage", "@id": "https://securelint.in/blog/phishing-link-popup-warning-email-protection" } },
  ],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Does SecureLint block all link clicks in emails?",
      acceptedAnswer: { "@type": "Answer", text: "No. SecureLint only intercepts link clicks that score above the risk threshold. Safe links (trusted domains, passing all signal checks) are followed immediately without interruption. Only links that trigger risk signals — young domain, brand impersonation, known phishing URL, failed SSL — show the popup warning." } },
    { "@type": "Question", name: "Does SecureLint work with email clients other than Gmail and Outlook?",
      acceptedAnswer: { "@type": "Answer", text: "SecureLint's link interception works on any web page, not just email clients. It intercepts clicks on links in any webpage that score above the risk threshold. The primary use case is email (Gmail and Outlook Web) but it also protects links clicked in Slack, Notion, LinkedIn, and any other browser-based application." } },
    { "@type": "Question", name: "What does the 'Unsafe Link Detected' popup show?",
      acceptedAnswer: { "@type": "Answer", text: "The popup displays the destination URL, overall risk score (0–100), and a breakdown of each triggered signal with plain-language explanations (e.g. 'Domain registered 3 days ago', 'Brand impersonation pattern detected: PayPal', 'SSL certificate issued 6 hours ago'). You can choose to go back safely or proceed with risk acknowledgement." } },
  ],
};

const TOC = [
  { id: "the-moment-of-click",      label: "The moment of click: where most phishing succeeds" },
  { id: "how-link-guard-works",     label: "How SecureLint Link Guard works" },
  { id: "signals-evaluated",        label: "Signals evaluated on every link click" },
  { id: "the-popup",                label: "The Unsafe Link Detected popup" },
  { id: "hover-preview",            label: "Hover-preview risk scoring" },
  { id: "works-in",                 label: "Where Link Guard works" },
  { id: "setup",                    label: "Setting up Link Guard" },
  { id: "faq",                      label: "Frequently asked questions" },
];

export default function PhishingLinkPopupPage() {
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
                <div className={s.authorMeta}><time dateTime="2026-05-31">May 31, 2026</time><span>·</span><span>6 min read</span></div>
              </div>
            </address>
            <h1 className={s.h1}>How SecureLint Stops Phishing Links in Emails with Real-Time Popup Warnings</h1>
          </header>

          <div className={s.coverBanner} style={{ background: "linear-gradient(135deg,#881337 0%,#be123c 60%,#4c0519 100%)" }} aria-hidden="true">
            <span className={s.coverBannerDeco1} style={{ background: "#fda4af" }} />
            <span className={s.coverBannerDeco2} style={{ background: "#fda4af" }} />
            <span className={s.coverBannerText}>Phishing Link Warning<br /><span style={{ color: "#fda4af" }}>Intercepted Before You Land</span></span>
          </div>

          <div className={s.prose}>
            <p>The most dangerous moment in a phishing attack is a single click. A carefully crafted email creates urgency, the link text looks legitimate, and muscle memory takes over. By the time the phishing page loads — even for a fraction of a second — tracking pixels have fired, your browser fingerprint has been collected, and the attacker knows the lure worked.</p>
            <p><strong>SecureLint Link Guard</strong> operates at the moment of click — evaluating the destination URL across multiple risk signals and intercepting dangerous navigations with a clear <em>Unsafe Link Detected</em> popup before the phishing page can load. For safe links, the navigation proceeds instantly with zero interruption.</p>

            <h2 id="the-moment-of-click">The moment of click: where most phishing succeeds</h2>
            <p>Email gateways scan links at delivery time — but phishing infrastructure is designed to be clean at delivery and malicious at click time. Common techniques attackers use to defeat time-of-delivery scanning:</p>
            <ul>
              <li><strong>Time-delayed activation</strong> — The phishing page serves a benign page for the first few hours, then switches to the credential-harvesting page after the email gateway has cached it as safe</li>
              <li><strong>Link redirectors through trusted services</strong> — Links go through Google Redirect, Bing redirect, or legitimate URL shorteners, which gateway scanners whitelist by default</li>
              <li><strong>Geo-fencing and user-agent gating</strong> — The phishing page only serves the malicious content to specific IP ranges or user agents, serving benign content to scanner IP addresses</li>
              <li><strong>QR code links</strong> — Links embedded in QR codes inside email images bypass text-based link scanners entirely</li>
            </ul>
            <p>None of these techniques defeat SecureLint Link Guard, because it evaluates the link at click time, in the same browser and from the same IP as the user — not from a remote scanning infrastructure at delivery time.</p>

            <h2 id="how-link-guard-works">How SecureLint Link Guard works</h2>
            <p>When you click a link on any web page, SecureLint intercepts the click event before the browser follows the navigation. The interception takes under 150 milliseconds — imperceptible for safe links (which are immediately followed), noticeable only when the popup fires for a risky link.</p>
            <p>The interception process:</p>
            <ol>
              <li><strong>Click capture</strong> — SecureLint&apos;s content script listens to <code>click</code> events on all <code>&lt;a&gt;</code> elements and programmatically-initiated navigations using <code>window.location</code></li>
              <li><strong>URL extraction</strong> — The full destination URL including any redirect chain visible in the href is extracted</li>
              <li><strong>Risk scoring</strong> — The URL is scored against SecureLint&apos;s signal set (see below). This is a local computation requiring no network round-trip</li>
              <li><strong>Decision</strong> — If the score is below the threshold, navigation proceeds. If above, the popup appears and navigation is suspended until the user makes a choice</li>
            </ol>

            <h2 id="signals-evaluated">Signals evaluated on every link click</h2>
            <ul>
              <li><strong>Domain age</strong> — Domains registered within 14 days of the click date are flagged high-risk</li>
              <li><strong>SSL certificate age and issuer</strong> — Certificates issued within 72 hours on Let&apos;s Encrypt or ZeroSSL against a new domain are a phishing indicator</li>
              <li><strong>Brand impersonation</strong> — The domain is matched against patterns for 500+ major brands using lookalike detection, hyphen insertion, and Unicode homograph normalisation</li>
              <li><strong>Known phishing URL database</strong> — The URL is checked against SecureLint&apos;s live feed of confirmed phishing URLs</li>
              <li><strong>Redirect chain analysis</strong> — Multi-hop redirectors are followed and each intermediate domain is scored independently</li>
              <li><strong>URL encoding and obfuscation</strong> — Double-encoded URLs, Unicode path encoding, and base64 URL obfuscation patterns are decoded and scored</li>
              <li><strong>TLD risk score</strong> — High-abuse TLDs (.xyz, .top, .click, .gq) receive a base risk penalty when combined with other signals</li>
            </ul>

            <h2 id="the-popup">The Unsafe Link Detected popup</h2>
            <p>When a link scores above the risk threshold, SecureLint injects a modal popup over the current page — the phishing page never loads behind it. The popup contains:</p>
            <ul>
              <li>The full destination URL clearly displayed</li>
              <li>An overall risk score from 0–100 with a colour-coded severity indicator (green / amber / red)</li>
              <li>A plain-language breakdown of each triggered signal, e.g.: <em>&ldquo;Domain registered 3 days ago&rdquo;</em>, <em>&ldquo;Brand impersonation: PayPal detected&rdquo;</em>, <em>&ldquo;SSL certificate issued 6 hours ago&rdquo;</em></li>
              <li><strong>Go Back (Safe)</strong> button — cancels the navigation and returns you to the email</li>
              <li><strong>Proceed Anyway</strong> button — follows the link with an explicit risk acknowledgement logged</li>
            </ul>

            <h2 id="hover-preview">Hover-preview risk scoring</h2>
            <p>Before you even click, SecureLint scores links when you hover over them in email clients. A small tooltip appears above the hovered link showing a risk level indicator (Safe / Caution / Dangerous) so you can make an informed decision before clicking. High-risk links show a red indicator directly in the email body.</p>

            <h2 id="works-in">Where Link Guard works</h2>
            <p>SecureLint Link Guard is active across all web-based applications:</p>
            <ul>
              <li><strong>Gmail</strong> (mail.google.com) — link clicks and hover previews in email body</li>
              <li><strong>Outlook Web</strong> (outlook.live.com, outlook.office.com) — including links in junk mail and forwarded messages</li>
              <li><strong>Slack Web</strong> — links in channel messages and direct messages</li>
              <li><strong>Notion, Confluence, Linear</strong> — links in documents and comments</li>
              <li><strong>Any web page</strong> — Link Guard&apos;s click interception is not limited to email clients. It protects every link click in any web-based application</li>
            </ul>

            <h2 id="setup">Setting up Link Guard in SecureLint</h2>
            <div className={s.checklist}>
              <ul>
                <li><span className={s.checkIcon}>✅</span><span>Install SecureLint from the Chrome Web Store. Link Guard is active by default on all pages.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Open Gmail or Outlook Web and hover over any link — a risk indicator tooltip appears showing the link&apos;s safety level.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Click a link. If it scores below the risk threshold, navigation proceeds instantly. If above, the Unsafe Link Detected popup appears.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Adjust sensitivity in the SecureLint settings: Strict (more popups), Balanced (default), or Permissive (fewer popups).</span></li>
              </ul>
            </div>
          </div>

          <section className={s.faqSection} aria-labelledby="faq">
            <h2 id="faq" className={s.faqTitle}>Frequently asked questions</h2>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Does SecureLint block all link clicks in emails?</p>
              <p className={s.faqA}>No. Only links that score above the risk threshold trigger the popup. Safe links are followed immediately with zero interruption. The popup only fires when risk signals are present — young domain, brand impersonation, known phishing URL, or failed SSL.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Does SecureLint work with email clients other than Gmail and Outlook?</p>
              <p className={s.faqA}>Link Guard works on any web page, not just email clients. It protects links in Slack, Notion, LinkedIn, and any other browser-based application. The primary use case is email, but the protection is universal across all browser tabs.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>What does the Unsafe Link Detected popup show?</p>
              <p className={s.faqA}>The popup displays the destination URL, overall risk score (0–100), and a breakdown of each triggered signal in plain language. You can go back safely or proceed with risk acknowledgement. Your choice is logged for enterprise audit purposes.</p>
            </div>
          </section>
        </article>
      </div></div>
      <SiteFooter />
    </>
  );
}
