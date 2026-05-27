import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Refund Policy – SecureLint Browser Security Extension",
  description:
    "SecureLint Refund Policy: all subscription payments are non-refundable. You may cancel your Pro or Enterprise subscription at any time — no future charges after cancellation.",
  keywords: [
    "SecureLint refund policy", "browser extension cancellation policy",
    "SecureLint subscription cancellation", "VAPTLabs refund", "no refund policy",
  ],
  alternates: { canonical: "https://securelint.in/refund-policy" },
  openGraph: {
    title: "Refund Policy – SecureLint Browser Security Extension",
    description:
      "SecureLint subscriptions are non-refundable. Cancel anytime — no future charges. Read our full refund and cancellation policy.",
    url: "https://securelint.in/refund-policy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecureLint – Refund Policy",
    description:
      "All SecureLint subscription payments are non-refundable. You can cancel anytime with no future charges.",
  },
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
            Please read this policy carefully before subscribing to SecureLint. All payments made for
            SecureLint subscriptions are non-refundable.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="privacy-content">
        <div className="privacy-content-inner">

          {/* Section 1 */}
          <section>
            <h2><span className="num">1</span> No Refund Policy</h2>
            <p>
              SecureLint (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), operated by <strong>VAPTLabs</strong>, does not offer
              refunds on any subscription payments — whether monthly or annual — for the SecureLint browser security extension
              and associated services.
            </p>
            <div className="callout">
              <p>
                <strong>By completing a purchase, you acknowledge and agree</strong> that all payments are final and
                non-refundable. We encourage you to review the extension features thoroughly before subscribing.
              </p>
            </div>
            <p>
              This applies to all paid plans (Pro and Enterprise) purchased directly through{" "}
              <a href="https://securelint.in">securelint.in</a>.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2><span className="num">2</span> How to Cancel Your Subscription</h2>
            <p>
              While payments are non-refundable, you are free to cancel your subscription at any time. Cancellation
              stops future billing — you will not be charged for the next cycle.
            </p>
            <p>To cancel, use either of the following methods:</p>
            <ul>
              <li>
                <strong>Self-service:</strong> Log in to <a href="https://securelint.in">securelint.in</a>, navigate
                to your account settings, and select &quot;Cancel Subscription&quot;.
              </li>
              <li>
                <strong>Email:</strong> Write to us at{" "}
                <a href="mailto:contact@vaptlabs.com">contact@vaptlabs.com</a> from your registered email address.
                We will cancel your subscription within 1 business day and send you a confirmation.
              </li>
            </ul>
            <p>
              After cancellation, you retain access to your paid features until the end of the current billing period.
              No further charges will be made after that date.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2><span className="num">3</span> Changes to This Policy</h2>
            <p>
              We may update this Refund Policy from time to time. The &quot;Effective&quot; date at the top of this page
              reflects the latest version. Continued use of a paid subscription after any update constitutes your
              acceptance of the revised policy.
            </p>
          </section>

          {/* Contact card */}
          <div className="contact-card">
            <h3>Questions about billing or cancellation?</h3>
            <p>
              Our support team is happy to help. Reach out and we&apos;ll respond within 2 business days.
            </p>
            <a href="mailto:contact@vaptlabs.com">📧 contact@vaptlabs.com</a>
          </div>

        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
