import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://securelint.in"),
  title: {
    default: "SecureLint – Real-Time API Key Masking, Phishing Detection & VAPT Browser Security | Chrome Extension",
    template: "%s | SecureLint",
  },
  description:
    "SecureLint is India's #1 Chrome extension for real-time API key masking, secret detection, phishing protection, SSL checks, domain age alerts, and browser VAPT. Blocks credential leaks, phishing emails, crypto drainers, and XSS attacks — 100% local, zero data sent to any server. Trusted by developers, security engineers, and enterprise IT teams.",
  keywords: [
    // Branded
    "SecureLint", "SecureLint Chrome extension", "SecureLint pricing", "SecureLint enterprise",
    "VAPTLabs", "VAPTLabs browser extension", "VAPTLabs security",
    // API keys & secrets
    "API key masking", "API key detector chrome", "mask API keys browser",
    "hide API keys extension", "API key exposure detection", "exposed API keys",
    "real-time API key detection", "secret masking chrome extension",
    "secret scanner browser", "prevent API key leak",
    "credential detection tool", "credential leak prevention",
    "AWS key masking", "GCP credential detection", "Azure secret detection",
    "JWT token masking", "OAuth token detection", "database password masking",
    "private key detection browser", "hardcoded secrets browser",
    // Phishing
    "phishing detection real-time", "phishing email detector chrome",
    "anti-phishing chrome extension", "real-time phishing protection",
    "phishing blocker extension", "phishing site detection",
    "AI phishing detection", "brand impersonation detection",
    "typosquat detection", "homograph attack protection",
    "fake CAPTCHA protection", "ClickFix attack blocker",
    "social engineering detection browser",
    // SSL & domain checks
    "SSL certificate check browser", "SSL real-time check extension",
    "domain age checker chrome", "domain age real-time alert",
    "new domain phishing detection", "suspicious domain alert",
    "HTTPS security check browser", "certificate validation extension",
    // VAPT / Security scanning
    "VAPT browser extension", "browser vulnerability scan",
    "real-time browser security scan", "browser security scanner",
    "online security scan extension", "web application security check",
    "browser VAPT tool", "automated security scan browser",
    "real-time threat detection browser", "browser threat scanner",
    // DLP
    "browser DLP extension", "data loss prevention chrome",
    "enterprise browser DLP", "email DLP chrome extension",
    "enterprise email send blocking", "sensitive data protector",
    // Crypto & wallet
    "crypto drainer detection", "fake dApp detection",
    "crypto wallet protection chrome", "Web3 phishing blocker",
    // General security
    "URL risk checker", "link scanner extension",
    "redirect chain detection", "XSS detection browser",
    "clipboard hijacking protection", "pastejacking protection",
    "password breach monitoring", "HaveIBeenPwned chrome extension",
    "browser security extension india", "enterprise security extension",
    "chrome security extension 2026", "best security extension chrome",
    // Competitor/intent
    "securelint alternative", "browser dlp alternative",
    "chrome extension for developers security",
  ],
  authors: [{ name: "VAPTLabs", url: "https://securelint.in" }],
  creator: "VAPTLabs",
  publisher: "VAPTLabs",
  category: "Security",
  classification: "Browser Security Extension",
  referrer: "origin-when-cross-origin",
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "content-language": "en-IN",
    "rating": "general",
    "revisit-after": "7 days",
    "og:locale:alternate": "en_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://securelint.in",
    languages: {
      "en-IN": "https://securelint.in",
      "en-US": "https://securelint.in",
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/icons/icon-128.png",
  },
  openGraph: {
    type: "website",
    url: "https://securelint.in",
    title: "SecureLint – Real-Time API Key Masking, Phishing & VAPT Browser Security",
    description:
      "Stop API keys, credentials, and secrets from leaking. SecureLint masks secrets in real-time, checks SSL certificates, flags new suspicious domains, blocks phishing attacks and crypto drainers — 100% locally, zero data sent.",
    siteName: "SecureLint",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "SecureLint – Real-Time Browser Security: API Key Masking, Phishing Detection & VAPT",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vaptlabs",
    creator: "@vaptlabs",
    title: "SecureLint – Stop API Key Leaks, Phishing & SSL Threats in Real-Time",
    description:
      "Real-time API key masking, phishing detection, SSL checks, domain age alerts & browser DLP — 100% local, zero data sent. India's #1 browser security extension.",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "SecureLint Chrome Extension – API Key Masking, Phishing & VAPT Security",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, jetbrainsMono.variable, "font-sans", geist.variable)}>
      <head>
        {/* Google Tag Manager — loads as early as possible for maximum coverage */}
        <Script
          id="gtm-head"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-54B3W9MQ');`,
          }}
        />
        {/* StartupBar widget */}
        <Script
          id="startupbar-widget"
          src="https://startupbar.co/widget/loader.js"
          data-startup-id="e070d47e-d25a-4f42-be2d-13d0fc9ff98b"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        {/* Google Tag Manager (noscript) — fallback for browsers with JS disabled */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-54B3W9MQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <SiteJsonLd />
        {children}
      </body>
    </html>
  );
}
