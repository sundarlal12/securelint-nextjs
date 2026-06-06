"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { BillingStepCtx } from "./billing/billing-step-ctx";
import FeedbackModal from "@/components/dashboard/FeedbackModal";
import ToastContainer from "@/components/dashboard/Toast";
import { clearUserCache, getCachedProfile, revalidateProfile } from "@/lib/userCache";

/* ── Brand tokens ── */
const TEAL        = "#0BA37F";
const TEAL_LIGHT  = "#E6F6F4";
const NAV_GRAY    = "#4F5E6B";
const BORDER      = "#E5E7EB";
const TEXT        = "#111827";
const MUTED       = "#6B7280";
const SIDEBAR_W   = 160;

/* ── Nav item definitions ── */
const NAV = [
  {
    href: "/user/dashboard",
    label: "Profile",
    icon: (active: boolean) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke={active ? TEAL : NAV_GRAY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/user/dashboard/subscription",
    label: "Subscription",
    icon: (active: boolean) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke={active ? TEAL : NAV_GRAY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/user/dashboard/settings",
    label: "Settings",
    icon: (active: boolean) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          stroke={active ? TEAL : NAV_GRAY} strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="3" stroke={active ? TEAL : NAV_GRAY} strokeWidth="1.5"/>
      </svg>
    ),
  },
];

/* ── Dropdown menu ── */
function AvatarDropdown({
  email, onClose, onAccount, onSignOut, onFeedback,
}: {
  email: string; avatar?: string;
  onClose: () => void; onAccount: () => void; onSignOut: () => void; onFeedback: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const item = (icon: React.ReactNode, label: string, onClick: () => void, red?: boolean) => (
    <button onClick={onClick} style={{
      display:"flex", alignItems:"center", gap:16, width:"100%", padding:"11px 22px",
      background:"none", border:"none", cursor:"pointer", textAlign:"left",
      fontSize:15, fontWeight:500, color: red ? "#dc2626" : TEXT,
      transition:"background .1s",
    }}
    onMouseEnter={e => (e.currentTarget.style.background = red ? "#fef2f2" : "#f9fafb")}
    onMouseLeave={e => (e.currentTarget.style.background = "none")}>
      {icon}
      {label}
    </button>
  );

  const iconStyle: React.CSSProperties = { flexShrink: 0, color: MUTED };

  return (
    <div ref={ref} className="ud-avatar-dropdown" style={{
      position:"fixed", bottom:20, left:168,
      width:272, background:"#fff", borderRadius:10, border:`1px solid ${BORDER}`,
      boxShadow:"0 4px 20px rgba(0,0,0,.14), 0 2px 8px rgba(0,0,0,.07)",
      zIndex:9999, overflow:"hidden",
    }}>
      {/* Email header */}
      <div style={{ padding:"16px 22px 10px", borderBottom:`1px solid ${BORDER}` }}>
        <span style={{ fontSize:14, color:MUTED }}>{email || "user@securelint.in"}</span>
      </div>

      {/* Account actions */}
      <div style={{ paddingTop:6, paddingBottom:6 }}>
        {item(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={iconStyle}>
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>,
          "Your account", onAccount,
        )}
        {item(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ ...iconStyle, color:"#dc2626" }}>
            <path d="M18.36 6.64A9 9 0 0 1 20.77 12a9 9 0 0 1-18 0A9 9 0 0 1 5.64 6.64" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="12" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>,
          "Sign out", onSignOut, true,
        )}
      </div>

      <hr style={{ margin:0, border:"none", borderTop:`1px solid ${BORDER}` }} />

      {/* Support section */}
      <div style={{ paddingTop:6, paddingBottom:8 }}>
        {item(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={iconStyle}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <circle cx="12" cy="17" r=".5" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
          </svg>,
          "Support", () => { window.location.href = "mailto:contact@vaptlabs.com"; onClose(); },
        )}
        {item(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={iconStyle}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>,
          "Feedback", () => { onClose(); onFeedback(); },
        )}
      </div>
    </div>
  );
}

