"use client";

import { useState } from "react";
import s from "./PhishingDemo.module.css";

/* ── Data ───────────────────────────────────────────────────── */

const SIGNALS = [
  { bg: "#fff7ed", color: "#ea580c", sym: "⚡", text: "SPF softfail — sender weakly authorised" },
  { bg: "#f0f4ff", color: "#4f46e5", sym: "🗝",  text: "DKIM not signed" },
  { bg: "#fef2f2", color: "#dc2626", sym: "✕",   text: "DMARC policy failed — domain alignment broken", bold: true },
  { bg: "#fff7ed", color: "#ea580c", sym: "🔗",  text: "Malicious URL (threat score 40/100): prismatic-elf-f0328c.netlify.app" },
  { bg: "#f8f9fa", color: "#6d7581", sym: "👤",  text: "Reply-To redirects to free mail (gmail.com) — credential harvest likely" },
];

const HEADERS_ROWS = [
  { sym: "•", label: "Subject",     value: "sundar",           valueClass: "" },
  { sym: "↗", label: "SPF",         value: "SOFTFAIL",         valueClass: s.valAmber, sub: "IP 114.29.236.247" },
  { sym: "🛡", label: "DMARC",      value: "FAIL",             valueClass: s.valRed },
  { sym: "✉", label: "From domain", value: "gmail.com",        valueClass: "" },
  { sym: "↩", label: "Reply-To",    value: "gmail.com",        valueClass: "" },
];

const INFO_ROWS = [
  { sym: "⬡", label: "Return-Path",  value: "gmail.com",   valueClass: "" },
  { sym: "🔒", label: "Transit TLS", value: "TLS1_3",      valueClass: s.valGreen },
  { sym: "👤", label: "ARC chain",   value: "Present ✓",   valueClass: s.valGreen },
];

const CHECKS = [
  "SPF · DKIM · DMARC signal analysis",
  "Malicious link & attachment scoring",
  "Real-time threat score (0 – 100)",
  "100% local — no email data leaves your browser",
];

/* ── Tab definitions ────────────────────────────────────────── */
type Tab = "Signals" | "Headers" | "Info" | "Links";

const TABS: { id: Tab; label: string; icon: React.ReactNode; alert?: boolean }[] = [
  {
    id: "Signals",
    label: "Signals",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <line x1="8" y1="6"  x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <circle cx="3" cy="6"  r="1" fill="currentColor" stroke="none"/>
        <circle cx="3" cy="12" r="1" fill="currentColor" stroke="none"/>
        <circle cx="3" cy="18" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: "Headers",
    label: "Headers",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    id: "Info",
    label: "Info",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <line x1="4" y1="6"  x2="20" y2="6"/>
        <line x1="4" y1="12" x2="20" y2="12"/>
        <line x1="4" y1="18" x2="20" y2="18"/>
      </svg>
    ),
  },
  {
    id: "Links",
    label: "Links",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    alert: true,
  },
];

/* ── Gauge SVG ──────────────────────────────────────────────────
   Center (100,100), r=85, upper semicircle, sweep-flag=1
   180° → (15,100)     green start
   120° → (57.5,26.4)  green/yellow boundary
    60° → (142.5,26.4) yellow/red boundary
     0° → (185,100)    red end
─────────────────────────────────────────────────────────────── */

/* ── Tab panel sub-components ─────────────────────────────── */

function SignalsPanel() {
  return (
    <div className={s.panelContent}>
      {SIGNALS.map((sig, i) => (
        <div key={i} className={s.sigRow} style={{ animationDelay: `${i * 0.09}s` }}>
          <span className={s.sigIcon} style={{ background: sig.bg, color: sig.color }} aria-hidden="true">
            {sig.sym}
          </span>
          <span className={`${s.sigText} ${sig.bold ? s.sigTextBold : ""}`}>{sig.text}</span>
          <span className={s.sigChevron} aria-hidden="true">›</span>
        </div>
      ))}
    </div>
  );
}

