import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms", "/refund-policy", "/contact/"],
        disallow: ["/dashboard/", "/admin/", "/user/"],
      },
    ],
    sitemap: "https://securelint.in/sitemap.xml",
    host: "https://securelint.in",
  };
}
