import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Terms & Conditions – SecureLint Browser Security Extension",
  description:
    "SecureLint Terms & Conditions — Read the terms governing your use of the SecureLint browser extension for real-time secret masking, phishing detection, and enterprise DLP.",
  alternates: { canonical: "https://securelint.in/terms" },
};

export default function TermsPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteHeader />

      {/* Hero */}
      <section className="privacy-hero">
        <div className="privacy-hero-inner">
          <div className="privacy-hero-eyebrow">📋 Terms &amp; Conditions &nbsp;·&nbsp; Effective May 27, 2026</div>
          <h1>Terms &amp; Conditions</h1>
          <p>
            By installing or using the SecureLint browser extension or any associated services, you agree to these terms.
            Please read them carefully before use.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="privacy-content">
        <div className="privacy-content-inner">

          {/* Section 1 */}
          <section>
            <h2><span className="num">1</span> Acceptance of Terms</h2>
            <p>
              These Terms &amp; Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;,
              &quot;you&quot;) and VAPTLabs (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), the creator and operator
              of <strong>SecureLint – Sensitive Data Protector</strong> (the &quot;Extension&quot;) and the associated
              web platform at <a href="https://securelint.in">securelint.in</a>.
            </p>
            <p>
              By installing the Extension from the Chrome Web Store, Microsoft Edge Add-ons, or Firefox Browser Add-ons,
              or by accessing securelint.in, you confirm that you have read, understood, and agree to be bound by these Terms.
              If you do not agree, please uninstall the Extension and do not use our services.
            </p>
            <div className="callout">
              <p>
                <strong>Age requirement:</strong> You must be at least 13 years old (or the minimum digital age of consent
                in your country) to use SecureLint. Enterprise deployments by organizations are permitted regardless of
                individual user age, provided the organization complies with applicable child privacy laws.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2><span className="num">2</span> Description of Service</h2>
            <p>SecureLint is a browser security extension that provides:</p>
            <ul>
              <li><strong>Real-time secret detection &amp; masking</strong> — detects API keys, passwords, tokens, credentials, and other sensitive data as you type or paste into web-based editors, and masks them to prevent accidental exposure.</li>
              <li><strong>Phishing mail detection</strong> — locally analyzes emails in Gmail, Outlook, and Yahoo Mail for phishing indicators without transmitting email content to our servers.</li>
              <li><strong>Enterprise Email DLP</strong> — for Enterprise customers, prevents sensitive data from being sent to personal or unauthorized external domains via email.</li>
              <li><strong>Enterprise Incident Reporting</strong> — for Enterprise customers, sends masked detection summaries to an organization's IT administrator dashboard for compliance visibility.</li>
              <li><strong>SecureLint Dashboard</strong> — a web-based admin panel at securelint.in for Enterprise customers to view masked incident reports, manage team members, and configure organization policies.</li>
            </ul>
            <p>
              All secret detection and masking runs <strong>100% locally in your browser</strong>. Raw secret values, page content,
              keystrokes, and email bodies are never transmitted to our servers.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2><span className="num">3</span> Subscription Plans &amp; License</h2>
            <p>SecureLint is available under two paid tiers:</p>

            <h3>3a. Pro Plan</h3>
            <ul>
              <li>Available as a paid monthly or annual subscription for individual professionals.</li>
              <li>Includes advanced detection patterns, custom regex, export reports, and priority support.</li>
              <li>Licensed for use by a single individual only — not transferable.</li>
            </ul>

            <h3>3b. Enterprise Plan</h3>
            <ul>
              <li>Available as a paid subscription for organizations, priced per seat.</li>
              <li>Includes all Pro features plus Incident Reporting, Enterprise Email DLP, centralized settings management, and a dedicated admin dashboard.</li>
              <li>Subject to a separate Enterprise Agreement or Order Form executed between your organization and VAPTLabs.</li>
            </ul>

            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to install and use the Extension
              in accordance with these Terms and the plan you have subscribed to.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2><span className="num">4</span> Prohibited Uses</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Reverse engineer, decompile, disassemble, or attempt to extract the source code of the Extension beyond what is permitted by applicable law.</li>
              <li>Modify, adapt, translate, or create derivative works based on the Extension without our written permission.</li>
              <li>Use the Extension to collect, harvest, or monitor data belonging to third parties without their explicit consent.</li>
              <li>Distribute, sublicense, rent, lease, sell, or otherwise transfer the Extension or your account to a third party.</li>
              <li>Use the Extension to circumvent, disable, or interfere with security features of any website or service.</li>
              <li>Attempt to interfere with the integrity or performance of the Extension or any associated backend services.</li>
              <li>Use the Extension in any way that violates applicable laws, regulations, or these Terms.</li>
              <li>Share your account credentials with others or use another user&apos;s account.</li>
              <li>Deploy the Extension in a manner that intentionally suppresses or corrupts security alerts for malicious purposes.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2><span className="num">5</span> Accounts &amp; Registration</h2>
            <p>
              Creating an account is optional for Pro individual users but required for Enterprise features.
              If you create an account, you agree to:
            </p>
            <ul>
              <li>Provide accurate, complete, and current information.</li>
              <li>Maintain the security of your password and accept responsibility for all activity that occurs under your account.</li>
              <li>Notify us immediately at <a href="mailto:contact@vaptlabs.com">contact@vaptlabs.com</a> if you suspect unauthorized use of your account.</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity,
              or for any other reason we deem appropriate, with or without notice.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2><span className="num">6</span> Payments &amp; Billing</h2>
            <p>
              Paid plans (Pro and Enterprise) are billed in advance on a monthly or annual basis. By subscribing, you authorize
              us to charge your payment method on a recurring basis until you cancel.
            </p>
            <ul>
              <li>You are responsible for all taxes, duties, or levies applicable to your subscription in your jurisdiction.</li>
              <li>We use Stripe and Razorpay as our payment processors — your payment card details are processed securely by them and are never stored on our servers.</li>
              <li>Subscription fees are non-refundable except as explicitly described in our <a href="/refund-policy">Refund Policy</a>.</li>
              <li>We reserve the right to modify pricing with at least 30 days' notice to active subscribers before changes apply to your billing cycle.</li>
              <li>Failure to pay may result in suspension or termination of your paid features.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2><span className="num">7</span> Cancellation</h2>
            <p>
              You may cancel your subscription at any time from your account settings or by emailing
              <a href="mailto:contact@vaptlabs.com"> contact@vaptlabs.com</a>.
            </p>
            <ul>
              <li>Cancellation takes effect at the end of your current billing period — you retain access to paid features until then.</li>
              <li>Cancellations do not automatically entitle you to a refund. See our <a href="/refund-policy">Refund Policy</a> for details.</li>
              <li>We reserve the right to cancel your subscription immediately if you breach these Terms, without a refund.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2><span className="num">8</span> Intellectual Property</h2>
            <p>
              SecureLint, the VAPTLabs name, logos, extension icons, and all associated trademarks, service marks, and trade dress
              are owned by VAPTLabs and may not be used without our prior written consent.
            </p>
            <p>
              The Extension and all its components — including detection patterns, algorithms, UI, and documentation — are protected
              by copyright and other intellectual property laws. Nothing in these Terms grants you ownership of any intellectual property.
            </p>
            <p>
              If you provide us with feedback, suggestions, or ideas, you grant us a perpetual, irrevocable, royalty-free license
              to use that feedback for any purpose without compensation to you.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2><span className="num">9</span> Privacy</h2>
            <p>
              Your use of SecureLint is subject to our <a href="/privacy">Privacy Policy</a>, which is incorporated into these Terms
              by reference. The Privacy Policy explains what data we collect, how we use it, and your rights.
            </p>
            <p>
              For Enterprise users, additional data processing terms (a Data Processing Agreement) may be required under
              GDPR or similar regulations. Please contact <a href="mailto:contact@vaptlabs.com">contact@vaptlabs.com</a> to
              obtain a DPA.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2><span className="num">10</span> Disclaimer of Warranties</h2>
            <div className="callout">
              <p>
                The Extension is provided <strong>&quot;as is&quot; and &quot;as available&quot;</strong> without warranties of any kind,
                express or implied, including but not limited to merchantability, fitness for a particular purpose, accuracy, or non-infringement.
              </p>
            </div>
            <p>
              We do not warrant that:
            </p>
            <ul>
              <li>The Extension will detect every secret or sensitive data item in every situation.</li>
              <li>The Extension will be free from bugs, errors, or interruptions.</li>
              <li>Phishing detection will identify every phishing attempt.</li>
              <li>The Extension will be compatible with all websites, browsers, or operating system versions at all times.</li>
            </ul>
            <p>
              SecureLint is a security aid, not a guarantee of security. You remain responsible for your own data security practices.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2><span className="num">11</span> Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless VAPTLabs, its affiliates, officers, directors, employees, and
              agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, or expenses (including
              reasonable legal fees) arising from your:
            </p>
            <ul>
              <li>Violation of these Terms.</li>
              <li>Misuse of the Extension.</li>
              <li>Violation of any third party&apos;s rights.</li>
              <li>Violation of any applicable law or regulation.</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section>
            <h2><span className="num">12</span> Third-Party Services &amp; Links</h2>
            <p>
              The Extension may interface with or display links to third-party websites or services (e.g., GitHub, Slack, Jira).
              We are not responsible for the privacy practices, content, or security of those third-party services. Your use of
              third-party services is subject to their own terms and policies.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2><span className="num">13</span> Changes to the Extension or Terms</h2>
            <p>
              We may update the Extension (including adding, modifying, or removing features) and these Terms at any time.
              For material changes to these Terms, we will provide at least 14 days' advance notice to registered users via email.
              Continued use of the Extension after the effective date of revised Terms constitutes your acceptance of those changes.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2><span className="num">14</span> Termination</h2>
            <p>
              We may suspend or terminate your access to the Extension and associated services at any time, with or without cause
              or notice. Upon termination, your license to use the Extension ends immediately. Provisions that by their nature
              should survive termination (including intellectual property, disclaimer of warranties, and governing law) will survive.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2><span className="num">15</span> Governing Law &amp; Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of India, without regard to its conflict of law principles.
              Any dispute arising from these Terms shall first be attempted to be resolved through good-faith negotiation.
              If unresolved within 30 days, disputes shall be submitted to binding arbitration under the Arbitration and
              Conciliation Act, 1996 of India, with proceedings conducted in English in Jaipur, Rajasthan, India.
            </p>
            <p>
              Nothing in this section prevents either party from seeking emergency injunctive relief from a competent court.
            </p>
          </section>

          {/* Section 16 */}
          <section>
            <h2><span className="num">16</span> Severability &amp; Entire Agreement</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force.
              These Terms, together with our Privacy Policy and any applicable Enterprise Agreement, constitute the entire
              agreement between you and VAPTLabs regarding SecureLint.
            </p>
          </section>

          {/* Contact card */}
          <div className="contact-card">
            <h3>Questions about these Terms?</h3>
            <p>We&apos;re happy to help. Reach out and we&apos;ll respond within 5 business days.</p>
            <a href="mailto:contact@vaptlabs.com">📧 contact@vaptlabs.com</a>
          </div>

        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
