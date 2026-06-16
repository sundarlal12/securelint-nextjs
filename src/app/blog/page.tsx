import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import s from "./Blog.module.css";

/* ─────────────────────────────────────────────
   SEO METADATA
───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "SecureLint Blog — Browser Security, API Key Masking & Phishing Protection Guides",
  description:
    "Expert guides on API key masking, real-time phishing detection, malicious extension blocking, meeting-mode secret blurring, password breach monitoring, and enterprise browser DLP — all powered by SecureLint.",
  alternates: { canonical: "https://securelint.in/blog" },
  openGraph: {
    type: "website",
    url: "https://securelint.in/blog",
    title: "SecureLint Blog — Browser Security Guides & Tutorials",
    description:
      "Practical guides on keeping API keys, credentials, and sensitive data safe in your browser — meeting mode, phishing detection, download scanning, and more.",
    siteName: "SecureLint",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vaptlabs",
    title: "SecureLint Blog — API Key Masking, Phishing & Browser Security Guides",
    description:
      "Expert guides on real-time secret masking, phishing detection, malicious extension detection, and enterprise browser DLP.",
    images: [{ url: "/og-banner.png" }],
  },
};

/* ─────────────────────────────────────────────
   BLOG POST DATA
   slug → /blog/[slug]  (individual posts TBD)
───────────────────────────────────────────── */
const POSTS = [
  {
    slug: "meeting-mode-blur-secrets-during-video-calls",
    category: "Meeting Mode",
    date: "2026-06-16",
    dateLabel: "Jun 16, 2026",
    readTime: "7 min read",
    title: "Meeting Mode: How SecureLint Blurs Secrets the Second a Video Call Starts",
    excerpt:
      "The moment Zoom, Google Meet, or Teams is detected, SecureLint's Meeting Mode instantly masks API keys, tokens, and credentials across every open tab — so nothing sensitive ever appears on screen during a live demo, interview, or standup.",
    gradient: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)",
    icon: "🎥",
    tag: "Feature Deep-Dive",
  },
  {
    slug: "automatic-api-key-masking-textarea-editor-input",
    category: "Secret Masking",
    date: "2026-06-14",
    dateLabel: "Jun 14, 2026",
    readTime: "6 min read",
    title: "How SecureLint Automatically Masks API Keys in Every Text Editor, Textarea & Input",
    excerpt:
      "SecureLint detects and masks AWS keys, GitHub tokens, Stripe secrets, OpenAI keys, and 100+ more credential patterns in real time — across VS Code Web, CodeSandbox, Notion, Jira, and every input on the web.",
    gradient: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)",
    icon: "🔑",
    tag: "How It Works",
  },
  {
    slug: "realtime-phishing-email-detection-chrome-extension",
    category: "Phishing Detection",
    date: "2026-06-12",
    dateLabel: "Jun 12, 2026",
    readTime: "8 min read",
    title: "Real-Time Phishing Email Detection: How SecureLint Scans Every Message Before You Click",
    excerpt:
      "SecureLint checks SPF, DKIM, and DMARC headers, scores every link against 14 threat signals, fingerprints attachments, and surfaces a clear 0–100 trust score — all before you ever open a suspicious email.",
    gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #b91c1c 100%)",
    icon: "📧",
    tag: "Feature Deep-Dive",
  },
  {
    slug: "how-securelint-detects-blocks-malicious-browser-extensions",
    category: "Extension Security",
    date: "2026-06-10",
    dateLabel: "Jun 10, 2026",
    readTime: "6 min read",
    title: "Malicious Browser Extension Detection: What SecureLint Checks and Why It Matters",
    excerpt:
      "Rogue Chrome extensions silently read your passwords, inject ads, and exfiltrate session cookies. SecureLint audits installed extensions against known malicious signatures and flags permission overreach — protecting you without manual reviews.",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #6d28d9 100%)",
    icon: "🧩",
    tag: "Security Guide",
  },
  {
    slug: "phishing-website-auto-block-before-you-click",
    category: "Link Guard",
    date: "2026-06-08",
    dateLabel: "Jun 8, 2026",
    readTime: "5 min read",
    title: "How SecureLint Automatically Blocks Phishing Websites Before You Land on Them",
    excerpt:
      "SecureLint evaluates domain age, SSL status, brand impersonation score, and URL patterns in real time. When you click a suspicious link — in email or on the web — a popup warning appears before the page loads.",
    gradient: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #c2410c 100%)",
    icon: "🚫",
    tag: "Feature Deep-Dive",
  },
  {
    slug: "it-security-policy-malicious-sites-extensions-enterprise",
    category: "Enterprise",
    date: "2026-06-06",
    dateLabel: "Jun 6, 2026",
    readTime: "7 min read",
    title: "IT Security Policies for Browser Threats: Blocking Malicious Sites & Extensions Across Your Team",
    excerpt:
      "Enterprise SecureLint lets IT admins push policies that block known-malicious domains, restrict extension installs, and trigger real-time incident alerts — without touching endpoint agents or VPN configs.",
    gradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #134e4a 100%)",
    icon: "🏢",
    tag: "Enterprise",
  },
  {
    slug: "malicious-download-scanning-automatic-chrome-extension",
    category: "Download Safety",
    date: "2026-06-04",
    dateLabel: "Jun 4, 2026",
    readTime: "6 min read",
    title: "Automatic Malicious Download Scanning: How SecureLint Checks Files Before You Open Them",
    excerpt:
      "Before a downloaded file lands in your folder, SecureLint checks its hash against known malware signatures, inspects the source domain reputation, and warns you if the file is suspicious — all in under a second.",
    gradient: "linear-gradient(135deg, #b45309 0%, #d97706 50%, #92400e 100%)",
    icon: "📥",
    tag: "Security Guide",
  },
  {
    slug: "webcam-screen-recording-detection-privacy-alert",
    category: "Privacy",
    date: "2026-06-02",
    dateLabel: "Jun 2, 2026",
    readTime: "5 min read",
    title: "Webcam & Screen Recording Detection: How SecureLint Alerts You When a Site Activates Your Camera",
    excerpt:
      "Websites can silently request webcam, microphone, and screen-recording access without obvious indicators. SecureLint surfaces a real-time alert the moment any page activates these permissions — so you always know who's watching.",
    gradient: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 50%, #075985 100%)",
    icon: "📸",
    tag: "Privacy",
  },
  {
    slug: "phishing-link-popup-warning-email-protection",
    category: "Link Guard",
    date: "2026-05-31",
    dateLabel: "May 31, 2026",
    readTime: "6 min read",
    title: "How SecureLint Stops Phishing Links in Emails with Real-Time Popup Warnings",
    excerpt:
      "When you click a link inside Gmail or Outlook, SecureLint silently scores it against domain reputation, SSL status, and brand impersonation signals — then intercepts your click with a clear Unsafe Link Detected popup if the score is too low.",
    gradient: "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #881337 100%)",
    icon: "🔗",
    tag: "How It Works",
  },
  {
    slug: "password-breach-detection-haveibeenpwned-browser",
    category: "Password Security",
    date: "2026-05-29",
    dateLabel: "May 29, 2026",
    readTime: "7 min read",
    title: "Password Breach Monitoring: How SecureLint Detects and Notifies You When Your Credentials Leak",
    excerpt:
      "SecureLint continuously cross-references your saved passwords against live breach databases (including HaveIBeenPwned) and notifies you the moment a credential leak is detected — so you can rotate keys before attackers do.",
    gradient: "linear-gradient(135deg, #166534 0%, #22c55e 50%, #14532d 100%)",
    icon: "🛡️",
    tag: "Security Guide",
  },
  {
    slug: "api-key-leak-prevention-developers-guide-2026",
    category: "Developer Guide",
    date: "2026-05-26",
    dateLabel: "May 26, 2026",
    readTime: "9 min read",
    title: "The Developer's Complete Guide to Preventing API Key Leaks in the Browser (2026)",
    excerpt:
      "API keys accidentally pasted into public repos, Slack messages, or live demos cause massive breaches. This guide covers every vector — and how SecureLint's real-time masking closes them all automatically.",
    gradient: "linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #1e1b4b 100%)",
    icon: "💻",
    tag: "Guide",
  },
  {
    slug: "securelint-enterprise-browser-dlp-review-2026",
    category: "Enterprise DLP",
    date: "2026-05-22",
    dateLabel: "May 22, 2026",
    readTime: "8 min read",
    title: "SecureLint Enterprise Browser DLP: Real-Time Secret Masking, Email DLP & Threat Intelligence (2026)",
    excerpt:
      "A deep-dive into SecureLint's enterprise layer — team-wide DLP rules, email send blocking, admin dashboards, extension allowlists, and SIEM integrations — everything a security team needs to enforce browser data-loss prevention without endpoint agents.",
    gradient: "linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #042f2e 100%)",
    icon: "🏛️",
    tag: "Enterprise",
  },
] as const;

