import type { ReactNode } from "react";
import s from "./PricingCard.module.css";

export type PricingPlanDefinition = {
  name: string;
  priceDisplay: ReactNode;
  period: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
  priceSize?: "lg" | "md";
  /** If provided, button click is handled by parent instead of href navigation */
  onCtaClick?: () => void;
};

export function PricingCard({ plan }: { plan: PricingPlanDefinition }) {
  return (
    <article className={`${s.card} ${plan.featured ? s.cardFeatured : ""}`}>
      <div className={s.badgeSlot}>
        {plan.featured ? <span className={s.popular}>Most Popular</span> : null}
      </div>
      <h3 className={s.name}>{plan.name}</h3>
      <div className={plan.priceSize === "md" ? s.priceWrapMd : s.priceWrap}>{plan.priceDisplay}</div>
      <p className={s.period}>{plan.period}</p>
      <ul className={s.list}>
        {plan.features.map((f) => (
          <li key={f}>
            <span className={s.tick}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      {plan.onCtaClick ? (
        <button type="button" onClick={plan.onCtaClick} className={s.cta}>
          {plan.ctaLabel}
        </button>
      ) : (
        <a
          href={plan.ctaHref}
          target={plan.ctaHref.startsWith("mailto") ? undefined : "_blank"}
          rel={plan.ctaHref.startsWith("mailto") ? undefined : "noopener noreferrer"}
          className={s.cta}
        >
          {plan.ctaLabel}
        </a>
      )}
    </article>
  );
}
