"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { SecureLintIconLight } from "@/components/SecureLintLogo";
import LoginModal from "@/components/auth/LoginModal";
import s from "./SiteHeader.module.css";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Privacy", href: "/privacy" },
  { label: "Support", href: "mailto:contact@vaptlabs.com" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"login" | "signup">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/user/dashboard");

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      setIsLoggedIn(true);
      const planId = localStorage.getItem("user_plan_id") || "";
      setDashboardHref(planId === "enterprise" ? "/dashboard" : "/user/dashboard");
    }
  }, []);

  // If the page was opened by the extension (popup passes ?ext_id=...),
  // store the ID for LoginModal to pick up and auto-open the login modal.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const extId  = params.get("ext_id");
    if (!extId) return;
    sessionStorage.setItem("sl_ext_id", extId);
    // Only auto-open if not already logged in
    if (!localStorage.getItem("user_token")) {
      setModalTab("login");
      setModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openLogin = () => {
    setModalTab("login");
    setModalOpen(true);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`${s.nav} ${scrolled ? s.navShadow : ""}`}>
        <div className={s.inner}>
          <Link href="/" className={s.logo}>
            <SecureLintIconLight size={28} />
            <span>SecureLint</span>
          </Link>

          <ul className={s.links}>
            {LINKS.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>

          <div className={s.actions}>
            {isLoggedIn ? (
              <Link href={dashboardHref} className={s.loginBtn}>
                Dashboard
              </Link>
            ) : (
              <button type="button" className={s.loginBtn} onClick={openLogin}>
                Log in
              </button>
            )}
            <a
              className={s.cta}
              href="https://chromewebstore.google.com/detail/securelint-%E2%80%93-sensitive-da/nfakpphnajjbmejbmpnlnamncdplkbna"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={14} aria-hidden />
              Get Extension
            </a>
          </div>

          <button
            type="button"
            className={s.menuBtn}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className={`${s.mobile} ${menuOpen ? s.mobileOpen : ""}`}>
          {LINKS.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <div className={s.mobileDivider} />
          <div className={s.mobileRow}>
            {isLoggedIn ? (
              <Link href={dashboardHref} className={s.loginBtn} onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            ) : (
              <button type="button" className={s.loginBtn} onClick={openLogin}>
                Log in
              </button>
            )}
            <a
              className={s.cta}
              href="https://chromewebstore.google.com/detail/securelint-%E2%80%93-sensitive-da/nfakpphnajjbmejbmpnlnamncdplkbna"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Get Extension
            </a>
          </div>
        </div>
      </nav>

      <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} defaultTab={modalTab} />
    </>
  );
}
