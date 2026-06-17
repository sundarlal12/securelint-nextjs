import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import s from "../[slug]/article.module.css";

export const metadata: Metadata = {
  title: "How SecureLint Automatically Masks API Keys in Every Text Editor, Textarea & Input — SecureLint Blog",
  description: "SecureLint detects AWS keys, GitHub tokens, Stripe secrets, OpenAI keys, and 100+ credential patterns in real time — across VS Code Web, CodeSandbox, Notion, Jira, and every input on the web.",
  keywords: "api key masking browser, auto mask secrets textarea, credential detection chrome extension, securelint api key, mask aws key browser, hide stripe secret browser",
  authors: [{ name: "SecureLint Research Team", url: "https://securelint.in" }],
  alternates: { canonical: "https://securelint.in/blog/automatic-api-key-masking-textarea-editor-input" },
  openGraph: {
    type: "article", url: "https://securelint.in/blog/automatic-api-key-masking-textarea-editor-input",
    title: "How SecureLint Automatically Masks API Keys in Every Text Editor, Textarea & Input",
    description: "100+ credential patterns detected and masked in real time — across VS Code Web, Notion, Jira, and every web input. Zero config.",
    publishedTime: "2026-06-14", siteName: "SecureLint",
    images: [{ url: "https://securelint.in/og-banner.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://securelint.in/og-banner.png"],
    title: "Auto-Mask API Keys in Every Browser Input — SecureLint",
    description: "AWS, Stripe, GitHub, OpenAI keys detected and masked in real time across all web editors and inputs." },
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "How SecureLint Automatically Masks API Keys in Every Text Editor, Textarea & Input",
  description: "SecureLint detects 100+ credential patterns and masks them in real time across every web editor and textarea.",
  datePublished: "2026-06-14", dateModified: "2026-06-14",
  image: "https://securelint.in/og-banner.png",
  author: { "@type": "Organization", name: "SecureLint Research Team", url: "https://securelint.in" },
  publisher: { "@type": "Organization", name: "SecureLint by VAPTLabs", logo: { "@type": "ImageObject", url: "https://securelint.in/icons/icon-128.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://securelint.in/blog/automatic-api-key-masking-textarea-editor-input" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": "https://securelint.in" } },
    { "@type": "ListItem", position: 2, name: "Blog", item: { "@type": "WebPage", "@id": "https://securelint.in/blog" } },
    { "@type": "ListItem", position: 3, name: "Auto-Mask API Keys", item: { "@type": "WebPage", "@id": "https://securelint.in/blog/automatic-api-key-masking-textarea-editor-input" } },
  ],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Which editors does SecureLint auto-masking work in?",
      acceptedAnswer: { "@type": "Answer", text: "SecureLint masks credentials in VS Code Web (vscode.dev), CodeSandbox, StackBlitz, Replit, GitHub web editor, Notion, Confluence, Jira, Linear, Slack, and any standard <textarea> or contenteditable element on the web." } },
    { "@type": "Question", name: "Does SecureLint send my code or credentials to any server?",
      acceptedAnswer: { "@type": "Answer", text: "No. All pattern matching runs locally inside the browser extension using a compiled regex engine. Your code, credentials, and typed text never leave your device." } },
    { "@type": "Question", name: "What credential types does SecureLint detect?",
      acceptedAnswer: { "@type": "Answer", text: "SecureLint detects 100+ patterns including AWS access and secret keys, GitHub PATs, GitLab tokens, Stripe live keys, OpenAI keys, Anthropic keys, Razorpay secrets, Jira API tokens, database connection strings (PostgreSQL, MySQL, MongoDB), JWT tokens, SSH private keys, and Azure client secrets." } },
  ],
};

const TOC = [
  { id: "the-problem", label: "The accidental credential exposure problem" },
  { id: "how-masking-works", label: "How SecureLint masking works" },
  { id: "supported-editors", label: "Supported editors and inputs" },
  { id: "credential-patterns", label: "Credential patterns detected" },
  { id: "setup", label: "Setting up auto-masking" },
  { id: "faq", label: "Frequently asked questions" },
];

