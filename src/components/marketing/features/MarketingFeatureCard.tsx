import s from "./MarketingFeatureCard.module.css";

export type MarketingFeatureSpec = {
  icon: string;
  title: string;
  description: string;
  badge?: "new" | "enterprise";
  badgeComingSoon?: boolean;
};

export function MarketingFeatureCard({ icon, title, description, badge }: MarketingFeatureSpec) {
  return (
    <article className={s.card}>
      <div className={s.iconWrap} aria-hidden>
        {icon}
      </div>
      <h3 className={s.title}>{title}</h3>
      {badge ? (
        <div className={s.badges}>
          {badge === "new" && <span className={s.badgeNew}>New</span>}
          {badge === "enterprise" && <span className={s.badgeEnterprise}>Enterprise</span>}
        </div>
      ) : null}
      <p className={s.desc}>{description}</p>
    </article>
  );
}