/* ─────────────────────────────────────────────
   JSON-LD — ItemList with BlogPosting entries
───────────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "SecureLint Blog",
  "description": "Guides and tutorials on browser security, API key masking, phishing detection, and enterprise DLP.",
  "url": "https://securelint.in/blog",
  "itemListElement": POSTS.map((p, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "item": {
      "@type": "BlogPosting",
      "headline": p.title,
      "description": p.excerpt,
      "datePublished": p.date,
      "url": `https://securelint.in/blog/${p.slug}`,
      "author": { "@type": "Organization", "name": "SecureLint", "url": "https://securelint.in" },
      "publisher": {
        "@type": "Organization",
        "name": "SecureLint by VAPTLabs",
        "logo": { "@type": "ImageObject", "url": "https://securelint.in/icons/icon-128.png" },
      },
    },
  })),
};

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */
export default function BlogPage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main id="main-content">

        {/* ── Hero ── */}
        <section className={s.hero} aria-labelledby="blog-heading">
          <div className={s.heroInner}>
            <p className={s.overline}>Blog</p>
            <h1 id="blog-heading" className={s.heroTitle}>
              Security guides, deep-dives,{" "}
              <em className={s.heroItalic}>and field notes.</em>
            </h1>
            <p className={s.heroDesc}>
              Practical tutorials on API key masking, real-time phishing detection, malicious extension
              blocking, meeting-mode privacy, and enterprise browser DLP — written by the SecureLint team.
            </p>
          </div>
        </section>

        {/* ── Blog grid ── */}
        <section className={s.grid_section} aria-label="Blog posts">
          <div className={s.gridInner}>
            <div className={s.grid} role="list">
              {POSTS.map((post) => (
                <article key={post.slug} className={s.card} role="listitem">

                  {/* cover banner — gradient with emoji icon */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className={s.coverLink}
                    aria-label={`Read: ${post.title}`}
                    tabIndex={-1}
                  >
                    <div
                      className={s.cover}
                      style={{ background: post.gradient }}
                      aria-hidden="true"
                    >
                      <span className={s.coverIcon}>{post.icon}</span>
                      <span className={s.coverTag}>{post.category}</span>
                    </div>
                  </Link>

                  {/* card body */}
                  <div className={s.cardBody}>
                    <div className={s.meta}>
                      <time dateTime={post.date} className={s.date}>{post.dateLabel}</time>
                      <span className={s.dot} aria-hidden="true">·</span>
                      <span className={s.readTime}>{post.readTime}</span>
                      <span className={s.dot} aria-hidden="true">·</span>
                      <span className={s.tagPill}>{post.tag}</span>
                    </div>

                    <h2 className={s.cardTitle}>
                      <Link href={`/blog/${post.slug}`} className={s.cardTitleLink}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className={s.excerpt}>{post.excerpt}</p>

                    <Link href={`/blog/${post.slug}`} className={s.readMore} aria-label={`Read full article: ${post.title}`}>
                      Read article →
                    </Link>
                  </div>

                </article>
              ))}
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  );
}