export default function ApiKeyMaskingPage() {
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
                <div className={s.authorMeta}><time dateTime="2026-06-14">Jun 14, 2026</time><span>·</span><span>6 min read</span></div>
              </div>
            </address>
            <h1 className={s.h1}>How SecureLint Automatically Masks API Keys in Every Text Editor, Textarea &amp; Input</h1>
          </header>

          {/*           {/* Animated SVG banner — must use <object> so SMIL <animate> plays */}
          <object
            data="/securelint_banner_apikey_animated.svg"
            type="image/svg+xml"
            aria-label="SecureLint — Automatic API Key Masking"
            className={s.articleBannerImg}
            style={{ pointerEvents: "none" }}
          /> */}

<img
              src="/securelint_banner_apikey_animated.svg"
              alt="How SecureLint Automatically Masks API Keys in Every Text Editor, Textarea & Input"
              className={s.articleBannerImg}
            />

          <div className={s.prose}>
            <p>You paste an AWS access key into a Notion doc to share with a teammate. You type a Stripe secret key into a Jira ticket description. You copy a database connection string into a Slack message. Each of these actions takes less than five seconds — and each one can cause a breach that takes months to contain.</p>
            <p><strong>SecureLint&apos;s automatic credential masking</strong> catches these moments the instant they happen. The moment a credential pattern appears in any text editor, textarea, or input field in your browser, SecureLint overlays it with a masked placeholder — without interrupting your workflow, and without sending a single byte of your data anywhere.</p>

            <h2 id="the-problem">The accidental credential exposure problem</h2>
            <p>Accidental credential exposure is one of the most common causes of cloud breaches. The patterns are consistent:</p>
            <ul>
              <li>A developer pastes an API key into a team chat to quickly share it, forgetting the channel is public or logged</li>
              <li>A secret is left in a Notion page, a Confluence doc, or a Linear issue — tools that are often shared with contractors or broadly visible across the organisation</li>
              <li>A connection string is typed into a web-based terminal or cloud shell that logs session output</li>
              <li>A credential is accidentally included in a commit message or PR description in the GitHub web editor</li>
            </ul>
            <p>Traditional secret scanning tools catch credentials in code repositories — but they only fire after a commit, and they have no visibility into your browser-based collaboration tools at all. SecureLint fills this gap by operating at the browser layer, where the exposure actually happens.</p>

            <h2 id="how-masking-works">How SecureLint credential masking works</h2>
            <p>SecureLint injects a lightweight content script into every page you visit. The script does three things continuously:</p>
            <ol>
              <li><strong>Input monitoring</strong> — A <code>MutationObserver</code> and input event listeners watch every <code>&lt;textarea&gt;</code>, <code>contenteditable</code> element, and <code>&lt;input type="text"&gt;</code> on the page. When text changes, the new content is passed to the pattern engine.</li>
              <li><strong>Pattern matching</strong> — The content is tested against a compiled set of over 100 credential regexes. Matching runs locally inside the extension sandbox — no network call is made at any point.</li>
              <li><strong>Overlay injection</strong> — When a match is found, SecureLint injects a visual mask overlay on the matched text. The underlying value in the DOM is not altered — only the rendered display is changed. This ensures form submission, copy-paste, and developer tools still see the real value when needed.</li>
            </ol>
            <div className={s.note}>
              <strong>Privacy guarantee:</strong> SecureLint&apos;s pattern engine runs entirely on-device. Your keystrokes, credentials, and page content are never sent to SecureLint servers or any third party. The extension has no remote logging, no telemetry on page content, and no cloud processing pipeline.
            </div>

            <h2 id="supported-editors">Supported editors and input surfaces</h2>
            <p>SecureLint masks credentials across every standard web input surface, including:</p>
            <ul>
              <li><strong>Web-based code editors</strong> — VS Code for the Web (vscode.dev), GitHub.dev, CodeSandbox, StackBlitz, Replit, Google Cloud Shell Editor</li>
              <li><strong>Project management tools</strong> — Jira issue descriptions, Linear issue bodies, Notion pages, Confluence wiki pages, Asana task descriptions</li>
              <li><strong>Communication tools</strong> — Slack message composer, Microsoft Teams message input, Discord message box</li>
              <li><strong>Version control web UIs</strong> — GitHub PR descriptions, commit messages (web editor), GitLab MR descriptions, Bitbucket PR bodies</li>
              <li><strong>Any standard HTML textarea</strong> — If the element is a <code>&lt;textarea&gt;</code> or a <code>contenteditable</code> div, SecureLint watches it</li>
            </ul>

            <h2 id="credential-patterns">Credential patterns detected (100+)</h2>
            <p>SecureLint&apos;s detection library covers the most commonly leaked credential types:</p>
            <ul>
              <li><strong>AWS</strong> — Access Key IDs (<code>AKIA…</code>), Secret Access Keys, session tokens</li>
              <li><strong>GCP</strong> — Service account JSON private keys, API key strings</li>
              <li><strong>Azure</strong> — Client secrets, connection strings, SAS tokens</li>
              <li><strong>GitHub</strong> — Personal access tokens (<code>ghp_…</code>, <code>github_pat_…</code>), OAuth tokens, fine-grained PATs</li>
              <li><strong>GitLab</strong> — Personal tokens (<code>glpat-…</code>), project tokens, deploy tokens</li>
              <li><strong>Stripe</strong> — Live secret keys (<code>sk_live_…</code>), restricted keys, webhook secrets</li>
              <li><strong>OpenAI</strong> — API keys (<code>sk-proj-…</code>, <code>sk-…</code>)</li>
              <li><strong>Anthropic / Claude</strong> — API keys (<code>sk-ant-…</code>)</li>
              <li><strong>Razorpay</strong> — Key secret values, webhook signing secrets</li>
              <li><strong>Jira / Atlassian</strong> — API tokens, OAuth secrets</li>
              <li><strong>Database credentials</strong> — PostgreSQL and MySQL URLs (<code>postgres://user:pass@host</code>), MongoDB Atlas SRV URIs, Redis AUTH strings</li>
              <li><strong>JWT tokens</strong> — Three-segment base64 tokens (header.payload.signature)</li>
              <li><strong>SSH private keys</strong> — PEM blocks (<code>-----BEGIN RSA PRIVATE KEY-----</code>)</li>
              <li><strong>Generic high-entropy strings</strong> — Long base64 or hex strings in key-value contexts that exceed the entropy threshold for random secrets</li>
            </ul>

            <h2 id="setup">Setting up auto-masking in SecureLint</h2>
            <div className={s.checklist}>
              <ul>
                <li><span className={s.checkIcon}>✅</span><span>Install SecureLint from the Chrome Web Store and pin the icon to your toolbar.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Auto-masking is <strong>on by default</strong> — no configuration required for individual users.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Open a Notion page or Jira issue and type or paste an API key. SecureLint masks it within milliseconds.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Click the SecureLint icon to temporarily reveal a masked value if you need to verify it or copy it.</span></li>
                <li><span className={s.checkIcon}>✅</span><span>Enterprise admins can enforce masking as a non-overrideable policy from the SecureLint admin console.</span></li>
              </ul>
            </div>
          </div>

          <section className={s.faqSection} aria-labelledby="faq">
            <h2 id="faq" className={s.faqTitle}>Frequently asked questions</h2>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Which editors does SecureLint auto-masking work in?</p>
              <p className={s.faqA}>SecureLint masks credentials in VS Code Web (vscode.dev), CodeSandbox, StackBlitz, Replit, GitHub web editor, Notion, Confluence, Jira, Linear, Slack, and any standard <code>&lt;textarea&gt;</code> or contenteditable element on the web.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>Does SecureLint send my code or credentials to any server?</p>
              <p className={s.faqA}>No. All pattern matching runs locally inside the browser extension using a compiled regex engine. Your code, credentials, and typed text never leave your device.</p>
            </div>
            <div className={s.faqItem}>
              <p className={s.faqQ}>What credential types does SecureLint detect?</p>
              <p className={s.faqA}>SecureLint detects 100+ patterns including AWS access and secret keys, GitHub PATs, GitLab tokens, Stripe live keys, OpenAI keys, Anthropic keys, Razorpay secrets, Jira API tokens, database connection strings (PostgreSQL, MySQL, MongoDB), JWT tokens, SSH private keys, and Azure client secrets.</p>
            </div>
          </section>
        </article>
      </div></div>
      <SiteFooter />
    </>
  );
}
