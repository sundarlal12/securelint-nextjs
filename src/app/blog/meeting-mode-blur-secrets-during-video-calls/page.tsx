import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import s from "../[slug]/article.module.css";

/* ─── SEO ──────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Meeting Mode: How SecureLint Blurs Secrets the Second a Video Call Starts — SecureLint Blog",
  description:
    "The moment Zoom, Google Meet, or Teams is detected, SecureLint instantly masks API keys, tokens, and credentials across every open tab — so nothing sensitive appears on screen during a live demo or standup.",
  keywords:
    "meeting mode secret blurring, API key masking screen share, SecureLint meeting mode, hide credentials during zoom call, google meet secret blur, screen share security extension",
  authors: [{ name: "SecureLint Research Team", url: "https://securelint.in" }],
  alternates: { canonical: "https://securelint.in/blog/meeting-mode-blur-secrets-during-video-calls" },
  openGraph: {
    type: "article",
    url: "https://securelint.in/blog/meeting-mode-blur-secrets-during-video-calls",
    title: "Meeting Mode: How SecureLint Blurs Secrets the Second a Video Call Starts",
    description:
      "SecureLint detects Zoom, Google Meet, and Teams — then instantly blurs API keys, tokens, and credentials across every open tab. Automatic, zero-config.",
    publishedTime: "2026-06-16",
    authors: ["SecureLint Research Team"],
    siteName: "SecureLint",
    images: [{ url: "https://securelint.in/og-banner.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meeting Mode: How SecureLint Blurs Secrets the Second a Video Call Starts",
    description:
      "Zoom detected → SecureLint instantly blurs API keys, tokens, DB passwords across every open tab. Zero config. Always on.",
    images: ["https://securelint.in/og-banner.png"],
  },
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "Meeting Mode: How SecureLint Blurs Secrets the Second a Video Call Starts",
  description: "The moment Zoom, Google Meet, or Teams is detected, SecureLint instantly masks API keys, tokens, and credentials across every open tab.",
  datePublished: "2026-06-16", dateModified: "2026-06-16",
  image: "https://securelint.in/og-banner.png",
  author: { "@type": "Organization", name: "SecureLint Research Team", url: "https://securelint.in" },
  publisher: { "@type": "Organization", name: "SecureLint by VAPTLabs", logo: { "@type": "ImageObject", url: "https://securelint.in/icons/icon-128.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://securelint.in/blog/meeting-mode-blur-secrets-during-video-calls" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": "https://securelint.in" } },
    { "@type": "ListItem", position: 2, name: "Blog", item: { "@type": "WebPage", "@id": "https://securelint.in/blog" } },
    { "@type": "ListItem", position: 3, name: "Meeting Mode", item: { "@type": "WebPage", "@id": "https://securelint.in/blog/meeting-mode-blur-secrets-during-video-calls" } },
  ],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Which video call apps does SecureLint Meeting Mode detect?",
      acceptedAnswer: { "@type": "Answer", text: "SecureLint Meeting Mode detects Zoom Web Client, Google Meet (meet.google.com), Microsoft Teams (teams.microsoft.com), Webex, Jitsi Meet, and any site that simultaneously requests camera and microphone permissions." } },
    { "@type": "Question", name: "What types of secrets does SecureLint blur in Meeting Mode?",
      acceptedAnswer: { "@type": "Answer", text: "SecureLint blurs AWS access and secret keys, GitHub personal access tokens, Stripe live secret keys, OpenAI project keys, Razorpay keys, Jira API tokens, database connection strings, JWT tokens, SSH private key blocks, and 100+ other credential patterns — all identified locally in the browser with no server communication." } },
    { "@type": "Question", name: "Does SecureLint record my screen or send data anywhere?",
      acceptedAnswer: { "@type": "Answer", text: "No. SecureLint runs entirely on-device using a local regex engine inside the browser extension. Nothing from your screen, open tabs, or credentials is ever captured, uploaded, or transmitted to any server." } },
    { "@type": "Question", name: "Does the blur automatically lift when my meeting ends?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The moment the call tab closes or camera/microphone permissions are revoked, all blur overlays are removed and your tabs return to normal within about 5 seconds." } },
    { "@type": "Question", name: "Can I override Meeting Mode during a call?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Click the SecureLint extension icon and choose Pause Meeting Mode for 10 minutes. A warning badge in the toolbar reminds you that secrets are temporarily exposed. Meeting Mode re-arms automatically when the 10-minute window expires." } },
  ],
};

const TOC = [
  { id: "what-is-meeting-mode",     label: "What is SecureLint Meeting Mode?" },
  { id: "how-call-detection-works", label: "How call detection works" },
  { id: "what-gets-blurred",        label: "What gets blurred" },
  { id: "technical-blur-engine",    label: "How the blur engine works technically" },
  { id: "setup-meeting-mode",       label: "Setting up Meeting Mode" },
  { id: "when-blur-lifts",          label: "When the blur lifts automatically" },
  { id: "meeting-mode-vs-manual",   label: "Meeting Mode vs manually hiding tabs" },
  { id: "faq",                      label: "Frequently asked questions" },
];

/* ─── Page ────────────────────────────────────────────────── */
export default function MeetingModeBlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}/>

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
              {/* Author row — appears above the title, matching reference */}
              <address className={s.authorRow} aria-label="Author and publication info">
                <div className={s.avatar}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://securelint.in/icons/icon-128.png"
                    alt="SecureLint"
                    className={s.avatarImg}
                  />
                </div>
                <div className={s.authorInfo}>
                  <p className={s.authorName}>SecureLint Research Team</p>
                  <p className={s.authorRole}>VAPTLabs Security Research</p>
                  <div className={s.authorMeta}>
                    <time dateTime="2026-06-16">Jun 16, 2026</time>
                    <span>·</span>
                    <span>7 min read</span>
                  </div>
                </div>
              </address>

              <h1 className={s.h1}>
                Meeting Mode: How SecureLint Blurs Secrets the Second a Video Call Starts
              </h1>
            </header>

            {/* Cover — real SVG banner */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/securelint_banner_diagonal.svg"
              alt="SecureLint Meeting Mode — blur secrets during screen share"
              className={s.articleBannerImg}
            />

            {/* ── Article Body ── */}
            <div className={s.prose}>

              <p>
                You are sharing your screen on a Google Meet call, walking a new client through your
                dashboard, when a teammate spots something in the background: a long string of characters
                in an open tab. An AWS access key. Or a Stripe secret. Or a database connection string.
                It happens in seconds and you don&apos;t notice until someone asks,{" "}
                <em>&ldquo;is that your production key?&rdquo;</em>
              </p>
              <p>
                <strong>SecureLint Meeting Mode</strong> exists precisely to close this gap. The moment
                the extension detects an active video call, it automatically blurs every sensitive
                credential it can find across all your open browser tabs — before a single pixel reaches
                the screen share stream. When the meeting ends, the blur lifts. No manual toggles, no
                closing tabs, no pre-call checklists.
              </p>

              <h2 id="what-is-meeting-mode">What is SecureLint Meeting Mode?</h2>
              <p>
                Meeting Mode is SecureLint&apos;s automatic privacy layer that activates in response to an
                active video call. Unlike generic screen-sharing tips that ask you to manually close
                sensitive tabs before each call, Meeting Mode works the other way round: it masks data
                in place so you never have to choose between having the right tools open and keeping
                secrets off the screen.
              </p>
              <p>
                When a call is detected, SecureLint overlays a blur on every DOM element whose visible
                text matches a known credential pattern — API keys, database passwords, tokens, and
                card numbers. The blur is applied client-side, inside the browser extension, with zero
                network round-trips. From the outside, your screen share shows blurred placeholders
                where secrets would be. Your own view is identical to your colleagues&apos; — a constant
                reminder that the masking is active.
              </p>

              <h2 id="how-call-detection-works">How SecureLint detects an active video call</h2>
              <p>
                SecureLint watches two independent signals inside the browser extension manifest, both
                of which stay entirely on-device:
              </p>
              <ol>
                <li>
                  <strong>Tab URL and title patterns</strong> — SecureLint maintains a fast regex index
                  of known meeting URLs: <code>meet.google.com/*</code>, <code>zoom.us/wc/*</code>,{" "}
                  <code>teams.microsoft.com/*</code>, <code>app.webex.com/*</code>,{" "}
                  <code>*.jitsi.org/*</code>, and several others. Any tab matching these patterns flips
                  Meeting Mode on within milliseconds.
                </li>
                <li>
                  <strong>Camera and microphone permission grants</strong> — A video call almost always
                  requests camera and microphone access. SecureLint listens to the browser&apos;s
                  permissions API. When a page is granted both camera <em>and</em> microphone access,
                  Meeting Mode activates for that session even if the URL is not on the known list — for
                  example, a custom enterprise video tool on a private subdomain.
                </li>
              </ol>
              <div className={s.note}>
                <strong>Privacy note:</strong> No audio, video, or screen content is ever read,
                captured, or transmitted by SecureLint. The extension only reads tab metadata (URL,
                title) and permission state — both are local browser signals.
              </div>

              <h2 id="what-gets-blurred">What gets blurred during a meeting</h2>
              <p>
                SecureLint&apos;s detection engine covers more than 100 credential patterns across every
                major cloud and SaaS platform:
              </p>
              <ul>
                <li><strong>Cloud provider keys</strong> — AWS Access Keys (<code>AKIA…</code>), AWS Secret Access Keys, GCP service account JSON, Azure client secrets</li>
                <li><strong>Source control tokens</strong> — GitHub personal access tokens (<code>ghp_…</code>), GitLab personal tokens, Bitbucket app passwords</li>
                <li><strong>Payment gateway secrets</strong> — Stripe live secret keys (<code>sk_live_…</code>), Stripe restricted keys, Razorpay key_secret values</li>
                <li><strong>AI platform keys</strong> — OpenAI API keys (<code>sk-proj-…</code>), Anthropic API keys, Cohere keys</li>
                <li><strong>Project management tokens</strong> — Jira API tokens, Atlassian OAuth secrets, Linear API keys, Notion integration tokens</li>
                <li><strong>Database credentials</strong> — PostgreSQL and MySQL connection strings, MongoDB Atlas URIs, Redis AUTH strings</li>
                <li><strong>Auth tokens</strong> — JWT tokens (three dot-separated base64 segments), OAuth access and refresh tokens</li>
                <li><strong>Private keys</strong> — PEM-encoded RSA and ECDSA private keys, SSH private key blocks</li>
                <li><strong>Payment card numbers</strong> — Luhn-validated 13–19 digit card numbers not inside a <code>type=&quot;password&quot;</code> field</li>
              </ul>
              <p>
                Patterns are matched against the rendered text content of every visible element on the
                page as well as input field values that are not of type <code>password</code>. The match
                runs against the DOM, not raw HTTP responses, so it works on single-page apps,
                dashboards loaded via AJAX, and server-side-rendered pages alike.
              </p>

              <h2 id="technical-blur-engine">How the blur engine works technically</h2>
              <p>
                When Meeting Mode activates, SecureLint performs the following steps on each open tab:
              </p>
              <ol>
                <li>
                  <strong>DOM traversal</strong> — A content script walks the live DOM collecting all
                  text nodes and input values. It skips <code>script</code>, <code>style</code>,{" "}
                  <code>noscript</code>, and <code>template</code> elements.
                </li>
                <li>
                  <strong>Pattern matching</strong> — Each text node is tested against a compiled regex
                  set. The engine is greedy: it matches the longest possible token that looks like a
                  credential and ignores surrounding prose.
                </li>
                <li>
                  <strong>Overlay injection</strong> — Matched nodes receive a{" "}
                  <code>data-sl-masked</code> attribute and SecureLint injects a{" "}
                  <code>::before</code> pseudo-element via a dynamically inserted stylesheet that
                  renders a solid blur overlay on top of the matched text. The underlying DOM text is
                  unchanged — only the visual presentation is altered.
                </li>
                <li>
                  <strong>Mutation observer</strong> — A <code>MutationObserver</code> watches for new
                  content added to the DOM (lazy-loaded panels, WebSocket pushes) and re-runs the
                  pattern matcher on added nodes, ensuring secrets that appear after page load are also
                  blurred.
                </li>
                <li>
                  <strong>Cleanup on call end</strong> — When the meeting tab closes or permissions are
                  revoked, SecureLint removes the injected stylesheet and clears all{" "}
                  <code>data-sl-masked</code> attributes, restoring the page to its original state.
                </li>
              </ol>

              <h2 id="setup-meeting-mode">Setting up Meeting Mode in SecureLint</h2>
              <p>Meeting Mode requires no configuration. It is enabled by default after you install the SecureLint Chrome extension:</p>
              <div className={s.checklist}>
                <ul>
                  <li><span className={s.checkIcon}>✅</span><span>Install SecureLint from the Chrome Web Store and pin the extension to your toolbar.</span></li>
                  <li><span className={s.checkIcon}>✅</span><span>Click the SecureLint icon and confirm Meeting Mode shows as <strong>On</strong> in the settings panel.</span></li>
                  <li><span className={s.checkIcon}>✅</span><span>Open a Google Meet or Zoom tab. A green indicator in the SecureLint toolbar icon confirms the call was detected.</span></li>
                  <li><span className={s.checkIcon}>✅</span><span>Switch to any tab containing API keys or credentials. Sensitive values are overlaid with blur masks.</span></li>
                  <li><span className={s.checkIcon}>✅</span><span>End the call. All blur overlays clear automatically within two seconds of the meeting tab closing.</span></li>
                </ul>
              </div>
              <p>
                For enterprise deployments, IT admins can enforce Meeting Mode as a non-overrideable
                policy via the SecureLint admin console, preventing employees from accidentally
                disabling it before a call.
              </p>

              <h2 id="when-blur-lifts">When the blur lifts automatically</h2>
              <p>
                SecureLint lifts the blur when <em>any</em> of the following is true:
              </p>
              <ul>
                <li>The meeting tab (Google Meet, Zoom, Teams) is closed.</li>
                <li>The meeting tab navigates away from the call URL (e.g., back to the Google Meet home screen).</li>
                <li>The page that held camera/microphone permission is unloaded or the permissions are revoked.</li>
                <li>You manually click <strong>Pause Meeting Mode</strong> in the SecureLint panel (the blur lifts for 10 minutes, then re-arms automatically).</li>
              </ul>
              <p>
                The state machine is evaluated every 3 seconds in the background service worker, so the
                maximum lag between a call ending and the blur lifting is under 5 seconds in practice.
              </p>

              <h2 id="meeting-mode-vs-manual">Meeting Mode vs manually hiding tabs</h2>
              <p>
                The conventional advice is: close sensitive tabs before a call. That advice works until
                you need those tabs open to do your job — a developer on a support call needs the
                production console open, a founder doing a live demo needs the real Stripe dashboard.
              </p>
              <p>
                Manual tab management also fails in two predictable ways:
              </p>
              <ol>
                <li>
                  <strong>The unexpected call</strong> — Someone shares a Slack Huddle link
                  mid-conversation and you join before you have time to sweep your tabs.
                </li>
                <li>
                  <strong>New content after the call starts</strong> — A CI/CD system pushes a
                  deployment key to a dashboard tab that was already open and &ldquo;safe&rdquo; when
                  you started sharing.
                </li>
              </ol>
              <p>
                Meeting Mode handles both. It is always watching, it activates instantly, and it covers
                dynamic content that appears after the call begins. You keep every tab open that you
                need, and SecureLint makes sure none of the credentials in them reach the screen share.
              </p>
            </div>

            {/* ── FAQ ── */}
            <section className={s.faqSection} aria-labelledby="faq">
              <h2 id="faq" className={s.faqTitle}>Frequently asked questions</h2>

              <div className={s.faqItem}>
                <p className={s.faqQ}>Which video call apps does SecureLint Meeting Mode detect?</p>
                <p className={s.faqA}>SecureLint Meeting Mode detects Zoom Web Client, Google Meet, Microsoft Teams, Webex, Jitsi Meet, and any site that requests camera and microphone permissions simultaneously. When any of these are active in a tab, secrets across all your other open tabs are immediately blurred.</p>
              </div>

              <div className={s.faqItem}>
                <p className={s.faqQ}>What types of secrets does SecureLint blur in Meeting Mode?</p>
                <p className={s.faqA}>SecureLint blurs AWS access and secret keys, GitHub personal access tokens, Stripe live secret keys, OpenAI project keys, Razorpay keys, Jira API tokens, database connection strings, JWT tokens, SSH private key blocks, and 100+ other credential patterns — all identified in real time locally in the browser.</p>
              </div>

              <div className={s.faqItem}>
                <p className={s.faqQ}>Does SecureLint record my screen or send data anywhere?</p>
                <p className={s.faqA}>No. SecureLint runs entirely on-device using a local regex engine inside the browser extension. Nothing from your screen, open tabs, or credentials is ever captured, uploaded, or transmitted to any server.</p>
              </div>

              <div className={s.faqItem}>
                <p className={s.faqQ}>Does the blur automatically lift when my meeting ends?</p>
                <p className={s.faqA}>Yes. SecureLint continuously watches for the meeting tab to close or for camera/microphone permissions to be revoked. The moment the call ends, all blur overlays are removed and your browser tabs return to normal visibility automatically — within about 5 seconds.</p>
              </div>

              <div className={s.faqItem}>
                <p className={s.faqQ}>Can I override Meeting Mode during a call?</p>
                <p className={s.faqA}>Yes. Click the SecureLint extension icon and choose Pause Meeting Mode for 10 minutes. A visible warning badge in the toolbar reminds you that secrets are temporarily exposed. Meeting Mode re-arms automatically when the window expires or when a new meeting is detected.</p>
              </div>
            </section>

          </article>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
