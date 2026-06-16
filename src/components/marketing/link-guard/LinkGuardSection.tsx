"use client";
import s from "./LinkGuard.module.css";

/* ── compact gauge ── */
function PopupGauge() {
  return (
    <svg viewBox="0 0 80 48" width="56" height="34" aria-hidden="true">
      <path d="M 12 38 A 28 28 0 0 1 68 38" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M 12 38 A 28 28 0 0 1 20.2 18.2" fill="none" stroke="#86efac" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M 20.2 18.2 A 28 28 0 0 1 40 10"  fill="none" stroke="#fb923c" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M 40 10 A 28 28 0 0 1 59.8 18.2"  fill="none" stroke="#f87171" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M 59.8 18.2 A 28 28 0 0 1 68 38"  fill="none" stroke="#dc2626" strokeWidth="5.5" strokeLinecap="round"/>
      <line x1="40" y1="38" x2="31.4" y2="11.4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="40" cy="38" r="3" fill="#fff"/>
      <text x="40" y="35" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">40</text>
    </svg>
  );
}

/* ── mouse cursor ── */
function Cursor() {
  return (
    <svg className={s.cursor} viewBox="0 0 20 24" width="16" height="20" aria-hidden="true">
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

        {/* ── Right: animated mock ── */}
        <div className={s.mockCol}>
          <div className={s.browser}>

            {/* chrome bar */}
            <div className={s.browserBar} aria-hidden="true">
              <span className={s.dot} style={{ background: "#f87171" }}/>
              <span className={s.dot} style={{ background: "#fb923c" }}/>
              <span className={s.dot} style={{ background: "#4ade80" }}/>
              <div className={s.addressBar}>
                outlook.live.com/mail/junkemail/id/AAkALg…
              </div>
            </div>

            <div className={s.browserBody}>

              {/* ══════════════════════════════════
                  MAIL ICON LOADER
                  Visible 0–7%: envelope opens → 
                  morphs into loading ring
              ══════════════════════════════════ */}
              <div className={s.mailLoader} aria-hidden="true">
                {/* envelope body */}
                <svg className={s.envelopeSvg} viewBox="0 0 64 48" width="64" height="48">
                  {/* envelope body */}
                  <rect x="2" y="8" width="60" height="38" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5"/>
                  {/* envelope flap (animates open) */}
                  <path className={s.envelopeFlap} d="M2 8 L32 28 L62 8" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round"/>
                  {/* left wing */}
                  <line x1="2" y1="46" x2="22" y2="28" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/>
                  {/* right wing */}
                  <line x1="62" y1="46" x2="42" y2="28" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div className={s.loaderLabel}>Loading mail…</div>
                <div className={s.loaderDots}>
                  <span className={s.loaderDot}/>
                  <span className={s.loaderDot}/>
                  <span className={s.loaderDot}/>
                </div>
              </div>

              {/* ══════════════════════════════════
                  OUTLOOK EMAIL VIEW
                  Visible from 6% → stays visible
                  even while popup is showing
              ══════════════════════════════════ */}
              <div className={s.emailView}>

                {/* subject bar */}
                <div className={s.subjectBar}>
                  <span className={s.subjectClose}>✕</span>
                  <span className={s.subjectText}>Keeping Your Account Up to Date</span>
                  <div className={s.subjectNavs}>
                    <span className={s.subjectNav}>‹</span>
                    <span className={s.subjectNav}>›</span>
                  </div>
                </div>

                {/* sender */}
                <div className={s.senderRow}>
                  <div className={s.senderAvatar}>MB</div>
                  <div className={s.senderInfo}>
                    <div className={s.senderTop}>
                      <span className={s.senderName}>Microsoft account</span>
                      <span className={s.senderEmail}> bill&lt;zn@cardcentrix.com&gt;</span>
                      <span className={s.configBadge}>⬆ Config Profile (Critical) 85/100</span>
                    </div>
                    <div className={s.senderTo}>
                      To: customer.5108047@outlook.com
                      <span className={s.senderDate}>Tue 6/16 8:21 PM</span>
                    </div>
                  </div>
                </div>

                {/* junk warning */}
                <div className={s.junkBar}>
                  <span className={s.junkIcon}>ⓘ</span>
                  <span>This message was identified as junk. We'll delete it after 30 days.</span>
                </div>

                {/* attachments */}
                <div className={s.attachRow}>
                  <span className={s.attachIcon}>📎</span>
                  <span className={s.attachFile}>emails-cardcentrix.mobilecon… <span className={s.attachSize}>6 KB</span></span>
                  <span className={s.attachFile}>carddav-cardcentrix.mobilec… <span className={s.attachSize}>6 KB</span></span>
                  <span className={s.attachFile}>caldav-cardcentrix.mobilec… <span className={s.attachSize}>7 KB</span></span>
                </div>

                {/* email body */}
                <div className={s.emailBodyBg}>
                  <div className={s.emailCard}>
                    {/* Microsoft 4-square logo */}
                    <div className={s.msLogoRow}>
                      <div className={s.msLogo}>
                        <span style={{ background: "#f25022" }}/>
                        <span style={{ background: "#7fba00" }}/>
                        <span style={{ background: "#00a4ef" }}/>
                        <span style={{ background: "#ffb900" }}/>
                      </div>
                      <span className={s.msLogoText}>Microsoft</span>
                    </div>
                    <p className={s.emailPara}>Hello,</p>
                    <p className={s.emailPara}>
                      We are reaching out with a reminder to review the information
                      associated with your account.
                    </p>
                    <p className={s.emailPara}>
                      Keeping your account details current helps ensure a smooth
                      experience and continued access to available features and services.
                    </p>
                    <span className={s.emailCta}>Review Payment Information</span>
                  </div>
                </div>

              </div>{/* /emailView */}

              {/* ══════════════════════════════════
                  Mouse cursor
                  Appears at 10%, travels to button,
                  clicks at 34%, disappears at 39%
              ══════════════════════════════════ */}
              <Cursor />

              {/* ══════════════════════════════════
                  SECURELINT POPUP — floating card
                  Small card at top, email visible below
                  Appears at 42%, fades at 87%
              ══════════════════════════════════ */}
              <div className={s.popup}>

                <div className={s.popupHead}>
                  <div className={s.popupHeadLeft}>
                    <div className={s.popupIcon}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
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
                    {" "}has been identified as a <strong>malicious or phishing site</strong>{" "}
                    by SecureLint. Do not proceed.
                  </div>
                </div>

                <div className={s.popupFoot}>
                  <div className={s.popupBtns}>
                    <button className={s.btnDismiss}>Dismiss</button>
                    <button className={s.btnVisit}>⚠ Visit Anyway</button>
                  </div>
                </div>

                <div className={s.popupBrand}>
                  <img src="https://securelint.in/icons/icon-128.png"
                    alt="" width="11" height="11" className={s.popupBrandLogo}/>
                  <span>SecureLint · </span>
                  <span className={s.popupBrandLink}>securelint.in</span>
                  <span> · Email Security Platform</span>
                </div>

              </div>

            </div>{/* /browserBody */}
          </div>
        </div>

      </div>
    </section>
  );
}
