import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import s from "../[slug]/article.module.css";

export const metadata: Metadata = {
  title: "Webcam & Screen Recording Detection: How SecureLint Alerts You When a Site Activates Your Camera — SecureLint Blog",
  description: "Websites can silently request webcam, microphone, and screen-recording access. SecureLint surfaces a real-time alert the moment any page activates these permissions — so you always know who's watching.",
  keywords: "webcam detection browser extension, screen recording alert chrome, camera access notification, microphone permission alert, securelint privacy alert, browser camera spy detection",
  authors: [{ name: "SecureLint Research Team", url: "https://securelint.in" }],
  alternates: { canonical: "https://securelint.in/blog/webcam-screen-recording-detection-privacy-alert" },
  openGraph: {
    type: "article", url: "https://securelint.in/blog/webcam-screen-recording-detection-privacy-alert",
    title: "Webcam & Screen Recording Detection: How SecureLint Alerts You When a Site Activates Your Camera",
    description: "Real-time alert the moment any site activates your webcam, microphone, or screen recording permission.",
    publishedTime: "2026-06-02", siteName: "SecureLint",
    images: [{ url: "https://securelint.in/og-banner.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://securelint.in/og-banner.png"],
    title: "Webcam & Screen Recording Detection — SecureLint",
    description: "Instant alert when any website activates your camera, mic, or screen recording." },
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "Webcam & Screen Recording Detection: How SecureLint Alerts You When a Site Activates Your Camera",
  description: "SecureLint surfaces real-time alerts the moment any page activates webcam, microphone, or screen-recording permissions.",
  datePublished: "2026-06-02", dateModified: "2026-06-02",
  image: "https://securelint.in/og-banner.png",
  author: { "@type": "Organization", name: "SecureLint Research Team", url: "https://securelint.in" },
  publisher: { "@type": "Organization", name: "SecureLint by VAPTLabs", logo: { "@type": "ImageObject", url: "https://securelint.in/icons/icon-128.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://securelint.in/blog/webcam-screen-recording-detection-privacy-alert" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": "https://securelint.in" } },
    { "@type": "ListItem", position: 2, name: "Blog", item: { "@type": "WebPage", "@id": "https://securelint.in/blog" } },
    { "@type": "ListItem", position: 3, name: "Webcam Detection", item: { "@type": "WebPage", "@id": "https://securelint.in/blog/webcam-screen-recording-detection-privacy-alert" } },
  ],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can a website activate my webcam without showing the browser permission prompt?",
      acceptedAnswer: { "@type": "Answer", text: "Not on first request — Chrome always shows a permission prompt the first time a site requests camera or microphone access. However, once you have granted permission to a site, it can reactivate the camera on subsequent visits without showing another prompt. SecureLint detects this silent reactivation and alerts you every time the camera is accessed, regardless of whether a permission prompt appeared." } },
    { "@type": "Question", name: "Does SecureLint block webcam and microphone access entirely?",
      acceptedAnswer: { "@type": "Answer", text: "No. SecureLint alerts and logs camera/microphone activations but does not block them by default. If you want to revoke access after receiving an alert, SecureLint provides a one-click button to revoke the site's camera and microphone permissions from the alert notification. Enterprise admins can configure SecureLint to block camera access on specific domains or domains not in an approved list." } },
    { "@type": "Question", name: "How is SecureLint's detection different from the Chrome camera indicator light?",
      acceptedAnswer: { "@type": "Answer", text: "Chrome's camera indicator (the dot in the address bar) shows that the camera is in use but gives no context about why or which page activated it. SecureLint provides: the specific page URL that activated the camera, whether the domain has been granted persistent permission, a risk score for the activating domain, and a log of all camera activations for audit purposes. It also alerts in real time via a visible notification, not just a subtle address bar icon." } },
  ],
};

