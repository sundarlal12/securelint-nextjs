"use client";

import s from "./MeetingMode.module.css";

/* ── The 4 open tabs that get armoured ── */
const TABS = [
  {
    title: "AWS Console",
    lines: [
      { bold: "AKIAIOSFODNN7EXAMPLE", rest: " — Access Key" },
      { bold: "wJalrXUtnFEMI/K7MD…",  rest: " — Secret Key" },
    ],
    delay: s.delayA,
  },
  {
    title: "GitHub — Secrets",
    lines: [
      { bold: "ghp_a1B2c3D4e5F6g7H8", rest: " — PAT" },
      { bold: "ghs_xYzAbCdEfGhIjKl",  rest: " — Actions secret" },
    ],
    delay: s.delayB,
  },
  {
    title: "Stripe — API Keys",
    lines: [
      { bold: "sk_live_51Abc…XYZ", rest: " — Secret key" },
      { bold: "rk_live_43Def…ABC", rest: " — Restricted" },
    ],
    delay: s.delayC,
  },
  {
    title: "Notion — Creds",
    lines: [
      { bold: "secret_KxQe7…fGhIj", rest: " — Integration" },
      { bold: "ntn_12abc…xyz99",    rest: " — API key" },
    ],
    delay: s.delayD,
  },
];

const CHECKS = [
  "Auto-detects Zoom, Meet & Teams",
  "Blurs API keys, tokens & credentials",
  "Protects every open tab simultaneously",
  "Lifts instantly when the call ends",
];

/* ── Lock icon ── */
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

/* ── Armour overlay (blur + lock) ── */
function Armour({ delayClass }: { delayClass: string }) {
  return (
    <div className={`${s.armour} ${delayClass}`} aria-hidden="true">
      <div className={s.armourBg} />
      {/* redaction dots row */}
      <div className={s.armourDots}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={s.armourDot} />
        ))}
      </div>
      <div className={s.armourLock}>
        <LockIcon />
      </div>
    </div>
  );
}

export function MeetingModeSection() {
  return (
    <section id="meeting-mode" className={s.section}>
      <div className={s.inner}>

        {/* ── Left: mock browser window ── */}
        <div className={s.mockCol} role="img"
          aria-label="Meeting Mode blurring four open tabs the moment a Zoom call starts">
          <div className={s.browser}>

            {/* browser chrome bar */}
            <div className={s.browserBar} aria-hidden="true">
              <span className={s.dot} style={{ background: "#f87171" }} />
              <span className={s.dot} style={{ background: "#fb923c" }} />
              <span className={s.dot} style={{ background: "#4ade80" }} />
              <div className={s.addressBar}>meeting mode · securelint active</div>
            </div>

            <div className={s.browserBody}>
              {/* "Zoom call detected" pill */}
              <div className={s.callBadge}>
                {/* video icon */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                  <rect x="2" y="6" width="14" height="12" rx="2"/>
                </svg>
                Zoom call detected
              </div>

              {/* 2×2 tab grid */}
              <div className={s.tabGrid}>
                {TABS.map((tab) => (
                  <div key={tab.title} className={s.tabCard}>
                    {/* tab header */}
                    <div className={s.tabHeader}>
                      <span className={s.tabDot} />
                      <span className={s.tabTitle}>{tab.title}</span>
                    </div>
                    {/* tab content — sensitive data */}
                    <div className={s.tabBody}>
                      {tab.lines.map((l, i) => (
                        <div key={i} className={s.tabLine}>
                          <span className={s.tabLineBold}>{l.bold}</span>
                          <span className={s.tabLineRest}>{l.rest}</span>
                        </div>
                      ))}
                    </div>
                    {/* armour overlay */}
                    <Armour delayClass={tab.delay} />
                  </div>
                ))}
              </div>

              {/* status bar */}
              <div className={s.statusBar}>
                <LockIcon />
                <span>
                  Meeting Mode active ·{" "}
                  <span className={s.statusCount}>4 tabs protected</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: copy ── */}
        <div className={s.textCol}>
          <div className={s.overline}>SecureLint · Meeting Mode</div>
          <h2 className={s.h2}>
            Masks secrets the second{" "}
            <em className={s.italic}>a call starts.</em>
          </h2>
          <p className={s.desc}>
            Meeting Mode detects active Zoom, Meet, or Teams sessions. The moment a call
            begins, SecureLint instantly blurs API keys, credentials and secrets across
            every open tab — so sensitive data never appears on screen during a demo,
            interview, or live review.
          </p>
          <ul className={s.checks}>
            {CHECKS.map((c) => (
              <li key={c} className={s.checkItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true" className={s.checkIcon}>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
