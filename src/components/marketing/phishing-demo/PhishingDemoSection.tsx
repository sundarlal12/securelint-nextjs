"use client";

import s from "./PhishingDemo.module.css";

const SIGNALS = [
  {
    bg: "#fff7ed", color: "#ea580c", sym: "⚡",
    text: "SPF softfail — sender weakly authorised",
  },
  {
    bg: "#f0f4ff", color: "#4f46e5", sym: "🗝",
    text: "DKIM not signed",
  },
  {
    bg: "#fef2f2", color: "#dc2626", sym: "✕",
    text: "DMARC policy failed — domain alignment broken",
    bold: true,
  },
  {
    bg: "#fff7ed", color: "#ea580c", sym: "🔗",
    text: "Malicious URL (threat score 40/100): prismatic-elf-f0328c.netlify.app",
  },
  {
    bg: "#f8f9fa", color: "#6d7581", sym: "👤",
    text: "Reply-To redirects to free mail (gmail.com) — credential harvest likely",
  },
];

const CHECKS = [
  "SPF · DKIM · DMARC signal analysis",
  "Malicious link & attachment scoring",
  "Real-time threat score (0 – 100)",
  "100% local — no email data leaves your browser",
];

/* Gauge SVG coords (center 100,100, radius 85, upper semicircle)
   Angles: 180° = left (score 0), 0° = right (score 100)
   x = 100 + 85·cos(θ),  y = 100 − 85·sin(θ)

   Segment boundaries:
     180° → (15, 100)          green start
     120° → (57.5, 26.4)       green/yellow boundary
      60° → (142.5, 26.4)      yellow/red boundary
       0° → (185, 100)         red end
*/

export function PhishingDemoSection() {
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
            You see a clear 0–100 trust score before you ever click or open anything.
          </p>
          <ul className={s.checks}>
            {CHECKS.map((c) => (
              <li key={c} className={s.checkItem}>
                <svg
                  width="18" height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={s.checkIcon}
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: mock phishing-detection card ── */}
        <div
          className={s.mockCol}
          role="img"
          aria-label="SecureLint phishing detection panel showing score 100/100 Critical with signal breakdown"
        >
          <div className={s.card}>

            {/* ── Gauge + status chips row ── */}
            <div className={s.gaugeRow}>
              <div className={s.gaugeWrap}>
                <svg viewBox="0 0 200 130" className={s.gaugeSvg} aria-hidden="true">
                  {/* background arc track */}
                  <path
                    d="M 15 100 A 85 85 0 0 1 185 100"
                    fill="none" stroke="#f0f0f0" strokeWidth="18" strokeLinecap="butt"
                  />
                  {/* green segment 180°→120° */}
                  <path
                    d="M 15 100 A 85 85 0 0 1 57.5 26.4"
                    fill="none" stroke="#22c55e" strokeWidth="18"
                  />
                  {/* yellow segment 120°→60° */}
                  <path
                    d="M 57.5 26.4 A 85 85 0 0 1 142.5 26.4"
                    fill="none" stroke="#eab308" strokeWidth="18"
                  />
                  {/* red segment 60°→0° */}
                  <path
                    d="M 142.5 26.4 A 85 85 0 0 1 185 100"
                    fill="none" stroke="#ef4444" strokeWidth="18"
                  />
                  {/* needle — pointing to 0° (score 100, rightmost) */}
                  <line
                    x1="100" y1="100" x2="165" y2="100"
                    stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"
                    className={s.needleAnim}
                  />
                  {/* pivot dot */}
                  <circle cx="100" cy="100" r="5.5" fill="#dc2626" />
                  {/* score number */}
                  <text x="100" y="88" textAnchor="middle" fill="#dc2626"
                    fontSize="28" fontWeight="900" fontFamily="inherit">
                    100
                  </text>
                  {/* axis labels */}
                  <text x="12" y="118" textAnchor="middle" fill="#9ca3af"
                    fontSize="10" fontFamily="inherit">0</text>
                  <text x="188" y="118" textAnchor="middle" fill="#9ca3af"
                    fontSize="10" fontFamily="inherit">100</text>
                  {/* Critical badge inside SVG */}
                  <rect x="70" y="107" width="60" height="17" rx="8" fill="#fef2f2" />
                  <text x="100" y="119.5" textAnchor="middle" fill="#dc2626"
                    fontSize="9.5" fontWeight="700" fontFamily="inherit">Critical</text>
                </svg>
              </div>

              {/* status chips */}
              <div className={s.chipsCol}>
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

            {/* ── Threat badge ── */}
            <div className={s.threatBadge}>
              <span aria-hidden="true">⚡</span>
              <span className={s.threatLabel}>Phishing</span>
              <span className={s.threatSub}>(Critical)</span>
              <span className={s.threatScore}>100/100</span>
            </div>

            {/* ── Tabs ── */}
            <div className={s.tabs} role="tablist">
              {["Signals", "Headers", "Info", "Links"].map((t, i) => (
                <div
                  key={t}
                  role="tab"
                  aria-selected={i === 0}
                  className={`${s.tab} ${i === 0 ? s.tabActive : ""}`}
                >
                  {i === 3 && <span className={s.tabAlert} aria-label="1 alert">1⚠</span>}
                  {t}
                </div>
              ))}
            </div>

            {/* ── Signal rows ── */}
            <div className={s.signals}>
              {SIGNALS.map((sig, i) => (
                <div
                  key={i}
                  className={s.sigRow}
                  style={{ animationDelay: `${0.35 + i * 0.12}s` }}
                >
                  <span
                    className={s.sigIcon}
                    style={{ background: sig.bg, color: sig.color }}
                    aria-hidden="true"
                  >
                    {sig.sym}
                  </span>
                  <span className={`${s.sigText} ${sig.bold ? s.sigTextBold : ""}`}>
                    {sig.text}
                  </span>
                  <span className={s.sigChevron} aria-hidden="true">›</span>
                </div>
              ))}
            </div>

            {/* ── Card footer ── */}
            <div className={s.cardFoot}>
              <span className={s.footLogo} aria-hidden="true">S</span>
              <span className={s.footText}>SecureLint · securelint.in</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
