"use client";

import s from "./MeetingMode.module.css";

/* ── 4 open tabs — content visible before armour slides in ── */
const TABS = [
  {
    title: "Jira — Project",
    lines: [
      { bold: "jira_api_***************", rest: " — API token" },
      { bold: "atlassian_***********",    rest: " — OAuth secret" },
    ],
    armour: s.armourA,
  },
  {
    title: "Stripe — Payouts",
    lines: [
      { bold: "sk_live_**************", rest: " — Secret key" },
      { bold: "rk_live_**************", rest: " — Restricted" },
    ],
    armour: s.armourB,
  },
  {
    title: "Razorpay — Keys",
    lines: [
      { bold: "rzp_live_***********", rest: " — Key ID" },
      { bold: "********************", rest: " — Key Secret" },
    ],
    armour: s.armourC,
  },
  {
    title: "OpenAI — API",
    lines: [
      { bold: "sk-proj-***************", rest: " — Project key" },
      { bold: "sk-org-****************", rest: " — Org key" },
    ],
    armour: s.armourD,
  },
];

const CHECKS = [
  "Auto-detects Google Meet, Zoom & Teams",
  "Masks Jira, Stripe, Razorpay, OpenAI & more",
  "Protects every open tab simultaneously",
  "Lifts instantly when the call ends",
];

/* ── Lock SVG ── */
function Lock({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

export function MeetingModeSection() {
  return (
    <section id="meeting-mode" className={s.section}>
      <div className={s.inner}>

        {/* ── Left: animated mock browser ── */}
        <div className={s.mockCol} role="img"
          aria-label="Meeting Mode blurring open tabs the moment a Google Meet call starts">
          <div className={s.browser}>

            {/* browser chrome */}
            <div className={s.browserBar} aria-hidden="true">
              <span className={s.dot} style={{ background: "#f87171" }} />
              <span className={s.dot} style={{ background: "#fb923c" }} />
              <span className={s.dot} style={{ background: "#4ade80" }} />
              <div className={s.addressBar}>meeting mode</div>
            </div>

            <div className={s.browserBody}>

              {/* "Zoom call detected" pill — loops with the animation */}
              <div className={s.callBadge} aria-live="polite">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                  <rect x="2" y="6" width="14" height="12" rx="2"/>
                </svg>
                Google Meet detected
              </div>

              {/* 2 × 2 tab grid */}
              <div className={s.tabGrid}>
                {TABS.map((tab) => (
                  <div key={tab.title} className={s.tabCard}>

                    {/* tab header */}
                    <div className={s.tabHeader}>
                      <span className={s.tabDot} />
                      <span className={s.tabTitle}>{tab.title}</span>
                    </div>

                    {/* tab body — sensitive data */}
                    <div className={s.tabBody}>
                      {tab.lines.map((l, i) => (
                        <div key={i} className={s.tabLine}>
                          <span className={s.bold}>{l.bold}</span>
                          <span className={s.muted}>{l.rest}</span>
                        </div>
                      ))}
                    </div>

                    {/* ── armour overlay ── */}
                    <div className={`${s.armour} ${tab.armour}`} aria-hidden="true">
                      {/* solid cover — hides all content */}
                      <div className={s.armourBg} />
                      {/* single clean redaction row */}
                      <span className={s.armourStars}>* * * * * * * * * * * * *</span>
                      {/* lock icon */}
                      <div className={s.armourLock}><Lock size={20} /></div>
                    </div>

                  </div>
                ))}
              </div>

              {/* status bar — fades in after all tabs are armoured */}
              <div className={s.statusBar}>
                <Lock size={13} />
                <span>
                  Meeting Mode active ·{" "}
                  <span className={s.statusMono}>4 tabs protected</span>
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
