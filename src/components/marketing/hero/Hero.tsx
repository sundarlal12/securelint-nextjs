"use client";

import { useEffect, useState } from "react";
import s from "./Hero.module.css";

const ROWS = [
  { initials: "JD", bg: "#e8f0ed", color: "#40826d", from: "John Davis <john@company.com>", subject: "Q3 Sprint Review — attached credentials…", time: "2m ago" },
  { initials: "⚠", bg: "#fef2f2", color: "#dc2626", from: "security-alert@g00gle.support", subject: "Urgent: Verify your account immediately…", badge: "phishing" as const },
  { initials: "AK", bg: "#f0f4ff", color: "#2563eb", from: "Alice Kim <alice@company.com>", subject: "FWD: AWS keys for staging env → ████████", time: "15m" },
  { initials: "RS", bg: "#fff7ed", color: "#ea580c", from: "Raj Shah <raj@company.com>", subject: "Sending DB creds to personal@gmail.com", badge: "blocked" as const },
  { initials: "SL", bg: "#f2f7f5", color: "#40826d", from: "SecureLint Bot", subject: "2 threats blocked · 3 secrets masked today", time: "1h" },
];

const BROWSERS = [
  { name: "Chrome",  status: "available" as const, img: "/icons/icon-chrome.png" },
  { name: "Edge",    status: "soon"      as const, img: "/icons/icon-edge.webp" },
  { name: "Firefox", status: "soon"      as const, img: "/icons/icon-firefox.webp" },
  {
    name: "Safari",
    status: "soon" as const,
    img: null as null,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="url(#safGrad)"/>
        <defs><linearGradient id="safGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#1BAFFC"/><stop offset="1" stopColor="#177FE8"/></linearGradient></defs>
        <path d="M15 9l-4.24 4.24M9 15l4.24-4.24" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="1.5" fill="#fff"/>
      </svg>
    ),
  },
];

const STATS = [
  { value: "100+", label: "Security Checks" },
  { value: "500+", label: "Brands Tracked" },
  { value: "100+", label: "Languages" },
  { value: "24/7",  label: "Always On" },
];

// Sliding hero content — main title + accent + subtitle
const SLIDES = [
  {
    line1: "Stop Phishing Attacks",
    line2: "Before They Steal Your Data.",
    accent: "phishing & brand impersonation",
    lead: "SecureLint's 14-layer engine identifies fake sites, spoofed domains, and lookalike brands — blocked in milliseconds, before the page even loads.",
  },
  {
    line1: "Stop Secrets From Leaking.",
    line2: "Before It's Too Late.",
    accent: "API keys, tokens & credentials",
    lead: "Real-time masking of API keys, passwords, tokens, and secrets across every input, textarea, and rich-text editor you open.",
  },
  {
    line1: "Stop Email Phishing",
    line2: "Before You Click Send.",
    accent: "email DLP & send blocking",
    lead: "SecureLint intercepts outbound emails containing secrets or sensitive data — masking content and blocking accidental sends before they reach the wrong inbox.",
  },
  {
    line1: "Stop XSS & Cookie Theft",
    line2: "Before Your Session Is Hijacked.",
    accent: "XSS attacks & session hijacking",
    lead: "Detects cross-site scripting payloads and cookie-stealing attempts in real-time — protecting your active sessions from silent browser exploits.",
  },
  {
    line1: "Stop Crypto Wallet Drainers",
    line2: "Before They Empty Your Wallet.",
    accent: "wallet drainers & fake dApps",
    lead: "Identifies crypto wallet drain scripts, fake dApp interfaces, and Web3 phishing pages — protecting your assets before any transaction is signed.",
  },
  {
    line1: "Stop Social Engineering",
    line2: "Before It Manipulates You.",
    accent: "fake CAPTCHAs & ClickFix attacks",
    lead: "Neutralises fake CAPTCHA prompts, ClickFix malware drops, pastejacking guards, and hidden text attacks — every social-engineering vector, silently blocked.",
  },
  {
    line1: "Stop Password Breaches",
    line2: "Before Attackers Use Them.",
    accent: "breached credentials & HIBP checks",
    lead: "Monitors passwords in real-time against HaveIBeenPwned — alerting you the moment a credential you type has been exposed in a known data breach.",
  },
];

