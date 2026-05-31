"use client";
import React from "react";
import s from "./PricingSection.module.css";

type FeatureValue = boolean | string;

interface CompRow {
  category: string;
  feature: string;
  free: FeatureValue;
  pro: FeatureValue;
  enterprise: FeatureValue;
}

const ROWS: CompRow[] = [
  // ── Phishing & Threat Detection ─────────────────────────────────────────
  { category: "Phishing & Threat Detection", feature: "100+ real-time security checks",          free: true,  pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "Safe domain check",                       free: true,  pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "URL pattern analysis",                    free: true,  pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "Typosquat detection",                     free: true,  pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "Google Safe Browsing",                    free: true,  pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "Free hosting detection",                  free: true,  pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "AI Brand Detection (any company)",        free: false, pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "Crypto scam & fake dApp detection",       free: false, pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "Social engineering detection",            free: false, pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "Fake CAPTCHA & ClickFix protection",      free: false, pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "Detects scams in 100+ languages",         free: false, pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "Multi-layer AI with auto failover",       free: false, pro: true,  enterprise: true  },
  { category: "Phishing & Threat Detection", feature: "Crowd-powered protection",                free: "Basic", pro: "Advanced", enterprise: "Advanced" },

  // ── Secret & Data Protection ─────────────────────────────────────────────
  { category: "Secret & Data Protection",   feature: "Secret detection & masking",               free: true,  pro: true,  enterprise: true  },
  { category: "Secret & Data Protection",   feature: "Medium & low severity detection",          free: true,  pro: true,  enterprise: true  },
  { category: "Secret & Data Protection",   feature: "Critical & high severity detection",       free: false, pro: true,  enterprise: true  },
  { category: "Secret & Data Protection",   feature: "Console masking",                          free: false, pro: true,  enterprise: true  },
  { category: "Secret & Data Protection",   feature: "Auto-mask textareas & inputs",             free: true,  pro: true,  enterprise: true  },
  { category: "Secret & Data Protection",   feature: "Auto-mask editor (CodeMirror, Monaco…)",   free: false, pro: true,  enterprise: true  },
  { category: "Secret & Data Protection",   feature: "Block network secrets & form submission",  free: false, pro: true,  enterprise: true  },
  { category: "Secret & Data Protection",   feature: "Password breach monitoring (HIBP)",        free: false, pro: true,  enterprise: true  },
  { category: "Secret & Data Protection",   feature: "Pastejacking guard",                       free: false, pro: true,  enterprise: true  },
  { category: "Secret & Data Protection",   feature: "Hidden text attack protection",            free: false, pro: true,  enterprise: true  },

  // ── Browser Protection ───────────────────────────────────────────────────
  { category: "Browser Protection",          feature: "Clickjacking protection",                 free: false, pro: true,  enterprise: true  },
  { category: "Browser Protection",          feature: "Link hover scanner (score before click)", free: false, pro: true,  enterprise: true  },
  { category: "Browser Protection",          feature: "Manual URL checker",                      free: false, pro: true,  enterprise: true  },
  { category: "Browser Protection",          feature: "Site exclusion rules",                    free: false, pro: true,  enterprise: true  },

  // ── Dashboard & Notifications ────────────────────────────────────────────
  { category: "Dashboard & Notifications",   feature: "Real-time desktop notifications",         free: false, pro: true,  enterprise: true  },
  { category: "Dashboard & Notifications",   feature: "Risk score & activity dashboard",         free: true,  pro: true,  enterprise: true  },
  { category: "Dashboard & Notifications",   feature: "Advanced scan history & weekly stats",    free: false, pro: true,  enterprise: true  },
  { category: "Dashboard & Notifications",   feature: "Real-time updates & animated charts",     free: false, pro: true,  enterprise: true  },
  { category: "Dashboard & Notifications",   feature: "Export detection reports",                free: true,  pro: true,  enterprise: true  },

  // ── UI & Experience ───────────────────────────────────────────────────────
  { category: "UI & Experience",             feature: "Draggable widget & smart positioning",    free: false, pro: true,  enterprise: true  },
  { category: "UI & Experience",             feature: "Lifetime updates during subscription",    free: false, pro: true,  enterprise: true  },
  { category: "UI & Experience",             feature: "Early access to new features",            free: false, pro: true,  enterprise: true  },

  // ── Enterprise ────────────────────────────────────────────────────────────
  { category: "Enterprise",                  feature: "Email DLP & send blocking",               free: false, pro: false, enterprise: true  },
  { category: "Enterprise",                  feature: "Aggressive email blocking",               free: false, pro: false, enterprise: true  },
  { category: "Enterprise",                  feature: "WAF / social-domain blocking",            free: false, pro: false, enterprise: true  },
  { category: "Enterprise",                  feature: "Enterprise data collection",              free: false, pro: false, enterprise: true  },
  { category: "Enterprise",                  feature: "Centralized admin dashboard",             free: false, pro: false, enterprise: true  },
  { category: "Enterprise",                  feature: "Custom policy management",                free: false, pro: false, enterprise: true  },
  { category: "Enterprise",                  feature: "Incident reporting & audit logs",         free: false, pro: false, enterprise: true  },
  { category: "Enterprise",                  feature: "Dedicated support & SLA",                free: false, pro: false, enterprise: true  },
];