const TOC = [
  { id: "the-silent-camera-problem",     label: "The silent camera activation problem" },
  { id: "how-detection-works",           label: "How SecureLint detects camera/mic activation" },
  { id: "screen-recording",              label: "Screen recording and tab capture detection" },
  { id: "what-the-alert-shows",          label: "What the real-time alert shows" },
  { id: "enterprise-controls",           label: "Enterprise camera access controls" },
  { id: "setup",                         label: "Setting up webcam detection" },
  { id: "faq",                           label: "Frequently asked questions" },
];

export default function WebcamDetectionPage() {
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
                <div className={s.authorMeta}><time dateTime="2026-06-02">Jun 2, 2026</time><span>·</span><span>5 min read</span></div>
              </div>
            </address>
            <h1 className={s.h1}>Webcam &amp; Screen Recording Detection: How SecureLint Alerts You When a Site Activates Your Camera</h1>
          </header>

          <div className={s.coverBanner} style={{ background: "linear-gradient(135deg,#075985 0%,#0284c7 60%,#0c4a6e 100%)" }} aria-hidden="true">
            <span className={s.coverBannerDeco1} style={{ background: "#7dd3fc" }} />
            <span className={s.coverBannerDeco2} style={{ background: "#7dd3fc" }} />
            <span className={s.coverBannerText}>Webcam &amp; Recording Alert<br /><span style={{ color: "#7dd3fc" }}>Know Who&apos;s Watching</span></span>
          </div>

          <div className={s.prose}>
            <p>Your laptop camera activates. The indicator light — if your device even has one — flickers on. Is it a legitimate video conferencing tool, or is it a web page that silently requested camera access while you were distracted? Most people would never know. <strong>SecureLint</strong> makes sure you always know exactly which site has activated your camera, microphone, or screen recording permission — and surfaces that information the instant it happens.</p>

            <h2 id="the-silent-camera-problem">The silent camera activation problem</h2>
            <p>Chrome requires a user permission prompt the first time a site requests camera or microphone access — but that is the only gate. Once you have granted a site permission, it can:</p>
            <ul>
              <li>Reactivate the camera on every subsequent visit without prompting you again</li>
              <li>Start the camera stream in a background tab that is not currently visible</li>
              <li>Activate the microphone independently of the camera using the same previously-granted permission</li>
              <li>Request screen capture through the <code>getDisplayMedia</code> API — which does show a picker dialog, but only until the user selects a source, after which the stream runs silently</li>
            </ul>
            <p>Malicious sites exploit this by requesting camera or microphone access under a legitimate-seeming pretense (a fake support chat, a fake online exam proctoring tool, a fake webcam test), then using the persistent permission to capture media on subsequent visits. The browser provides no persistent notification that a stream is active in a background tab.</p>

            <h2 id="how-detection-works">How SecureLint detects camera and microphone activation</h2>
            <p>SecureLint monitors the browser&apos;s permissions API in real time. Specifically, it watches for:</p>
            <ul>
              <li>The <code>camera</code> permission state changing to <code>granted</code> on any page</li>
              <li>The <code>microphone</code> permission state changing to <code>granted</code> on any page</li>
              <li>Any page that holds both <code>camera</code> and <code>microphone</code> permissions simultaneously (strong meeting/surveillance signal)</li>
              <li>Camera or microphone activations on pages outside of the known video conferencing URL list (meets.google.com, zoom.us, teams.microsoft.com, etc.) — a potential indicator of surveillance-ware</li>
            </ul>
            <p>The detection runs as a background service worker that polls permission states across all open tabs every 3 seconds. When a camera activation is detected, SecureLint fires a real-time notification within 3 seconds of the stream starting.</p>

            <h2 id="screen-recording">Screen recording and tab capture detection</h2>
            <p>Beyond the camera, SecureLint also monitors for screen and tab capture activity:</p>
            <ul>
              <li><strong>Screen capture (<code>getDisplayMedia</code>)</strong> — Any page that successfully captures the screen, a window, or a tab is logged. SecureLint records the capturing page URL and the type of capture surface selected.</li>
              <li><strong>Tab capture via extension API</strong> — Browser extensions can capture the content of any tab using the <code>tabCapture</code> API. SecureLint flags extensions that use this API and do not match known legitimate video conferencing tools.</li>
              <li><strong>Invisible iframes capturing media</strong> — A technique where a hidden <code>0×0</code> pixel iframe requests camera access on behalf of a parent page. SecureLint flags camera activations from invisible or off-screen elements.</li>
            </ul>
            <div className={s.note}>
              <strong>Note on Meeting Mode:</strong> SecureLint&apos;s Meeting Mode feature uses camera and microphone permission detection as one of its signals for activating credential blurring. The same detection engine that powers privacy alerts also powers Meeting Mode — so you get both protections from a single mechanism.
            </div>

            <h2 id="what-the-alert-shows">What the real-time alert shows</h2>
            <p>When SecureLint detects a camera, microphone, or screen recording activation, it fires a notification that includes:</p>
            <ul>
              <li><strong>The activating page URL</strong> — The exact page that started the media stream</li>
              <li><strong>The permission type</strong> — Camera, microphone, or screen recording</li>
              <li><strong>Domain risk score</strong> — Whether the activating domain is trusted (known video conferencing tool) or suspicious (young domain, phishing category)</li>
              <li><strong>One-click revoke</strong> — A button to immediately revoke the site&apos;s camera and microphone permissions without opening browser settings</li>
              <li><strong>Timestamp and duration</strong> — When the stream started and how long it has been active</li>
            </ul>

            <h2 id="enterprise-controls">Enterprise camera access controls</h2>
            <p>SecureLint Enterprise admins can configure camera and microphone access policies:</p>
            <ul>
              <li><strong>Camera access audit log</strong> — All camera activations across every employee browser are logged to the admin console with employee identity, activating URL, and duration</li>
              <li><strong>Approved site list</strong> — Define a list of domains that are approved for camera access (e.g. meet.google.com, zoom.us). Activations outside this list generate a High severity detection event</li>
              <li><strong>Auto-revoke on suspicious domains</strong> — For domains outside the approved list with a risk score above a configurable threshold, SecureLint automatically revokes camera permission without waiting for user action</li>
            </ul>

            <h2 id="setup">Setting up webcam detection in SecureLint</h2>
            <div className={s.checklist}>
              <ul>
                <li><span className={s.checkIcon}>✅</span><span>Install SecureLint from the Chrome Web Store. Camera and microphone detection is enabled by default.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>The next time any site activates your camera or microphone, SecureLint fires a notification within 3 seconds showing the activating URL and risk score.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Review your permission history in the SecureLint panel — it lists every site that has active camera or microphone permission in your browser.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Use the one-click revoke button in the notification or the SecureLint panel to remove camera access from any suspicious site instantly.</span></li>
              </ul>
            </div>
          </div>

          <section className={s.faqSection} aria-labelledby="faq">
            <h2 id="faq" className={s.faqTitle}>Frequently asked questions</h2>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Can a website activate my webcam without showing the browser permission prompt?</p>
              <p className={s.faqA}>Not on first request — Chrome always prompts. But once a site has been granted permission, it can reactivate the camera on subsequent visits without prompting again. SecureLint detects this silent reactivation and alerts you every time the camera is accessed, even without a new permission prompt.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Does SecureLint block webcam and microphone access entirely?</p>
              <p className={s.faqA}>No — SecureLint alerts and logs activations by default. You can revoke access with one click from the alert notification. Enterprise admins can configure auto-revoke for domains outside an approved list.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>How is SecureLint's detection different from the Chrome camera indicator light?</p>
              <p className={s.faqA}>Chrome&apos;s indicator shows that the camera is in use but gives no context about which page, why, or whether the domain is suspicious. SecureLint provides the activating URL, domain risk score, activation history, and one-click revoke — in a visible notification, not a subtle address bar icon.</p>
            </div>
          </section>
        </article>
      </div></div>
      <SiteFooter />
    </>
  );
}
