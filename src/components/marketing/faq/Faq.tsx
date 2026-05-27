"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "What is SecureLint and how does it work?",
    a: "SecureLint is a Chrome extension that runs entirely in your browser. It scans text you type or paste into any web editor in real time, detects sensitive data (API keys, passwords, tokens, credentials), and masks it before it can leak. It also blocks phishing sites using a 14-layer detection engine before the page fully loads.",
  },
  {
    q: "Is my data ever sent to a server?",
    a: "For Free and Pro users — no. All detection, masking, and phishing checks happen 100% locally inside your browser. No page content, typed text, or detected secrets are ever transmitted to any server. For Enterprise users, masked incident reports (never raw secrets) can be sent to your organization's admin dashboard only when explicitly enabled by your IT admin.",
  },
  {
    q: "What's the difference between Free and Pro?",
    a: "The Free plan covers the fundamentals: 60+ security checks, URL analysis, typosquat detection, Google Safe Browsing, and basic secret masking. Pro adds advanced features including AI Brand Detection, clickjacking & pastejacking protection, HaveIBeenPwned breach monitoring, crypto scam detection, 100+ language scam detection, advanced scan history, and much more.",
  },
  {
    q: "Can I switch plans or cancel anytime?",
    a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time from your dashboard. If you cancel, your Pro or Enterprise features remain active until the end of your current billing period.",
  },
  {
    q: "Does SecureLint work on all websites?",
    a: "Yes. SecureLint works across all websites — standard inputs, textareas, contenteditable elements, and rich text editors like CodeMirror, Monaco, Ace, TinyMCE, CKEditor, and popular productivity tools like Gmail, Slack, Notion, ChatGPT, and more.",
  },
  {
    q: "What are the billing period options for Pro?",
    a: "Pro is available monthly, quarterly, or annually. Annual gives you the best value at 33% off. Quarterly saves 10%. All plans are billed as a single upfront payment for the chosen period.",
  },
  {
    q: "What is the Enterprise plan?",
    a: "Enterprise is designed for IT and security teams. It adds centralized policy management, email DLP & send blocking, WAF / social-domain blocking, incident reporting, admin dashboard, and dedicated support with an SLA. Pricing is custom — contact our sales team to get a quote.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "The Free plan is permanently free and covers the core feature set. We don't offer a time-limited Pro trial, but the Free plan lets you experience the extension before upgrading.",
  },
  {
    q: "How does phishing detection work?",
    a: "SecureLint uses a 14-layer engine: bloom filter, URL heuristics, homograph/IDN analysis, typosquat detection, WHOIS domain-age check, SSL certificate validation, Google Safe Browsing, and page-content scanning for credential-harvesting language. If Google Safe Browsing confirms the site is safe (all threat flags false), the site is automatically unblocked — no false positives from local heuristics.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major UPI apps (PhonePe, GPay, Paytm), credit/debit cards (Visa, Mastercard, RuPay), and net banking via Razorpay. All payments are in INR.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: "#f8fafc", padding: "80px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.7px", marginBottom: 12 }}>
            Frequently asked questions
          </h2>
          <p style={{ fontSize: 16, color: "#57606a", maxWidth: 520, margin: "0 auto" }}>
            Everything you need to know about SecureLint.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i}
                style={{ background: "#fff", border: `1px solid ${isOpen ? "#1a7f3740" : "#e2e8f0"}`, borderRadius: 14, overflow: "hidden", transition: "border-color .2s" }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: "100%", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: isOpen ? "#1a7f37" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d={isOpen ? "M2 7l3-4 3 4" : "M2 3l3 4 3-4"} stroke={isOpen ? "#fff" : "#57606a"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 22px 18px", fontSize: 14, color: "#475569", lineHeight: 1.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", marginTop: 36, fontSize: 14, color: "#57606a" }}>
          Still have questions?{" "}
          <a href="mailto:contact@vaptlabs.com" style={{ color: "#1a7f37", fontWeight: 600, textDecoration: "none" }}>
            Email our support team →
          </a>
        </p>
      </div>
    </section>
  );
}