function HeadersPanel() {
  return (
    <div className={s.panelContent}>
      {HEADERS_ROWS.map((r, i) => (
        <div key={i} className={s.infoRow} style={{ animationDelay: `${i * 0.09}s` }}>
          <span className={s.infoRowIcon} aria-hidden="true">{r.sym}</span>
          <span className={s.infoRowLabel}>{r.label}</span>
          <span className={s.infoRowRight}>
            <span className={`${s.infoRowVal} ${r.valueClass ?? ""}`}>{r.value}</span>
            {r.sub && <span className={s.infoRowSub}>{r.sub}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

function InfoPanel() {
  return (
    <div className={s.panelContent}>
      {INFO_ROWS.map((r, i) => (
        <div key={i} className={s.infoRow} style={{ animationDelay: `${i * 0.09}s` }}>
          <span className={s.infoRowIcon} aria-hidden="true">{r.sym}</span>
          <span className={s.infoRowLabel}>{r.label}</span>
          <span className={`${s.infoRowVal} ${r.valueClass ?? ""}`}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function LinksPanel() {
  return (
    <div className={s.panelContent}>
      <div className={s.linksHeader}>
        <span>SCORE</span>
        <span>URL</span>
        <span className={s.linksHeaderRight}>STATUS</span>
        <span>LINK</span>
      </div>
      <div className={s.linksRow} style={{ animationDelay: "0.05s" }}>
        <span className={s.linkScore}>40</span>
        <span className={s.linkUrl}>prismatic-elf-f0328c.n…</span>
        <span className={s.linkUnsafe}>Unsafe</span>
        <span className={s.linkBlock} aria-label="Blocked">🚫</span>
      </div>
      <div className={s.linksNote}>
        Scores via SecureLint scanner · &lt;50 = phishing risk
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */

export function PhishingDemoSection() {
  const [activeTab, setActiveTab] = useState<Tab>("Signals");
  const [panelKey, setPanelKey] = useState(0);

  function switchTab(tab: Tab) {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setPanelKey((k) => k + 1);
  }

  const Panel =
    activeTab === "Signals" ? SignalsPanel :
    activeTab === "Headers" ? HeadersPanel :
    activeTab === "Info"    ? InfoPanel    :
    LinksPanel;

  return (
    <section className={s.section}>
      <div className={s.inner}>

        {/* ── Left: copy ── */}
        <div className={s.textCol}>
          <div className={s.overline}>SecureLint · Email Security</div>
          <h2 className={s.h2}>
            Catches phishing emails{" "}
            <em className={s.italic}>before you click.</em>
          </h2>
          <p className={s.desc}>
            Every inbound email is silently scanned — SPF, DKIM and DMARC signals checked,
            every link scored for threat probability, and attachments fingerprinted.
            You see a clear 0–100 trust score before you ever open anything.
          </p>
          <ul className={s.checks}>
            {CHECKS.map((c) => (
              <li key={c} className={s.checkItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true" className={s.checkIcon}>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: mock phishing-detection card ── */}
        <div className={s.mockCol} role="img"
          aria-label="SecureLint phishing detection panel — score 100/100 Critical">
          <div className={s.card}>

            {/* ── Gauge + horizontal chips row ── */}
            <div className={s.gaugeRow}>
              {/* Gauge */}
              <div className={s.gaugeWrap}>
                <svg viewBox="0 0 200 130" className={s.gaugeSvg} aria-hidden="true">
                  {/* background track */}
                  <path d="M 15 100 A 85 85 0 0 1 185 100"
                    fill="none" stroke="#f3f4f6" strokeWidth="16" strokeLinecap="butt"/>
                  {/*
                    4 segments, each 45° (score 0→25→50→75→100)
                    Boundary coords (cx=100, cy=100, r=85):
                      180° → (15,   100)   score 0
                      135° → (39.9,  39.9) score 25
                       90° → (100,   15)   score 50
                       45° → (160.1, 39.9) score 75
                        0° → (185,  100)   score 100
                  */}
                  {/* green  0–25 */}
                  <path d="M 15 100 A 85 85 0 0 1 39.9 39.9"
                    fill="none" stroke="#86efac" strokeWidth="16"/>
                  {/* orange 25–50 */}
                  <path d="M 39.9 39.9 A 85 85 0 0 1 100 15"
                    fill="none" stroke="#fb923c" strokeWidth="16"/>
                  {/* light red 50–75 */}
                  <path d="M 100 15 A 85 85 0 0 1 160.1 39.9"
                    fill="none" stroke="#f87171" strokeWidth="16"/>
                  {/* dark red 75–100 */}
                  <path d="M 160.1 39.9 A 85 85 0 0 1 185 100"
                    fill="none" stroke="#dc2626" strokeWidth="16"/>
                  {/* animated needle */}
                  <line x1="100" y1="100" x2="163" y2="100"
                    stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"
                    className={s.needleAnim}/>
                  {/* pivot */}
                  <circle cx="100" cy="100" r="5" fill="#dc2626"/>
                  {/* score */}
                  <text x="100" y="87" textAnchor="middle" fill="#dc2626"
                    fontSize="26" fontWeight="900" fontFamily="system-ui,sans-serif">100</text>
                  {/* 0 / 100 labels */}
                  <text x="12"  y="118" textAnchor="middle" fill="#9ca3af" fontSize="9.5" fontFamily="system-ui,sans-serif">0</text>
                  <text x="188" y="118" textAnchor="middle" fill="#9ca3af" fontSize="9.5" fontFamily="system-ui,sans-serif">100</text>
                  {/* Critical pill */}
                  <rect x="68" y="106" width="64" height="17" rx="8" fill="#fef2f2"/>
                  <text x="100" y="118.5" textAnchor="middle" fill="#dc2626"
                    fontSize="9" fontWeight="700" fontFamily="system-ui,sans-serif">Critical</text>
                </svg>
              </div>

              {/* ── Chips — HORIZONTAL row aligned to top-right ── */}
              <div className={s.chipsRow}>
                <span className={s.chipYellow}>SPF –</span>
                <span className={s.chipRed}>DMARC ×</span>
                <span className={s.chipUser} aria-label="User">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M20 21a8 8 0 1 0-16 0"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* ── Phishing threat badge ── */}
            <div className={s.threatBadge}>
              <span aria-hidden="true">⚡</span>
              <span className={s.threatLabel}>Phishing</span>
              <span className={s.threatSub}>(Critical)</span>
              <span className={s.threatScore}>100/100</span>
            </div>

            {/* ── Interactive tab bar ── */}
            <div className={s.tabs} role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={activeTab === t.id}
                  className={`${s.tab} ${activeTab === t.id ? s.tabActive : ""}`}
                  onClick={() => switchTab(t.id)}
                >
                  <span className={s.tabIcon}>{t.icon}</span>
                  {t.label}
                  {t.alert && <span className={s.tabAlert} aria-label="1 warning">1⚠</span>}
                </button>
              ))}
            </div>

            {/* ── Tab panel — re-keyed so CSS animation replays ── */}
            <div key={panelKey} className={s.tabPanel}>
              <Panel />
            </div>

            {/* ── Footer ── */}
            <div className={s.cardFoot}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://securelint.in/icons/icon-128.png"
                alt="SecureLint"
                width={18}
                height={18}
                className={s.footLogo}
              />
              <span className={s.footText}>SecureLint · securelint.in</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
