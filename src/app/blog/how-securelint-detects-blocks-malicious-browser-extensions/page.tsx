import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import s from "../[slug]/article.module.css";

/* ─── SEO ──────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Malicious Browser Extension Detection: What SecureLint Checks and Why It Matters — SecureLint Blog",
  description:
    "Rogue Chrome extensions silently read passwords, inject ads, and exfiltrate session cookies. SecureLint audits installed extensions against known malicious signatures, flags permission overreach, and blocks risky extensions before they execute.",
  keywords:
    "malicious browser extension detection, block rogue chrome extensions, extension security audit, browser extension risk score, securelint extension guard, malicious extension blocker chrome, session hijacking extensions",
  authors: [{ name: "SecureLint Research Team", url: "https://securelint.in" }],
  alternates: { canonical: "https://securelint.in/blog/how-securelint-detects-blocks-malicious-browser-extensions" },
  openGraph: {
    type: "article",
    url: "https://securelint.in/blog/how-securelint-detects-blocks-malicious-browser-extensions",
    title: "Malicious Browser Extension Detection: What SecureLint Checks and Why It Matters",
    description:
      "SecureLint audits every installed extension against known-bad signatures, permission overreach, and supply-chain risk signals — and blocks threats before they execute in your browser.",
    publishedTime: "2026-06-10",
    authors: ["SecureLint Research Team"],
    siteName: "SecureLint",
    images: [{ url: "https://securelint.in/og-banner.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Malicious Browser Extension Detection: What SecureLint Checks and Why It Matters",
    description:
      "Rogue extensions steal session cookies, exfiltrate passwords, and inject ads. SecureLint detects and blocks them in real time — before any damage is done.",
    images: ["https://securelint.in/og-banner.png"],
  },
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "Malicious Browser Extension Detection: What SecureLint Checks and Why It Matters",
  description:
    "Rogue Chrome extensions silently read passwords, inject ads, and exfiltrate session cookies. SecureLint audits installed extensions against known malicious signatures and flags permission overreach.",
  datePublished: "2026-06-10", dateModified: "2026-06-10",
  image: "https://securelint.in/og-banner.png",
  author: { "@type": "Organization", name: "SecureLint Research Team", url: "https://securelint.in" },
  publisher: { "@type": "Organization", name: "SecureLint by VAPTLabs", logo: { "@type": "ImageObject", url: "https://securelint.in/icons/icon-128.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://securelint.in/blog/how-securelint-detects-blocks-malicious-browser-extensions" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": "https://securelint.in" } },
    { "@type": "ListItem", position: 2, name: "Blog", item: { "@type": "WebPage", "@id": "https://securelint.in/blog" } },
    { "@type": "ListItem", position: 3, name: "Malicious Extension Detection", item: { "@type": "WebPage", "@id": "https://securelint.in/blog/how-securelint-detects-blocks-malicious-browser-extensions" } },
  ],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question", name: "How does SecureLint detect malicious browser extensions?",
      acceptedAnswer: { "@type": "Answer", text: "SecureLint cross-references every installed extension against a continuously updated threat intelligence list of known-malicious extension IDs and hashes. It also performs real-time permission analysis, scoring each extension based on the breadth of host permissions, access to sensitive APIs (cookies, tabs, webRequest), and ownership history. Extensions that match known-bad signatures are blocked immediately." }
    },
    {
      "@type": "Question", name: "Can SecureLint block an extension that was safe yesterday but turned malicious today?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. SecureLint runs a continuous background check on all installed extensions and compares them against live threat intelligence. The moment a previously-trusted extension is flagged as malicious — for example because an attacker pushed a compromised update — SecureLint generates a detection event and can block the extension from executing. This is critical because Chrome Web Store review alone cannot prevent malicious updates from reaching browsers." }
    },
    {
      "@type": "Question", name: "What permissions indicate a risky browser extension?",
      acceptedAnswer: { "@type": "Answer", text: "High-risk permission combinations include: <all_urls> or broad host patterns, the 'cookies' API (enables session token theft), 'webRequest'/'declarativeNetRequest' (enables traffic interception), 'tabs' with 'activeTab' (reads all page content), and 'clipboardRead' (reads copied data including passwords). SecureLint computes a composite risk score from these and other signals." }
    },
    {
      "@type": "Question", name: "Does SecureLint create an inventory of all installed extensions?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. SecureLint provides a real-time inventory of every extension installed across all browsers where the SecureLint extension is active. The inventory includes extension name, ID, version, permissions, host permissions, install method (managed, manual, sideloaded, or development), and which user/browser has it installed. This is the foundation for risk-based extension management." }
    },
    {
      "@type": "Question", name: "How do I set up an extension allowlist with SecureLint?",
      acceptedAnswer: { "@type": "Answer", text: "In the SecureLint Enterprise admin console, navigate to Controls > Extension Policy. You can define an allowlist of approved extension IDs. Any extension not on the allowlist is blocked from executing in browsers with SecureLint installed, and users see a customizable block message. The allowlist is centrally managed and applies across all browsers and operating systems without additional MDM configuration." }
    },
  ],
};

const TOC = [
  { id: "why-malicious-extensions-are-dangerous",   label: "Why malicious extensions are dangerous" },
  { id: "how-extensions-turn-malicious",            label: "How legitimate extensions turn malicious" },
  { id: "what-securelint-checks",                   label: "What SecureLint checks on every extension" },
  { id: "step0-enable-detection",                   label: "Step 0: Enable extension detection" },
  { id: "step1-inventory",                          label: "Step 1: Build an extension inventory" },
  { id: "step2-risk-assess",                        label: "Step 2: Risk-assess installed extensions" },
  { id: "step3-allowlist",                          label: "Step 3: Create an allowlist" },
  { id: "step4-monitor",                            label: "Step 4: Monitor for risky changes" },
  { id: "additional-tips",                          label: "Additional security tips" },
  { id: "faq",                                      label: "Frequently asked questions" },
];

/* ─── Page ─────────────────────────────────────────────────── */
export default function MaliciousExtensionBlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader />
      <div className={s.page}>
        <div className={s.outer}>

          {/* ── Sidebar ToC ── */}
          <nav className={s.toc} aria-label="Table of contents">
            <div className={s.tocInner}>
              <p className={s.tocTitle}>Table of Contents</p>
              <ul className={s.tocList}>
                {TOC.map((item) => (
                  <li key={item.id} className={s.tocItem}>
                    <a href={`#${item.id}`} className={s.tocLink}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* ── Main article ── */}
          <article className={s.article}>

            <header className={s.header}>
              <address className={s.authorRow} aria-label="Author and publication info">
                <div className={s.avatar}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://securelint.in/icons/icon-128.png" alt="SecureLint" className={s.avatarImg} />
                </div>
                <div className={s.authorInfo}>
                  <p className={s.authorName}>SecureLint Research Team</p>
                  <p className={s.authorRole}>VAPTLabs Security Research</p>
                  <div className={s.authorMeta}>
                    <time dateTime="2026-06-10">Jun 10, 2026</time>
                    <span>·</span>
                    <span>6 min read</span>
                  </div>
                </div>
              </address>

              <h1 className={s.h1}>
                Malicious Browser Extension Detection: What SecureLint Checks and Why It Matters
              </h1>
            </header>

            {/* Cover banner */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/securelint_banner_malicious_extension.svg"
              alt="SecureLint — Malicious Browser Extension Detection"
              className={s.articleBannerImg}
            />

            {/* ── Article Body ── */}
            <div className={s.prose}>

              <p>
                Attackers have discovered that browser extensions are the perfect Trojan horse. A
                legitimate-looking productivity tool with thousands of five-star reviews can silently
                read every password you type, intercept your session cookies, and exfiltrate data to
                an attacker-controlled server — all while Chrome shows a green padlock and no security
                alert fires.
              </p>
              <p>
                Recent campaigns like <strong>ShadyPanda</strong> (43 million installs), <strong>ZoomStealer</strong>,
                <strong> GhostPoster</strong>, and the Cyberhaven supply-chain compromise have put browser
                extension security at the top of every security team&apos;s agenda. <strong>SecureLint</strong>{" "}
                gives you real-time visibility and active blocking — right inside the browser, where the
                threat actually lives.
              </p>

              <h2 id="why-malicious-extensions-are-dangerous">Why malicious extensions are so dangerous</h2>
              <p>
                Browser extensions run with elevated privileges that normal web pages cannot access.
                A Chrome extension with the right permission set can:
              </p>
              <ul>
                <li>Read and modify every page you visit, including banking and SaaS dashboards</li>
                <li>Access <code>document.cookie</code> and steal authenticated session tokens</li>
                <li>Intercept all outgoing network requests and inject data before they leave the browser</li>
                <li>Read clipboard contents, capturing passwords copied from a password manager</li>
                <li>Capture form inputs in real time, including username and password fields</li>
                <li>Exfiltrate API keys, AWS credentials, and database passwords visible in open tabs</li>
              </ul>
              <p>
                Unlike malware installed on the operating system, extensions bypass most endpoint
                detection tools. Traditional EDR agents look at processes, file system events, and
                network sockets — they have no visibility into JavaScript running inside a browser
                extension sandbox.
              </p>

              <h2 id="how-extensions-turn-malicious">How a legitimate extension becomes malicious overnight</h2>
              <p>
                The most dangerous attack vector is not a newly-created fake extension — it is a
                trusted extension that has been compromised after installation. There are three common
                paths:
              </p>
              <ol>
                <li>
                  <strong>Phished developer account</strong> — An attacker phishes the credentials of
                  an extension developer, pushes a malicious update to the Chrome Web Store, and within
                  hours every browser with that extension installed receives the malicious payload
                  automatically.
                </li>
                <li>
                  <strong>Extension acquisition</strong> — Attackers purchase popular but
                  under-maintained extensions from their developers, then publish a malicious update to
                  the millions of existing users.
                </li>
                <li>
                  <strong>Supply-chain dependency injection</strong> — A malicious package is introduced
                  into a library used by an extension's build pipeline, hiding malicious code inside an
                  otherwise clean-looking update.
                </li>
              </ol>
              <div className={s.note}>
                <strong>Key insight:</strong> Chrome Web Store review processes use static analysis and
                sandboxed execution — both of which attackers routinely bypass using dynamically
                compiled code, delayed execution timers, and environment-specific activation conditions.
                An extension can pass review and turn malicious the moment it detects it is running
                outside the review sandbox.
              </div>

              <h2 id="what-securelint-checks">What SecureLint checks on every installed extension</h2>
              <p>
                SecureLint performs a multi-signal analysis on every extension present in your browser,
                combining threat intelligence, static permission analysis, and behavioral signals:
              </p>
              <ul>
                <li>
                  <strong>Known-bad signature matching</strong> — SecureLint maintains a continuously
                  updated index of known-malicious extension IDs, manifest hashes, and content-script
                  fingerprints. Any extension that matches is flagged immediately, regardless of whether
                  it is still listed in the Chrome Web Store.
                </li>
                <li>
                  <strong>Permission risk scoring</strong> — Each permission and host pattern is
                  weighted by its abuse potential. Combinations like{" "}
                  <code>&lt;all_urls&gt;</code> + <code>cookies</code> + <code>webRequest</code>{" "}
                  produce a high composite risk score.
                </li>
                <li>
                  <strong>Ownership change detection</strong> — SecureLint tracks the publisher
                  identity of each extension. A change in publisher name or update URL is a red flag
                  that the extension has been acquired or compromised.
                </li>
                <li>
                  <strong>Install method auditing</strong> — Extensions installed via sideloading
                  (pushed by local software) or developer mode (loaded from disk) are flagged, as
                  these bypass the Chrome Web Store entirely.
                </li>
                <li>
                  <strong>Unlisted / removed status</strong> — When Chrome Web Store removes an
                  extension, SecureLint detects that it has been delisted and alerts you, even though
                  Chrome does not automatically uninstall extensions that are removed from the store.
                </li>
                <li>
                  <strong>Version anomaly detection</strong> — A sudden major version bump with no
                  matching changelog, especially shortly after a change in extension ownership, is a
                  known precursor to a malicious update.
                </li>
              </ul>

              <h2 id="step0-enable-detection">Step 0 — Enable malicious extension detection in SecureLint</h2>
              <p>
                Before anything else, make sure known-bad extensions cannot execute in your environment.
                In the SecureLint admin console, navigate to{" "}
                <strong>Controls → Extension Security</strong> and set the detection mode to{" "}
                <strong>Block</strong>.
              </p>
              <div className={s.checklist}>
                <ul>
                  <li><span className={s.checkIcon}>✅</span><span><strong>Off</strong> — No checks run. Not recommended.</span></li>
                  <li><span className={s.checkIcon}>✅</span><span><strong>Monitor</strong> — Detection events are generated and surfaced in the Detections dashboard but the extension is not blocked. Use during initial rollout to understand your baseline.</span></li>
                  <li><span className={s.checkIcon}>✅</span><span><strong>Block (recommended)</strong> — The extension is disabled in every browser where SecureLint is installed and users cannot re-enable it. Access to the Web Store listing is also blocked to prevent manual reinstall.</span></li>
                </ul>
              </div>
              <p>
                Detection events are classified by severity based on whether the extension was already
                active when it was flagged:
              </p>
              <ul>
                <li><strong>Low</strong> — Extension was installed but never enabled. SecureLint prevented execution before any harm occurred.</li>
                <li><strong>Medium</strong> — Extension was active but has now been disabled by SecureLint. The window of exposure was limited.</li>
                <li><strong>High</strong> — Extension is currently active and running (typically because the control was in Monitor mode). Immediate manual investigation is required.</li>
              </ul>
              <div className={s.note}>
                <strong>Why this matters even with an allowlist in place:</strong> An extension that is
                safe and approved today can receive a malicious update tomorrow. Block mode ensures that
                the moment an extension is reported as malicious — even after it was approved — it is
                instantly disabled across every browser in your organization.
              </div>

              <h2 id="step1-inventory">Step 1 — Build a real-time extension inventory</h2>
              <p>
                You cannot manage what you cannot see. SecureLint automatically builds a complete,
                real-time inventory of every extension installed across every browser where the
                SecureLint extension is deployed.
              </p>
              <p>For each extension, SecureLint tracks:</p>
              <ul>
                <li>Extension name, ID, and current version number</li>
                <li>All declared permissions and host permissions</li>
                <li>Install method: <em>managed</em> (pushed by IT), <em>manual</em> (user-installed from store), <em>sideloaded</em> (installed by local software), or <em>development</em> (loaded from disk in developer mode)</li>
                <li>Publisher identity and update URL (to catch ownership changes)</li>
                <li>Which users and browsers have the extension installed</li>
                <li>Whether the extension is currently enabled or disabled</li>
                <li>Web Store listing status (active, unlisted, or removed)</li>
                <li>Install count and historical ownership data</li>
              </ul>
              <p>
                This inventory is the foundation for every subsequent risk management decision. Without
                it, your security team is flying blind.
              </p>

              <h2 id="step2-risk-assess">Step 2 — Risk-assess extensions using SecureLint data</h2>
              <p>
                With a full inventory in hand, use SecureLint&apos;s extension dashboard to identify
                and prioritize risky extensions. Focus on:
              </p>
              <ul>
                <li>
                  <strong>High-permission extensions from unverified publishers</strong> — An extension
                  that requests <code>&lt;all_urls&gt;</code> and <code>cookies</code> from an
                  unverified publisher with fewer than 1,000 installs is a significant risk.
                </li>
                <li>
                  <strong>Sideloaded or development-mode extensions</strong> — These bypass the Chrome
                  Web Store entirely. Unless you explicitly authorized the software that installed them,
                  they should be treated as suspicious and investigated immediately.
                </li>
                <li>
                  <strong>Extensions with recent ownership changes</strong> — Filter the inventory by
                  &ldquo;Publisher changed in last 90 days&rdquo; to surface acquisitions that may
                  precede a malicious update.
                </li>
                <li>
                  <strong>Unlisted or delisted extensions</strong> — If Chrome Web Store has removed
                  an extension, there is usually a reason. These should be removed from all browsers
                  immediately.
                </li>
                <li>
                  <strong>Extensions used by very few employees for non-critical tasks</strong> — A
                  niche tool used by two people for an optional workflow represents attack surface that
                  is rarely worth keeping.
                </li>
              </ul>
              <div className={s.note}>
                <strong>Tip:</strong> Almost every extension requests permissions that could theoretically
                be abused, so permissions alone are not a sufficient reason to block an extension.
                Focus on the combination: broad host permissions <em>plus</em> sensitive API access
                <em> plus</em> an unverified or recently-changed publisher is the high-risk pattern to
                act on.
              </div>

              <h2 id="step3-allowlist">Step 3 — Create an allowlist to control which extensions can run</h2>
              <p>
                Once you have completed your risk assessment, establish a formal allowlist — a set of
                approved extension IDs that employees are permitted to run. Everything not on the list
                is blocked.
              </p>
              <p>
                In the SecureLint Enterprise admin console, navigate to{" "}
                <strong>Controls → Extension Policy → Allowlist</strong> and add the extension IDs you
                have approved. You can also define a blocklist for specific high-risk extensions you
                want to explicitly prohibit even if not on the known-malicious list.
              </p>
              <p>Two practical approaches to building the initial allowlist:</p>
              <ol>
                <li>
                  <strong>Start from the current inventory (recommended for most teams)</strong> — Add
                  every extension that is currently running to the allowlist, enable blocking for
                  everything else, and then progressively remove extensions that fail your risk
                  assessment. This is the least disruptive approach because no extension is disabled in
                  one go.
                </li>
                <li>
                  <strong>Build a minimal allowlist from scratch</strong> — Define only the extensions
                  that are strictly necessary for business operations and block everything else
                  immediately. More disruptive short-term, but produces a significantly smaller attack
                  surface from day one.
                </li>
              </ol>
              <p>
                When an employee attempts to use a blocked extension, SecureLint displays a
                customizable block screen with your company-branded messaging and a link to your
                extension request workflow. Users can submit a request; the security team reviews and
                approves or rejects it from the admin console.
              </p>

              <h2 id="step4-monitor">Step 4 — Monitor for risky changes on an ongoing basis</h2>
              <p>
                Extension management is not a one-time event. The threat landscape changes every week
                as extensions are acquired, updated, and compromised. Configure SecureLint to alert
                your team on:
              </p>
              <ul>
                <li><strong>New malicious extension detections</strong> — Any extension newly added to the threat intelligence list that is installed in your environment</li>
                <li><strong>Permission escalation on existing extensions</strong> — An extension that requests broader permissions in a new update than it had in the previous version</li>
                <li><strong>Publisher or ownership changes</strong> — Any extension whose update URL or publisher identity has changed since last check</li>
                <li><strong>New sideloaded extensions</strong> — Any extension installed by local software rather than through the Chrome Web Store, especially on managed devices</li>
                <li><strong>Extensions removed from the Web Store</strong> — Any extension in your approved inventory that has been delisted</li>
              </ul>
              <p>
                SecureLint integrates with your SIEM and SOAR via webhook and REST API, so detection
                events can flow directly into your existing Splunk, Datadog, or Elastic incident
                response workflows without any manual export.
              </p>

              <h2 id="additional-tips">Additional security tips for browser extension management</h2>

              <h3>Disable browser profile syncing for extensions on work devices</h3>
              <p>
                By default, Chrome syncs extensions across every browser where a Google profile is
                signed in. This means a malicious extension installed on a personal, less-secure device
                can automatically appear in a work browser the moment a user signs into their Chrome
                profile. Disable extension sync for managed Chrome instances via Google Workspace Admin
                under <strong>Chrome → Settings → Sync</strong>.
              </p>
              <p>
                If you have deployed the SecureLint allowlist, this is less of an issue because
                extensions synced from personal browsers will be blocked on managed devices. But for
                teams that have not yet completed allowlist setup, disabling sync provides an important
                early safeguard.
              </p>

              <h3>Apply the principle of least privilege to extension installs</h3>
              <p>
                Before approving any extension for your allowlist, ask: <em>does this extension need
                access to all websites, or only specific ones?</em> Many extensions work perfectly
                well when their host permissions are restricted to specific domains via{" "}
                <strong>chrome://extensions → Details → Site access → On specific sites</strong>.
                Narrowing host permissions dramatically reduces the blast radius if the extension is
                ever compromised.
              </p>

              <h3>Review development-mode extensions immediately</h3>
              <p>
                Development-mode extensions — loaded from a local folder with Chrome&apos;s developer
                mode enabled — bypass the Chrome Web Store entirely. They may be legitimate (a
                developer testing their own extension) or they may be malicious (an attacker who has
                installed a custom extension via a phishing payload). SecureLint flags these
                automatically. Unless you have explicitly authorized the developer mode extension, treat
                it as a high-priority investigation.
              </p>
            </div>

            {/* ── FAQ ── */}
            <section className={s.faqSection} aria-labelledby="faq">
              <h2 id="faq" className={s.faqTitle}>Frequently asked questions</h2>

              <div className={s.faqItem}>
                <p className={s.faqQ}>How does SecureLint detect malicious browser extensions?</p>
                <p className={s.faqA}>
                  SecureLint cross-references every installed extension against a continuously updated threat
                  intelligence list of known-malicious extension IDs and hashes. It also computes a composite
                  risk score based on permissions, host patterns, publisher identity, install method, and Web
                  Store listing status. Extensions that match known-bad signatures are blocked immediately;
                  high-risk extensions are surfaced for manual review.
                </p>
              </div>

              <div className={s.faqItem}>
                <p className={s.faqQ}>Can SecureLint block an extension that was safe yesterday but turned malicious today?</p>
                <p className={s.faqA}>
                  Yes. SecureLint continuously monitors all installed extensions against live threat intelligence.
                  The moment a previously-trusted extension is flagged — for example because an attacker pushed
                  a compromised update — SecureLint generates a detection event and, if Block mode is enabled,
                  disables the extension across every browser in your organization before it can execute.
                </p>
              </div>

              <div className={s.faqItem}>
                <p className={s.faqQ}>What permissions indicate a particularly risky browser extension?</p>
                <p className={s.faqA}>
                  The highest-risk permission combinations are: <code>&lt;all_urls&gt;</code> host access combined
                  with the <code>cookies</code> API (enables session token theft), <code>webRequest</code> (enables
                  traffic interception), <code>tabs</code> (reads page content), and <code>clipboardRead</code>{" "}
                  (captures copied passwords). SecureLint computes a composite risk score from all permission signals
                  and surfaces the most dangerous extensions first.
                </p>
              </div>

              <div className={s.faqItem}>
                <p className={s.faqQ}>Does SecureLint build an inventory of all installed extensions across my team?</p>
                <p className={s.faqA}>
                  Yes. SecureLint provides a real-time inventory of every extension installed across every browser
                  where the SecureLint extension is deployed. The inventory includes name, ID, version, permissions,
                  host permissions, install method, publisher identity, and Web Store listing status — across all
                  browsers and operating systems in your organization.
                </p>
              </div>

              <div className={s.faqItem}>
                <p className={s.faqQ}>How do I set up an extension allowlist with SecureLint?</p>
                <p className={s.faqA}>
                  In the SecureLint Enterprise admin console, go to Controls → Extension Policy. Add the extension
                  IDs you have approved to the allowlist. Extensions not on the list are blocked from executing, and
                  users see a customizable block screen. The policy is browser-agnostic and does not require MDM or
                  Group Policy configuration — it is enforced directly through the SecureLint extension.
                </p>
              </div>
            </section>

          </article>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
