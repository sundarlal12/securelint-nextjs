import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { POSTS } from "./posts-data";
import { BlogCard } from "./BlogCard";
import s from "./Blog.module.css";

export const metadata: Metadata = {
  title: "SecureLint Blog — Browser Security, API Key Masking & Phishing Protection Guides",
  description:
    "Expert guides on API key masking, real-time phishing detection, malicious extension blocking, meeting-mode secret blurring, password breach monitoring, and enterprise browser DLP — all powered by SecureLint.",
  alternates: { canonical: "https://securelint.in/blog" },
  openGraph: {
    type: "website",
    url: "https://securelint.in/blog",
    title: "SecureLint Blog — Browser Security Guides & Tutorials",
    description:
      "Practical guides on keeping API keys, credentials, and sensitive data safe in your browser — meeting mode, phishing detection, download scanning, and more.",
    siteName: "SecureLint",
    images: [{ url: "/og-banner.png", width: 1200, height: 630, alt: "SecureLint Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vaptlabs",
    title: "SecureLint Blog — API Key Masking, Phishing & Browser Security Guides",
    description: "Expert guides on real-time secret masking, phishing detection, malicious extension detection, and enterprise browser DLP.",
    images: [{ url: "/og-banner.png" }],
  },
};


const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "SecureLint Blog",
  "url": "https://securelint.in/blog",
  "itemListElement": POSTS.map((p, i) => ({
    "@type": "ListItem", "position": i + 1,
    "item": {
      "@type": "BlogPosting",
      "headline": p.title, "description": p.excerpt,
      "datePublished": p.date,
      "url": `https://securelint.in/blog/${p.slug}`,
      "author": { "@type": "Organization", "name": "SecureLint", "url": "https://securelint.in" },
      "publisher": { "@type": "Organization", "name": "SecureLint by VAPTLabs", "logo": { "@type": "ImageObject", "url": "https://securelint.in/icons/icon-128.png" } },
    },
  })),
};

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      <SiteHeader />
      <main id="main-content">

        {/* Hero */}
        <section className={s.hero}>
          <div className={s.heroInner}>
            <p className={s.overline}>Blog</p>
            <h1 className={s.heroTitle}>
              Security guides, deep-dives,{" "}
              <em className={s.heroItalic}>and field notes.</em>
            </h1>
            <p className={s.heroDesc}>
              Practical tutorials on API key masking, phishing detection, malicious extension
              blocking, meeting-mode privacy, and enterprise browser DLP — by the SecureLint team.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className={s.gridSection} aria-label="Blog posts">
          <div className={s.gridInner}>
            <div className={s.grid}>
              {POSTS.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
