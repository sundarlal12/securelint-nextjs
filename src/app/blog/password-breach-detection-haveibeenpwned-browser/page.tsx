import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import s from "../[slug]/article.module.css";

export const metadata: Metadata = {
  title: "Password Breach Monitoring: How SecureLint Detects and Notifies You When Your Credentials Leak — SecureLint Blog",
  description: "SecureLint cross-references your saved passwords against live breach databases including HaveIBeenPwned and notifies you the moment a credential leak is detected — so you can rotate keys before attackers do.",
  keywords: "password breach detection browser, haveibeenpwned chrome extension, credential leak notification, securelint breach monitor, password exposed alert, hibp browser integration",
  authors: [{ name: "SecureLint Research Team", url: "https://securelint.in" }],
  alternates: { canonical: "https://securelint.in/blog/password-breach-detection-haveibeenpwned-browser" },
  openGraph: {
    type: "article", url: "https://securelint.in/blog/password-breach-detection-haveibeenpwned-browser",
    title: "Password Breach Monitoring: How SecureLint Detects When Your Credentials Leak",
    description: "HaveIBeenPwned integration + live breach feeds + credential hash checks — get notified the moment your password appears in a data breach.",
    publishedTime: "2026-05-29", siteName: "SecureLint",
    images: [{ url: "https://securelint.in/og-banner.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://securelint.in/og-banner.png"],
    title: "Password Breach Monitoring — SecureLint + HaveIBeenPwned",
    description: "Get notified the moment your passwords appear in a live data breach — before attackers exploit them." },
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "Password Breach Monitoring: How SecureLint Detects and Notifies You When Your Credentials Leak",
  description: "SecureLint cross-references passwords against HaveIBeenPwned and live breach databases, alerting you the moment a credential appears in a data breach.",
  datePublished: "2026-05-29", dateModified: "2026-05-29",
  image: "https://securelint.in/og-banner.png",
  author: { "@type": "Organization", name: "SecureLint Research Team", url: "https://securelint.in" },
  publisher: { "@type": "Organization", name: "SecureLint by VAPTLabs", logo: { "@type": "ImageObject", url: "https://securelint.in/icons/icon-128.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://securelint.in/blog/password-breach-detection-haveibeenpwned-browser" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": "https://securelint.in" } },
    { "@type": "ListItem", position: 2, name: "Blog", item: { "@type": "WebPage", "@id": "https://securelint.in/blog" } },
    { "@type": "ListItem", position: 3, name: "Password Breach Monitoring", item: { "@type": "WebPage", "@id": "https://securelint.in/blog/password-breach-detection-haveibeenpwned-browser" } },
  ],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Does SecureLint send my actual passwords to HaveIBeenPwned?",
      acceptedAnswer: { "@type": "Answer", text: "No. SecureLint uses the k-anonymity model: it computes the SHA-1 hash of your password, sends only the first 5 characters of that hash to the HIBP API, and checks whether the full hash appears in the returned list of breached hashes. Your actual password or its full hash is never transmitted anywhere." } },
    { "@type": "Question", name: "How quickly does SecureLint notify me after a breach is discovered?",
      acceptedAnswer: { "@type": "Answer", text: "SecureLint performs breach checks when you log in to a site and on a configurable periodic schedule (default: weekly). When a new breach is added to the HIBP database that includes your credentials, SecureLint will detect it at the next scheduled check and show an immediate notification. For critical breach events, the check schedule can be set to daily in SecureLint settings." } },
    { "@type": "Question", name: "What should I do when SecureLint shows a breach notification?",
      acceptedAnswer: { "@type": "Answer", text: "Change the breached password immediately on the affected site. If you reused that password on other sites, change it on those sites too. Enable two-factor authentication on the affected account if not already active. The SecureLint notification includes a direct link to the site's password change page where available." } },
  ],
};

