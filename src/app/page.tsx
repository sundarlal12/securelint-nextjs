import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  FeaturesShowcase,
  FaqSection,
  HeroSection,
  HowItWorksSection,
  MarketingCta,
  PlanComparison,
  PricingSection,
  PrivacyPromoSection,
  // TrustedStrip,
} from "@/components/marketing";
import styles from "@/styles/page-shell.module.css";

export default function HomePage() {
  return (
    <div className={styles.shell}>
      <SiteHeader />
      <main className={styles.main}>
        <HeroSection />
        {/* <TrustedStrip /> */}
        <FeaturesShowcase />
        <HowItWorksSection />
        <PricingSection />
        <PlanComparison />
        <FaqSection />
        <PrivacyPromoSection />
        <MarketingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
