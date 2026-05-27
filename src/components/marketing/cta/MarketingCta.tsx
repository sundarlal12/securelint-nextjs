import s from "./MarketingCta.module.css";

export function MarketingCta() {
  return (
    <section className={s.section} aria-labelledby="cta-heading">
      <div className={s.inner}>
        <h2 id="cta-heading">Start protecting your secrets today</h2>
        <p>Install SecureLint in seconds — free, private, and zero-config.</p>
        <a href="https://chromewebstore.google.com/detail/securelint-%E2%80%93-sensitive-da/nfakpphnajjbmejbmpnlnamncdplkbna" target="_blank" rel="noopener noreferrer" className={s.btn}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Install Extension — It&apos;s Free
        </a>
      </div>
    </section>
  );
}
