"use client";
import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts";
import { LazyCard } from "@/components/dashboard/CardLoader";
import { fetchPhishingStats, fetchCharts, fetchIncidentsPhishing } from "@/lib/adminApi";

// ── Styles ────────────────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = { background: "#ffffff", border: "1px solid #e9e9ec", borderRadius: 14 };
const tooltipStyle: React.CSSProperties = { background: "#fafafa", border: "1px solid #e9e9ec", borderRadius: 8, color: "#0a0a0a", fontSize: 11 };
const sk = (w: number | string, h: number, r = 5): React.CSSProperties => ({
  width: w, height: h, borderRadius: r, background: "#e9e9ec",
  animation: "sk-pulse 1.4s ease-in-out infinite", display: "inline-block",
});

// ── Static fallbacks (shown only if API returns nothing) ──────────────────────
const DEFAULT_VOLUME: { t: string; detected: number; blocked: number }[] = [
  { t: "00", detected: 0, blocked: 0 }, { t: "04", detected: 0, blocked: 0 },
  { t: "08", detected: 0, blocked: 0 }, { t: "12", detected: 0, blocked: 0 },
  { t: "16", detected: 0, blocked: 0 }, { t: "20", detected: 0, blocked: 0 },
];
const DEFAULT_WEEKLY: { day: string; emails: number; pages: number }[] = [
  { day: "Mon", emails: 0, pages: 0 }, { day: "Tue", emails: 0, pages: 0 },
  { day: "Wed", emails: 0, pages: 0 }, { day: "Thu", emails: 0, pages: 0 },
  { day: "Fri", emails: 0, pages: 0 }, { day: "Sat", emails: 0, pages: 0 },
  { day: "Sun", emails: 0, pages: 0 },
];
const DEFAULT_ATTACK = [
  { label: "Credential Harvest", pct: 38, color: "#dc2626" },
  { label: "Brand Impersonation", pct: 27, color: "#ea580c" },
  { label: "Spear Phishing",      pct: 19, color: "#0d9488" },
  { label: "BEC",                 pct: 16, color: "#a855f7" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function shortUrl(url?: string): string {
  if (!url) return "—";
  try { return new URL(url).hostname || url.slice(0, 30); } catch { return url.slice(0, 30); }
}
function relTime(ts?: string): string {
  if (!ts) return "—";
  try {
    const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60_000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return "—"; }
}
function deriveType(inc: Record<string, unknown>): string {
  const extra = (inc.extra as Record<string, unknown>) ?? {};
  const status = String(extra.site_status ?? extra.status ?? "").toLowerCase();
  if (status === "danger") return "Phishing";
  if (status === "suspicious") return "Suspicious";
  if (status === "unsafe") return "Malicious";
  const action = String(inc.action ?? "").toLowerCase();
  if (action === "blocked") return "Blocked Threat";
  if (inc.secret_type === "phishing") return "Phishing Email";
  return "URL Visit";
}

// ── Donut chart with hover tooltip in centre ──────────────────────────────────
type AttackSeg = { label: string; pct: number; color: string };
function DonutChart({ segs }: { segs: AttackSeg[] }) {
  const [hovered, setHovered] = useState<AttackSeg | null>(null);
  const total = segs.reduce((s, a) => s + a.pct, 0) || 1;
  const r = 42, sw = 22, cx = 60, cy = 60;
  let cum = 0;
  // shorten label to fit inside the donut hole (r - sw/2 ≈ 31px radius)
  const labelLine = hovered
    ? (hovered.label.length > 10 ? hovered.label.slice(0, 9) + "…" : hovered.label)
    : null;
  return (
    <svg viewBox="0 0 120 120" width={120} height={120} style={{ overflow: "visible" }}>
      {segs.map((seg, i) => {
        const len = (seg.pct / total) * 2 * Math.PI * r;
        const off = -cum * (2 * Math.PI * r) / total;
        cum += seg.pct;
        const isActive = hovered === seg;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color}
            strokeWidth={isActive ? sw + 4 : sw}
            strokeOpacity={hovered && !isActive ? 0.35 : 1}
            strokeDasharray={`${len} ${2 * Math.PI * r - len}`}
            strokeDashoffset={off}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ cursor: "pointer", transition: "stroke-width 0.15s, stroke-opacity 0.15s" }}
            onMouseEnter={() => setHovered(seg)}
            onMouseLeave={() => setHovered(null)}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r - sw / 2 + 1} fill="#ffffff" />
      {hovered ? (
        <>
          <text x={cx} y={cy - 6} textAnchor="middle" fill={hovered.color} fontSize="13" fontWeight="700">{hovered.pct}%</text>
          <text x={cx} y={cy + 9} textAnchor="middle" fill="#52525b" fontSize="7.5">{labelLine}</text>
        </>
      ) : (
        <text x={cx} y={cy + 4} textAnchor="middle" fill="#a1a1aa" fontSize="9">hover</text>
      )}
    </svg>
  );
}

// Fetch a large batch so both tabs always have rows; paginate 5-at-a-time client-side
const SERVER_BATCH = 100;
const ROWS_PER_PAGE = 5;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AiMonitoringPage() {
  const [tab, setTab]             = useState<"email" | "page">("email");
  const [statsRaw,  setStatsRaw]  = useState<Record<string, unknown> | null>(null);
  const [allIncidents, setAllIncidents] = useState<Record<string, unknown>[]>([]);
  const [volumeData, setVolumeData] = useState(DEFAULT_VOLUME);
  const [weeklyData, setWeeklyData] = useState(DEFAULT_WEEKLY);
  const [attackTypes, setAttackTypes] = useState<AttackSeg[]>(DEFAULT_ATTACK);
  const [topTargeted, setTopTargeted] = useState<{ name: string; val: number }[]>([]);
  const [loading, setLoading]     = useState(true);

  // ── Independent client-side page cursors per tab ──────────────────────────
  const [emailPage, setEmailPage] = useState(0);
  const [pgPage,    setPgPage]    = useState(0);

  // ── Initial load — one large batch covers both tabs ───────────────────────
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchPhishingStats()
        .then((d) => { if (d) setStatsRaw(d as Record<string, unknown>); })
        .catch(() => {}),

      fetchCharts()
        .then((d) => {
          const pm = (d as Record<string, unknown> | null)
            ?.phishing_monitoring as Record<string, unknown> | undefined;
          if (pm?.volume_24h)   setVolumeData(pm.volume_24h as typeof DEFAULT_VOLUME);
          if (pm?.weekly_trend) setWeeklyData(pm.weekly_trend as typeof DEFAULT_WEEKLY);
          if (Array.isArray(pm?.attack_types) && (pm!.attack_types as AttackSeg[]).length > 0)
            setAttackTypes(pm!.attack_types as AttackSeg[]);
          if (pm?.top_targeted) setTopTargeted(pm.top_targeted as { name: string; val: number }[]);
        })
        .catch(() => {}),

      fetchIncidentsPhishing({ page: 0, page_size: SERVER_BATCH })
        .then((d) => {
          const r = d as Record<string, unknown> | null;
          setAllIncidents((r?.incidents as Record<string, unknown>[] | undefined) ?? []);
        })
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  // ── Derived KPI values ────────────────────────────────────────────────────
  const kpis = statsRaw?.kpis as Record<string, unknown> | undefined;
  const threatsBlocked   = Number(kpis?.threats_blocked    ?? 0);
  const blockedLast24h   = Number(kpis?.blocked_last_24h   ?? 0);
  const usersAffected    = Number(kpis?.users_affected     ?? 0);
  const pctProtected     = Number(kpis?.pct_users_protected ?? 0);
  const totalIncidents   = Number(kpis?.total_phishing_incidents ?? 0);

  const kpiCards = [
    { title: "THREATS BLOCKED",    value: String(threatsBlocked), sub1: "All time",       sub2: "↑ Protected",     sub2Color: "#16a34a" },
    { title: "BLOCKED LAST 24H",   value: String(blockedLast24h), sub1: "Rolling 24-hour",sub2: "↑ Active shield", sub2Color: "#16a34a" },
    { title: "USERS AFFECTED",     value: String(usersAffected),  sub1: `${totalIncidents} total incidents`, sub2: "↓ Risk exposure", sub2Color: "#d97706" },
    { title: "USERS PROTECTED",    value: `${pctProtected}%`,     sub1: "Click-through rate", sub2: pctProtected >= 90 ? "↑ Excellent" : "↑ Active", sub2Color: "#16a34a" },
  ];

  // ── Split all incidents by type, then slice the active client-side page ────
  const allEmail  = useMemo(() => allIncidents.filter(i => i.secret_type === "phishing"),  [allIncidents]);
  const allPg     = useMemo(() => allIncidents.filter(i => i.secret_type === "url_visit"), [allIncidents]);

  const emailTotalPages = Math.max(1, Math.ceil(allEmail.length / ROWS_PER_PAGE));
  const pgTotalPages    = Math.max(1, Math.ceil(allPg.length   / ROWS_PER_PAGE));

  const activeEvents = tab === "email"
    ? allEmail.slice(emailPage * ROWS_PER_PAGE, (emailPage + 1) * ROWS_PER_PAGE)
    : allPg.slice(pgPage * ROWS_PER_PAGE, (pgPage + 1) * ROWS_PER_PAGE);

  const curPage    = tab === "email" ? emailPage    : pgPage;
  const totalPages = tab === "email" ? emailTotalPages : pgTotalPages;
  const setPage    = tab === "email" ? setEmailPage : setPgPage;

  // ── Status badge colour ───────────────────────────────────────────────────
  const statusColor = (type: string) => {
    if (type === "Phishing" || type === "Phishing Email") return { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" };
    if (type === "Malicious" || type === "Blocked Threat") return { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" };
    if (type === "Suspicious") return { color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
    return { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1400 }}>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>

      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 24, fontWeight: 660, color: "#0a0a0a", letterSpacing: "-0.028em", margin: 0 }}>Phishing Monitoring</h2>
        <p style={{ fontSize: 14, color: "#52525b", marginTop: 6 }}>AI-powered phishing detection, behavioural analysis, and intelligent threat monitoring.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((stat, i) => (
          <div key={i} style={{ ...cardStyle, padding: "20px 22px" }}>
            <LazyCard delay={200 + i * 100}>
              <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{stat.title}</div>
              {loading
                ? <><div style={sk("60%", 28, 4)} /><div style={{ ...sk("80%", 9, 3), marginTop: 12 }} /></>
                : <>
                    <div style={{ fontSize: 36, fontWeight: 800, color: "#0a0a0a", lineHeight: 1, marginBottom: 12 }}>{stat.value}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <span style={{ fontSize: 11, color: "#52525b" }}>{stat.sub1}</span>
                      <span style={{ fontSize: 11, color: stat.sub2Color, fontWeight: 600 }}>{stat.sub2}</span>
                    </div>
                  </>
              }
            </LazyCard>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Phishing Volume 24H */}
        <div style={{ ...cardStyle, padding: "20px 22px" }}>
          <LazyCard delay={600}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="card-title">Phishing Volume</span>
                <span style={{ fontSize: 10, color: "#52525b", fontWeight: 500 }}>· 24H</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 2, background: "#dc2626", borderRadius: 2 }} />
                  <span style={{ fontSize: 10, color: "#52525b" }}>Detected</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 2, background: "#0d9488", borderRadius: 2 }} />
                  <span style={{ fontSize: 10, color: "#52525b" }}>Blocked</span>
                </div>
              </div>
            </div>
            {loading
              ? <div style={sk("100%", 180, 8)} />
              : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={volumeData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                    <XAxis dataKey="t" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={{ stroke: "#e9e9ec" }} tickLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={{ stroke: "#e9e9ec" }} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#dcdce0" }} />
                    <Line type="monotone" dataKey="detected" stroke="#dc2626" strokeWidth={2} dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="blocked"  stroke="#0d9488" strokeWidth={2} dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              )
            }
          </LazyCard>
        </div>

        {/* Weekly Trend */}
        <div style={{ ...cardStyle, padding: "20px 22px" }}>
          <LazyCard delay={700}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span className="card-title">Weekly Trend</span>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 2, background: "#16a34a", borderRadius: 2 }} />
                  <span style={{ fontSize: 10, color: "#52525b" }}>Emails</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 2, background: "#d97706", borderRadius: 2 }} />
                  <span style={{ fontSize: 10, color: "#52525b" }}>Page Visits</span>
                </div>
              </div>
            </div>
            {loading
              ? <div style={sk("100%", 180, 8)} />
              : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={weeklyData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={{ stroke: "#e9e9ec" }} tickLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={{ stroke: "#e9e9ec" }} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#dcdce0" }} />
                    <Line type="monotone" dataKey="emails" stroke="#16a34a" strokeWidth={2} dot={{ r: 3, fill: "#16a34a", strokeWidth: 0 }} activeDot={{ r: 4, strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="pages"  stroke="#d97706" strokeWidth={2} dot={{ r: 3, fill: "#d97706", strokeWidth: 0 }} activeDot={{ r: 4, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              )
            }
          </LazyCard>
        </div>
      </div>

      {/* Detection Events + Attack Types + Top Targeted */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Detection Events table */}
        <div className="lg:col-span-2" style={{ ...cardStyle, padding: "20px 22px" }}>
          <LazyCard delay={800}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span className="card-title">Detection Events</span>
              <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #e9e9ec" }}>
                <button onClick={() => setTab("email")} style={{ padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: tab === "email" ? "#0a0a0a" : "transparent", color: tab === "email" ? "#ffffff" : "#52525b" }}>Email</button>
                <button onClick={() => setTab("page")}  style={{ padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: tab === "page"  ? "#0a0a0a" : "transparent", color: tab === "page"  ? "#ffffff" : "#52525b" }}>Page Visit</button>
              </div>
            </div>
            {/* thead outside scroll so it stays fixed while rows scroll */}
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e9e9ec" }}>
                  {["URL / Domain", "User", "Type", "When"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px 8px 0", color: "#52525b", fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
            </table>
            {/* 4 rows visible exactly; scroll reveals the 5th */}
            <div style={{ height: 164, overflowY: "auto" }}>
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
              <tbody>
                {loading
                  ? Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #e9e9ec" }}>
                        <td style={{ padding: "12px 10px 12px 0" }}><div style={sk(130, 9)} /></td>
                        <td style={{ padding: "12px 10px 12px 0" }}><div style={sk(80, 9)} /></td>
                        <td style={{ padding: "12px 10px 12px 0" }}><div style={sk(70, 20, 10)} /></td>
                        <td style={{ padding: "12px 0" }}><div style={sk(50, 9)} /></td>
                      </tr>
                    ))
                  : activeEvents.length === 0
                  ? <tr><td colSpan={4} style={{ padding: "32px 0", textAlign: "center", color: "#8e8e93" }}>No events recorded</td></tr>
                  : activeEvents.map((inc, i) => {
                      const type = deriveType(inc);
                      const sc   = statusColor(type);
                      return (
                        <tr key={`${tab}-${curPage}-${i}`} style={{ borderBottom: "1px solid #e9e9ec" }}>
                          <td style={{ padding: "11px 10px 11px 0", color: "#0d9488", fontFamily: "monospace", fontSize: 11, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {shortUrl(String(inc.tab_url ?? ""))}
                          </td>
                          <td style={{ padding: "11px 10px 11px 0", color: "#52525b", fontSize: 12, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {String(inc.user_email ?? "—")}
                          </td>
                          <td style={{ padding: "11px 10px 11px 0" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}>{type}</span>
                          </td>
                          <td style={{ padding: "11px 0", color: "#8e8e93", whiteSpace: "nowrap" }}>{relTime(String(inc.timestamp ?? ""))}</td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
            </div>
            {/* Prev / Next — only when there are multiple pages */}
            {!loading && totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid #e9e9ec" }}>
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={curPage === 0}
                  style={{ padding: "5px 14px", fontSize: 11, fontWeight: 600, borderRadius: 7, border: "1px solid #dcdce0", background: "transparent", color: curPage === 0 ? "#a1a1aa" : "#0a0a0a", cursor: curPage === 0 ? "default" : "pointer" }}
                >← Prev</button>
                <span style={{ fontSize: 11, color: "#52525b" }}>Page {curPage + 1} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={curPage + 1 >= totalPages}
                  style={{ padding: "5px 14px", fontSize: 11, fontWeight: 600, borderRadius: 7, border: "1px solid #dcdce0", background: "transparent", color: curPage + 1 >= totalPages ? "#a1a1aa" : "#0a0a0a", cursor: curPage + 1 >= totalPages ? "default" : "pointer" }}
                >Next →</button>
              </div>
            )}
          </LazyCard>
        </div>

        {/* Attack Types donut */}
        <div style={{ ...cardStyle, padding: "20px 22px" }}>
          <LazyCard delay={900}>
            <div style={{ marginBottom: 16 }}><span className="card-title">Threat Breakdown</span></div>
            {loading
              ? <div style={{ ...sk(120, 120, 60), margin: "0 auto 16px", display: "block" }} />
              : (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                  <DonutChart segs={attackTypes} />
                </div>
              )
            }
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <div key={i} style={sk("100%", 10)} />)
                : attackTypes.map((a, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                        <span style={{ color: "#18181b" }}>{a.label}</span>
                      </div>
                      <span style={{ color: "#0a0a0a", fontWeight: 700 }}>{a.pct}%</span>
                    </div>
                  ))
              }
            </div>
          </LazyCard>
        </div>

        {/* Top Targeted — vertical bars */}
        <div style={{ ...cardStyle, padding: "20px 22px" }}>
          <LazyCard delay={1000}>
            <div style={{ marginBottom: 16 }}><span className="card-title">Top Targeted</span></div>
            {loading
              ? <div style={sk("100%", 200, 8)} />
              : topTargeted.length === 0
              ? <p style={{ color: "#8e8e93", fontSize: 12 }}>No data available</p>
              : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={topTargeted.slice(0, 6)}
                    margin={{ top: 4, right: 4, left: -20, bottom: 40 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#52525b", fontSize: 9 }}
                      axisLine={{ stroke: "#e9e9ec" }}
                      tickLine={false}
                      interval={0}
                      tickFormatter={(v: string) => v.length > 8 ? v.slice(0, 8) + "…" : v}
                      angle={-30}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fill: "#71717a", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(16,17,20,0.04)" }} formatter={(v: unknown) => [`${v}`, "Hits"]} />
                    <Bar dataKey="val" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )
            }
          </LazyCard>
        </div>

      </div>
    </div>
  );
}
