"use client";

import { useEffect, useState } from "react";
import { MarketingFeatureCard, type MarketingFeatureSpec } from "./MarketingFeatureCard";
import s from "./FeaturesShowcase.module.css";

const SLIDES: MarketingFeatureSpec[][] = [
  // ── Slide 1: Core secret protection ─────────────────────────────────────
  [
    {
      icon: "🌐",
      title: "Universal Editor Support",
      description:
        "Works in all web editors: CodeMirror, Monaco, Ace, TinyMCE, CKEditor, Google Docs, Notion, Jira, Confluence — and any contenteditable field.",
    },
    {
      icon: "🎯",
      title: "4-Level Risk Classification",
      description:
        "Every detected secret is scored: Critical, High, Medium, or Low — so you know exactly what to fix first.",
    },
    {
      icon: "🔒",
      title: "Context-Aware Masking",
      description:
        "Dev mode shows partial masks (sk-1234****5678). Writing mode uses full masking (***API_KEY***). Adapts to your workflow automatically.",
    },
    {
      icon: "🔍",
      title: "100+ Detection Patterns",
      description:
        "AWS, GCP, Azure credentials, JWT tokens, DB connection strings, private keys, Stripe/Twilio/SendGrid keys, SSNs, credit cards, and more.",
    },
  ],

  // ── Slide 2: Phishing & email protection ─────────────────────────────────
  [
    {
      icon: "🎣",
      title: "Phishing Mail Detection",
      description:
        "Detects phishing emails in Gmail, Outlook, and Yahoo Mail. Blocks the reply button and alerts you in real-time before you engage.",
      badge: "new",
    },
    {
      icon: "📧",
      title: "Enterprise Email DLP",
      description:
        "When an employee tries to send company data to a personal domain, SecureLint blocks the send button and notifies the IT admin.",
      badge: "enterprise",
    },
    {
      icon: "📊",
      title: "Enterprise Incident Reporting",
      description:
        "IT admins get centralized dashboards showing masked secret detection events across the entire workforce.",
      badge: "enterprise",
    },
    {
      icon: "💬",
      title: "Smart Floating Widget",
      description:
        "A subtle floating icon shows detected secrets count, color-coded by severity. Move it anywhere — smart positioning opens up or down based on location.",
    },
  ],

  // ── Slide 3: AI-powered brand & phishing detection ───────────────────────
  [
    {
      icon: "🧠",
      title: "AI Brand Detection",
      description:
        "Identifies any company worldwide in 100+ languages and verifies the domain matches. Banks, airlines, telecom, government — any brand, any country.",
      badge: "new",
    },
    {
      icon: "🛡️",
      title: "Clickjacking Shield",
      description:
        "Detects invisible overlays that hijack your clicks. Automatically disables them so your clicks always land exactly where you intend.",
    },
    {
      icon: "📋",
      title: "Clipboard Guard",
      description:
        "Blocks pastejacking. If a page silently replaces what you copied, SecureLint detects it and restores your original clipboard content instantly.",
    },
    {
      icon: "⚡",
      title: "Multi-Layer AI Engine",
      description:
        "Advanced AI detection with automatic failover across multiple models. Always on, always analysing every page in real time — even with encrypted or obfuscated code.",
    },
  ],

  // ── Slide 4: Privacy & breach protection ─────────────────────────────────
  [
    {
      icon: "🔐",
      title: "Password Breach Monitor",
      description:
        "Checks passwords against HaveIBeenPwned in real-time. Warns you immediately if your password appeared in any known data breach. Privacy-safe — no plain-text is sent.",
    },
    {
      icon: "👁️",
      title: "Link Hover Scanner",
      description:
        "Hover any link to see its trust score before clicking. Works on emails, social media, forums, and anywhere links appear.",
    },
    {
      icon: "🔔",
      title: "Real-time Desktop Alerts",
      description:
        "Instant desktop notifications when a dangerous site is detected. A full-page warning overlay blocks scam content before you can interact with it.",
    },
    {
      icon: "💀",
      title: "Wallet Drainer Detection",
      description:
        "Scans every page for wallet-draining code. Detects 15+ known drainer kits and malicious transaction requests before they can access your crypto.",
    },
  ],

  // ── Slide 5: Advanced analysis & verification ────────────────────────────
  [
    {
      icon: "🕵️",
      title: "JS Code Analysis",
      description:
        "AI reads the actual JavaScript on suspicious pages to understand what it does. Catches hidden drainers that disguise themselves behind encrypted or obfuscated code.",
    },
    {
      icon: "🔎",
      title: "Manual URL Checker",
      description:
        "Paste any URL to get an instant AI-powered trust score with detailed risk breakdown — before you ever visit the site.",
    },
    {
      icon: "🔐",
      title: "SSL & DNS Verification",
      description:
        "Verifies SSL certificates are valid and not expired, and confirms the domain actually resolves to a real server. Expired SSL or phantom DNS = flagged immediately.",
    },
    {
      icon: "🌍",
      title: "100+ Language Scam Detection",
      description:
        "Detects scam patterns written in over 100 languages. No attacker can evade detection just by switching to a non-English script.",
    },
  ],

  // ── Slide 6: Crowd intelligence & stats ──────────────────────────────────
  [
    {
      icon: "🌐",
      title: "Crowd-Powered Protection",
      description:
        "Shared threat cache across all users. The moment one person encounters a scam, every other user is instantly protected. Faster scans, smarter detection.",
    },
    {
      icon: "📊",
      title: "Scan History & Weekly Stats",
      description:
        "A personal weekly stats dashboard: threats blocked, warnings given, safe sites verified, and secrets masked — all in one view.",
    },
    {
      icon: "🚚",
      title: "Draggable Widget",
      description:
        "Move the SecureLint indicator anywhere on screen. Smart positioning automatically opens the panel up or down based on where it sits.",
    },
    {
      icon: "🔒",
      title: "Zero Data Transmission",
      description:
        "All detection, masking, and phishing checks happen 100% locally inside your browser. No page content or typed text is ever sent to any server.",
    },
  ],
];