const TOC = [
  { id: "why-breach-monitoring-matters",  label: "Why breach monitoring matters" },
  { id: "hibp-integration",               label: "HaveIBeenPwned k-anonymity integration" },
  { id: "when-checks-run",                label: "When breach checks run" },
  { id: "what-the-alert-shows",           label: "What the breach alert shows" },
  { id: "password-reuse-detection",       label: "Password reuse detection" },
  { id: "setup",                          label: "Setting up breach monitoring" },
  { id: "faq",                            label: "Frequently asked questions" },
];

export default function PasswordBreachDetectionPage() {
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
                <div className={s.authorMeta}><time dateTime="2026-05-29">May 29, 2026</time><span>·</span><span>7 min read</span></div>
              </div>
            </address>
            <h1 className={s.h1}>Password Breach Monitoring: How SecureLint Detects and Notifies You When Your Credentials Leak</h1>
          </header>

          <div className={s.coverBanner} style={{ background: "linear-gradient(135deg,#14532d 0%,#16a34a 60%,#052e16 100%)" }} aria-hidden="true">
            <span className={s.coverBannerDeco1} style={{ background: "#86efac" }} />
            <span className={s.coverBannerDeco2} style={{ background: "#86efac" }} />
            <span className={s.coverBannerText}>Password Breach Monitoring<br /><span style={{ color: "#86efac" }}>Detect Leaks Before Attackers</span></span>
          </div>

          <div className={s.prose}>
            <p>A data breach at a company whose service you use six years ago. A password you stopped using two years ago. A credential stuffing attack on an account you forgot existed. Billions of username-password combinations from historical breaches are freely available on criminal marketplaces, and attackers systematically test them against current accounts. <strong>SecureLint&apos;s breach monitoring</strong> checks your credentials against live breach databases continuously — so you find out about a leak before attackers exploit it.</p>

            <h2 id="why-breach-monitoring-matters">Why breach monitoring matters for every user</h2>
            <p>The scale of credential compromise is difficult to comprehend:</p>
            <ul>
              <li>Over 15 billion unique username-password combinations are circulating on criminal forums and dark web marketplaces</li>
              <li>The average time between a breach occurring and the credentials appearing in criminal markets is under 72 hours for high-value breaches</li>
              <li>Password reuse across multiple sites means a single breach of a low-security site can compromise high-security accounts if the same password was reused</li>
              <li>Credential stuffing attacks — automated login attempts using breach data — succeed against roughly 0.1% of tested credentials; at billions of attempts per day, this scales to millions of account takeovers</li>
            </ul>
            <p>The only way to know that your credentials have appeared in a breach — and rotate them before attackers exploit them — is continuous breach monitoring.</p>

            <h2 id="hibp-integration">HaveIBeenPwned k-anonymity integration</h2>
            <p>SecureLint integrates with <strong>HaveIBeenPwned (HIBP)</strong>, the largest and most maintained public breach database, using the k-anonymity API. This is the same privacy-preserving approach used by major password managers and browsers.</p>
            <p>How the k-anonymity check works:</p>
            <ol>
              <li>SecureLint computes the <strong>SHA-1 hash</strong> of the password locally in the browser — e.g. <code>5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8</code></li>
              <li>Only the <strong>first 5 characters</strong> of that hash (<code>5BAA6</code>) are sent to the HIBP API</li>
              <li>HIBP returns a list of all breach hashes that start with those 5 characters — typically 500–1,000 entries</li>
              <li>SecureLint checks whether the full hash of your password appears in the returned list, entirely locally</li>
              <li>Your actual password or its full hash is never transmitted</li>
            </ol>
            <div className={s.note}>
              <strong>Privacy guarantee:</strong> The k-anonymity model means the HIBP API server never sees your password or its full hash. The lookup is mathematically indistinguishable from any other lookup for the same 5-character prefix — your specific password cannot be identified from network traffic.
            </div>

            <h2 id="when-checks-run">When breach checks run</h2>
            <p>SecureLint performs breach checks at three trigger points:</p>
            <ul>
              <li><strong>Login detection</strong> — When SecureLint detects a successful login (a form submission to a known authentication endpoint), it immediately checks the submitted password against HIBP. This provides instant feedback when you use a compromised password to log in.</li>
              <li><strong>Scheduled weekly scan</strong> — SecureLint periodically checks all passwords stored in your browser&apos;s password manager against the HIBP database. New breaches are added to HIBP continuously, so a password that was clean last week may appear in this week&apos;s scan.</li>
              <li><strong>New breach notification</strong> — SecureLint subscribes to breach notification feeds. When a major new breach is published, it triggers an immediate out-of-schedule check for all matching credentials.</li>
            </ul>

            <h2 id="what-the-alert-shows">What the breach notification shows</h2>
            <p>When a breached password is detected, SecureLint shows a notification with:</p>
            <ul>
              <li><strong>The affected site or service</strong> — The domain whose password was found in a breach</li>
              <li><strong>Breach source</strong> — Which breach database the credential appeared in (e.g. a named breach, or HIBP count showing how many times this password hash has appeared across all breaches)</li>
              <li><strong>Breach count</strong> — How many times this specific password hash has been seen in breach databases — a high count means the password is in widespread criminal circulation</li>
              <li><strong>Urgency level</strong> — Low (old breach, password likely already rotated), Medium (recent breach), High (password seen in current credential stuffing campaigns)</li>
              <li><strong>Direct password change link</strong> — A link to the affected site&apos;s password change page where available</li>
            </ul>

            <h2 id="password-reuse-detection">Password reuse detection</h2>
            <p>Breach monitoring alone is not enough if you reuse the same password across multiple sites. SecureLint also checks for password reuse:</p>
            <ul>
              <li>When a login is detected, SecureLint checks whether the same password is used on any other stored credential</li>
              <li>If a breached password is also used on other sites, SecureLint flags all affected sites — not just the one where the breach occurred</li>
              <li>A password reuse warning appears alongside the breach alert, with a list of all sites using the compromised password</li>
            </ul>
            <p>This is the most common vector for breach escalation: a weak password from a low-security forum is reused on a banking or corporate SaaS account, turning a minor breach into a critical one.</p>

            <h2 id="setup">Setting up breach monitoring in SecureLint</h2>
            <div className={s.checklist}>
              <ul>
                <li><span className={s.checkIcon}>✅</span><span>Install SecureLint from the Chrome Web Store. Breach monitoring is enabled by default.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Log in to any site with a saved password. SecureLint silently checks it against HIBP and shows a badge if the password has appeared in a breach.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>View your breach dashboard in the SecureLint extension popup — it shows a summary of all currently compromised credentials with urgency levels.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Click any breach alert to open the affected site&apos;s password change page and rotate the compromised credential immediately.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Enable email notifications in SecureLint settings to receive an email summary when new breaches are detected during scheduled scans.</span></li>
              </ul>
            </div>
          </div>

          <section className={s.faqSection} aria-labelledby="faq">
            <h2 id="faq" className={s.faqTitle}>Frequently asked questions</h2>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Does SecureLint send my actual passwords to HaveIBeenPwned?</p>
              <p className={s.faqA}>No. SecureLint uses the k-anonymity model: it computes the SHA-1 hash of your password locally, sends only the first 5 characters of that hash to the HIBP API, and checks whether the full hash appears in the returned list. Your actual password or its full hash is never transmitted.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>How quickly does SecureLint notify me after a breach is discovered?</p>
              <p className={s.faqA}>SecureLint checks at login time (immediate) and on a weekly schedule. When a new breach is added to HIBP that includes your credentials, SecureLint detects it at the next scheduled check. The schedule can be set to daily in settings for faster detection.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>What should I do when SecureLint shows a breach notification?</p>
              <p className={s.faqA}>Change the breached password immediately on the affected site. If you reused it on other sites, change it everywhere. Enable two-factor authentication on the affected account. The notification includes a direct link to the site&apos;s password change page where available.</p>
            </div>
          </section>
        </article>
      </div></div>
      <SiteFooter />
    </>
  );
}
