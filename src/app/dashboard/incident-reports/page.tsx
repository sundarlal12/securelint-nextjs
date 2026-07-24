"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, ResponsiveContainer, AreaChart, Area } from "recharts";
import { LazyCard } from "@/components/dashboard/CardLoader";
import { fetchIncidents, fetchIncidentsSecrets, fetchIncidentsPhishing, fetchIncidentsEmailDlp, fetchIncidentsExtension, fetchCharts } from "@/lib/adminApi";

const defaultWeeklyData = [
  { day: "Mon", secrets: 8, phishing: 1, dlp: 3, ext: 1 },
  { day: "Tue", secrets: 6, phishing: 0, dlp: 2, ext: 0 },
  { day: "Wed", secrets: 10, phishing: 1, dlp: 1, ext: 2 },
  { day: "Thu", secrets: 7, phishing: 0, dlp: 2, ext: 1 },
  { day: "Fri", secrets: 9, phishing: 1, dlp: 2, ext: 2 },
  { day: "Sat", secrets: 4, phishing: 0, dlp: 1, ext: 0 },
  { day: "Sun", secrets: 3, phishing: 0, dlp: 1, ext: 0 },
];

const defaultTrendData = [
  { w: "W1", v: 28 }, { w: "W2", v: 35 }, { w: "W3", v: 22 },
  { w: "W4", v: 41 }, { w: "W5", v: 38 }, { w: "W6", v: 47 },
];

const cardStyle: React.CSSProperties = { background: "#ffffff", border: "1px solid #e9e9ec", borderRadius: 14 };

