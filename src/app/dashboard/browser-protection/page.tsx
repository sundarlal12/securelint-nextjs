"use client";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { LazyCard } from "@/components/dashboard/CardLoader";
import { fetchBrowserProtection, fetchCharts } from "@/lib/adminApi";
import { TONE } from "@/lib/dashboardTheme";

const defaultThreats = [
  { type: "Malicious Chrome Extension", browser: "Chrome", level: "Critical", detected: "2 mins ago", action: "Blocked" },
  { type: "Phishing Website Blocked", browser: "Firefox", level: "High", detected: "5 mins ago", action: "Resolved" },
  { type: "Clipboard Hijacking Attempt", browser: "Edge", level: "Medium", detected: "12 mins ago", action: "Monitoring" },
  { type: "Cookie Theft Detection", browser: "Chrome", level: "Critical", detected: "20 mins ago", action: "Quarantined" },
  { type: "Fake Login Page Prevented", browser: "Chrome", level: "High", detected: "35 mins ago", action: "Blocked" },
  { type: "Suspicious Download Blocked", browser: "Firefox", level: "High", detected: "50 mins ago", action: "Resolved" },
];

const defaultStats = { safe_browsing: 1245, blocked_phishing: 8762 };

const levelStyles: Record<string, { color: string; bg: string; border: string }> = {
  Critical: TONE.red,
  High:     TONE.orange,
  Medium:   TONE.amber,
};

function BrowserIcon({ name }: { name: string }) {
  const colors: Record<string, string[]> = {
    Chrome: ["#ea4335", "#4285f4", "#fbbc05", "#34a853"],
    Firefox: ["#ff7139", "#e15f2b"],
    Edge: ["#0078d7", "#50e6ff"],
  };
  const c = colors[name] ?? ["#52525b"];
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill={c[0]} />
      {c.length > 1 && <circle cx="10" cy="10" r="5" fill={c[1] ?? c[0]} />}
      {c.length > 2 && <><path d="M10 1A9 9 0 0 1 19 10L10 10Z" fill={c[1]}/><path d="M19 10A9 9 0 0 1 5 18L10 10Z" fill={c[2]}/><path d="M5 18A9 9 0 0 1 10 1L10 10Z" fill={c[3]}/><circle cx="10" cy="10" r="4" fill="white"/><circle cx="10" cy="10" r="3" fill={c[1]}/></>}
    </svg>
  );
}

const defaultSafeData = [
  { t: "Jan", v: 60 }, { t: "Mon", v: 90 }, { t: "Feb", v: 110 },
  { t: "Edg", v: 80 }, { t: "Sep", v: 140 }, { t: "Aug", v: 120 },
];

const defaultThreatBlockedData = [
  { t: "Mar", v: 30 }, { t: "Apr", v: 50 }, { t: "May", v: 65 }, { t: "Jun", v: 45 },
  { t: "Jul", v: 80 }, { t: "Aug", v: 60 }, { t: "Sep", v: 70 },
];

const defaultPieData = [
  { name: "Safe", value: 65, color: "#16a34a" },
  { name: "Risk", value: 20, color: "#ea580c" },
  { name: "Unknown", value: 15, color: "#2563eb" },
];

const defaultPhishTrendData = [
  { t: "Jan", v: 20 }, { t: "Feb", v: 35 }, { t: "Mar", v: 30 }, { t: "May", v: 50 },
  { t: "Jun", v: 45 }, { t: "Jul", v: 60 }, { t: "Aug", v: 75 }, { t: "Sep", v: 55 },
];

const cardStyle: React.CSSProperties = { background: "#ffffff", border: "1px solid #e9e9ec", borderRadius: 14 };

function WorldHeatmap() {
  const dots = [
    { x: 25, y: 30 }, { x: 30, y: 28 }, { x: 48, y: 25 }, { x: 52, y: 30 },
    { x: 55, y: 22 }, { x: 60, y: 35 }, { x: 70, y: 28 }, { x: 75, y: 32 },
    { x: 80, y: 40 }, { x: 35, y: 50 }, { x: 65, y: 45 }, { x: 20, y: 45 },
    { x: 85, y: 55 }, { x: 45, y: 35 }, { x: 38, y: 42 },
  ];
  return (
    <svg viewBox="0 0 100 60" width="100%" height="100%" style={{ opacity: 0.5 }}>
      <ellipse cx="50" cy="30" rx="45" ry="24" fill="none" stroke="#e9e9ec" strokeWidth="0.3" />
      <ellipse cx="25" cy="30" rx="18" ry="20" fill="none" stroke="#e9e9ec" strokeWidth="0.2" />
      <ellipse cx="55" cy="28" rx="22" ry="22" fill="none" stroke="#e9e9ec" strokeWidth="0.2" />
      <ellipse cx="78" cy="32" rx="14" ry="18" fill="none" stroke="#e9e9ec" strokeWidth="0.2" />
      {dots.map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r="1.5" fill="#0d9488" opacity={0.3 + Math.random() * 0.5} />
          <circle cx={d.x} cy={d.y} r="0.5" fill="#0d9488" />
        </g>
      ))}
    </svg>
  );
}

