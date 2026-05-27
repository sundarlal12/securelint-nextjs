/** Structured data from legacy index.html SEO blocks */
export function SiteJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SecureLint",
    url: "https://securelint.in",
    logo: "https://securelint.in/icons/icon-128.png",
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@vaptlabs.com",
      contactType: "customer support",
    },
    sameAs: [
      "https://www.linkedin.com/company/vaptlabs/",
      "https://www.instagram.com/vaptlabs",
    ],
  };
  const app = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SecureLint – Sensitive Data Protector",
    operatingSystem: "Chrome",
    applicationCategory: "SecurityApplication",
    description:
      "SecureLint detects and masks API keys, passwords, tokens, and credentials in real-time inside your browser.",
    url: "https://securelint.in",
    image: "https://securelint.in/icons/icon-128.png",
    author: { "@type": "Organization", name: "VAPTLabs" },
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: "Free",
        description: "Core secret detection and masking — free forever",
      },
      {
        "@type": "Offer",
        price: "9",
        priceCurrency: "USD",
        name: "Pro",
        description: "Phishing detection, priority updates, advanced masking",
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
    </>
  );
}