function ShieldIcon() {
  return <svg width="28" height="28" viewBox="0 0 28 28"><path d="M14 3L5 8v7c0 6.5 4 10.5 9 12 5-1.5 9-5.5 9-12V8z" fill="none" stroke="#16a34a" strokeWidth="1.5"/><path d="M11 14l2.5 2.5L18 12" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function HookIcon() {
  return <svg width="28" height="28" viewBox="0 0 28 28"><path d="M14 5v10c0 3-2 5-5 5s-5-2-5-5" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 5l-3-2M14 5l3-2" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function EnvIcon() {
  return <svg width="28" height="28" viewBox="0 0 28 28"><rect x="4" y="7" width="20" height="14" rx="2" fill="none" stroke="#16a34a" strokeWidth="1.5"/><path d="M4 11l10 5 10-5" fill="none" stroke="#16a34a" strokeWidth="1.5"/></svg>;
}
function ExtensionIcon() {
  return <svg width="28" height="28" viewBox="0 0 28 28"><rect x="4" y="4" width="20" height="20" rx="3" fill="none" stroke="#16a34a" strokeWidth="1.5"/><path d="M10 11h8M10 14h8M10 17h5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/><circle cx="19" cy="17" r="3" fill="none" stroke="#16a34a" strokeWidth="1.3"/></svg>;
}

export default function IncidentReportsPage() {
  const [weeklyData, setWeeklyData] = useState(defaultWeeklyData);
  const [trendData, setTrendData] = useState(defaultTrendData);
  const [counts, setCounts] = useState({ secrets: 47, phishing: 3, dlp: 12, extensions: 0 });

  useEffect(() => {
    // Fetch totals from each typed endpoint (uses 90-day window, page_size=1 just for count)
    Promise.all([
      fetchIncidentsSecrets({ page: 0, page_size: 200 }),
      fetchIncidentsPhishing({ page: 0, page_size: 200 }),
      fetchIncidentsEmailDlp({ page: 0, page_size: 200 }),
      fetchIncidentsExtension({ page: 0, page_size: 200 }),
    ]).then(([s, p, d, e]) => {
      setCounts({
        secrets:    Number(s?.total ?? s?.count ?? 47),
        phishing:   Number(p?.total ?? p?.count ?? 3),
        dlp:        Number(d?.total ?? d?.count ?? 12),
        extensions: Number(e?.total ?? e?.count ?? 0),
      });
    }).catch(() => {});

    // Fallback: also try the combined /incidents endpoint
    fetchIncidents().then((data) => {
      if (data?.counts) {
        setCounts(prev => ({
          secrets:    data.counts.secrets    ?? prev.secrets,
          phishing:   data.counts.phishing   ?? prev.phishing,
          dlp:        data.counts.dlp        ?? prev.dlp,
          extensions: data.counts.extensions ?? prev.extensions,
        }));
      }
    }).catch(() => {});

    fetchCharts()
      .then((data) => {
        const ir = data?.incident_reports;
        if (ir?.hub_weekly) setWeeklyData(ir.hub_weekly);
        if (ir?.six_week_trend) setTrendData(ir.six_week_trend);
      })
      .catch(() => {});
  }, []);

  const reports = [
    { title: "Secrets Report", desc: "Exposed API keys, tokens, and credentials detected across repositories and cloud environments.", href: "/dashboard/incident-reports/secrets", count: counts.secrets, sub: "secrets detected\nthis week", Icon: ShieldIcon },
    { title: "Phishing Mail Report", desc: "Phishing email incidents intercepted, flagged sender domains, and impersonation attempts.", href: "/dashboard/incident-reports/phishing", count: counts.phishing, sub: "phishing attempts\nblocked", Icon: HookIcon },
    { title: "Email DLP Report", desc: "Outbound data loss prevention violations, blocked emails, and sensitive content exfiltration.", href: "/dashboard/incident-reports/email-dlp", count: counts.dlp, sub: "email DLP blocks\nthis week", Icon: EnvIcon },
    { title: "Extension Report", desc: "Browser extension activity — malicious extensions, blacklisted add-ons, installs, and removals across your org.", href: "/dashboard/incident-reports/extensions", count: counts.extensions, sub: "extension events\ndetected", Icon: ExtensionIcon },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1400 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 24, fontWeight: 660, color: "#0a0a0a", letterSpacing: "-0.028em", margin: 0 }}>Incident Reports</h2>
        <p style={{ fontSize: 14, color: "#52525b", marginTop: 6 }}>Review and investigate detected incidents and policy violations across your organization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reports.map((r, i) => (
          <Link key={i} href={r.href} style={{ textDecoration: "none" }}>
            <div style={{ ...cardStyle, padding: "24px 28px", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#16a34a"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e9e9ec"}>
              <LazyCard delay={200 + i * 150}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f1faf6", border: "1px solid #16a34a22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <r.Icon />
                  </div>
                  <div>
                    <div style={{ fontSize: 36, fontWeight: 680, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{r.count}</div>
                    <div style={{ fontSize: 12, color: "#52525b", marginTop: 4, whiteSpace: "pre-line", lineHeight: 1.4 }}>{r.sub}</div>
                  </div>
                </div>
              </LazyCard>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div style={{ ...cardStyle, padding: "20px 22px" }}>
          <LazyCard delay={700}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span className="card-title">Weekly Incident Breakdown</span>
              <div style={{ display: "flex", gap: 12 }}>
                {[{ label: "Secrets", color: "#0d9488" }, { label: "Phishing", color: "#dc2626" }, { label: "DLP", color: "#2563eb" }, { label: "Ext", color: "#7c3aed" }].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                    <span style={{ fontSize: 10, color: "#52525b" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Bar dataKey="secrets"  fill="#0d9488" radius={[2, 2, 0, 0]} barSize={8} />
                <Bar dataKey="phishing" fill="#dc2626" radius={[2, 2, 0, 0]} barSize={8} />
                <Bar dataKey="dlp"      fill="#2563eb" radius={[2, 2, 0, 0]} barSize={8} />
                <Bar dataKey="ext"      fill="#7c3aed" radius={[2, 2, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </LazyCard>
        </div>

        <div style={{ ...cardStyle, padding: "20px 22px" }}>
          <LazyCard delay={800}>
            <div style={{ marginBottom: 14 }}>
              <span className="card-title">Incident Volume Trend (6 weeks)</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs><linearGradient id="irt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/><stop offset="95%" stopColor="#0d9488" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="w" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="v" stroke="#0d9488" strokeWidth={2} fill="url(#irt)" dot={{ r: 3, fill: "#0d9488", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </LazyCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reports.map((r, i) => (
          <Link key={i} href={r.href} style={{ textDecoration: "none" }}>
            <div style={{ ...cardStyle, padding: "20px 22px", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#16a34a"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e9e9ec"}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0a0a0a", marginBottom: 6 }}>{r.title}</div>
              <p style={{ fontSize: 12, color: "#52525b", lineHeight: 1.6, margin: 0, marginBottom: 12 }}>{r.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#0d9488", fontWeight: 600 }}>
                View Report →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
