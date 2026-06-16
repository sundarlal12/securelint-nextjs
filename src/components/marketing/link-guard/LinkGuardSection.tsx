"use client";

import s from "./LinkGuard.module.css";

/* ── compact gauge for popup header ── */
function PopupGauge() {
  // center (40,38), r=28 — 4 segments, needle at 40% (108° standard)
  // tip: (40+28*cos108°, 38-28*sin108°) = (40-8.65, 38-26.63) = (31.4, 11.4)
  return (
    <svg viewBox="0 0 80 48" width="64" height="38" aria-hidden="true">
      <path d="M 12 38 A 28 28 0 0 1 68 38" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="6" strokeLinecap="round"/>
      <path d="M 12 38 A 28 28 0 0 1 20.2 18.2" fill="none" stroke="#86efac" strokeWidth="6" strokeLinecap="round"/>
      <path d="M 20.2 18.2 A 28 28 0 0 1 40 10"   fill="none" stroke="#fb923c" strokeWidth="6" strokeLinecap="round"/>
      <path d="M 40 10 A 28 28 0 0 1 59.8 18.2"   fill="none" stroke="#f87171" strokeWidth="6" strokeLinecap="round"/>
      <path d="M 59.8 18.2 A 28 28 0 0 1 68 38"   fill="none" stroke="#dc2626" strokeWidth="6" strokeLinecap="round"/>
      <line x1="40" y1="38" x2="31.4" y2="11.4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="40" cy="38" r="3" fill="#fff"/>
      <text x="40" y="35" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">40</text>
    </svg>
  );
}

/* ── mouse cursor SVG ── */
function Cursor() {
  return (
    <svg className={s.cursor} viewBox="0 0 20 24" width="18" height="22" aria-hidden="true">
      <path d="M1 1L1 18L5.5 14L8.5 21L11 20L8 13.5L14 13.5L1 1Z"
        fill="white" stroke="#1e293b" strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

const CHECKS = [
  "Scans every link before you click",
  "Flags phishing, impersonation & brand spoofing",
  "Shows trust score with a live visual gauge",
  "Works silently inside Gmail, Outlook & Webmail",
];

export function LinkGuardSection() {
  return (
    <section id="link-guard" className={s.section}>
      <div className={s.inner}>

        {/* ── Left: copy ── */}
        <div className={s.textCol}>
          <div className={s.overline}>SecureLint · Link Guard</div>
          <h2 className={s.h2}>
            Stops phishing links{" "}
            <em className={s.italic}>before you click.</em>
          </h2>
          <p className={s.desc}>
            The moment you open a suspicious email and hover over a link, SecureLint
            silently checks its domain, reputation score, SSL status, and brand
            impersonation signals — then blocks your click if the link is unsafe.
          </p>
          <ul className={s.checks}>
            {CHECKS.map((c) => (
              <li key={c} className={s.checkItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true" className={s.checkIcon}>
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: animated mock browser ── */}
        <div className={s.mockCol}
          role="img"
          aria-label="Animated demo: phishing email opens, mouse clicks the link, SecureLint popup blocks it">

          <div className={s.browser}>

            {/* chrome bar */}
            <div className={s.browserBar} aria-hidden="true">
              <span className={s.dot} style={{ background: "#f87171" }}/>
              <span className={s.dot} style={{ background: "#fb923c" }}/>
              <span className={s.dot} style={{ background: "#4ade80" }}/>
              <div className={s.addressBar}>mail.google.com/mail</div>
            </div>

            <div className={s.browserBody}>

              {/* ── Email content ── */}
              <div className={s.emailView}>
                <div className={s.emailMeta}>
                  <div className={s.emailAvatar}>⚠</div>
                  <div>
                    <div className={s.emailSender}>noreply@acc-verify-secure.net</div>
                    <div className={s.emailSubject}>Account Notice · Action Required</div>
                  </div>
                </div>
                <div className={s.emailDivider}/>
                <div className={s.emailBody}>
                  <p className={s.emailPara}>Hello,</p>
                  <p className={s.emailPara}>
                    We are reaching out with a reminder to review the information
                    associated with your account.
                  </p>
                  <p className={s.emailPara}>
                    Keeping your details current helps ensure continued access
                    to available features and services.
                  </p>
                  <div className={s.emailCtaWrap}>
                    <span className={s.emailCta}>Review Payment Information</span>
                  </div>
                </div>
              </div>

              {/* ── Mouse cursor — animates from top-right to button ── */}
              <Cursor />

              {/* ── SecureLint popup — slides in after click ── */}
              <div className={s.popup}>

                <div className={s.popupHead}>
                  <div className={s.popupHeadLeft}>
                    <div className={s.popupIcon}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </div>
                    <div>
                      <div className={s.popupLabel}>SECURELINT · LINK SAFETY</div>
                      <div className={s.popupTitle}>Unsafe Link Detected</div>
                      <div className={s.popupUrl}>acc-verify-secure.net</div>
                    </div>
                  </div>
                  <div className={s.popupGaugeWrap}>
                    <PopupGauge/>
                    <div className={s.popupUnsafe}>UNSAFE</div>
                  </div>
                </div>

                <div className={s.popupBody}>
                  <div className={s.popupAlert}>
                    <span className={s.popupAlertUrl}>acc-verify-secure.net</span>
                    {" "}has been identified as a{" "}
                    <strong>malicious or phishing site</strong> by SecureLint.
                    We strongly recommend you do not proceed.
                  </div>

                  <div className={s.popupWhyLabel}>WHY THIS MATTERS</div>

                  <div className={s.popupCard}>
                    <div className={s.popupCardIcon}>🔒</div>
                    <div>
                      <div className={s.popupCardTitle}>Phishing Sites Steal Credentials</div>
                      <div className={s.popupCardDesc}>
                        Clicking this link can expose your email, passwords, and
                        banking credentials to attackers in real time.
                      </div>
                    </div>
                  </div>

                  <div className={s.popupDots}>
                    <span className={`${s.popupDot} ${s.dotActive}`}/>
                    <span className={s.popupDot}/><span className={s.popupDot}/><span className={s.popupDot}/>
                  </div>
                </div>

                <div className={s.popupFoot}>
                  <div className={s.popupDisclaimer}>
                    By proceeding you accept the associated risks per your org's policy.
                  </div>
                  <div className={s.popupBtns}>
                    <button className={s.btnDismiss}>Dismiss</button>
                    <button className={s.btnVisit}>⚠ Visit Anyway</button>
                  </div>
                </div>

                <div className={s.popupBrand}>
                  <img src="https://securelint.in/icons/icon-128.png"
                    alt="" width="12" height="12" className={s.popupBrandLogo}/>
                  <span>SecureLint · </span>
                  <span className={s.popupBrandLink}>securelint.in</span>
                  <span> · Email Security Platform</span>
                </div>

              </div>{/* /popup */}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
