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
  title: "SecureLint – Real-Time Secret Masking & Phishing Protection | Chrome Extension",
  description:
    "SecureLint is a Chrome extension that detects and masks API keys, passwords, tokens, and credentials in real-time inside your browser. Includes phishing mail detection and enterprise email DLP.",
  keywords:
    "secret masking, API key protection, credential detection, phishing email detection, DLP, Chrome extension, browser security, SecureLint",
  authors: [{ name: "VAPTLabs" }],
  robots: { index: true, follow: true },
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
    description: "Detect and mask API keys, passwords, tokens, and credentials in real-time.",
    siteName: "SecureLint",
    images: [{ url: "https://securelint.in/icons/icon-128.png" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "SecureLint – Real-Time Secret Masking & Phishing Protection",
    description: "Detect and mask API keys, passwords, tokens, and credentials in real-time.",
    images: ["https://securelint.in/icons/icon-128.png"],
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
