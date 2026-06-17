import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import s from "../[slug]/article.module.css";

export const metadata: Metadata = {
  title: "How SecureLint Automatically Blocks Phishing Websites Before You Land on Them — SecureLint Blog",
  description: "SecureLint evaluates domain age, SSL status, brand impersonation score, and URL patterns in real time. When you click a suspicious link, a popup warning appears before the page loads.",
  keywords: "block phishing websites chrome extension, phishing website detection, anti-phishing browser extension, securelint phishing blocker, domain age check browser, brand impersonation detection",
  authors: [{ name: "SecureLint Research Team", url: "https://securelint.in" }],
  alternates: { canonical: "https://securelint.in/blog/phishing-website-auto-block-before-you-click" },
  openGraph: {
    type: "article", url: "https://securelint.in/blog/phishing-website-auto-block-before-you-click",
    title: "How SecureLint Automatically Blocks Phishing Websites Before You Land on Them",
    description: "Domain age, SSL, brand impersonation, and URL pattern checks — all evaluated before the page loads.",
    publishedTime: "2026-06-08", siteName: "SecureLint",
    images: [{ url: "https://securelint.in/og-banner.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://securelint.in/og-banner.png"],
    title: "Block Phishing Websites Before You Land — SecureLint",
    description: "Domain age + SSL + brand impersonation checked in real time before every page load." },
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "How SecureLint Automatically Blocks Phishing Websites Before You Land on Them",
  description: "SecureLint evaluates domain age, SSL, brand impersonation, and URL patterns in real time, blocking phishing pages before they load.",
  datePublished: "2026-06-08", dateModified: "2026-06-08",
  image: "https://securelint.in/og-banner.png",
  author: { "@type": "Organization", name: "SecureLint Research Team", url: "https://securelint.in" },
  publisher: { "@type": "Organization", name: "SecureLint by VAPTLabs", logo: { "@type": "ImageObject", url: "https://securelint.in/icons/icon-128.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://securelint.in/blog/phishing-website-auto-block-before-you-click" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": "https://securelint.in" } },
    { "@type": "ListItem", position: 2, name: "Blog", item: { "@type": "WebPage", "@id": "https://securelint.in/blog" } },
    { "@type": "ListItem", position: 3, name: "Block Phishing Websites", item: { "@type": "WebPage", "@id": "https://securelint.in/blog/phishing-website-auto-block-before-you-click" } },
  ],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Does SecureLint block websites based on a static blocklist?",
      acceptedAnswer: { "@type": "Answer", text: "No. SecureLint uses dynamic, real-time signal analysis rather than a static blocklist alone. It evaluates domain age, SSL certificate age, brand impersonation patterns, redirect chains, and URL structure for every navigation. This catches newly-registered phishing domains that have not yet appeared in any blocklist." } },
    { "@type": "Question", name: "What happens when SecureLint detects a phishing website?",
      acceptedAnswer: { "@type": "Answer", text: "SecureLint shows a popup warning overlay before the phishing page renders. The popup displays the risk signals that triggered the block (e.g., domain registered 2 days ago, brand impersonation detected, SSL issued 6 hours ago) and gives you the option to proceed at your own risk or go back safely." } },
    { "@type": "Question", name: "Can I whitelist a website that SecureLint is blocking incorrectly?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Click 'Proceed anyway' in the SecureLint popup and choose 'Trust this domain' to add it to your personal whitelist. Enterprise admins can manage a team-wide domain whitelist from the SecureLint admin console." } },
  ],
};

const TOC = [
  { id: "how-phishing-sites-evade-detection", label: "How phishing sites evade traditional detection" },
  { id: "securelint-real-time-checks",        label: "SecureLint's real-time website checks" },
  { id: "the-popup-warning",                  label: "The before-you-land popup warning" },
  { id: "setup",                              label: "Setting up website blocking" },
  { id: "faq",                                label: "Frequently asked questions" },
];