export default function BrowserProtectionPage() {
  const [threats, setThreats] = useState(defaultThreats);
  const [stats, setStats] = useState(defaultStats);
  const [safeData, setSafeData] = useState(defaultSafeData);
  const [threatBlockedData, setThreatBlockedData] = useState(defaultThreatBlockedData);
  const [pieData, setPieData] = useState(defaultPieData);
  const [phishTrendData, setPhishTrendData] = useState(defaultPhishTrendData);

  useEffect(() => {
    async function load() {
      const data = await fetchBrowserProtection();
      if (data?.threats && Array.isArray(data.threats)) setThreats(data.threats);
      if (data?.stats) setStats({ safe_browsing: data.stats.safe_browsing ?? 1245, blocked_phishing: data.stats.blocked_phishing ?? 8762 });

      const charts = await fetchCharts();
      const bp = charts?.browser_protection;
      if (bp?.safe_data && Array.isArray(bp.safe_data)) setSafeData(bp.safe_data);
      if (bp?.threat_blocked_data && Array.isArray(bp.threat_blocked_data)) setThreatBlockedData(bp.threat_blocked_data);
      if (bp?.pie_data && Array.isArray(bp.pie_data)) setPieData(bp.pie_data);
      if (bp?.phish_trend_data && Array.isArray(bp.phish_trend_data)) setPhishTrendData(bp.phish_trend_data);
    }
    load().catch(() => {});
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1400 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 24, fontWeight: 660, color: "#0a0a0a", letterSpacing: "-0.028em", margin: 0 }}>Browser Protection</h2>
        <p style={{ fontSize: 14, color: "#52525b", marginTop: 6 }}>Real-time browser security, extension monitoring, phishing defense, and secure web protection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2" style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={300}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span className="card-title">Active Browser Threats Table</span>
              <span style={{ color: "#a1a1aa", cursor: "pointer", fontSize: 18 }}>···</span>
            </div>
            <div className="overflow-x-auto">
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e9e9ec" }}>
                    {["Threat Type", "Browser", "Risk Level", "Detected Time", "Action Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 8px 8px 0", color: "#52525b", fontWeight: 600, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {threats.map((t, i) => {
                    const lv = levelStyles[t.level] ?? { color: "#52525b", bg: "#e9e9ec", border: "#333" };
                    return (
                      <tr key={i} style={{ borderBottom: i < threats.length - 1 ? "1px solid #e9e9ec" : "none" }}>
                        <td style={{ padding: "12px 8px 12px 0", color: "#0a0a0a", fontWeight: 500 }}>{t.type}</td>
                        <td style={{ padding: "12px 8px 12px 0" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#0a0a0a" }}>
                            <BrowserIcon name={t.browser} />
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px 12px 0" }}>
                          <span style={{ fontSize: 10, fontWeight: 400, padding: "3px 12px", borderRadius: 20, color: lv.color, background: lv.bg, border: `1px solid ${lv.border}` }}>{t.level}</span>
                        </td>
                        <td style={{ padding: "12px 8px 12px 0", color: "#52525b", fontSize: 12 }}>{t.detected}</td>
                        <td style={{ padding: "12px 0", color: "#0a0a0a", fontSize: 12 }}>{t.action}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LazyCard>
        </div>

        <div style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={500}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span className="card-title">Real-Time Web Protection Panel</span>
              <span style={{ color: "#a1a1aa", cursor: "pointer", fontSize: 18 }}>···</span>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ background: "#f1faf6", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, minWidth: 100 }}>
                <div style={{ position: "relative", width: 48, height: 48, marginBottom: 6 }}>
                  <svg viewBox="0 0 48 48" width="48" height="48">
                    <path d="M24 4L6 14v12c0 11 8 18 18 20 10-2 18-9 18-20V14z" fill="#122118" stroke="#16a34a" strokeWidth="1.5"/>
                    <path d="M19 24l4 4 8-8" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ fontSize: 10, color: "#52525b", marginBottom: 2 }}>Safe Browsing</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0d9488" }}>{stats.safe_browsing.toLocaleString()}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#52525b", marginBottom: 2 }}>Blocked Phishing Attempts:</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#0a0a0a", marginBottom: 8 }}>{stats.blocked_phishing.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "#52525b", marginBottom: 10 }}>Browser Sessions Protected</div>
                {[
                  { text: "Secure DNS Enabled", val: "" },
                  { text: "Web Tracking Blocked", val: "" },
                  { text: "Real-time Protection", val: "Active" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#0a0a0a", marginBottom: 6 }}>
                    <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 13 }}>✓</span>
                    <span>{item.text}</span>
                    {item.val && <span style={{ color: "#16a34a", fontWeight: 700, marginLeft: 4 }}>{item.val}</span>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Chrome", "Firefox", "Edge"].map((b) => (
                <div key={b} style={{ width: 32, height: 32, borderRadius: 8, background: "#f4f4f5", border: "1px solid #e9e9ec", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BrowserIcon name={b} />
                </div>
              ))}
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f4f4f5", border: "1px solid #e9e9ec", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#7c3aed"/><circle cx="10" cy="10" r="4" fill="#7c3aed"/></svg>
              </div>
            </div>
          </LazyCard>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={600}>
            <div style={{ marginBottom: 10 }}>
              <span className="card-title">Real-Time Web Protection Panel</span>
            </div>
            <div style={{ fontSize: 10, color: "#52525b", marginBottom: 6 }}>Safe Browsing</div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={safeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs><linearGradient id="sbg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/><stop offset="95%" stopColor="#16a34a" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="t" tick={{ fill: "#71717a", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={1.5} fill="url(#sbg)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </LazyCard>
        </div>

        <div style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={700}>
            <div style={{ marginBottom: 10 }}>
              <span className="card-title">Browser Security Analytics</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 9, color: "#52525b", marginBottom: 6, fontWeight: 600 }}>Threats Blocked Over Time</div>
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={threatBlockedData} margin={{ top: 2, right: 2, left: -20, bottom: 0 }}>
                    <XAxis dataKey="t" tick={{ fill: "#71717a", fontSize: 7 }} axisLine={false} tickLine={false} />
                    <Bar dataKey="v" fill="#0d9488" radius={[2, 2, 0, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div style={{ fontSize: 9, color: "#52525b", marginBottom: 6, fontWeight: 600 }}>Extension Risk Analytics</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <PieChart width={80} height={80}>
                    <Pie data={pieData} cx={37} cy={37} innerRadius={20} outerRadius={34} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </div>
              </div>
            </div>
          </LazyCard>
        </div>

        <div style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={800}>
            <div style={{ marginBottom: 10 }}>
              <span className="card-title">Phishing Detection Trend</span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={phishTrendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs><linearGradient id="ptg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/><stop offset="95%" stopColor="#0d9488" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="t" tick={{ fill: "#71717a", fontSize: 8 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#71717a", fontSize: 8 }} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="v" stroke="#0d9488" strokeWidth={1.5} fill="url(#ptg)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </LazyCard>
        </div>

        <div style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={900}>
            <div style={{ marginBottom: 10 }}>
              <span className="card-title">Browser Attack Heatmap</span>
            </div>
            <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <WorldHeatmap />
            </div>
          </LazyCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={1000}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span className="card-title">AI Browser Defense Assistant</span>
              <span style={{ color: "#a1a1aa", cursor: "pointer", fontSize: 18 }}>···</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { text: "Malicious extension removed", ok: false },
                { text: "Clipboard protection enabled", ok: false },
                { text: "Suspicious login blocked", ok: false },
                { text: "AI web protection active", ok: true },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#0a0a0a" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.ok ? "#16a34a" : "#dc2626", flexShrink: 0, boxShadow: `0 0 6px ${item.ok ? "#16a34a55" : "#dc262655"}` }} />
                  {item.text}
                </div>
              ))}
            </div>
          </LazyCard>
        </div>

        <div style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={1100}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span className="card-title">Device & Session Security</span>
              <span style={{ color: "#a1a1aa", cursor: "pointer", fontSize: 18 }}>···</span>
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              {[
                { label: "Protected\nBrowsers", val: "12" },
                { label: "Active\nSessions", val: "45" },
                { label: "Threats\nBlocked", val: "2.1k" },
                { label: "Secure\nBrowsing", val: "98%", highlight: true },
              ].map((m, i) => (
                <div key={i} style={{ flex: 1, padding: "0 12px", borderLeft: i > 0 ? "1px solid #e9e9ec" : "none", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#52525b", marginBottom: 6, whiteSpace: "pre-line", lineHeight: 1.3 }}>{m.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: m.highlight ? "#16a34a" : "#0d9488", lineHeight: 1 }}>{m.val}</div>
                </div>
              ))}
            </div>
          </LazyCard>
        </div>

        <div style={{ ...cardStyle, padding: "18px 20px 20px" }}>
          <LazyCard delay={1200}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span className="card-title">Extension Monitoring Panel</span>
              <span style={{ color: "#a1a1aa", cursor: "pointer", fontSize: 18 }}>···</span>
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              {[
                { label: "Installed\nExtensions\nScanned", val: "189", color: "#0d9488" },
                { label: "Unsafe\nPermissions\nDetected", val: "14", color: "#dc2626" },
                { label: "Privacy Risk\nScore", val: "Low", color: "#16a34a" },
                { label: "Browser\nIsolation\nStatus", val: "Enabled", color: "#16a34a" },
              ].map((m, i) => (
                <div key={i} style={{ flex: 1, padding: "0 10px", borderLeft: i > 0 ? "1px solid #e9e9ec" : "none", textAlign: "center" }}>
                  <div style={{ fontSize: 8, color: "#52525b", marginBottom: 6, whiteSpace: "pre-line", lineHeight: 1.3 }}>{m.label}</div>
                  <div style={{ fontSize: m.val.length > 3 ? 14 : 22, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.val}</div>
                </div>
              ))}
            </div>
          </LazyCard>
        </div>
      </div>
    </div>
  );
}
