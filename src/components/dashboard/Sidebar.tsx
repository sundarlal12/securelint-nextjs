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
} from "lucide-react";

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
    ],
  },
  // { label: "Compliance", href: "/dashboard/compliance", Icon: ClipboardCheck },
  { label: "Settings", href: "/dashboard/settings", Icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const sidebarBg = "#0b1120";
const borderColor = "#182030";
const activeRowBg = "#1a2636";
const hoverRowBg = "#131d2a";
const textWhite = "#ffffff";
const textMuted = "#c8d1db";
const textDim = "#7d8a99";

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (label: string) =>
    setExpanded((e) =>
      e.includes(label) ? e.filter((x) => x !== label) : [...e, label]
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: sidebarBg, color: textWhite }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 20px 24px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo1.png"
          alt="SecureLint"
          width={38}
          height={38}
          style={{ width: 38, height: 38, borderRadius: 8, display: "block", flexShrink: 0 }}
        />
        <span style={{ fontSize: 17, fontWeight: 800, color: textWhite, letterSpacing: "-0.3px" }}>
          SecureLint
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "0 12px 24px" }}>
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
            gap: 14,
            width: "100%",
            borderRadius: 8,
            padding: "12px 14px",
            fontSize: 14,
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
            marginTop: 2,
            transition: "background 0.15s",
            background: isActive ? activeRowBg : "transparent",
            color: isActive ? textWhite : textMuted,
            fontWeight: isActive ? 600 : 400,
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
                  <Icon size={20} strokeWidth={1.5} color={isActive ? textWhite : textMuted} />
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
                  <div style={{ display: "flex", flexDirection: "column", marginTop: 2, marginLeft: 42 }}>
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
                            borderRadius: 6,
                            padding: "8px 8px",
                            fontSize: 13,
                            textDecoration: "none",
                            color: childActive ? textWhite : textDim,
                            fontWeight: childActive ? 500 : 400,
                            transition: "color 0.15s",
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
                  e.currentTarget.style.color = textWhite;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = textMuted;
                }
              }}
            >
              <Icon size={20} strokeWidth={1.5} color={isActive ? textWhite : textMuted} />
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
          width: 210,
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
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />
          <aside
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 230,
              background: sidebarBg,
              borderRight: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