export default function PhishingWebsiteBlockPage() {
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
                <div className={s.authorMeta}><time dateTime="2026-06-08">Jun 8, 2026</time><span>·</span><span>5 min read</span></div>
              </div>
            </address>
            <h1 className={s.h1}>How SecureLint Automatically Blocks Phishing Websites Before You Land on Them</h1>
          </header>

          <div className={s.coverBanner} style={{ background: "linear-gradient(135deg,#c2410c 0%,#ea580c 60%,#9a3412 100%)" }} aria-hidden="true">
            <span className={s.coverBannerDeco1} style={{ background: "#fdba74" }} />
            <span className={s.coverBannerDeco2} style={{ background: "#fdba74" }} />
            <span className={s.coverBannerText}>Block Phishing Sites<br /><span style={{ color: "#fdba74" }}>Before the Page Loads</span></span>
          </div>

          <div className={s.prose}>
            <p>By the time a phishing page loads in your browser, it has already had its chance — a pixel tracker has fired, your browser fingerprint has been collected, and any auto-filled credentials may already be on their way to the attacker. The only effective protection is interception <em>before</em> the page renders. That is exactly where SecureLint operates.</p>

            <h2 id="how-phishing-sites-evade-detection">How phishing sites evade traditional detection</h2>
            <p>Traditional phishing protection relies on blocklists — databases of known-bad domains that are updated periodically. This approach has a fundamental gap: <strong>blocklists are always behind</strong>. A phishing site registered this morning, used for a single high-value spear-phishing campaign, and burned within 48 hours will never appear in a blocklist before the damage is done.</p>
            <p>Modern phishing infrastructure is built around this gap:</p>
            <ul>
              <li>Domains are registered hours before the phishing campaign launches</li>
              <li>Valid SSL certificates are obtained automatically (Let&apos;s Encrypt issues in seconds)</li>
              <li>Pages are designed to look pixel-perfect on the target domain</li>
              <li>Link redirectors (through legitimate services like bit.ly or Google Redirect) hide the final phishing domain until the moment of click</li>
            </ul>

            <h2 id="securelint-real-time-checks">SecureLint&apos;s real-time website checks</h2>
            <p>For every navigation, SecureLint evaluates the destination URL across multiple signals before allowing the page to load:</p>
            <ul>
              <li><strong>Domain age</strong> — Domains registered within 14 days are flagged as high-risk. SecureLint queries WHOIS data locally and compares the registration date against the current date. A domain registered today with a valid SSL certificate is a textbook phishing indicator.</li>
              <li><strong>SSL certificate age and issuer</strong> — Phishing sites typically use free, auto-issued certificates that are days old. Certificates issued by automated CAs (Let&apos;s Encrypt, ZeroSSL) within 72 hours of the domain registration date trigger a combined risk flag.</li>
              <li><strong>Brand impersonation score</strong> — The domain is compared against 500+ known brand patterns. Techniques include lookalike TLD substitution (<code>paypal.com.secure-login.net</code>), hyphen insertion (<code>pay-pal.com</code>), and Unicode homograph attacks.</li>
              <li><strong>URL pattern analysis</strong> — Paths containing <code>/login</code>, <code>/verify</code>, <code>/secure</code>, <code>/account/suspended</code>, or <code>/confirm-identity</code> on a young domain are heavily weighted as phishing indicators.</li>
              <li><strong>Redirect chain analysis</strong> — SecureLint follows the redirect chain before committing to navigation and flags chains longer than two hops or chains that terminate on a domain not matching the original link.</li>
              <li><strong>Known phishing kit fingerprints</strong> — Common phishing page structures (fake login forms, urgency countdown timers, brand logo patterns) are matched against a library of known phishing kit templates.</li>
            </ul>

            <h2 id="the-popup-warning">The before-you-land popup warning</h2>
            <p>When SecureLint detects a high-risk destination, it intercepts the navigation and displays a warning popup before any content from the phishing page reaches your browser. The popup shows:</p>
            <ul>
              <li>The destination domain and overall risk score (0–100)</li>
              <li>A breakdown of each triggered signal with plain-language explanations</li>
              <li>Two options: <strong>Go Back (Safe)</strong> or <strong>Proceed Anyway</strong> (with a clear risk acknowledgement)</li>
            </ul>
            <p>The page content never loads until you make a choice. This means the phishing site&apos;s tracking pixels, credential harvesters, and browser fingerprinting scripts are never executed.</p>
            <div className={s.note}>
              <strong>Zero false-positive tuning:</strong> If SecureLint blocks a site you trust, click &ldquo;Proceed Anyway&rdquo; and then &ldquo;Trust this domain&rdquo; to add it to your whitelist. Enterprise admins can maintain a shared domain allowlist from the SecureLint admin console.
            </div>

            <h2 id="setup">Setting up website blocking in SecureLint</h2>
            <div className={s.checklist}>
              <ul>
                <li><span className={s.checkIcon}>✅</span><span>Install SecureLint from the Chrome Web Store. Website blocking is enabled by default.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Navigate to any link. SecureLint evaluates the destination in the background before the page renders.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>When a high-risk site is detected, a full-screen warning popup appears with the risk breakdown and safe navigation options.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Adjust blocking sensitivity in the SecureLint settings panel: Strict, Balanced (default), or Permissive.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Enterprise admins can push blocking policies and domain allowlists centrally via the SecureLint admin console.</span></li>
              </ul>
            </div>
          </div>

          <section className={s.faqSection} aria-labelledby="faq">
            <h2 id="faq" className={s.faqTitle}>Frequently asked questions</h2>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Does SecureLint block websites based on a static blocklist?</p>
              <p className={s.faqA}>No. SecureLint uses dynamic, real-time signal analysis — domain age, SSL certificate age, brand impersonation, redirect chains, and URL patterns — for every navigation. This catches newly-registered phishing domains that have not yet appeared in any blocklist.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>What happens when SecureLint detects a phishing website?</p>
              <p className={s.faqA}>SecureLint shows a popup warning overlay before the phishing page renders. The popup displays the risk signals that triggered the block and gives you the option to go back safely or proceed at your own risk.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Can I whitelist a website that SecureLint is blocking incorrectly?</p>
              <p className={s.faqA}>Yes. Click &quot;Proceed anyway&quot; in the SecureLint popup and choose &quot;Trust this domain&quot; to add it to your personal whitelist. Enterprise admins can manage a team-wide domain whitelist from the SecureLint admin console.</p>
            </div>
          </section>
        </article>
      </div></div>
      <SiteFooter />
    </>
  );
}
