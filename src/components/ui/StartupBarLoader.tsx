"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Renders the StartupBar <Script> only on public-facing pages.
 * Returns null (script never fetched or parsed) on all dashboard routes.
 */
const BLOCKED_PREFIXES = ["/dashboard", "/user/dashboard"];

export function StartupBarLoader() {
  const pathname = usePathname();

  const blocked = BLOCKED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (blocked) return null;

  return (
    <Script
      id="startupbar-widget"
      src="https://startupbar.co/widget/loader.js"
      data-startup-id="e070d47e-d25a-4f42-be2d-13d0fc9ff98b"
      strategy="afterInteractive"
    />
  );
}
