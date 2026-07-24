"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  Lock,
  Shield,
  Fish,
  Link2,
  ClipboardCheck,
  Settings,
  ChevronDown,
  FileWarning,
  SlidersHorizontal,
} from "lucide-react";
import { T } from "@/lib/dashboardTheme";

const navItems = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Live Threats", href: "/dashboard/live-threats", Icon: ShieldAlert },
  { label: "Secret Scanner", href: "/dashboard/secret-scanner", Icon: Lock },
  // { label: "Browser Protection", href: "/dashboard/browser-protection", Icon: Shield },
  { label: "Phishing Monitoring", href: "/dashboard/ai-monitoring", Icon: Fish },
  // {
  //   label: "Integrations",
  //   href: "/dashboard/integrations",
  //   Icon: Link2,
  //   children: [
  //     { label: "GitHub", href: "/dashboard/integrations#github" },
  //     { label: "GitLab", href: "/dashboard/integrations#gitlab" },
  //     { label: "AWS", href: "/dashboard/integrations#aws" },
  //     { label: "Slack", href: "/dashboard/integrations#slack" },
  //   ],
  // },
  {
    label: "Incident Reports",
    href: "/dashboard/incident-reports",
    Icon: FileWarning,
    children: [
      { label: "Secrets Report", href: "/dashboard/incident-reports/secrets" },
      { label: "Phishing Mail Report", href: "/dashboard/incident-reports/phishing" },
      { label: "Email DLP Report", href: "/dashboard/incident-reports/email-dlp" },
      { label: "Extensions Report", href: "/dashboard/incident-reports/extensions" },
    ],
  },
  // { label: "Compliance", href: "/dashboard/compliance", Icon: ClipboardCheck },
  { label: "Controls", href: "/dashboard/controls", Icon: SlidersHorizontal },
  { label: "Settings", href: "/dashboard/settings", Icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

// Light rail. The active row is a soft grey pill with near-black ink — the
// contrast step alone marks position, so no accent colour is needed here.
const sidebarBg = "#fbfbfc";
const borderColor = "#ebebee";
const activeRowBg = "#f0f0f2";
const hoverRowBg = "#f5f5f6";
const textActive = T.text;
const textMuted = T.text2;
const textDim = T.muted;

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const rawPathname = usePathname();
  // Routes resolve with a trailing slash; strip it so exact matches still land.
  const pathname = rawPathname !== "/" ? rawPathname.replace(/\/+$/, "") : rawPathname;
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (label: string) =>
    setExpanded((e) =>
      e.includes(label) ? e.filter((x) => x !== label) : [...e, label]
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: sidebarBg, color: textActive }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 18px", borderBottom: `1px solid ${borderColor}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo1.png"
          alt="SecureLint"
          width={30}
          height={30}
          style={{ width: 30, height: 30, borderRadius: 7, display: "block", flexShrink: 0 }}
        />
        <span style={{ fontSize: 16, fontWeight: 680, color: textActive, letterSpacing: "-0.02em" }}>
          SecureLint
        </span>
      </div>

      {/* Nav */}
      <nav className="dash-scroll" style={{ flex: 1, overflowY: "auto", padding: "12px 10px 24px" }}>
        {navItems.map((item) => {
          const Icon = item.Icon;
          const hasKids = !!item.children?.length;
          const isExpanded = expanded.includes(item.label);
          const basePath = item.href.split("#")[0];

          const isActive = hasKids
            ? pathname === basePath || pathname.startsWith(`${basePath}/`)
            : item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          const rowStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            gap: 11,
            width: "100%",
            borderRadius: 9,
            padding: "9px 11px",
            fontSize: 13.5,
            letterSpacing: "-0.01em",
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
            marginTop: 1,
            transition: "background 0.15s, color 0.15s",
            background: isActive ? activeRowBg : "transparent",
            color: isActive ? textActive : textMuted,
            fontWeight: isActive ? 600 : 460,
          };

          if (hasKids) {
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggle(item.label)}
                  style={{ ...rowStyle, textAlign: "left" }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = hoverRowBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon size={17} strokeWidth={1.8} color={isActive ? textActive : textMuted} />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.label}
                  </span>
                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    color={textDim}
                    style={{
                      flexShrink: 0,
                      transition: "transform 0.2s",
                      transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                    }}
                  />
                </button>

                {isExpanded && (
                  /* Children hang off a hairline rule, so the indent reads as
                     structure rather than as loose whitespace. */
                  <div style={{ display: "flex", flexDirection: "column", marginTop: 2, marginLeft: 20, paddingLeft: 12, borderLeft: `1px solid ${borderColor}` }}>
                    {item.children!.map((child) => {
                      const childBase = child.href.split("#")[0];
                      const childActive = pathname === childBase;
                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={onClose}
                          style={{
                            display: "block",
                            borderRadius: 7,
                            padding: "7px 9px",
                            fontSize: 12.5,
                            textDecoration: "none",
                            background: childActive ? activeRowBg : "transparent",
                            color: childActive ? textActive : textDim,
                            fontWeight: childActive ? 600 : 450,
                            transition: "color 0.15s, background 0.15s",
                          }}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              style={rowStyle}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = hoverRowBg;
                  e.currentTarget.style.color = textActive;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = textMuted;
                }
              }}
            >
              <Icon size={17} strokeWidth={1.8} color={isActive ? textActive : textMuted} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside
        style={{
          width: 224,
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          background: sidebarBg,
          borderRight: `1px solid ${borderColor}`,
        }}
        className="hidden md:flex flex-col"
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }} className="md:hidden">
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(16,17,20,0.32)", backdropFilter: "blur(3px)" }}
            onClick={onClose}
          />
          <aside
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 240,
              background: sidebarBg,
              borderRight: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              boxShadow: T.shadowLg,
            }}
          >
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