/* ── Main layout ── */
export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [avatar,       setAvatar]       = useState("U");
  const [email,        setEmail]        = useState("");
  const [fullName,     setFullName]     = useState("");
  const [planId,       setPlanId]       = useState("free");
  const [showMenu,     setShowMenu]     = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [checked,      setChecked]      = useState(false);
  const [billingStep,  setBillingStep]  = useState<"choose"|"pay">("choose");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) { router.replace("/"); return; }

    // ── 1. Use cached profile blob as the single source of truth ─────────────
    // This is the same source the profile page uses, so they are always in sync.
    const cached = getCachedProfile();
    const em = cached?.email      || localStorage.getItem("user_email")     || "";
    const nm = cached?.full_name  || localStorage.getItem("user_full_name") || "";
    setEmail(em);
    setFullName(nm);
    setAvatar((nm || em || "U")[0].toUpperCase());
    setPlanId(cached?.plan?.id || localStorage.getItem("user_plan_id") || "free");
    setChecked(true);

    // ── 2. Revalidate in the background and sync layout state ─────────────────
    // Ensures avatar/email are always up-to-date after the first API response.
    revalidateProfile(token).then(fresh => {
      if (!fresh) return;
      setEmail(fresh.email || "");
      setFullName(fresh.full_name || "");
      setAvatar((fresh.full_name || fresh.email || "U")[0].toUpperCase());
      setPlanId(fresh.plan?.id || "free");
    });
  }, [router]);

  if (!checked) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#f9fafb" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:28, height:28, border:`3px solid ${BORDER}`, borderTop:`3px solid ${TEAL}`, borderRadius:"50%", animation:"spin .8s linear infinite" }} />
    </div>
  );

  const isBillingPage = pathname === "/user/dashboard/billing";

  /* ── Billing: full-page checkout ── */
  if (isBillingPage) {
    const G = "#007b70";
    return (
      <BillingStepCtx.Provider value={{ step: billingStep, setStep: setBillingStep }}>
        <div style={{ minHeight:"100vh", background:"radial-gradient(circle at 8% 15%, rgba(45,212,191,.12) 0%, rgba(11,163,127,.06) 40%, #fff 80%)", fontFamily:"system-ui,-apple-system,sans-serif" }}>
          <style>{`
            @keyframes spin{to{transform:rotate(360deg)}}
            .billing-header-email { display: flex; }
            @media (max-width: 600px) {
              .billing-header { padding: 0 16px !important; }
              .billing-header-stepper { font-size: 12px !important; gap: 4px !important; }
              .billing-header-email { display: none !important; }
              .billing-main { padding: 28px 16px 80px !important; }
            }
          `}</style>
          <div style={{ position:"fixed", top:-120, left:-120, width:500, height:500, borderRadius:"50%", background:"rgba(45,212,191,.08)", filter:"blur(60px)", pointerEvents:"none", zIndex:0 }} />
          <div style={{ position:"fixed", bottom:-100, right:-100, width:400, height:400, borderRadius:"50%", background:"rgba(11,163,127,.07)", filter:"blur(60px)", pointerEvents:"none", zIndex:0 }} />

          {/* ── Billing header ── */}
          <header className="billing-header" style={{ position:"sticky", top:0, zIndex:50, background:"rgba(255,255,255,.95)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${BORDER}`, display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", padding:"0 48px", height:64 }}>
            {/* Left — logo */}
            <Link href="/user/dashboard" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="SecureLint" style={{ width:32, height:32, objectFit:"contain" }} />
              <span style={{ fontSize:16, fontWeight:700, color:TEXT, letterSpacing:"-0.4px" }}>SecureLint</span>
            </Link>

            {/* Center — step indicator */}
            <nav className="billing-header-stepper" style={{ display:"flex", alignItems:"center", gap:6, fontSize:14, fontWeight:500 }}>
              <span style={{ color: billingStep==="choose" ? G : MUTED, fontWeight: billingStep==="choose" ? 700 : 500 }}>
                1. Choose billing
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ color: billingStep==="pay" ? G : MUTED, fontWeight: billingStep==="pay" ? 700 : 500 }}>
                2. Review &amp; purchase
              </span>
            </nav>

            {/* Right — email (hidden on mobile) */}
            <div className="billing-header-email" style={{ alignItems:"center", gap:8, justifySelf:"end" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e" }} />
              <span style={{ fontSize:13, color:MUTED, fontWeight:500 }}>{email}</span>
            </div>
          </header>

          <main className="billing-main" style={{ position:"relative", zIndex:1, maxWidth:920, margin:"0 auto", padding:"56px 32px 100px" }}>
            {children}
          </main>
          <ToastContainer />
        </div>
      </BillingStepCtx.Provider>
    );
  }

  /* ── Normal dashboard layout ── */
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#fff", fontFamily:"'Inter',system-ui,-apple-system,sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        .ud-nav-item { transition: background .15s; }
        .ud-nav-item:hover .ud-nav-icon-bg { background: #f3f4f6; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }

        /* ── Mobile layout ── */
        .ud-sidebar-overlay {
          display: none;
          position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 39;
        }
        @media (max-width: 768px) {
          .ud-sidebar {
            transform: translateX(-100%);
            transition: transform .25s ease;
            box-shadow: 4px 0 24px rgba(0,0,0,.12);
          }
          .ud-sidebar.open {
            transform: translateX(0);
          }
          .ud-sidebar-overlay.open { display: block; }
          .ud-mobile-header { display: flex !important; }
          .ud-main { margin-left: 0 !important; padding: 72px 16px 80px !important; }
          .ud-avatar-dropdown { left: 16px !important; bottom: 16px !important; width: calc(100vw - 32px) !important; }
        }
        @media (min-width: 769px) {
          .ud-mobile-header { display: none !important; }
          .ud-sidebar { transform: translateX(0) !important; }
        }
      `}</style>

      {/* ── Mobile overlay (tap to close sidebar) ── */}
      <div
        className={`ud-sidebar-overlay${mobileSidebarOpen ? " open" : ""}`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* ── Left sidebar ── */}
      <aside className={`ud-sidebar${mobileSidebarOpen ? " open" : ""}`} style={{
        width: SIDEBAR_W, background:"#fff", borderRight:`1px solid ${BORDER}`,
        display:"flex", flexDirection:"column", alignItems:"center",
        position:"fixed", top:0, left:0, height:"100vh", zIndex:40, overflow:"visible",
      }}>

        {/* Logo header */}
        <div style={{ width:"100%", padding:"20px 18px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${BORDER}` }}>
          <Link href="/" style={{ display:"flex", alignItems:"center", gap:9, textDecoration:"none" }} onClick={() => setMobileSidebarOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="SecureLint" style={{ width:34, height:34, objectFit:"contain", flexShrink:0 }} />
            <span style={{ fontSize:15, fontWeight:700, color:TEXT, letterSpacing:"-0.3px", lineHeight:1 }}>SecureLint</span>
          </Link>
        </div>

        {/* Nav items */}
        <nav style={{ width:"100%", padding:"20px 10px 0", display:"flex", flexDirection:"column", gap:4 }}>
          {NAV.map(n => {
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href} className="ud-nav-item"
                onClick={() => setMobileSidebarOpen(false)}
                style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 8px 8px", textDecoration:"none", gap:5, borderRadius:10 }}>
                <div className="ud-nav-icon-bg" style={{
                  width:48, height:48, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
                  background: active ? TEAL_LIGHT : "transparent",
                  transition:"background .15s",
                }}>
                  {n.icon(active)}
                </div>
                <span style={{ fontSize:12, fontWeight: active ? 700 : 500, color: active ? TEAL : NAV_GRAY, letterSpacing:"0.01em" }}>
                  {n.label}
                </span>
              </Link>
            );
          })}

          {/* Upgrade / Pro CTA */}
          {(planId === "free" || planId === "basic") && (
            <Link href="/user/dashboard/subscription" className="ud-nav-item"
              onClick={() => setMobileSidebarOpen(false)}
              style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 8px 8px", textDecoration:"none", gap:5, borderRadius:10, marginTop:8 }}>
              <div className="ud-nav-icon-bg" style={{ width:48, height:48, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", background:"transparent", transition:"background .15s" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke={NAV_GRAY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize:12, fontWeight:500, color:NAV_GRAY, textAlign:"center", lineHeight:1.3 }}>Upgrade Pro</span>
            </Link>
          )}
        </nav>

        {/* Avatar + dropdown at bottom */}
        <div style={{ marginTop:"auto", padding:"16px 0 20px", position:"relative", width:"100%", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <button onClick={() => setShowMenu(!showMenu)}
            style={{
              width:44, height:44, borderRadius:"50%", background:"#1e3a8a",
              border:"none", color:"#fff", fontSize:15, fontWeight:800,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
              letterSpacing:"0.5px",
            }}>
            {avatar}
          </button>
          {showMenu && (
            <AvatarDropdown
              email={email}
              onClose={() => setShowMenu(false)}
              onAccount={() => { setShowMenu(false); router.push("/user/dashboard"); }}
              onFeedback={() => setShowFeedback(true)}
              onSignOut={() => {
                clearUserCache();
                router.replace("/");
              }}
            />
          )}
        </div>
      </aside>

      {/* ── Mobile top bar (hidden on desktop) ── */}
      <header className="ud-mobile-header" style={{
        display:"none", position:"fixed", top:0, left:0, right:0, height:56,
        background:"#fff", borderBottom:`1px solid ${BORDER}`, zIndex:38,
        alignItems:"center", justifyContent:"space-between", padding:"0 16px",
      }}>
        {/* Hamburger */}
        <button onClick={() => setMobileSidebarOpen(true)}
          style={{ background:"none", border:"none", cursor:"pointer", padding:6, display:"flex", flexDirection:"column", gap:5 }}>
          <span style={{ display:"block", width:22, height:2, background:TEXT, borderRadius:2 }} />
          <span style={{ display:"block", width:22, height:2, background:TEXT, borderRadius:2 }} />
          <span style={{ display:"block", width:22, height:2, background:TEXT, borderRadius:2 }} />
        </button>
        {/* Logo */}
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="SecureLint" style={{ width:28, height:28, objectFit:"contain" }} />
          <span style={{ fontSize:15, fontWeight:700, color:TEXT, letterSpacing:"-0.3px" }}>SecureLint</span>
        </Link>
        {/* Avatar */}
        <button onClick={() => setShowMenu(!showMenu)}
          style={{ width:36, height:36, borderRadius:"50%", background:"#1e3a8a", border:"none", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer" }}>
          {avatar}
        </button>
        {showMenu && (
          <AvatarDropdown
            email={email}
            onClose={() => setShowMenu(false)}
            onAccount={() => { setShowMenu(false); router.push("/user/dashboard"); }}
            onFeedback={() => setShowFeedback(true)}
            onSignOut={() => { clearUserCache(); router.replace("/"); }}
          />
        )}
      </header>

      {/* ── Main content ── */}
      <main className="ud-main" style={{ marginLeft: SIDEBAR_W, flex:1, padding:"44px 52px", minHeight:"100vh", paddingTop: 44 }}>
        {children}
      </main>

      {/* ── Feedback modal ── */}
      {showFeedback && (
        <FeedbackModal
          email={email}
          fullName={fullName}
          onClose={() => setShowFeedback(false)}
        />
      )}

      {/* ── Toast notifications ── */}
      <ToastContainer />
    </div>
  );
}