export function FeaturesShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="features" className={s.section}>
      <div className={s.inner}>
        <div className={s.header}>
          <h2>API Key Masking &amp; Phishing Detection —{" "}
            <em style={{ fontStyle: "italic", color: "var(--ink-muted)", fontWeight: 800 }}>All in One Extension.</em>
          </h2>
          <p>
            From real-time credential leak prevention to enterprise email DLP — SecureLint stops API keys, passwords,
            and secrets from leaking across every web editor, email client, and tool you use.
          </p>
        </div>

        <div className={s.viewport}>
          <div
            className={s.track}
            style={{
              width: `${SLIDES.length * 100}%`,
              transform: `translateX(-${(100 / SLIDES.length) * index}%)`,
            }}
          >
            {SLIDES.map((slide, si) => (
              <div key={si} className={s.slide} style={{ width: `${100 / SLIDES.length}%` }}>
                <div className={s.grid}>
                  {slide.map((card, ci) => (
                    <MarketingFeatureCard key={`${card.title}-${ci}`} {...card} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={s.progressWrap}>
          <div className={s.progressBar}>
            <div className={s.progressFill} style={{ width: `${((index + 1) / SLIDES.length) * 100}%` }} />
          </div>
          <div className={s.progressLabel} aria-live="polite">
            {index + 1} / {SLIDES.length}
          </div>
        </div>

        <div className={s.controls}>
          <button type="button" className={s.controlBtn} onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)} aria-label="Previous slide">
            ←
          </button>
          {SLIDES.map((_, i) => (
            <button key={i} type="button" className={i === index ? s.dotActive : s.dot} onClick={() => setIndex(i)} aria-label={`Slide ${i + 1}`} />
          ))}
          <button type="button" className={s.controlBtn} onClick={() => setIndex((i) => (i + 1) % SLIDES.length)} aria-label="Next slide">
            →
          </button>
        </div>
      </div>
    </section>
  );
}
