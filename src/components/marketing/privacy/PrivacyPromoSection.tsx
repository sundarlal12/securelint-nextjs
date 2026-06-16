import Link from "next/link";
import s from "./PrivacyPromo.module.css";

const ITEMS = [
  { icon: "🖥️", label: "100% Local Processing" },
  { icon: "🚫", label: "No Tracking or Ads" },
  { icon: "🔐", label: "No Third-Party SDKs" },
  { icon: "🛡️", label: "Open Privacy Policy" },
];

export function PrivacyPromoSection() {
  return (
    <section id="privacy-teaser" className={s.wrapper}>
      <div className={s.inner}>
        <h2>Your data stays yours —{" "}
          <em style={{ fontStyle: "italic", color: "var(--ink-muted)", fontWeight: "inherit" }}>always private, always local.</em>
        </h2>
        <p>
          SecureLint processes everything locally in your browser. We never read, store, or transmit your secrets. No
          tracking, no ads, no third-party SDKs — just pure, private protection.
        </p>
        <div className={s.pills}>
          {ITEMS.map((pill) => (
            <div key={pill.label} className={s.pill}>
              <span className={s.ico} aria-hidden>{pill.icon}</span>
              {pill.label}
            </div>
          ))}
        </div>
        <Link href="/privacy" className={s.link}>
          Read our full Privacy Policy →
        </Link>
      </div>
    </section>
  );
}
