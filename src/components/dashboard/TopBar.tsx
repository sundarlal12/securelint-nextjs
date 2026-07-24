"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { fetchProfile } from "@/lib/adminApi";
import { T, STATUS, TONE } from "@/lib/dashboardTheme";
import { searchDashboard } from "@/lib/dashboardSearch";

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
}

const barBg = T.surface;
const borderClr = "#ebebee";
const inputBg = T.inset;
const textPrimary = T.text;
const textMuted = T.text2;
const textDim = T.muted;
const hoverBg = T.hover;
const greenGlow = STATUS.green;
const redDot = STATUS.red;
const dropBg = T.surface;
const dropBorder = T.border;

const notifications = [
  { id: 1, title: "Critical: AWS Key exposed in repo", desc: "Detected in acme/backend — 2 min ago", read: false, severity: STATUS.red },
  { id: 2, title: "Phishing email blocked", desc: "Sender: security@paypal-alert.io — 15 min ago", read: false, severity: STATUS.amber },
  { id: 3, title: "DLP: Sensitive file shared externally", desc: "finance_report.xlsx — 1 hour ago", read: true, severity: STATUS.amber },
  { id: 4, title: "New integration connected", desc: "Jenkins pipeline linked — 3 hours ago", read: true, severity: STATUS.green },
  { id: 5, title: "Weekly compliance report ready", desc: "SOC2 score improved to 94% — Yesterday", read: true, severity: STATUS.teal },
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

  // ── Search ────────────────────────────────────────────────────────────────
  const searchRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const results = useMemo(() => searchDashboard(search), [search]);

  // The highlight is stored together with the query it belongs to, so a new
  // query derives back to row 0 during render. Resetting it from an effect
  // would leave one frame where Enter could fire a stale row.
  const [cursorState, setCursorState] = useState({ query: "", index: 0 });
  const cursor = cursorState.query === search ? cursorState.index : 0;
  const setCursor = (i: number) => setCursorState({ query: search, index: i });

  // Dismissal is handled by a focus-out check on the container rather than a
  // document listener: it also covers leaving by Tab, and keeps the state
  // change in an event handler.

  // ⌘K / Ctrl+K focuses search from anywhere; Escape returns focus to the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function goTo(href: string) {
    setSearchOpen(false);
    setSearch("");
    searchRef.current?.blur();
    router.push(href);
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") { setSearchOpen(false); searchRef.current?.blur(); return; }
    if (!results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((cursor + 1) % results.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((cursor - 1 + results.length) % results.length); }
    else if (e.key === "Enter") { e.preventDefault(); goTo(results[cursor].href); }
  }

  useEffect(() => {
    fetchProfile()
      .then((d) => {
        // A failed call resolves with the parsed error body rather than
        // rejecting, and that body carries no `email`/`plan`. Require a field
        // we actually render before treating the response as a profile.
        const r = d as Record<string, unknown> | null;
        if (r && !r.error && typeof r.email === "string") setProfile(r as unknown as Profile);
      })
      .catch(() => {});
  }, []);

  // Derive display values — fall back to localStorage while API loads
  const displayName = profile?.display_name
    || (typeof window !== "undefined" ? localStorage.getItem("admin_role") || "Admin" : "Admin");
  const displayEmail = profile?.email || "";
  const orgShort = profile?.org_id
    ? profile.org_id.slice(0, 8) + "…"
    : (typeof window !== "undefined" ? (localStorage.getItem("admin_org_id") || "").slice(0, 8) + "…" : "");
  const avatarLetter = (profile?.display_name || profile?.email || displayName)?.[0]?.toUpperCase() || "A";
  const planLabel = profile?.plan
    ? `${profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)} · ${profile.plan_status ?? "Active"}`
    : "Enterprise · Active";
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
    position: "relative", width: 34, height: 34, borderRadius: 9,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: active ? hoverBg : "transparent",
    border: `1px solid ${active ? T.borderStrong : borderClr}`,
    cursor: "pointer", color: textMuted, flexShrink: 0, transition: "all .15s",
  });

  const dropStyle: React.CSSProperties = {
    position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50,
    background: dropBg, border: `1px solid ${dropBorder}`, borderRadius: 14,
    boxShadow: T.shadowLg, overflow: "hidden", minWidth: 300,
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header style={{ height: 60, background: barBg, borderBottom: `1px solid ${borderClr}`, display: "flex", alignItems: "center", gap: 12, padding: "0 22px", flexShrink: 0, position: "sticky", top: 0, zIndex: 30 }}>
      <button type="button" onClick={onMenuClick} className="md:hidden"
        style={{ width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: `1px solid ${borderClr}`, cursor: "pointer", color: textMuted, flexShrink: 0 }}
        aria-label="Open sidebar">
        <Menu size={17} strokeWidth={2} color={textMuted} />
      </button>

      <h1 style={{ color: textPrimary, fontSize: 18, fontWeight: 650, letterSpacing: "-0.022em", flexShrink: 0, margin: 0 }}>{title}</h1>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 0, padding: "0 12px" }}>
        <div
          ref={searchBoxRef}
          onBlur={(e) => {
            // Only close when focus actually leaves the search box — clicking a
            // result moves focus within it and must not dismiss first.
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSearchOpen(false);
          }}
          style={{ position: "relative", width: "100%", maxWidth: 460 }}
        >
          <Search size={15} strokeWidth={2} color={textDim} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search pages, controls and settings…"
            value={search}
            onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
            onFocus={e => { setSearchOpen(true); e.currentTarget.style.borderColor = T.text; e.currentTarget.style.background = T.surface; }}
            onBlur={e => { e.currentTarget.style.borderColor = borderClr; e.currentTarget.style.background = inputBg; }}
            onKeyDown={onSearchKeyDown}
            role="combobox"
            aria-expanded={searchOpen && !!search}
            aria-controls="dash-search-results"
            aria-autocomplete="list"
            style={{ width: "100%", background: inputBg, border: `1px solid ${borderClr}`, borderRadius: 10, padding: "9px 62px 9px 38px", fontSize: 13, color: textPrimary, outline: "none", fontFamily: "inherit" }}
          />
          {/* Shortcut hint, hidden once the field is in use. */}
          {!search && (
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 3, pointerEvents: "none" }}>
              {["⌘", "K"].map(k => (
                <kbd key={k} style={{
                  fontSize: 10, fontFamily: "inherit", color: textDim, background: T.surface,
                  border: `1px solid ${T.border}`, borderRadius: 4, padding: "1px 5px", lineHeight: 1.5,
                }}>{k}</kbd>
              ))}
            </span>
          )}

          {searchOpen && search.trim() && (
            <div id="dash-search-results" role="listbox" style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 60,
              background: dropBg, border: `1px solid ${dropBorder}`, borderRadius: 14,
              boxShadow: T.shadowLg, overflow: "hidden", maxHeight: 420, overflowY: "auto",
            }} className="dash-scroll">
              {results.length === 0 ? (
                <div style={{ padding: "22px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, color: textPrimary, fontWeight: 550 }}>
                    No matches for “{search.trim()}”
                  </div>
                  <div style={{ fontSize: 11.5, color: textDim, marginTop: 4 }}>
                    Try a page name, a control, or a term like “api key” or “phishing”.
                  </div>
                </div>
              ) : (
                results.map((r, i) => {
                  const active = i === cursor;
                  // Group heading only when the group changes.
                  const showGroup = i === 0 || results[i - 1].group !== r.group;
                  return (
                    <div key={r.id}>
                      {showGroup && (
                        <div style={{
                          padding: "9px 14px 5px", fontSize: 10, fontWeight: 600, color: textDim,
                          textTransform: "uppercase", letterSpacing: "0.07em",
                          borderTop: i === 0 ? "none" : `1px solid ${dropBorder}`,
                        }}>{r.group}</div>
                      )}
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onMouseEnter={() => setCursor(i)}
                        onClick={() => goTo(r.href)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, width: "100%",
                          padding: "9px 14px", border: "none", cursor: "pointer", textAlign: "left",
                          background: active ? hoverBg : "transparent", fontFamily: "inherit",
                        }}
                      >
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: "block", fontSize: 13, fontWeight: 550, color: textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {r.title}
                          </span>
                          <span style={{ display: "block", fontSize: 11.5, color: textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {r.description}
                          </span>
                        </span>
                        {active && <span style={{ fontSize: 11, color: textDim, flexShrink: 0 }}>↵</span>}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      <div ref={dropRef} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

        {/* ── Notifications ── */}
        <div style={{ position: "relative" }}>
          <button type="button" onClick={() => toggle("notif")} style={btnStyle(open === "notif")}>
            <Bell size={16} strokeWidth={2} color={open === "notif" ? textPrimary : textMuted} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: -3, right: -3, minWidth: 15, height: 15, borderRadius: 8, background: redDot, border: `2px solid ${barBg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#fff" }}>{unreadCount}</span>
            )}
          </button>
          {open === "notif" && (
            <div style={{ ...dropStyle, width: 360 }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${dropBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 650, color: textPrimary }}>Notifications</span>
                <span style={{ fontSize: 11, color: textMuted, fontWeight: 550, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 }}>Mark all read</span>
              </div>
              <div className="dash-scroll" style={{ maxHeight: 340, overflowY: "auto" }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ display: "flex", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${dropBorder}`, background: n.read ? "transparent" : T.inset, cursor: "pointer", transition: "background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                    onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : T.inset}>
                    {/* Unread carries a severity-coloured dot; read rows go grey. */}
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.read ? T.border : n.severity, marginTop: 5, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: n.read ? 450 : 600, color: n.read ? textMuted : textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: textDim, marginTop: 2 }}>{n.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "11px 16px", borderTop: `1px solid ${dropBorder}`, textAlign: "center" }}>
                <span style={{ fontSize: 12, color: textPrimary, fontWeight: 560, cursor: "pointer" }}>View all notifications →</span>
              </div>
            </div>
          )}
        </div>

        {/* ── AI Active pill ── */}
        <div className="hidden sm:flex"
          style={{ alignItems: "center", gap: 6, background: TONE.green.bg, border: `1px solid ${TONE.green.border}`, borderRadius: 999, padding: "5px 11px", fontSize: 11.5, fontWeight: 560, color: TONE.green.color, whiteSpace: "nowrap" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: greenGlow, display: "inline-block" }} />
          AI Active
        </div>

        {/* ── Profile ── */}
        <div style={{ position: "relative" }}>
          <button type="button" onClick={() => toggle("profile")}
            style={{ display: "flex", alignItems: "center", gap: 2, padding: "0 4px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}>
            {/* Solid black avatar — the mark is the initial, not a colour. */}
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 620, color: "#ffffff", border: open === "profile" ? `2px solid ${T.borderStrong}` : "2px solid transparent", transition: "border .15s" }}>
              {avatarLetter}
            </div>
            <ChevronDown size={13} strokeWidth={2} color={textMuted} className="hidden sm:block" style={{ transition: "transform .2s", transform: open === "profile" ? "rotate(180deg)" : "rotate(0)" }} />
          </button>
          {open === "profile" && (
            <div style={{ ...dropStyle, minWidth: 264 }}>
              {/* User header */}
              <div style={{ padding: "16px", borderBottom: `1px solid ${dropBorder}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 620, color: "#ffffff", flexShrink: 0 }}>
                  {avatarLetter}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 620, color: textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
                  {displayEmail && <div style={{ fontSize: 11.5, color: textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 170 }}>{displayEmail}</div>}
                  {companyName && <div style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>{companyName}</div>}
                  {!companyName && <div style={{ fontSize: 11, color: textDim, marginTop: 2 }}>{orgShort}</div>}
                </div>
              </div>

              {/* Plan badge */}
              <div style={{ padding: "11px 16px", borderBottom: `1px solid ${dropBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11.5, color: textDim }}>Current Plan</span>
                <span style={{ fontSize: 10.5, fontWeight: 620, padding: "3px 10px", borderRadius: 999, background: TONE.green.bg, color: TONE.green.color, border: `1px solid ${TONE.green.border}` }}>{planLabel}</span>
              </div>

              {/* Nav items */}
              <div style={{ padding: "6px 0" }}>
                <Link href="/dashboard/profile" onClick={() => setOpen(null)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer", transition: "background .15s", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = hoverBg}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke={textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize: 12.5, color: textMuted, fontWeight: 520, flex: 1 }}>My Profile</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke={T.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>

              {/* Sign out */}
              <div style={{ borderTop: `1px solid ${dropBorder}`, padding: "6px 0" }}>
                <div onClick={handleSignOut} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer", transition: "background .15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = TONE.red.bg}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke={STATUS.red} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize: 12.5, color: STATUS.red, fontWeight: 520 }}>Sign Out</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
