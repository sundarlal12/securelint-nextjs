import type { MetadataRoute } from "next";

const BASE_URL = "https://securelint.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date("2026-05-09"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/refund-policy`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact/sales`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    /* ── Blog listing ── */
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    /* ── Blog posts ── */
    { url: `${BASE_URL}/blog/meeting-mode-blur-secrets-during-video-calls`,          lastModified: new Date("2026-06-16"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/blog/automatic-api-key-masking-textarea-editor-input`,        lastModified: new Date("2026-06-14"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/blog/realtime-phishing-email-detection-chrome-extension`,     lastModified: new Date("2026-06-12"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/blog/how-securelint-detects-blocks-malicious-browser-extensions`, lastModified: new Date("2026-06-10"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/blog/phishing-website-auto-block-before-you-click`,           lastModified: new Date("2026-06-08"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/blog/it-security-policy-malicious-sites-extensions-enterprise`, lastModified: new Date("2026-06-06"), changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${BASE_URL}/blog/malicious-download-scanning-automatic-chrome-extension`, lastModified: new Date("2026-06-04"), changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${BASE_URL}/blog/webcam-screen-recording-detection-privacy-alert`,        lastModified: new Date("2026-06-02"), changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${BASE_URL}/blog/phishing-link-popup-warning-email-protection`,           lastModified: new Date("2026-05-31"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/blog/password-breach-detection-haveibeenpwned-browser`,       lastModified: new Date("2026-05-29"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/blog/api-key-leak-prevention-developers-guide-2026`,          lastModified: new Date("2026-05-26"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/blog/securelint-enterprise-browser-dlp-review-2026`,          lastModified: new Date("2026-05-22"), changeFrequency: "monthly" as const, priority: 0.75 },
  ];
}
