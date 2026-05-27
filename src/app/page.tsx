import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "SecureLint – #1 Chrome Extension for API Key Masking & Phishing Protection",
  description:
    "SecureLint is the #1 Chrome extension for real-time API key masking, phishing email detection, and browser DLP. Stop secrets from leaking, block phishing attacks, and protect your team — 100% local, zero data sent to any server. Trusted by developers, security engineers, and enterprise IT teams.",
  alternates: { canonical: "https://securelint.in" },
  openGraph: {
    title: "SecureLint – Stop API Keys & Credentials From Leaking in Your Browser",
    description:
      "Real-time secret masking, phishing detection & browser DLP. Detect API keys, AWS credentials, JWT tokens, and passwords as you type — masked instantly, 100% locally.",
    url: "https://securelint.in",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Chrome Extension" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SecureLint – Stop API Keys & Secrets Leaking in Your Browser",
    description:
      "Real-time API key masking, phishing email detection & enterprise DLP — 100% local, zero data sent. Install free on Chrome.",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Chrome Extension" }],
  },
};

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
