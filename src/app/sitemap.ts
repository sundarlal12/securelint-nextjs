// Sitemap is served as a static file from public/sitemap.xml
// which includes image:image namespace support not available in MetadataRoute.Sitemap.
// This file is intentionally left as a no-op to avoid duplicate sitemap generation.
export const dynamic = "force-static";
export default function sitemap() { return []; }
