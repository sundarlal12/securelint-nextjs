"use client";

import s from "./LinkGuard.module.css";

/* ── Mini gauge SVG for the popup ── */
function PopupGauge() {
  // viewBox 0 0 100 58, center (50,50), r=38
  // Arcs: 180°→135° green, 135°→90° orange, 90°→45° light-red, 45°→0° dark-red
  // Needle at score 40 → 40% of 180° = 72° from right = 108° standard
  // Needle tip: (50+38*cos(108°), 50-38*sin(108°)) = (38.3, 13.9)
  return (
    <svg viewBox="0 0 100 58" width="80" height="46" aria-hidden="true">
      {/* bg track */}
      <path d="M 12 50 A 38 38 0 0 1 88 50" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="7" strokeLinecap="round"/>
      {/* green 180°→135° */}
      <path d="M 12 50 A 38 38 0 0 1 23.1 23.1" fill="none" stroke="#86efac" strokeWidth="7" strokeLinecap="round"/>
      {/* orange 135°→90° */}
      <path d="M 23.1 23.1 A 38 38 0 0 1 50 12" fill="none" stroke="#fb923c" strokeWidth="7" strokeLinecap="round"/>
      {/* light-red 90°→45° */}
      <path d="M 50 12 A 38 38 0 0 1 76.9 23.1" fill="none" stroke="#f87171" strokeWidth="7" strokeLinecap="round"/>
      {/* dark-red 45°→0° */}
      <path d="M 76.9 23.1 A 38 38 0 0 1 88 50" fill="none" stroke="#dc2626" strokeWidth="7" strokeLinecap="round"/>
      {/* needle */}
      <line x1="50" y1="50" x2="38.3" y2="13.9" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      {/* pivot */}
      <circle cx="50" cy="50" r="3.5" fill="#fff"/>
      {/* score */}
      <text x="50" y="47" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">40</text>
    </svg>
  );
}

const CHECKS = [
  "Scans every link before you click",
  "Flags phishing, impersonation & brand spoofing",
  "Shows trust score with visual gauge",
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

        {/* ── Right: animated mock ── */}
        <div className={s.mockCol}
          role="img"
          aria-label="Email with a phishing link gets intercepted by SecureLint's Unsafe Link Detected popup">

          <div className={s.browser}>
            {/* chrome bar */}
            <div className={s.browserBar} aria-hidden="true">
              <span className={s.dot} style={{ background: "#f87171" }} />
              <span className={s.dot} style={{ background: "#fb923c" }} />
              <span className={s.dot} style={{ background: "#4ade80" }} />
              <div className={s.addressBar}>mail.google.com/mail</div>
            </div>

            <div className={s.browserBody}>

              {/* ── Email view — fades in, then popup covers it ── */}
              <div className={s.emailView}>

                {/* email header */}
                <div className={s.emailMeta}>
                  <div className={s.emailAvatar}>⚠</div>
                  <div>
                    <div className={s.emailSender}>noreply@acc-verify-secure.net</div>
                    <div className={s.emailSubject}>Account Notice · Action Required</div>
                  </div>
                </div>

                <div className={s.emailDivider} />

                {/* email body */}
                <div className={s.emailBody}>
                  <p className={s.emailPara}>Hello,</p>
                  <p className={s.emailPara}>
                    We are reaching out with a reminder to review the information
                    associated with your account.
                  </p>
                  <p className={s.emailPara}>
                    Keeping your account details current helps ensure a smooth
                    experience and continued access to available features.
                  </p>
                  {/* the CTA link — pulses before popup appears */}
                  <div className={s.emailCtaWrap}>
                    <span className={s.emailCta}>Review Payment Information</span>
                  </div>
                </div>
              </div>

              {/* ── SecureLint popup — slides in after "click" ── */}
              <div className={s.popup} aria-live="assertive">

                {/* red header */}
                <div className={s.popupHead}>
                  <div className={s.popupHeadLeft}>
                    <div className={s.popupIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                        aria-hidden="true">
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
                    <PopupGauge />
                    <div className={s.popupUnsafe}>UNSAFE</div>
                  </div>
                </div>

                {/* body */}
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

                  {/* pagination dots */}
                  <div className={s.popupDots}>
                    <span className={`${s.popupDot} ${s.dotActive}`} />
                    <span className={s.popupDot} />
                    <span className={s.popupDot} />
                    <span className={s.popupDot} />
                  </div>
                </div>

                {/* footer buttons */}
                <div className={s.popupFoot}>
                  <div className={s.popupDisclaimer}>
                    By proceeding you accept the associated risks per your org's policy.
                  </div>
                  <div className={s.popupBtns}>
                    <button className={s.btnDismiss}>Dismiss</button>
                    <button className={s.btnVisit}>⚠ Visit Anyway</button>
                  </div>
                </div>

                {/* branding */}
                <div className={s.popupBrand}>
                  <img src="https://securelint.in/icons/icon-128.png"
                    alt="SecureLint" width="14" height="14"
                    className={s.popupBrandLogo}/>
                  <span>SecureLint ·{" "}</span>
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
