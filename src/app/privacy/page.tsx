import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy – SecureLint | How We Protect Your Sensitive Data",
  description:
    "SecureLint Privacy Policy — Learn how SecureLint protects your API keys, passwords, and credentials. 100% local processing, no data collection, enterprise DLP, phishing mail detection.",
  alternates: { canonical: "https://securelint.in/privacy" },
};

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteHeader />

      {/* Hero */}
      <section className="privacy-hero">
        <div className="privacy-hero-inner">
          <div className="privacy-hero-eyebrow">🔒 Privacy Policy &nbsp;·&nbsp; Effective May 9, 2026</div>
          <h1>Your privacy is our priority</h1>
          <p>
            SecureLint is built to protect your sensitive data — and that starts with how we handle yours.
            Everything is processed 100% locally in your browser. We never read, store, or transmit your secrets, passwords, or page content.
          </p>
        </div>
      </section>

      {/* Safeguards band */}
      <section className="safeguards">
        <div className="safeguards-inner">
          <h2>Our privacy safeguards at a glance</h2>
          <div className="safeguards-grid">
            <div className="safeguard-pill">
              <span className="sp-icon">🖥️</span>
              <span className="sp-text">100% Local Processing<br /><span style={{ fontWeight: 400, color: "var(--ink-muted)", fontSize: 12 }}>All detection runs in-browser</span></span>
            </div>
            <div className="safeguard-pill">
              <span className="sp-icon">🚫</span>
              <span className="sp-text">No Tracking or Ads<br /><span style={{ fontWeight: 400, color: "var(--ink-muted)", fontSize: 12 }}>Zero third-party analytics</span></span>
            </div>
            <div className="safeguard-pill">
              <span className="sp-icon">🔐</span>
              <span className="sp-text">No Data Sale<br /><span style={{ fontWeight: 400, color: "var(--ink-muted)", fontSize: 12 }}>Your data is never monetized</span></span>
            </div>
            <div className="safeguard-pill">
              <span className="sp-icon">🛡️</span>
              <span className="sp-text">GDPR &amp; CCPA Aligned<br /><span style={{ fontWeight: 400, color: "var(--ink-muted)", fontSize: 12 }}>Full data subject rights</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="privacy-content">
        <div className="privacy-content-inner">
          {/* Section 1 — Overview */}
          <section>
            <h2><span className="num">1</span> Overview</h2>
            <p>
              SecureLint (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a browser extension and dashboard
              designed to detect and mask sensitive information — API keys, passwords, tokens, credentials, and other
              secrets — directly inside your browser. This Privacy Policy explains what data we process, what we never collect,
              and how we protect your information.
            </p>
            <div className="callout">
              <p>
                <strong>Bottom line:</strong> SecureLint runs entirely on your device. The text you type, paste, and view
                is processed locally — it never leaves your browser, and we have no way to read it.
              </p>
            </div>
          </section>

          {/* Section 2 — Data we collect */}
          <section>
            <h2><span className="num">2</span> Data We Collect</h2>

            <h3>2a. Data Processed Locally — Never Leaves Your Browser</h3>
            <p>
              When SecureLint scans for secrets, it analyzes the text you type, paste, or view in active web editors.
              This processing happens entirely in your browser&apos;s memory using JavaScript regex patterns:
            </p>
            <ul>
              <li>Text typed into web editors (CodeMirror, Monaco, Ace, Google Docs, etc.)</li>
              <li>Email content in Gmail, Outlook, Yahoo Mail (for phishing &amp; DLP detection)</li>
              <li>Clipboard data (only when you paste into a monitored editor)</li>
            </ul>
            <p>None of this data is ever transmitted to SecureLint or any third party.</p>

            <h3>2b. Settings Stored Locally in Your Browser</h3>
            <p>SecureLint saves your preferences in your browser&apos;s local storage:</p>
            <ul>
              <li>Masking style (partial / full)</li>
              <li>Excluded domains</li>
              <li>Custom regex patterns</li>
              <li>Severity threshold and notification preferences</li>
            </ul>

            <h3>2c. Account &amp; Authentication Data <em style={{ fontWeight: 400, fontSize: 13, color: "var(--ink-muted)" }}>(Optional — Registered Users Only)</em></h3>
            <p>If you create a SecureLint account (optional), we store on our servers:</p>
            <ul>
              <li>Email address</li>
              <li>Hashed password (bcrypt) or OAuth provider ID (Google / GitHub)</li>
              <li>Account creation timestamp and last sign-in</li>
              <li>Anonymous browser ID for cross-device sync</li>
            </ul>
          </section>

          {/* Section 3 — Data we do NOT collect */}
          <section>
            <h2><span className="num">3</span> Data We Do <em>NOT</em> Collect</h2>
            <p>We want to be crystal clear about what stays on your device:</p>
            <ul>
              <li>The actual secrets, API keys, passwords, or credentials we detect</li>
              <li>The content of web pages you visit</li>
              <li>Your browsing history</li>
              <li>Keystrokes outside of monitored editor fields</li>
              <li>Email content (phishing detection runs locally only)</li>
              <li>IP addresses for tracking purposes</li>
              <li>Device fingerprints</li>
            </ul>
          </section>

          {/* Section 4 — Permissions */}
          <section>
            <h2><span className="num">4</span> Permissions &amp; Why We Need Them</h2>
            <table>
              <thead>
                <tr><th>Permission</th><th>Why We Need It</th></tr>
              </thead>
              <tbody>
                <tr><td><code>activeTab</code></td><td>Read text in the current tab&apos;s editors to detect secrets locally.</td></tr>
                <tr><td><code>storage</code></td><td>Save your masking preferences and excluded domains in your browser.</td></tr>
                <tr><td><code>scripting</code></td><td>Inject the local detection script into web editors.</td></tr>
                <tr><td><code>clipboardRead</code></td><td>Detect secrets in pasted content (processed locally only).</td></tr>
                <tr><td><code>host_permissions</code></td><td>Run detection across all sites where you might paste secrets.</td></tr>
              </tbody>
            </table>
          </section>

          {/* Section 5 — How we protect */}
          <section>
            <h2><span className="num">5</span> How We Protect Your Data</h2>
            <ul>
              <li><strong>Local-first architecture</strong> — secret detection never leaves your browser</li>
              <li><strong>TLS 1.3 encryption</strong> — all account/auth traffic is encrypted in transit</li>
              <li><strong>bcrypt password hashing</strong> — passwords are never stored in plain text</li>
              <li><strong>Minimal data retention</strong> — we store only what is strictly required for the service</li>
              <li><strong>Regular security audits</strong> — by independent third-party auditors</li>
              <li><strong>Responsible disclosure</strong> — vulnerabilities can be reported to security@vaptlabs.com</li>
            </ul>

            <h3 style={{ marginTop: 24 }}>Detection Risk Levels</h3>
            <table>
              <thead>
                <tr><th>Level</th><th>Examples</th><th>Behavior</th></tr>
              </thead>
              <tbody>
                <tr><td><strong style={{ color: "#dc2626" }}>Critical</strong></td><td>AWS keys, private SSH keys, DB connection strings</td><td>Auto-mask + alert</td></tr>
                <tr><td><strong style={{ color: "#ea580c" }}>High</strong></td><td>Stripe live keys, OAuth tokens, JWT secrets</td><td>Auto-mask + warn</td></tr>
                <tr><td><strong style={{ color: "#d97706" }}>Medium</strong></td><td>Webhook URLs, internal hostnames</td><td>Subtle highlight</td></tr>
                <tr><td><strong style={{ color: "#2563eb" }}>Low</strong></td><td>Phone numbers, SSNs, credit cards</td><td>Optional masking</td></tr>
              </tbody>
            </table>
          </section>

          {/* Section 6 — Third party */}
          <section>
            <h2><span className="num">6</span> Third-Party Services</h2>
            <p>
              We use a minimal set of third parties, only where strictly necessary, and only with your explicit consent:
            </p>
            <ul>
              <li><strong>Google &amp; GitHub OAuth</strong> — used only if you choose &quot;Continue with Google/GitHub&quot;. They share your name and email only.</li>
              <li><strong>Vercel</strong> — hosts our authentication API endpoints (not the extension).</li>
              <li><strong>Resend / SendGrid</strong> — for password reset emails (transactional only, no marketing).</li>
            </ul>
            <p>We do <em>not</em> use Google Analytics, Facebook Pixel, advertising SDKs, or session-replay tools.</p>
          </section>

          {/* Section 7 — Children */}
          <section>
            <h2><span className="num">7</span> Children&apos;s Privacy</h2>
            <p>
              SecureLint is not directed at children under 13. We do not knowingly collect personal information from children.
              If you believe a child has provided us with personal data, contact us at <a href="mailto:contact@vaptlabs.com">contact@vaptlabs.com</a>.
            </p>
          </section>

          {/* Section 8 — Changes */}
          <section>
            <h2><span className="num">8</span> Changes to This Policy</h2>
            <p>
              We may update this policy occasionally. The &quot;Effective&quot; date at the top reflects the latest version.
              For material changes, we will notify registered users via email at least 14 days before changes take effect.
            </p>
          </section>

          {/* Section 9 — Your rights */}
          <section>
            <h2><span className="num">9</span> Your Rights</h2>
            <p>Under GDPR, CCPA, and similar regulations, you have the right to:</p>
            <ul>
              <li>Access — request a copy of your personal data</li>
              <li>Rectification — correct inaccurate or incomplete data</li>
              <li>Erasure — request deletion of your account and all data</li>
              <li>Restriction — limit how we process your data</li>
              <li>Portability — receive your data in a machine-readable format</li>
              <li>Object — opt out of any processing you disagree with</li>
            </ul>
            <p>
              To exercise any of these rights, email <a href="mailto:contact@vaptlabs.com">contact@vaptlabs.com</a>.
              We respond within 30 days.
            </p>
          </section>

          {/* Section 10 — Enterprise Incident Reporting */}
          <section>
            <h2><span className="num">10</span> Enterprise Incident Reporting</h2>
            <p>
              For Enterprise customers only, SecureLint can send <em>masked</em> incident reports to a designated IT
              administrator inside your organization.
            </p>
            <h3>What is included in an incident report?</h3>
            <ul>
              <li>Type of secret detected (e.g. &quot;AWS Access Key&quot;)</li>
              <li>Severity level</li>
              <li>Domain where it was detected (e.g. <code>github.com</code>)</li>
              <li>Timestamp</li>
              <li>The masked preview (e.g. <code>AKIA████████</code>)</li>
            </ul>
            <h3>What is never included</h3>
            <ul>
              <li>The actual secret value</li>
              <li>Surrounding text or context</li>
              <li>Any other content from the page</li>
            </ul>
          </section>

          {/* Section 11 — Phishing detection */}
          <section>
            <h2><span className="num">11</span> Phishing Mail Detection</h2>
            <p>
              SecureLint can warn you about likely phishing emails in Gmail, Outlook, and Yahoo Mail. The detection runs
              entirely inside your browser using heuristic analysis of sender, links, and content patterns. <strong>No email
              content is sent to our servers.</strong>
            </p>
          </section>

          {/* Section 12 — DLP */}
          <section>
            <h2><span className="num">12</span> Enterprise Email DLP</h2>
            <p>
              For Enterprise customers, SecureLint can block emails that contain sensitive company data from being sent to
              personal or external domains. The block decision is made entirely on your device. The administrator only receives
              a masked summary (sender, recipient domain, secret type, timestamp) — never the actual email content.
            </p>
          </section>

          {/* Contact */}
          <div className="contact-card">
            <h3>Questions about privacy?</h3>
            <p>We&apos;re here to help. Reach out anytime — we respond to all privacy inquiries within 5 business days.</p>
            <a href="mailto:contact@vaptlabs.com">📧 contact@vaptlabs.com</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
