import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  FeaturesShowcase,
  FaqSection,
  HeroSection,
  HowItWorksSection,
  MarketingCta,
  MeetingModeSection,
  PhishingDemoSection,
  PlanComparison,
  PricingSection,
  PrivacyPromoSection,
  // TrustedStrip,
} from "@/components/marketing";
import styles from "@/styles/page-shell.module.css";

export const metadata: Metadata = {
  title: "SecureLint – #1 Chrome Extension for API Key Masking, Phishing Detection, SSL Check & VAPT",
  description:
    "SecureLint detects and masks API keys, secrets & credentials in real-time, checks SSL certificates, alerts on suspicious new domains, blocks phishing attacks, crypto drainers, and XSS — 100% local browser security. Used by developers, security teams, and enterprises across India.",
  alternates: { canonical: "https://securelint.in" },
  openGraph: {
    title: "SecureLint – Real-Time API Key Masking, SSL Check, Phishing & VAPT Browser Security",
    description:
      "Stop API key leaks, phishing emails, SSL threats, and credential exposure. SecureLint runs a real-time VAPT-style scan in your browser — masking secrets, validating SSL, checking domain age, and blocking threats before they cause damage.",
    url: "https://securelint.in",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint – API Key Masking, SSL & Phishing Protection Chrome Extension" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SecureLint – API Key Masking, SSL Check, Phishing & VAPT in Your Browser",
    description:
      "Real-time API key masking, SSL certificate check, domain age alert, phishing detection & browser DLP — 100% local, zero data sent. India's #1 browser security extension.",
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
        <PhishingDemoSection />
        <MeetingModeSection />
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
