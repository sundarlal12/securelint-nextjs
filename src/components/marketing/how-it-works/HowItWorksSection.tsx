"use client";

import s from "./HowItWorks.module.css";

/* ── #01 token-grid data: "d" = detected (dark), "n" = neutral (light) ── */
const CELLS: Array<"d" | "n"> = [
  "d","n","d","d","n",
  "n","d","d","n","d",
  "d","d","n","d","n",
  "n","d","d","n","d",
];

/* ── #02 masked credentials ── */
const CREDS = [
  { k: "STRIPE_KEY",  v: "sk_live_a1b2c3",  delay: 0   },
  { k: "AWS_SECRET",  v: "wJalrXUtnFEM",    delay: 150 },
  { k: "DB_PASSWORD", v: "hunter2!xyz99",   delay: 300 },
];

/* ── #04 email tabs ── */
const TABS = ["Inbox (47)", "Compose", "AWS Alerts", "Slack DMs"];

/* ── #05 severity levels ── */
const SEVERITY = [
  { label: "Critical", color: "#dc2626", pct: "18%" },
  { label: "High",     color: "#ea580c", pct: "38%" },
  { label: "Medium",   color: "#d97706", pct: "62%" },
  { label: "Low",      color: "#40826d", pct: "84%" },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className={s.section}>
      <div className={s.inner}>

        {/* ── Header ── */}
        <div className={s.head}>
          <div className={s.overline}>The full toolkit</div>
          <h2 className={s.h2}>
            Six ways SecureLint protects you.
            <br />
            <em className={s.italic}>One install. Always on.</em>
          </h2>
        </div>

        {/* ── Bento grid ── */}
        <ul role="list" className={s.grid}>

          {/* ───────────────────────────────────────────
              #01  Instant Detection — blurring token grid
          ─────────────────────────────────────────── */}
          <li>
            <article className={s.card} aria-labelledby="sl-01">
              <span className={s.num} aria-hidden="true">#01</span>

              <div className={s.visual}>
                <div className={s.v01Grid}>
                  {CELLS.map((t, i) => (
                    <div
                      key={i}
                      className={t === "d" ? s.v01CellD : s.v01CellN}
                      style={{
                        transitionDelay: `${Math.floor(i / 5) * 60 + (i % 5) * 40}ms`,
                        animationDelay:  `${Math.floor(i / 5) * 60 + (i % 5) * 40}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <h3 id="sl-01" className={s.cardTitle}>Instant Detection</h3>
              <p className={s.cardDesc}>
                100+ regex patterns scan every keystroke for AWS keys, Stripe secrets, JWT tokens,
                and more — entirely inside your browser, zero latency.
              </p>
            </article>
          </li>

          {/* ───────────────────────────────────────────
              #02  Real-time Masking — values blur on hover
          ─────────────────────────────────────────── */}
          <li>
            <article className={s.card} aria-labelledby="sl-02">
              <span className={s.num} aria-hidden="true">#02</span>

              <div className={s.visual}>
                <div className={s.v02Wrap}>
                  {CREDS.map((r) => (
                    <div key={r.k} className={s.v02Row}>
                      <span className={s.v02Key}>{r.k}</span>
                      <span className={s.v02Eq}>=</span>
                      <span
                        className={s.v02Val}
                        style={{
                          transitionDelay: `${r.delay}ms`,
                          animationDelay:  `${r.delay}ms`,
                        }}
                      >
                        {r.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <h3 id="sl-02" className={s.cardTitle}>Real-time Masking</h3>
              <p className={s.cardDesc}>
                Detected secrets are replaced with ████ blocks the moment they appear.
                Original stays in memory — masked on-screen. Nothing leaves the tab.
              </p>
            </article>
          </li>

          {/* ───────────────────────────────────────────
              #03  Phishing Detection — selection expands
          ─────────────────────────────────────────── */}
          <li>
            <article className={s.card} aria-labelledby="sl-03">
              <span className={s.num} aria-hidden="true">#03</span>

              <div className={s.visual}>
                <div className={s.v03Wrap}>
                  <div className={s.v03Hatch} aria-hidden="true" />
                  <div className={s.v03Selection}>
                    <div className={`${s.v03Dot} ${s.v03TL}`} />
                    <div className={`${s.v03Dot} ${s.v03TR}`} />
                    <div className={`${s.v03Dot} ${s.v03BL}`} />
                    <div className={`${s.v03Dot} ${s.v03BR}`} />
                    <div className={s.v03UrlBar}>
                      <span className={s.v03Warn}>⚠</span>
                      <span className={s.v03Url}>security-alert@g00gle.support</span>
                    </div>
                  </div>
                  <div className={s.v03Badge}>Phishing Detected</div>
                </div>
              </div>

              <h3 id="sl-03" className={s.cardTitle}>Phishing Detection</h3>
              <p className={s.cardDesc}>
                500+ tracked brands, domain-age checks, and lookalike analysis flag fake sites
                in milliseconds — before the page finishes loading.
              </p>
            </article>
          </li>

          {/* ───────────────────────────────────────────
              #04  Email DLP — tab titles covered + blocked banner
          ─────────────────────────────────────────── */}
          <li>
            <article className={s.card} aria-labelledby="sl-04">
              <span className={s.num} aria-hidden="true">#04</span>

              <div className={s.visual}>
                <div className={s.v04Wrap}>
                  <div className={s.v04TabRow}>
                    {TABS.map((t, i) => (
                      <div key={t} className={s.v04Tab}>
                        <div className={s.v04TabDot} />
                        <div className={s.v04TabInner}>
                          <span className={s.v04TabText}>{t}</span>
                          <span
                            className={s.v04Cover}
                            style={{
                              transitionDelay: `${i * 90}ms`,
                              animationDelay:  `${i * 90}ms`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={s.v04Body} />
                  <div className={s.v04Banner}>
                    <span role="img" aria-label="shield">🛡️</span>
                    Send Blocked · Secrets Detected
                  </div>
                </div>
              </div>

              <h3 id="sl-04" className={s.cardTitle}>Email DLP</h3>
              <p className={s.cardDesc}>
                Intercepts outbound Gmail sends containing API keys or PII — masking content
                and blocking accidental sends before they reach the wrong inbox.
              </p>
            </article>
          </li>

          {/* ───────────────────────────────────────────
              #05  Severity Triage — bars grow on hover
          ─────────────────────────────────────────── */}
          <li>
            <article className={s.card} aria-labelledby="sl-05">
              <span className={s.num} aria-hidden="true">#05</span>

              <div className={s.visual}>
                <div className={s.v05Wrap}>
                  {SEVERITY.map((sv, i) => (
                    <div key={sv.label} className={s.v05Row}>
                      <span className={s.v05Label} style={{ color: sv.color }}>{sv.label}</span>
                      <div className={s.v05Track}>
                        <div
                          className={s.v05Bar}
                          style={{
                            background:      sv.color,
                            "--bar-w":       sv.pct,
                            transitionDelay: `${i * 80}ms`,
                            animationDelay:  `${i * 80}ms`,
                          } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  ))}
                  <div className={s.v05SliderRow}>
                    <div className={s.v05SliderTrack}>
                      <div className={s.v05SliderFill} />
                    </div>
                  </div>
                </div>
              </div>

              <h3 id="sl-05" className={s.cardTitle}>Severity Triage</h3>
              <p className={s.cardDesc}>
                Every finding is tagged Critical, High, Medium, or Low. A live counter per
                session shows exactly what was caught and when.
              </p>
            </article>
          </li>

          {/* ───────────────────────────────────────────
              #06  14-Layer Engine — cards fan out on hover
          ─────────────────────────────────────────── */}
          <li>
            <article className={s.card} aria-labelledby="sl-06">
              <span className={s.num} aria-hidden="true">#06</span>

              <div className={s.visual}>
                <div className={s.v06Wrap}>
                  {/* back card */}
                  <div className={`${s.v06Card} ${s.v06Back}`}>
                    <div className={s.v06Bar} style={{ background: "#40826d" }} />
                    <div className={s.v06Lines}>
                      <div className={s.v06Line} />
                      <div className={s.v06LineShort} />
                    </div>
                    <span className={s.v06Tag} style={{ background: "#40826d", color: "#fff" }}>
                      Phishing
                    </span>
                  </div>
                  {/* mid card */}
                  <div className={`${s.v06Card} ${s.v06Mid}`}>
                    <div className={s.v06Bar} style={{ background: "#c8e6dc" }} />
                    <div className={s.v06Lines}>
                      <div className={s.v06Line} />
                      <div className={s.v06LineShort} />
                    </div>
                    <span className={s.v06Tag} style={{ background: "#c8e6dc", color: "#0e101a" }}>
                      XSS Guard
                    </span>
                  </div>
                  {/* front card */}
                  <div className={`${s.v06Card} ${s.v06Front}`}>
                    <div className={s.v06Bar} style={{ background: "#0e101a" }} />
                    <div className={s.v06Lines}>
                      <div className={s.v06Line} />
                      <div className={s.v06LineShort} />
                    </div>
                    <span className={s.v06Tag} style={{ background: "#0e101a", color: "#fff" }}>
                      Secrets
                    </span>
                  </div>
                </div>
              </div>

              <h3 id="sl-06" className={s.cardTitle}>14-Layer Engine</h3>
              <p className={s.cardDesc}>
                XSS detection, crypto drain guards, HIBP breach checks, SSL validation,
                pastejack protection — each layer runs silently in parallel.
              </p>
            </article>
          </li>

        </ul>
      </div>
    </section>
  );
}
