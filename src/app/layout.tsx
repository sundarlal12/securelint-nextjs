import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
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
    default: "SecureLint – Real-Time Secret Masking & Phishing Protection | Chrome Extension",
    template: "%s | SecureLint",
  },
  description:
    "SecureLint is the #1 Chrome extension for real-time API key masking, phishing email detection, and browser DLP. Stops secrets from leaking, blocks phishing attacks, and protects your team — 100% local, zero data sent to any server.",
  keywords: [
    // Phase 1 — Branded
    "SecureLint", "SecureLint Chrome extension", "SecureLint pricing", "SecureLint enterprise",
    "VAPTLabs security", "VAPTLabs browser extension",
    // Phase 2 — Secret Masking
    "API key detector chrome", "mask sensitive data browser", "hide secrets extension",
    "real-time secret scanning", "credential detection tool", "secret masking", "API key protection",
    "credential detection", "API key leakage", "password masking", "token masking",
    "AWS key masking", "JWT token detection", "real-time secret detection",
    "sensitive data protector", "prevent credential leak",
    // Phase 2 — Phishing Protection
    "phishing email detector", "malware domain blocker", "anti-phishing chrome extension",
    "crypto drainer detection", "URL risk checker", "homograph attack protection",
    "phishing email detection", "phishing detection Chrome", "phishing blocker",
    // Phase 2 — Browser DLP
    "browser dlp extension", "data loss prevention chrome", "enterprise browser security",
    "web filtering extension", "browser DLP", "email DLP Chrome extension",
    "enterprise security extension",
    // Phase 3 — Developer persona
    "prevent committing secrets in browser", "mask API keys in screenshots",
    "scan for hardcoded keys browser", "secret scanner browser",
    // Phase 3 — Security team persona
    "how to prevent employees sharing passwords", "dlp for remote teams",
    "block sensitive data chrome managed devices",
    // Phase 3 — General user
    "protect clipboard from malware", "detect fake website before login",
    "stop shoulder surfing on laptop",
    // Phase 4 — Problem/Tech
    "clipboard hijacking malware protection", "crypto wallet address swap attack",
    "fake QR code phishing", "brand impersonation detection",
    "gdpr compliant data masking", "pci dss screen protection",
    "typosquat domain detection", "exposed API keys browser",
    // Phase 5 — Competitor alternatives
    "hide secrets extension alternative", "open source browser dlp alternative",
    "chrome extension", "browser security", "developer security tool",
  ],
  authors: [{ name: "VAPTLabs", url: "https://securelint.in" }],
  creator: "VAPTLabs",
  publisher: "VAPTLabs",
  category: "Security",
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
  alternates: { canonical: "https://securelint.in" },
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
    title: "SecureLint – Real-Time Secret Masking & Phishing Protection",
    description:
      "Stop API keys, passwords, and credentials from leaking in your browser. SecureLint masks secrets in real-time, blocks phishing attacks, and gives enterprises full DLP visibility — 100% locally, zero data sent.",
    siteName: "SecureLint",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "SecureLint – Real-Time Browser Security Extension for Secret Masking & Phishing Protection",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vaptlabs",
    creator: "@vaptlabs",
    title: "SecureLint – Stop Secrets From Leaking in Your Browser",
    description:
      "Real-time API key masking, phishing detection & browser DLP. 100% local — your secrets never leave your browser. Trusted by developers & security teams.",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "SecureLint Chrome Extension – Secret Masking & Phishing Protection",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, jetbrainsMono.variable, "font-sans", geist.variable)}>
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        <SiteJsonLd />
        {children}
      </body>
    </html>
  );
}
