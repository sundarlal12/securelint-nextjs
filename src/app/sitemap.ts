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
  ];
}
