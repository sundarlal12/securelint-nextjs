import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Refund Policy – SecureLint Browser Security Extension",
  description:
    "SecureLint Refund Policy — Understand our refund and cancellation policy for Pro and Enterprise subscriptions of the SecureLint browser security extension.",
  alternates: { canonical: "https://securelint.in/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteHeader />

      {/* Hero */}
      <section className="privacy-hero">
        <div className="privacy-hero-inner">
          <div className="privacy-hero-eyebrow">💳 Refund Policy &nbsp;·&nbsp; Effective May 27, 2026</div>
          <h1>Refund Policy</h1>
          <p>
            We want you to be completely satisfied with SecureLint. This policy outlines when refunds are
            available and how to request them.
          </p>
        </div>
      </section>

      {/* Safeguards band */}
      <section className="safeguards">
        <div className="safeguards-inner">
          <h2>Our commitment to you</h2>
          <div className="safeguards-grid">
            <div className="safeguard-pill">
              <span className="sp-icon">🔄</span>
              <span className="sp-text">7-Day Money-Back<br /><span style={{ fontWeight: 400, color: "var(--ink-muted)", fontSize: 12 }}>Full refund, no questions asked</span></span>
            </div>
            <div className="safeguard-pill">
              <span className="sp-icon">🚫</span>
              <span className="sp-text">No Hidden Fees<br /><span style={{ fontWeight: 400, color: "var(--ink-muted)", fontSize: 12 }}>Cancel anytime, no penalties</span></span>
            </div>
            <div className="safeguard-pill">
              <span className="sp-icon">⚡</span>
              <span className="sp-text">Fast Processing<br /><span style={{ fontWeight: 400, color: "var(--ink-muted)", fontSize: 12 }}>Refunds processed within 5–7 days</span></span>
            </div>
            <div className="safeguard-pill">
              <span className="sp-icon">💬</span>
              <span className="sp-text">Responsive Support<br /><span style={{ fontWeight: 400, color: "var(--ink-muted)", fontSize: 12 }}>We reply within 2 business days</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="privacy-content">
        <div className="privacy-content-inner">

          {/* Section 1 */}
          <section>
            <h2><span className="num">1</span> Overview</h2>
            <p>
              This Refund Policy applies to paid subscriptions for SecureLint — the browser security extension developed
              and operated by <strong>VAPTLabs</strong>. It covers Pro (individual) and Enterprise (organization) plans
              purchased directly through <a href="https://securelint.in">securelint.in</a>.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2><span className="num">2</span> 7-Day Money-Back Guarantee</h2>
            <p>
              If you are not satisfied with SecureLint for any reason, you may request a full refund within
              <strong> 7 calendar days</strong> of your initial purchase or the start of your first paid subscription term.
            </p>
            <p>This guarantee applies to:</p>
            <ul>
              <li>New Pro (monthly or annual) subscriptions — first payment only.</li>
              <li>New Enterprise subscriptions — first payment only, unless a separate Enterprise Agreement specifies different terms.</li>
            </ul>
            <p>To claim your 7-day refund, email us at <a href="mailto:contact@vaptlabs.com">contact@vaptlabs.com</a> with:</p>
            <ul>
              <li>Subject line: <code>Refund Request – SecureLint</code></li>
              <li>Your registered email address.</li>
              <li>Your payment receipt or transaction ID.</li>
              <li>Brief reason for the refund (optional, but helps us improve).</li>
            </ul>
            <p>
              We will process your refund within <strong>5–7 business days</strong>. Funds will be returned to your
              original payment method (credit/debit card or bank account via Stripe / Razorpay).
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2><span className="num">3</span> Renewals &amp; Subsequent Billing Cycles</h2>
            <p>
              After the initial 7-day guarantee period, subscription fees are <strong>non-refundable</strong> for the
              current billing cycle. This applies to:
            </p>
            <ul>
              <li>Monthly subscription renewals.</li>
              <li>Annual subscription renewals (including mid-term cancellations).</li>
            </ul>
            <p>
              When you cancel, your subscription remains active until the end of the current paid period.
              You will not be charged for the next cycle, and no partial refund is issued for unused days.
            </p>
            <div className="callout">
              <p>
                <strong>Example:</strong> You pay for an annual Pro plan on January 1. You cancel on March 15.
                You retain access to Pro features through December 31 but will not receive a refund for the remaining
                9.5 months.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2><span className="num">4</span> Exceptions — When We May Issue a Refund Beyond 7 Days</h2>
            <p>
              We may, at our sole discretion, grant refunds beyond the 7-day window in exceptional circumstances:
            </p>
            <table>
              <thead>
                <tr><th>Situation</th><th>Outcome</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Duplicate charge due to a billing error on our end</td>
                  <td>Full refund of the duplicate amount</td>
                </tr>
                <tr>
                  <td>Extended service outage (&gt;72 hours) affecting core features during your paid period</td>
                  <td>Prorated credit or refund at our discretion</td>
                </tr>
                <tr>
                  <td>Unauthorized charge confirmed after account investigation</td>
                  <td>Full refund of the unauthorized charge</td>
                </tr>
                <tr>
                  <td>Extension removed from browser store by the platform due to policy changes beyond our control</td>
                  <td>Prorated refund for the remaining paid period</td>
                </tr>
              </tbody>
            </table>
            <p>
              To report a billing error or exceptional circumstance, contact us at
              <a href="mailto:contact@vaptlabs.com"> contact@vaptlabs.com</a> within 30 days of the charge.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2><span className="num">5</span> Non-Refundable Situations</h2>
            <p>Refunds will <strong>not</strong> be issued in the following circumstances:</p>
            <ul>
              <li>Requests made after the 7-day guarantee window for reasons other than the exceptions in Section 4.</li>
              <li>Failure to cancel before the renewal date — we send a renewal reminder email 7 days in advance, and it is your responsibility to cancel in time.</li>
              <li>Dissatisfaction with features that were clearly described on the pricing page before purchase.</li>
              <li>Accounts terminated for violating our <a href="/terms">Terms &amp; Conditions</a> (e.g. abuse, fraud, misuse).</li>
              <li>Changes in your personal requirements or business circumstances.</li>
              <li>Incompatibility with a browser version or operating system that was outside our stated minimum requirements (Chrome 88+, Edge 88+) at the time of purchase.</li>
              <li>Purchases made through third-party resellers or partner channels — those are subject to the reseller&apos;s own refund policy.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2><span className="num">6</span> Enterprise Subscriptions</h2>
            <p>
              Enterprise subscriptions governed by a custom Enterprise Agreement or Order Form follow the refund and
              cancellation terms specified in that agreement. If no specific terms are stated, this Refund Policy applies.
            </p>
            <p>
              Enterprise trials (where offered) are subject to their own trial terms agreed at the time of the trial setup.
              Conversions from a trial to a paid Enterprise plan follow the standard 7-day guarantee starting from the first
              paid invoice date.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2><span className="num">7</span> How to Cancel Your Subscription</h2>
            <p>You can cancel your subscription at any time through one of the following methods:</p>
            <ul>
              <li><strong>Self-service:</strong> Log in to <a href="https://securelint.in">securelint.in</a>, go to your account settings, and select &quot;Cancel Subscription&quot;.</li>
              <li><strong>Email:</strong> Send a cancellation request to <a href="mailto:contact@vaptlabs.com">contact@vaptlabs.com</a> from your registered email. We will process the cancellation within 1 business day and send you a confirmation.</li>
            </ul>
            <p>
              After cancellation, you retain access to paid features until the end of your current billing period.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2><span className="num">8</span> Refund Method &amp; Timeline</h2>
            <table>
              <thead>
                <tr><th>Payment Method</th><th>Refund Method</th><th>Timeline</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Credit / Debit Card (Stripe)</td>
                  <td>Reversal to original card</td>
                  <td>5–10 business days</td>
                </tr>
                <tr>
                  <td>UPI / Net Banking (Razorpay)</td>
                  <td>Reversal to originating account</td>
                  <td>5–7 business days</td>
                </tr>
                <tr>
                  <td>Bank Transfer / Wire</td>
                  <td>Bank transfer to originating account</td>
                  <td>7–14 business days</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: 12 }}>
              Processing times are from the date we approve the refund. Actual receipt depends on your bank or card issuer.
              We will email you a refund confirmation once initiated.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2><span className="num">9</span> Chargebacks</h2>
            <p>
              If you believe a charge is incorrect, please contact us first at
              <a href="mailto:contact@vaptlabs.com"> contact@vaptlabs.com</a> before initiating a chargeback with your
              bank or card issuer. We can typically resolve billing disputes faster than the chargeback process and without
              the administrative burden it creates.
            </p>
            <p>
              Chargebacks initiated without prior contact that we determine to be fraudulent or unwarranted may result in
              account suspension and referral to our payment processors for dispute resolution.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2><span className="num">10</span> Changes to This Policy</h2>
            <p>
              We may update this Refund Policy from time to time. The &quot;Effective&quot; date at the top reflects the latest
              version. For material changes, we will notify registered users via email at least 14 days before the new policy
              takes effect. Continued use of a paid subscription after the effective date constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact card */}
          <div className="contact-card">
            <h3>Need a refund or have a billing question?</h3>
            <p>
              Our support team is here to help. Email us and we&apos;ll respond within 2 business days.
              Please include your registered email address and payment receipt for faster resolution.
            </p>
            <a href="mailto:contact@vaptlabs.com">📧 contact@vaptlabs.com</a>
          </div>

        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
