"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { fetchProfile } from "@/lib/adminApi";

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
}

const barBg = "#070a0e";
const borderClr = "#1b222c";
const inputBg = "#0d1218";
const textPrimary = "#e6edf3";
const textMuted = "#8b949e";
const textDim = "#6e7681";
const greenGlow = "#39d353";
const redDot = "#f85149";
const dropBg = "#0d1117";
const dropBorder = "#21262d";

const notifications = [
  { id: 1, title: "Critical: AWS Key exposed in repo", desc: "Detected in acme/backend — 2 min ago", read: false, severity: "#dc2626" },
  { id: 2, title: "Phishing email blocked", desc: "Sender: security@paypal-alert.io — 15 min ago", read: false, severity: "#d97706" },
  { id: 3, title: "DLP: Sensitive file shared externally", desc: "finance_report.xlsx — 1 hour ago", read: true, severity: "#d97706" },
  { id: 4, title: "New integration connected", desc: "Jenkins pipeline linked — 3 hours ago", read: true, severity: "#39d353" },
  { id: 5, title: "Weekly compliance report ready", desc: "SOC2 score improved to 94% — Yesterday", read: true, severity: "#2dd4bf" },
];


function useClickOutside(ref: React.RefObject<HTMLDivElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) handler(); };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

type OpenDrop = null | "notif" | "profile";

interface Profile {
  email: string;
  display_name: string;
  org_id: string;
  role: string;
  company_name: string;
  plan: string;
  plan_status: string;
}