function Cell({ val }: { val: FeatureValue }) {
  if (typeof val === "string") {
    return <span style={{ fontSize: 12, fontWeight: 600, color: "#1a7f37", background: "#dafbe1", padding: "2px 8px", borderRadius: 10 }}>{val}</span>;
  }
  return val
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#1a7f37"/><path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#f0f0f0"/><path d="M9 9l6 6M15 9l-6 6" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/></svg>;
}

// Group rows by category
const CATEGORIES = Array.from(new Set(ROWS.map(r => r.category)));

export function PlanComparison() {
  return (
    <section style={{ background: "var(--bg)", padding: "0 24px 80px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.7px", marginBottom: 12 }}>
            Compare plans
          </h2>
          <p style={{ fontSize: 16, color: "var(--ink-muted)", maxWidth: 520, margin: "0 auto" }}>
            See exactly what&apos;s included in each plan.
          </p>
        </header>

        <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            {/* Header */}
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: 700, color: "#57606a", borderBottom: "2px solid #e2e8f0", width: "50%" }}>Feature</th>
                {(["Pro", "Enterprise"] as const).map((plan, i) => (
                  <th key={plan} style={{ padding: "16px 20px", textAlign: "center", fontWeight: 800, color: i === 0 ? "#1a7f37" : "#1a1a2e", borderBottom: "2px solid #e2e8f0", background: i === 0 ? "#f0fdf4" : undefined }}>
                    {plan}
                    {i === 0 && <span style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#1a7f37", background: "#dafbe1", borderRadius: 8, padding: "1px 6px", marginTop: 4 }}>Most Popular</span>}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {CATEGORIES.map(cat => {
                const catRows = ROWS.filter(r => r.category === cat);
                return (
                  <React.Fragment key={cat}>
                    {/* Category header row */}
                    <tr style={{ background: "#f1f5f9" }}>
                      <td colSpan={3} style={{ padding: "10px 20px", fontWeight: 700, fontSize: 12, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {cat}
                      </td>
                    </tr>

                    {catRows.map((row, idx) => (
                      <tr key={`${cat}-${row.feature}`} style={{ background: idx % 2 === 0 ? "#fff" : "#fafbfc", borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "13px 20px", color: "#1a1a2e", fontWeight: 500 }}>{row.feature}</td>
                        <td style={{ padding: "13px 20px", textAlign: "center", background: "rgba(26,127,55,.03)" }}><Cell val={row.pro} /></td>
                        <td style={{ padding: "13px 20px", textAlign: "center" }}><Cell val={row.enterprise} /></td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
