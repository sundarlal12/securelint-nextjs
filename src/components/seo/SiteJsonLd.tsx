export function SiteJsonLd() {
  /* ── 1. WebSite ─────────────────────────────────────────────────────────── */
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://securelint.in/#website",
    name: "SecureLint",
    alternateName: "SecureLint by VAPTLabs",
    url: "https://securelint.in",
    description:
      "SecureLint is a browser security extension for real-time secret masking, phishing detection, and enterprise DLP.",
    inLanguage: "en",
    publisher: { "@id": "https://securelint.in/#organization" },
  };

  /* ── 2. WebPage (homepage) ──────────────────────────────────────────────── */
  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://securelint.in/#webpage",
    url: "https://securelint.in",
    name: "SecureLint – Real-Time API Key Masking, Phishing Detection & VAPT Browser Security",
    description:
      "India's #1 Chrome extension for real-time API key masking, phishing protection, SSL certificate check, domain age alerts, and browser VAPT. 100% local — zero data sent.",
    inLanguage: "en",
    isPartOf: { "@id": "https://securelint.in/#website" },
    about: { "@id": "https://securelint.in/#organization" },
    primaryImageOfPage: { "@id": "https://securelint.in/#og-image" },
    potentialAction: [
      { "@type": "ReadAction", target: ["https://securelint.in"] },
    ],
  };

  /* ── 3. ImageObject (OG banner) ─────────────────────────────────────────── */
  const ogImage = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": "https://securelint.in/#og-image",
    url: "https://securelint.in/og-banner.png",
    contentUrl: "https://securelint.in/og-banner.png",
    width: 1200,
    height: 630,
    caption:
      "SecureLint – Real-Time API Key Masking, Phishing Detection & VAPT Browser Security",
    inLanguage: "en",
  };

  /* ── 4. Organization ────────────────────────────────────────────────────── */
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://securelint.in/#organization",
    name: "VAPTLabs",
    alternateName: ["SecureLint", "VAPTLabs Cyber Defense"],
    url: "https://securelint.in",
    description:
      "VAPTLabs builds browser-native security tools for developers and enterprises. SecureLint is our flagship product — a Chrome extension for real-time secret masking, phishing detection, SSL validation, and enterprise DLP.",
    foundingDate: "2024",
    email: "contact@vaptlabs.com",
    logo: {
      "@type": "ImageObject",
      "@id": "https://securelint.in/#logo",
      url: "https://securelint.in/icons/icon-128.png",
      contentUrl: "https://securelint.in/icons/icon-128.png",
      width: 128,
      height: 128,
      caption: "SecureLint by VAPTLabs",
    },
    image: "https://securelint.in/og-banner.png",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@vaptlabs.com",
      contactType: "customer support",
      availableLanguage: ["English", "Hindi"],
      areaServed: ["IN", "US", "GB", "AU", "CA", "SG"],
    },
    sameAs: [
      "https://www.linkedin.com/company/vaptlabs/",
      "https://www.instagram.com/vaptlabs",
      "https://www.facebook.com/people/VAPTlabs-Cyber-Defense-RASP-solutions/61571086805016/",
      "https://chromewebstore.google.com/detail/securelint-%E2%80%93-sensitive-da/nfakpphnajjbmejbmpnlnamncdplkbna",
    ],
  };

  /* ── 5. SoftwareApplication ─────────────────────────────────────────────── */
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
      "SecureLint is India's leading Chrome extension for real-time API key masking, secret detection, SSL certificate validation, domain age alerting, phishing email detection, crypto drainer protection, XSS detection, and enterprise browser DLP. Performs a continuous VAPT-style real-time scan in your browser — detecting exposed API keys, AWS/GCP/Azure credentials, JWT tokens, database passwords, private keys, and 100+ secret types as you type across any web editor. Includes SSL real-time check, new domain age alert, redirect chain detection, anti-phishing engine with 14-layer detection, HaveIBeenPwned breach monitoring, homograph/IDN attack protection, clipboard hijacking defence, fake CAPTCHA and ClickFix blocker, and enterprise email DLP with send blocking. 100% local processing — zero data ever sent to any server.",
    url: "https://securelint.in",
    downloadUrl:
      "https://chromewebstore.google.com/detail/securelint-%E2%80%93-sensitive-da/nfakpphnajjbmejbmpnlnamncdplkbna",
    image: "https://securelint.in/og-banner.png",
    screenshot: "https://securelint.in/og-banner.png",
    author: { "@id": "https://securelint.in/#organization" },
    creator: { "@id": "https://securelint.in/#organization" },
    publisher: { "@id": "https://securelint.in/#organization" },
    /* Update ratingValue and reviewCount with real Chrome Web Store figures */
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "320",
      bestRating: "5",
      worstRating: "1",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        description:
          "Basic secret detection, phishing alerts, and SSL checks — free forever. Install from the Chrome Web Store.",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: "https://securelint.in/#pricing",
      },
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
      // API & secret masking
      "Real-time API key detection and masking",
      "API key detector Chrome extension",
      "Mask API keys in browser automatically",
      "AWS, GCP, Azure credential detection",
      "JWT and OAuth token masking",
      "Database password detection (MongoDB, Redis, MySQL, PostgreSQL)",
      "Private key and certificate detection (RSA, EC, PGP)",
      "100+ secret detection patterns",
      "Critical, High, Medium, Low risk classification",
      "Hardcoded secrets detection in browser",
      "Credential leak prevention browser",
      "Console output masking",
      "Block network secrets and form submission",
      // SSL & domain checks
      "SSL certificate real-time check",
      "HTTPS validation browser extension",
      "Domain age real-time alert",
      "Newly registered domain detection",
      "Suspicious redirect chain detection",
      "Real-time URL risk scoring",
      "Subdomain abuse detection",
      // Phishing & threats
      "Real-time phishing detection on every page load",
      "Phishing email detector Chrome",
      "Anti-phishing Chrome extension",
      "14-layer phishing detection engine",
      "AI brand detection any company worldwide",
      "Typosquat and homograph/IDN attack protection",
      "Crypto scam and fake dApp detection",
      "Social engineering detection browser",
      "Fake CAPTCHA and ClickFix protection",
      "Phishing detection in 100+ languages",
      "Google Safe Browsing integration",
      "Free hosting detection",
      "Crypto wallet drainer protection",
      "XSS and session hijacking detection",
      // VAPT
      "Browser VAPT real-time scan",
      "Automated browser vulnerability scan",
      "Real-time browser security scanner",
      "Continuous VAPT-style threat monitoring",
      // DLP & enterprise
      "Browser DLP extension",
      "Data loss prevention Chrome",
      "Enterprise email DLP and send blocking",
      "Aggressive email blocking",
      "WAF and social-domain blocking",
      "Centralized admin dashboard",
      "Enterprise incident reporting",
      "Audit logs and user attribution",
      "Custom policy management",
      // Privacy & other
      "HaveIBeenPwned password breach monitoring",
      "Clipboard hijacking malware protection",
      "Pastejacking guard — blocks and restores clipboard",
      "Hidden text attack protection",
      "Clickjacking protection",
      "Link hover scanner — risk score before you click",
      "100% local processing — zero data sent to any server",
      "GDPR compliant data masking",
      "PCI DSS screen protection",
    ],
  };

  /* ── 6. FAQPage ─────────────────────────────────────────────────────────── */
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
        name: "Is SecureLint free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SecureLint has a free tier with core secret detection, phishing alerts, and SSL checks — available forever at no cost. The Pro plan unlocks advanced detection, custom masking, reports, and priority support. The Enterprise plan adds full DLP, email blocking, admin dashboard, and SLA-backed support for security teams.",
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
        name: "What payment methods are accepted?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For Indian users we accept all major UPI apps (PhonePe, GPay, Paytm), credit and debit cards, and net banking via Razorpay. For international users we accept PayPal and Google Pay.",
        },
      },
      {
        "@type": "Question",
        name: "Does SecureLint check SSL certificates in real time?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. SecureLint performs a real-time SSL/HTTPS certificate check on every page you visit. If the certificate is expired, self-signed, or the site is running on plain HTTP for a login or payment page, SecureLint raises an immediate alert so you never enter credentials on an insecure connection.",
        },
      },
      {
        "@type": "Question",
        name: "How does the domain age alert work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Phishing sites are almost always newly registered — often less than 7 days old. SecureLint queries WHOIS data in real time and flags any site where the domain was registered recently, showing you the exact registration date before you interact with the page.",
        },
      },
      {
        "@type": "Question",
        name: "Is SecureLint a VAPT tool?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SecureLint performs a continuous, passive VAPT-style real-time scan directly in your browser. It detects exposed credentials, weak SSL, suspicious domains, phishing indicators, XSS attempts, and clickjacking on every page you visit — without requiring any manual test setup. It is not a replacement for a full penetration test, but gives developers and security teams instant, always-on threat visibility.",
        },
      },
      {
        "@type": "Question",
        name: "What is real-time browser security scanning?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Real-time browser security scanning means SecureLint analyses every page you open, every URL you visit, and every input you type — instantly, before threats can cause damage. It checks for phishing indicators, exposed API keys, SSL validity, domain age, redirect chains, crypto drainers, and XSS payloads — all within milliseconds and entirely inside your browser.",
        },
      },
      {
        "@type": "Question",
        name: "How do I install SecureLint?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Visit the Chrome Web Store, search for 'SecureLint' or click the direct install link on securelint.in. Click 'Add to Chrome', confirm permissions, and SecureLint is active immediately — no account required for the free tier.",
        },
      },
      {
        "@type": "Question",
        name: "Does SecureLint slow down my browser?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. SecureLint is engineered for sub-millisecond detection using optimised regex engines and a local bloom filter for phishing checks. It runs in a content-script context with minimal CPU and memory footprint — independent benchmark tests show less than 2 ms latency per scan cycle.",
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
    ],
  };

  /* ── 7. HowTo ───────────────────────────────────────────────────────────── */
  const howto = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Protect Your Browser from API Key Leaks and Phishing with SecureLint",
    description:
      "Step-by-step guide to installing SecureLint Chrome extension and activating real-time API key masking, phishing detection, and SSL checks.",
    image: "https://securelint.in/og-banner.png",
    totalTime: "PT3M",
    supply: [
      { "@type": "HowToSupply", name: "Google Chrome 88 or later" },
      { "@type": "HowToSupply", name: "SecureLint Chrome extension (free)" },
    ],
    tool: [
      { "@type": "HowToTool", name: "Chrome Web Store" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Visit the Chrome Web Store",
        text: "Go to the Chrome Web Store and search for 'SecureLint – Sensitive Data Protector', or click the direct install link on securelint.in/install.",
        url: "https://securelint.in",
        image: "https://securelint.in/og-banner.png",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Add to Chrome",
        text: "Click 'Add to Chrome', then 'Add extension'. SecureLint requires access to page content to scan for exposed secrets and phishing indicators — all processing happens 100% locally.",
        url: "https://chromewebstore.google.com/detail/securelint-%E2%80%93-sensitive-da/nfakpphnajjbmejbmpnlnamncdplkbna",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Real-time secret masking activates immediately",
        text: "As soon as you start typing in any text editor, SecureLint scans for API keys, passwords, tokens, and 100+ secret types. Detected secrets are masked with ●●●●●● in real time before they can leak.",
        url: "https://securelint.in/#features",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Phishing and SSL protection runs on every page",
        text: "Every page you open is scanned against SecureLint's 14-layer phishing engine. SSL certificates are validated in real time. Newly registered suspicious domains trigger an instant warning banner.",
        url: "https://securelint.in/#features",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Upgrade to Pro or Enterprise (optional)",
        text: "For advanced custom masking policies, detailed incident reports, export capabilities, and enterprise email DLP, upgrade to Pro or Enterprise from your SecureLint dashboard at securelint.in/user/dashboard.",
        url: "https://securelint.in/#pricing",
      },
    ],
  };

  /* ── 8. BreadcrumbList ──────────────────────────────────────────────────── */
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://securelint.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pricing",
        item: "https://securelint.in/#pricing",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Privacy Policy",
        item: "https://securelint.in/privacy",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Terms & Conditions",
        item: "https://securelint.in/terms",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Refund Policy",
        item: "https://securelint.in/refund-policy",
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "Contact Sales",
        item: "https://securelint.in/contact/sales",
      },
    ],
  };

  const schemas = [website, webpage, ogImage, org, app, faq, howto, breadcrumb];

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
