import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import s from "../[slug]/article.module.css";

export const metadata: Metadata = {
  title: "Real-Time Phishing Email Detection: How SecureLint Scans Every Message Before You Click — SecureLint Blog",
  description: "SecureLint checks SPF, DKIM, and DMARC headers, scores every link against 14 threat signals, fingerprints attachments, and surfaces a clear 0–100 trust score — all before you open a suspicious email.",
  keywords: "realtime phishing email detection, phishing email scanner chrome extension, spf dkim dmarc check browser, email trust score, securelint phishing detection, malicious link in email",
  authors: [{ name: "SecureLint Research Team", url: "https://securelint.in" }],
  alternates: { canonical: "https://securelint.in/blog/realtime-phishing-email-detection-chrome-extension" },
  openGraph: {
    type: "article", url: "https://securelint.in/blog/realtime-phishing-email-detection-chrome-extension",
    title: "Real-Time Phishing Email Detection: How SecureLint Scans Every Message Before You Click",
    description: "SPF, DKIM, DMARC checks + 14-signal link scoring + attachment fingerprinting — all in real time, right in Gmail and Outlook.",
    publishedTime: "2026-06-12", siteName: "SecureLint",
    images: [{ url: "https://securelint.in/og-banner.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://securelint.in/og-banner.png"],
    title: "Real-Time Phishing Email Detection — SecureLint",
    description: "SPF + DKIM + 14-signal link scoring + attachment checks — before you click." },
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "Real-Time Phishing Email Detection: How SecureLint Scans Every Message Before You Click",
  description: "SecureLint checks SPF, DKIM, DMARC, scores links against 14 signals, and surfaces a 0–100 trust score in real time.",
  datePublished: "2026-06-12", dateModified: "2026-06-12",
  image: "https://securelint.in/og-banner.png",
  author: { "@type": "Organization", name: "SecureLint Research Team", url: "https://securelint.in" },
  publisher: { "@type": "Organization", name: "SecureLint by VAPTLabs", logo: { "@type": "ImageObject", url: "https://securelint.in/icons/icon-128.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://securelint.in/blog/realtime-phishing-email-detection-chrome-extension" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": "https://securelint.in" } },
    { "@type": "ListItem", position: 2, name: "Blog", item: { "@type": "WebPage", "@id": "https://securelint.in/blog" } },
    { "@type": "ListItem", position: 3, name: "Phishing Email Detection", item: { "@type": "WebPage", "@id": "https://securelint.in/blog/realtime-phishing-email-detection-chrome-extension" } },
  ],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Which email clients does SecureLint phishing detection work in?",
      acceptedAnswer: { "@type": "Answer", text: "SecureLint works inside Gmail (mail.google.com) and Outlook Web (outlook.live.com, outlook.office.com). It reads the rendered email content and header metadata directly from the DOM — no email forwarding or server-side access required." } },
    { "@type": "Question", name: "What is the trust score and how is it calculated?",
      acceptedAnswer: { "@type": "Answer", text: "The trust score is a 0–100 composite score calculated from 14 signals: SPF pass/fail, DKIM pass/fail, DMARC policy, sender domain age, brand impersonation pattern matching, link domain reputation, SSL certificate validity, redirect chain depth, URL encoding obfuscation, attachment MIME type risk, sender name spoofing, reply-to mismatch, and known phishing keyword density." } },
    { "@type": "Question", name: "Does SecureLint read the content of my emails?",
      acceptedAnswer: { "@type": "Answer", text: "SecureLint reads the rendered HTML of emails displayed in your browser to extract sender metadata, link URLs, and attachment types. This analysis runs entirely locally in the browser extension. No email content, sender addresses, or URLs are transmitted to SecureLint servers." } },
  ],
};

const TOC = [
  { id: "why-email-phishing-succeeds",  label: "Why email phishing still succeeds" },
  { id: "14-signal-analysis",           label: "SecureLint's 14-signal email analysis" },
  { id: "spf-dkim-dmarc",              label: "SPF, DKIM, and DMARC explained" },
  { id: "link-scoring",                 label: "Real-time link threat scoring" },
  { id: "attachment-scanning",          label: "Attachment risk fingerprinting" },
  { id: "trust-score",                  label: "The 0–100 trust score" },
  { id: "setup",                        label: "Setting up phishing detection" },
  { id: "faq",                          label: "Frequently asked questions" },
];