export default function TopBar({ title, onMenuClick }: TopBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<OpenDrop>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile()
      .then((d) => { if (d && !(d as Record<string, unknown>).error) setProfile(d as Profile); })
      .catch(() => {});
  }, []);

  // Derive display values — fall back to localStorage while API loads
  const displayName = profile?.display_name
    || (typeof window !== "undefined" ? localStorage.getItem("admin_role") || "Admin" : "Admin");
  const displayEmail = profile?.email || "";
  const orgShort = profile?.org_id
    ? profile.org_id.slice(0, 8) + "…"
    : (typeof window !== "undefined" ? (localStorage.getItem("admin_org_id") || "").slice(0, 8) + "…" : "");
  const avatarLetter = (profile?.display_name || profile?.email || displayName)[0]?.toUpperCase() || "A";
  const planLabel = profile ? `${profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)} · ${profile.plan_status}` : "Enterprise · Active";
  const companyName = profile?.company_name || "";

  function handleSignOut() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_org_id");
    localStorage.removeItem("admin_role");
    router.replace("/admin/login");
  }

  useClickOutside(dropRef, () => setOpen(null));

  const toggle = (d: OpenDrop) => setOpen(prev => prev === d ? null : d);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    position: "relative", width: 36, height: 36, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: active ? "#161b22" : inputBg, border: `1px solid ${active ? "#39d353" : borderClr}`,
    cursor: "pointer", color: textMuted, flexShrink: 0, transition: "all .15s",
  });

  const dropStyle: React.CSSProperties = {
    position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50,
    background: dropBg, border: `1px solid ${dropBorder}`, borderRadius: 12,
    boxShadow: "0 16px 48px rgba(0,0,0,.5)", overflow: "hidden", minWidth: 300,
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header style={{ height: 56, background: barBg, borderBottom: `1px solid ${borderClr}`, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", flexShrink: 0, position: "sticky", top: 0, zIndex: 30 }}>
      <button type="button" onClick={onMenuClick} className="md:hidden"
        style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: inputBg, border: `1px solid ${borderClr}`, cursor: "pointer", color: textMuted, flexShrink: 0 }}
        aria-label="Open sidebar">
        <Menu size={18} strokeWidth={2} color={textMuted} />
      </button>

      <h1 style={{ color: textPrimary, fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px", flexShrink: 0, margin: 0 }}>{title}</h1>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 0, padding: "0 12px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
          <Search size={14} strokeWidth={2} color={textDim} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", background: inputBg, border: `1px solid ${borderClr}`, borderRadius: 999, padding: "8px 16px 8px 38px", fontSize: 13, color: textPrimary, outline: "none", fontFamily: "inherit" }} />
        </div>
      </div>

      <div ref={dropRef} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

        {/* ── Notifications ── */}
        <div style={{ position: "relative" }}>
          <button type="button" onClick={() => toggle("notif")} style={btnStyle(open === "notif")}>
            <Bell size={16} strokeWidth={2} color={open === "notif" ? "#39d353" : textMuted} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: 4, right: 4, minWidth: 14, height: 14, borderRadius: 7, background: redDot, border: `2px solid ${barBg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff" }}>{unreadCount}</span>
            )}
          </button>
          {open === "notif" && (
            <div style={{ ...dropStyle, width: 360 }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${dropBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>Notifications</span>
                <span style={{ fontSize: 10, color: "#2dd4bf", fontWeight: 600, cursor: "pointer" }}>Mark all read</span>
              </div>
              <div style={{ maxHeight: 340, overflowY: "auto" }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ display: "flex", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${dropBorder}`, background: n.read ? "transparent" : "#161b2208", cursor: "pointer", transition: "background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#161b22"}
                    onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : "#161b2208"}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "transparent" : n.severity, marginTop: 5, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: n.read ? 400 : 600, color: n.read ? textMuted : textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
                      <div style={{ fontSize: 10, color: textDim, marginTop: 2 }}>{n.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 16px", borderTop: `1px solid ${dropBorder}`, textAlign: "center" }}>
                <span style={{ fontSize: 11, color: "#2dd4bf", fontWeight: 600, cursor: "pointer" }}>View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* ── AI Active pill ── */}
        <div className="hidden sm:flex"
          style={{ alignItems: "center", gap: 6, background: "rgba(8,34,22,0.9)", border: "1px solid #134d2f", borderRadius: 999, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "#3ae374", whiteSpace: "nowrap" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: greenGlow, boxShadow: `0 0 6px ${greenGlow}`, display: "inline-block" }} />
          AI Active
        </div>

        {/* ── Profile ── */}
        <div style={{ position: "relative" }}>
          <button type="button" onClick={() => toggle("profile")}
            style={{ display: "flex", alignItems: "center", gap: 2, padding: "0 4px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #39d353, #1fa97a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#041109", border: open === "profile" ? "2px solid #39d353" : "2px solid transparent", transition: "border .15s" }}>
              {avatarLetter}
            </div>
            <ChevronDown size={13} strokeWidth={2} color={textMuted} className="hidden sm:block" style={{ transition: "transform .2s", transform: open === "profile" ? "rotate(180deg)" : "rotate(0)" }} />
          </button>
          {open === "profile" && (
            <div style={{ ...dropStyle, minWidth: 260 }}>
              {/* User header */}
              <div style={{ padding: "16px", borderBottom: `1px solid ${dropBorder}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #39d353, #1fa97a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#041109", flexShrink: 0 }}>
                  {avatarLetter}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
                  {displayEmail && <div style={{ fontSize: 11, color: textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 170 }}>{displayEmail}</div>}
                  {companyName && <div style={{ fontSize: 10, color: "#2dd4bf", marginTop: 2 }}>{companyName}</div>}
                  {!companyName && <div style={{ fontSize: 10, color: textDim, marginTop: 2 }}>{orgShort}</div>}
                </div>
              </div>

              {/* Plan badge */}
              <div style={{ padding: "10px 16px", borderBottom: `1px solid ${dropBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: textDim }}>Current Plan</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: "#0f2318", color: "#39d353", border: "1px solid #134d2f" }}>{planLabel}</span>
              </div>

              {/* Nav items */}
              <div style={{ padding: "6px 0" }}>
                <Link href="/dashboard/profile" onClick={() => setOpen(null)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer", transition: "background .15s", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#161b22"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke={textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize: 12, color: textMuted, fontWeight: 500, flex: 1 }}>My Profile</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>

              {/* Sign out */}
              <div style={{ borderTop: `1px solid ${dropBorder}`, padding: "6px 0" }}>
                <div onClick={handleSignOut} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", cursor: "pointer", transition: "background .15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#1a0808"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 500 }}>Sign Out</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
