export function SiteJsonLd() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SecureLint",
    url: "https://securelint.in",
    description:
      "SecureLint is a browser security extension for real-time secret masking, phishing detection, and enterprise DLP.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://securelint.in/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://securelint.in/#organization",
    name: "VAPTLabs",
    url: "https://securelint.in",
    logo: {
      "@type": "ImageObject",
      url: "https://securelint.in/icons/icon-128.png",
      width: 128,
      height: 128,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@vaptlabs.com",
      contactType: "customer support",
      availableLanguage: "English",
    },
    sameAs: [
      "https://www.linkedin.com/company/vaptlabs/",
      "https://www.instagram.com/vaptlabs",
      "https://www.facebook.com/people/VAPTlabs-Cyber-Defense-RASP-solutions/61571086805016/",
      "https://chromewebstore.google.com/detail/securelint-%E2%80%93-sensitive-da/nfakpphnajjbmejbmpnlnamncdplkbna",
    ],
  };

  const app = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://securelint.in/#app",
    name: "SecureLint – Sensitive Data Protector",
    operatingSystem: "Chrome, Edge, Firefox",
    applicationCategory: "SecurityApplication",
    applicationSubCategory: "Browser Extension",
    browserRequirements: "Requires Chrome 88 or later",
    description:
      "SecureLint is the leading Chrome extension for real-time API key masking, credential leak prevention, phishing email detection, and enterprise browser DLP. Stop secrets from leaking — mask API keys, AWS credentials, JWT tokens, database passwords, and private keys as you type, across any web editor. Includes anti-phishing Chrome protection, crypto drainer detection, homograph attack protection, clipboard hijacking malware protection, and enterprise email DLP with send blocking. 100+ detection patterns, 100% local processing — zero data sent to any server. Trusted alternative to manual secret scanning tools, secure by design.",
    url: "https://securelint.in",
    downloadUrl:
      "https://chromewebstore.google.com/detail/securelint-%E2%80%93-sensitive-da/nfakpphnajjbmejbmpnlnamncdplkbna",
    image: "https://securelint.in/og-banner.png",
    screenshot: "https://securelint.in/og-banner.png",
    author: {
      "@type": "Organization",
      "@id": "https://securelint.in/#organization",
      name: "VAPTLabs",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Pro",
        description:
          "Advanced secret detection, phishing protection, custom masking, export reports, and priority support for individual professionals.",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: "https://securelint.in/#pricing",
      },
      {
        "@type": "Offer",
        name: "Enterprise",
        description:
          "Full DLP, centralized incident reporting, email send-blocking, admin dashboard, and SLA-backed support for security teams.",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: "https://securelint.in/contact/sales",
      },
    ],
    featureList: [
      "Real-time API key and secret masking",
      "API key detector Chrome extension",
      "Mask sensitive data in browser",
      "Hide secrets extension",
      "Credential detection tool",
      "Prevent credential leak in browser",
      "Phishing email detector",
      "Anti-phishing Chrome extension",
      "Malware domain blocker",
      "Homograph attack protection",
      "URL risk checker",
      "Crypto drainer detection",
      "Browser DLP extension",
      "Data loss prevention Chrome",
      "Enterprise browser security",
      "Enterprise email DLP and send blocking",
      "100+ security detection patterns",
      "AWS, GCP, Azure credential detection",
      "JWT, OAuth token masking",
      "Database password detection (MongoDB, Redis, MySQL, PostgreSQL)",
      "Private key and certificate detection (RSA, EC, PGP)",
      "HaveIBeenPwned breach monitoring",
      "Crypto wallet drainer protection",
      "XSS and session hijacking detection",
      "Clipboard hijacking malware protection",
      "Fake QR code phishing detection",
      "Brand impersonation detection",
      "GDPR compliant data masking",
      "4-level risk classification (Critical, High, Medium, Low)",
      "100% local processing — no data ever sent to servers",
      "Enterprise incident reporting dashboard",
      "Scan for hardcoded keys in browser",
      "Protect clipboard from malware",
      "Detect fake websites before login",
      "Typosquat domain detection",
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is SecureLint and how does it work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SecureLint is a Chrome extension that runs entirely in your browser. It scans text you type or paste into any web editor in real time, detects sensitive data (API keys, passwords, tokens, credentials), and masks it before it can leak. It also blocks phishing sites using a 14-layer detection engine before the page fully loads.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data ever sent to a server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For individual users — no. All detection, masking, and phishing checks happen 100% locally inside your browser. No page content, typed text, or detected secrets are ever transmitted to any server. For Enterprise users, masked incident reports (never raw secrets) can be sent to your organization's admin dashboard only when explicitly enabled by your IT admin.",
        },
      },
      {
        "@type": "Question",
        name: "Does SecureLint work on all websites?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. SecureLint works across all websites — standard inputs, textareas, contenteditable elements, and rich text editors like CodeMirror, Monaco, Ace, TinyMCE, CKEditor, and popular productivity tools like Gmail, Slack, Notion, ChatGPT, and more.",
        },
      },
      {
        "@type": "Question",
        name: "How does phishing detection work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SecureLint uses a 14-layer engine: bloom filter, URL heuristics, homograph/IDN analysis, typosquat detection, WHOIS domain-age check, SSL certificate validation, Google Safe Browsing, and page-content scanning for credential-harvesting language. If Google Safe Browsing confirms the site is safe, the site is automatically unblocked — no false positives.",
        },
      },
      {
        "@type": "Question",
        name: "What types of secrets does SecureLint detect?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SecureLint detects 100+ secret types including AWS, GCP, and Azure credentials; JWT tokens; OAuth access and refresh tokens; database connection strings (MongoDB, Redis, MySQL, PostgreSQL); private keys and certificates (RSA, EC, PGP); Stripe, Slack, and GitHub API keys; SSNs, Aadhaar numbers, and credit card patterns.",
        },
      },
      {
        "@type": "Question",
        name: "Can I switch plans or cancel anytime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can upgrade, downgrade, or cancel your subscription at any time from your dashboard. If you cancel, your Pro or Enterprise features remain active until the end of your current billing period.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Enterprise plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enterprise is designed for IT and security teams. It adds centralized policy management, email DLP and send blocking, WAF and social-domain blocking, incident reporting, admin dashboard, and dedicated support with an SLA. Contact our sales team for pricing.",
        },
      },
      {
        "@type": "Question",
        name: "What payment methods are accepted?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We accept all major UPI apps (PhonePe, GPay, Paytm), credit and debit cards (Visa, Mastercard, RuPay), and net banking via Razorpay. All payments are in INR.",
        },
      },
    ],
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://securelint.in" },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://securelint.in/privacy" },
      { "@type": "ListItem", position: 3, name: "Terms & Conditions", item: "https://securelint.in/terms" },
      { "@type": "ListItem", position: 4, name: "Refund Policy", item: "https://securelint.in/refund-policy" },
      { "@type": "ListItem", position: 5, name: "Contact Sales", item: "https://securelint.in/contact/sales" },
    ],
  };

  const schemas = [website, org, app, faq, breadcrumb];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