export function HeroSection() {
  const [idx, setIdx]     = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % SLIDES.length);
        setVisible(true);
      }, 350); // fade-out duration
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[idx];

  return (
    <section className={s.hero}>
      <div className={s.inner}>
        {/* ── Left: text column ── */}
        <div className={s.textCol}>
          <div className={s.eyebrowRow}>
            <div className={s.eyebrow}>🛡️ Sensitive Data Protector · Browser Extension</div>
            <div className={s.eyebrowChipGreen}>
              <span className={s.pulseDot} />
              Real-time AI detection
            </div>
          </div>

          {/* Animated main title */}
          <div className={`${s.titleWrap} ${visible ? s.slideIn : s.slideOut}`}>
            <h1 className={s.title}>
              {slide.line1}
              <br />
              <span className={s.gradient}>{slide.line2}</span>
            </h1>
          </div>

          {/* Animated sliding subtitle + accent */}
          <div className={s.slideWrap}>
            <div className={`${s.slideContent} ${visible ? s.slideIn : s.slideOut}`}>
              <p className={s.slideAccent}>
                {/* Animated radar/scan icon */}
                <span className={s.scanIcon} aria-hidden>
                  <svg className={s.scanRing1} width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="rgba(125,211,184,.35)" strokeWidth="1.5"/>
                  </svg>
                  <svg className={s.scanRing2} width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#7dd3b8" strokeWidth="1.5"
                      strokeDasharray="14 43" strokeLinecap="round"/>
                  </svg>
                  <span className={s.scanDot} />
                </span>
                Now scanning for{" "}
                <strong>{slide.accent}</strong>
              </p>
              <p className={s.lead}>{slide.lead}</p>
            </div>
          </div>

          <div className={s.btns}>
            <a
              href="https://chromewebstore.google.com/detail/securelint-%E2%80%93-sensitive-da/nfakpphnajjbmejbmpnlnamncdplkbna"
              target="_blank"
              rel="noopener noreferrer"
              className={s.btnPrimary}
            >
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Install Extension
            </a>
            <a href="#how-it-works" className={s.btnGhost}>
              See How It Works →
            </a>
          </div>

          {/* Browser support row */}
          <div className={s.browserRow}>
            {BROWSERS.map((b) => {
              const inner = (
                <>
                  <div className={b.status === "available" ? s.browserIconAvail : s.browserIconSoon}>
                    {b.img
                      ? <img src={b.img} width={22} height={22} alt={b.name} style={{ objectFit: "contain" }} />
                      : ("icon" in b ? b.icon : null)}
                  </div>
                  <span className={s.browserName}>{b.name}</span>
                  <span className={b.status === "available" ? s.badgeAvail : s.badgeSoon}>
                    {b.status === "available" ? "Available" : "Coming Soon"}
                  </span>
                </>
              );
              return b.status === "available" ? (
                <a
                  key={b.name}
                  href="https://chromewebstore.google.com/detail/securelint-%E2%80%93-sensitive-da/nfakpphnajjbmejbmpnlnamncdplkbna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${s.browserItem} ${s.browserItemLink}`}
                >
                  {inner}
                </a>
              ) : (
                <div key={b.name} className={s.browserItem}>{inner}</div>
              );
            })}
          </div>
        </div>

        {/* ── Right: animated card ── */}
        <div className={s.visualCol}>
          <div className={s.visualWrap}>
            <div className={s.chipC}>
              <span className={s.dot} style={{ background: "#dc2626" }} />
              Phishing Detected
            </div>
            <div className={s.chipH}>
              <span className={s.dot} style={{ background: "#ea580c" }} />
              Email DLP · Send Blocked
            </div>
            <div className={s.chipM}>
              <span className={s.dot} style={{ background: "#40826d" }} />
              3 Secrets Masked
            </div>

            <div className={s.editor}>
              <div className={s.editorBar}>
                <span className={s.dDot} />
                <span className={s.dDot} />
                <span className={s.dDot} />
                <span className={s.fileName}>Inbox · SecureLint protecting</span>
              </div>
              <div className={s.body}>
                <div className={s.scan} aria-hidden />
                {ROWS.map((row, i) => (
                  <div
                    key={i}
                    className={`${s.row} ${
                      row.badge === "phishing" ? s.rowPhishing : row.badge === "blocked" ? s.rowBlocked : ""
                    }`}
                  >
                    <div className={s.avatar} style={{ background: row.bg, color: row.color }}>
                      {row.initials}
                    </div>
                    <div className={s.content}>
                      <div className={row.color === "#dc2626" ? s.fromDanger : s.from}>{row.from}</div>
                      <div className={s.subj}>{row.subject}</div>
                    </div>
                    {row.time ? <span className={s.time}>{row.time}</span> : null}
                    {row.badge === "phishing" ? <span className={s.badgeP}>Phishing</span> : null}
                    {row.badge === "blocked" ? <span className={s.badgeB}>Blocked</span> : null}
                  </div>
                ))}
              </div>
              <div className={s.editorFoot}>
                <span className={s.efBadge}>🛡️ SECURELINT</span>
                <span className={s.efMeta}>1 phishing · 1 DLP · 3 secrets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full-width stats footer strip ── */}
      <div className={s.heroFooter}>
        <div className={s.heroFooterInner}>
          {STATS.map((st, i) => (
            <div key={st.label} className={s.footerStat}>
              {i > 0 && <div className={s.footerStatDiv} />}
              <span className={s.footerStatVal}>{st.value}</span>
              <span className={s.footerStatLabel}>{st.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