export default function PhishingEmailDetectionPage() {
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
                <div className={s.authorMeta}><time dateTime="2026-06-12">Jun 12, 2026</time><span>·</span><span>8 min read</span></div>
              </div>
            </address>
            <h1 className={s.h1}>Real-Time Phishing Email Detection: How SecureLint Scans Every Message Before You Click</h1>
          </header>

          <div className={s.coverBanner} style={{ background: "linear-gradient(135deg,#991b1b 0%,#dc2626 60%,#7f1d1d 100%)" }} aria-hidden="true">
            <span className={s.coverBannerDeco1} style={{ background: "#fca5a5" }} />
            <span className={s.coverBannerDeco2} style={{ background: "#fca5a5" }} />
            <span className={s.coverBannerText}>Phishing Email Detection<br /><span style={{ color: "#fca5a5" }}>14-Signal Trust Score</span></span>
          </div>

          <div className={s.prose}>
            <p>A carefully crafted phishing email lands in your inbox. The sender name looks familiar. The logo matches. The call-to-action is urgent. You click the link before your brain has time to run the checks your eyes skipped. That moment — between seeing the email and clicking the link — is where <strong>SecureLint</strong> operates.</p>
            <p>SecureLint&apos;s phishing detection engine analyses every email you open in Gmail and Outlook Web in real time, computing a 0–100 trust score from 14 independent threat signals. High-risk emails get a red warning banner before you can click any link. Low-trust links trigger an interstitial popup the moment you click them.</p>

            <h2 id="why-email-phishing-succeeds">Why email phishing still succeeds in 2026</h2>
            <p>Email authentication standards (SPF, DKIM, DMARC) have existed for over a decade — yet phishing remains the leading initial access vector in over 80% of breaches. The reason is that sophisticated attackers have adapted:</p>
            <ul>
              <li><strong>Lookalike domains</strong> — Registering <code>paypa1.com</code> or <code>micro-soft.com</code> and sending emails that pass SPF and DKIM on those domains</li>
              <li><strong>Compromised legitimate accounts</strong> — Sending phishing emails from a real colleague&apos;s hacked account, which passes all authentication checks</li>
              <li><strong>Link redirectors</strong> — Embedding links through legitimate services (Google Docs, OneDrive, Dropbox) that redirect to phishing pages only after email gateway scanning</li>
              <li><strong>Zero-day phishing kits</strong> — Purpose-built pages that use valid SSL certificates, legitimate-looking UI, and are hosted on domains registered within the last 24 hours</li>
            </ul>

            <h2 id="14-signal-analysis">SecureLint&apos;s 14-signal email analysis</h2>
            <p>Each email is scored across 14 independent signals, grouped into four categories:</p>
            <ul>
              <li><strong>Authentication signals</strong> — SPF pass/fail, DKIM signature validity, DMARC policy enforcement (none / quarantine / reject)</li>
              <li><strong>Sender identity signals</strong> — Display name vs. envelope sender mismatch, reply-to address mismatch, sender domain age (domains younger than 30 days are high-risk), brand impersonation pattern matching against 500+ known brands</li>
              <li><strong>Link signals</strong> — Each link URL is scored for domain reputation, SSL certificate age, redirect chain depth, URL encoding obfuscation, and homograph / IDN substitution attacks</li>
              <li><strong>Content signals</strong> — Attachment MIME type risk, phishing keyword density (urgency language, credential request patterns, account suspension threats), and known phishing template fingerprints</li>
            </ul>

            <h2 id="spf-dkim-dmarc">SPF, DKIM, and DMARC: what they check and what they miss</h2>
            <p>These three standards form the baseline of email authentication — but each has blind spots that SecureLint&apos;s additional signals are designed to cover.</p>
            <ul>
              <li><strong>SPF (Sender Policy Framework)</strong> checks whether the sending mail server is authorized to send on behalf of the domain in the email envelope. It does not check the From header visible to the user, which is why display name spoofing is still possible even with a passing SPF record.</li>
              <li><strong>DKIM (DomainKeys Identified Mail)</strong> verifies that the email was cryptographically signed by the claimed domain. A passing DKIM signature means the email was not tampered with in transit — but it says nothing about whether the sending domain itself is malicious.</li>
              <li><strong>DMARC (Domain-based Message Authentication)</strong> ties SPF and DKIM together and specifies what the receiving server should do with failures. A DMARC policy of <code>p=none</code> provides reporting but no protection. Only <code>p=quarantine</code> or <code>p=reject</code> actually block spoofed emails.</li>
            </ul>
            <div className={s.note}>
              <strong>SecureLint surfaces all three signal results</strong> in a compact header badge on each email — a green tick for pass, an amber warning for soft-fail or <code>p=none</code>, and a red badge for outright failure. These are displayed horizontally alongside the sender name so you can see authentication status without opening any panel.
            </div>

            <h2 id="link-scoring">Real-time link threat scoring</h2>
            <p>Every link in an email body is scored before you click it. SecureLint checks:</p>
            <ul>
              <li><strong>Domain age</strong> — Domains registered within 30 days of the email date are flagged as high-risk. Most phishing infrastructure is burned and replaced within weeks.</li>
              <li><strong>SSL certificate age</strong> — A certificate issued within 72 hours of the email is a strong phishing signal.</li>
              <li><strong>Brand impersonation</strong> — The domain is checked against patterns for 500+ major brands. <code>paypal-security-verify.com</code> triggers a brand impersonation flag even though it passes SSL.</li>
              <li><strong>Redirect chain depth</strong> — Phishing links often chain through two or three redirectors to bypass gateway scanning. SecureLint flags links with redirect chains longer than two hops.</li>
              <li><strong>IDN homograph attacks</strong> — Unicode lookalike characters (е vs e, а vs a) are normalised and checked for brand impersonation.</li>
            </ul>

            <h2 id="attachment-scanning">Attachment risk fingerprinting</h2>
            <p>SecureLint does not download attachments for scanning (that would require server-side processing). Instead, it fingerprints the attachment metadata visible in the email DOM:</p>
            <ul>
              <li>MIME type vs. file extension mismatch (e.g., a <code>.pdf</code> with an <code>application/exe</code> MIME type)</li>
              <li>High-risk file extensions: <code>.exe</code>, <code>.js</code>, <code>.vbs</code>, <code>.wsf</code>, <code>.hta</code>, <code>.iso</code>, <code>.lnk</code></li>
              <li>Password-protected archives (common phishing technique to bypass content scanning)</li>
              <li>Office documents with macro-enabled extensions (<code>.xlsm</code>, <code>.docm</code>)</li>
            </ul>

            <h2 id="trust-score">The 0–100 trust score</h2>
            <p>All 14 signals are combined into a single 0–100 trust score, displayed as a colour-coded gauge on each email:</p>
            <ul>
              <li><strong>80–100 (Green)</strong> — All authentication signals pass; no threat indicators detected. Safe to interact with.</li>
              <li><strong>50–79 (Amber)</strong> — Some signals are suspicious. Review before clicking any links.</li>
              <li><strong>0–49 (Red)</strong> — Multiple high-risk signals detected. SecureLint displays a warning banner and blocks link clicks pending your confirmation.</li>
            </ul>

            <h2 id="setup">Setting up phishing detection in SecureLint</h2>
            <div className={s.checklist}>
              <ul>
                <li><span className={s.checkIcon}>✅</span><span>Install SecureLint from the Chrome Web Store.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Open Gmail or Outlook Web — phishing detection activates automatically with no configuration.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Open any email. A trust score badge appears next to the sender name within one second of the email rendering.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Hover any link in the email body to see its per-link risk score before clicking.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>For red-scored emails, SecureLint displays a full-width warning banner with a breakdown of each failing signal.</span></li>
              </ul>
            </div>
          </div>

          <section className={s.faqSection} aria-labelledby="faq">
            <h2 id="faq" className={s.faqTitle}>Frequently asked questions</h2>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Which email clients does SecureLint phishing detection work in?</p>
              <p className={s.faqA}>SecureLint works inside Gmail (mail.google.com) and Outlook Web (outlook.live.com, outlook.office.com). It reads the rendered email content and header metadata directly from the DOM — no email forwarding or server-side access required.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>What is the trust score and how is it calculated?</p>
              <p className={s.faqA}>The trust score is a 0–100 composite score calculated from 14 signals: SPF pass/fail, DKIM validity, DMARC policy, sender domain age, brand impersonation matching, link domain reputation, SSL certificate age, redirect chain depth, URL encoding obfuscation, attachment MIME risk, sender name spoofing, reply-to mismatch, and phishing keyword density.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Does SecureLint read the content of my emails?</p>
              <p className={s.faqA}>SecureLint reads the rendered HTML of emails displayed in your browser to extract sender metadata, link URLs, and attachment types. This analysis runs entirely locally in the browser extension. No email content, sender addresses, or URLs are transmitted to SecureLint servers.</p>
            </div>
          </section>
        </article>
      </div></div>
      <SiteFooter />
    </>
  );
}
