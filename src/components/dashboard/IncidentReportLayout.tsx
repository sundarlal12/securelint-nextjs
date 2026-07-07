"use client";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Tooltip } from "recharts";
import { LazyCard } from "@/components/dashboard/CardLoader";

export interface BrowserInfo {
  os?: string;
  deviceType?: string;
  browserName?: string;
  browserVersion?: string;
  viewportWidth?: number;
  viewportHeight?: number;
}

export interface Incident {
  id: string;
  initials: string;
  initialsColor: string;
  name: string;
  email: string;
  secretType: string;
  secretIcon: React.ReactNode;
  severity: "High" | "Medium" | "Low" | "Critical";
  alertStatus: "Blocked" | "Flagged" | "Detected" | "Masked" | "Quarantined";
  detectedAt: string;
  detectedTime: string;
  preview: string;
  alertTitle: string;
  alertDesc: string;
  details: { icon: string; label: string; value: string }[];
  maskedContent: string;
  browserInfo?: BrowserInfo;
}

export interface FetchParams {
  start_time: string;
  end_time: string;
  page: number;
  page_size: number;
}

export interface ReportStats {
  total: number;
  blocked: number;
  flagged: number;
  critical: number;
  weeklyData: { day: string; count: number }[];
}

interface Props {
  title: string;
  subtitle: string;
  incidents: Incident[];
  stats: ReportStats;
  onFetch?: (params: FetchParams) => void;
  isFetching?: boolean;
  isLoading?: boolean;
}

const sevStyles: Record<string, { color: string; bg: string; border: string }> = {
  // Critical → deep red
  Critical: { color: "#b91c1c", bg: "#fee2e2", border: "#fca5a5" },
  // High → red-orange
  High:     { color: "#c2410c", bg: "#ffedd5", border: "#fdba74" },
  // Medium → orange
  Medium:   { color: "#b45309", bg: "#fef3c7", border: "#fcd34d" },
  // Low → yellow-green
  Low:      { color: "#3f6212", bg: "#f7fee7", border: "#bef264" },
};

const alertStatusConfig: Record<string, { color: string; bg: string; border: string; label: string; dot: string }> = {
  Blocked:     { color: "#f87171", bg: "#1f0e0e", border: "#7f1d1d", label: "Blocked",     dot: "#ef4444" },
  Flagged:     { color: "#fbbf24", bg: "#1c1508", border: "#78350f", label: "Flagged",     dot: "#f59e0b" },
  Detected:    { color: "#60a5fa", bg: "#0d1626", border: "#1e3a8a", label: "Detected",    dot: "#3b82f6" },
  Masked:      { color: "#a78bfa", bg: "#150e24", border: "#4c1d95", label: "Masked",      dot: "#8b5cf6" },
  Quarantined: { color: "#fb923c", bg: "#1a1008", border: "#7c2d12", label: "Quarantined", dot: "#f97316" },
};

const cs: React.CSSProperties = { background: "#0d1117", border: "1px solid #21262d", borderRadius: 14 };

type GroupedIncident = Incident & { count: number; occurrences: Incident[]; secretTypes: string[] };

const DETAIL_ICONS: Record<string, string> = {
  "Employee":      "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z",
  "Email":         "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  "Secret Type":   "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1h.01c1.71 0 3.1 1.39 3.1 3.1v2z",
  "Severity":      "M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z",
  "Action":        "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12V11c0 4.52-3.08 8.79-7 10-3.92-1.21-7-5.48-7-10V6.3l7-3.12z",
  "Page URL":      "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  "Full URL":      "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
  "Page Title":    "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  "Domain":        "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  "Site Status":   "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z",
  "Risk Score":    "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
  "Browser ID":    "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",
  "Extension Ver": "M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z",
  "Incident ID":   "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z",
  "Recipients":    "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  "Data Type":     "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
};

function DetailIcon({ label }: { label: string }) {
  const d = DETAIL_ICONS[label] ?? DETAIL_ICONS["Incident ID"];
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b7280">
      <path d={d} />
    </svg>
  );
}

const emptyKF = `@keyframes ePulse{0%,100%{opacity:.22;transform:scale(.97)}50%{opacity:.5;transform:scale(1)}}@keyframes eLine{0%,100%{width:40%}50%{width:70%}}@keyframes summaryIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}@keyframes summaryOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-6px)}}`;

function EmptyState({ text }: { text: string }) {
  return (
    <>
      <style>{emptyKF + skeletonKF}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px", gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, border: "2px dashed #21262d", animation: "ePulse 2.4s ease-in-out infinite", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#4a5568" strokeWidth="1.5" strokeDasharray="4 2"/><path d="M9 12h6M12 9v6" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 120 }}>
          <div style={{ height: 6, borderRadius: 3, background: "#21262d", animation: "eLine 3s ease-in-out infinite", width: "60%" }} />
          <div style={{ height: 6, borderRadius: 3, background: "#21262d", animation: "eLine 3s ease-in-out infinite 0.4s", width: "40%" }} />
        </div>
        <span style={{ fontSize: 12, color: "#4a5568", marginTop: 4 }}>{text}</span>
      </div>
    </>
  );
}

function fmtRange(from: string, to: string) {
  const f = new Date(from), t = new Date(to);
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${m[f.getMonth()]} ${f.getDate()} – ${m[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}`;
}

// Critical, High, Medium, Low — matches sevStyles text colours
const PIE_C = ["#b91c1c", "#c2410c", "#b45309", "#3f6212"];

const skeletonKF = `@keyframes skPulse{0%,100%{opacity:.35}50%{opacity:.7}}`;
function Sk({ w = "100%", h = 16, r = 6 }: { w?: string | number; h?: number; r?: number }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: "#21262d", animation: "skPulse 1.4s ease-in-out infinite" }} />;
}

export default function IncidentReportLayout({ title, subtitle, incidents, stats, onFetch, isFetching = false, isLoading = false }: Props) {
  const [page, setPage] = useState(0);
  const [sevFilter, setSevFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split("T")[0]);
  const [sevOpen, setSevOpen]     = useState(false);
  const [calOpen, setCalOpen]     = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const perPage = 12;

  /* ── Drawer state ── */
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [drawerInc, setDrawerInc]     = useState<GroupedIncident | null>(null);
  const [showAllOccs, setShowAllOccs] = useState(false);
  const drawerBodyRef = useRef<HTMLDivElement>(null);

  /* Reset scroll to top every time a new incident opens */
  useEffect(() => {
    if (drawerBodyRef.current) drawerBodyRef.current.scrollTop = 0;
  }, [drawerInc]);

  const openDrawer  = useCallback((inc: GroupedIncident) => { setDrawerInc(inc); setDrawerOpen(true); setShowAllOccs(false); }, []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return incidents.filter(inc => {
      if (sevFilter !== "All" && inc.severity !== sevFilter) return false;
      const d = new Date(inc.detectedAt), from = new Date(dateFrom), to = new Date(dateTo);
      to.setHours(23, 59, 59);
      if (d < from || d > to) return false;
      if (q) {
        return (
          inc.name.toLowerCase().includes(q) ||
          inc.email.toLowerCase().includes(q) ||
          inc.secretType.toLowerCase().includes(q) ||
          inc.preview.toLowerCase().includes(q) ||
          inc.alertStatus.toLowerCase().includes(q) ||
          inc.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [incidents, sevFilter, dateFrom, dateTo, searchQuery]);

  /* ── Group incidents by (employee + page URL + date).
       Falls back to (email + secretType + date) if no Page URL available.
       This collapses all secrets found on the same page visit into one row. ── */
  const grouped = useMemo<GroupedIncident[]>(() => {
    const map = new Map<string, GroupedIncident>();
    filtered.forEach(inc => {
      const pageUrl = inc.details.find(d => d.label === "Page URL")?.value
                   ?? inc.details.find(d => d.label === "Full URL")?.value
                   ?? "";
      const key = pageUrl
        ? `${inc.email}||${pageUrl}||${inc.detectedAt}`
        : `${inc.email}||${inc.secretType}||${inc.detectedAt}`;
      if (map.has(key)) {
        const g = map.get(key)!;
        g.count++;
        g.occurrences.push(inc);
        if (!g.secretTypes.includes(inc.secretType)) g.secretTypes.push(inc.secretType);
      } else {
        map.set(key, { ...inc, count: 1, occurrences: [inc], secretTypes: [inc.secretType] });
      }
    });
    return Array.from(map.values());
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(grouped.length / perPage));
  const pageInc = grouped.slice(page * perPage, (page + 1) * perPage);

  // Compute daily counts from actual incidents as a fallback for trend chart
  const derivedTrend = useMemo(() => {
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const m: Record<string, number> = {};
    incidents.forEach(inc => {
      try {
        const d = new Date(inc.detectedAt);
        const key = DAYS[d.getDay()];
        m[key] = (m[key] || 0) + 1;
      } catch { /* skip */ }
    });
    return DAYS.map(d => ({ day: d, count: m[d] ?? 0 }));
  }, [incidents]);

  const trendData = (stats.weeklyData && stats.weeklyData.some(d => d.count > 0))
    ? stats.weeklyData
    : derivedTrend;

  const sevBrk = useMemo(() => {
    const m: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    filtered.forEach(i => m[i.severity] = (m[i.severity] || 0) + 1);
    return Object.entries(m).map(([name, value]) => ({ name, value })).filter(s => s.value > 0);
  }, [filtered]);

  const statusBrk = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.forEach(i => m[i.alertStatus] = (m[i.alertStatus] || 0) + 1);
    return Object.entries(m).map(([name, value]) => ({ name, value })).filter(s => s.value > 0);
  }, [filtered]);

  const handleExport = useCallback(() => {
    const data = filtered.map(inc => ({
      id: inc.id, employee: inc.name, email: inc.email,
      secretType: inc.secretType, severity: inc.severity, alertStatus: inc.alertStatus,
      detectedAt: `${inc.detectedAt} ${inc.detectedTime}`, preview: inc.preview,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  }, [filtered, title]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1440 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.5px", margin: 0 }}>SecureLint Enterprise — {title}</h2>
        <p style={{ fontSize: 13, color: "#8b949e", marginTop: 6 }}>{subtitle}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: "Total Incidents", val: stats.total, c: "#2dd4bf", d: "M3 12a9 9 0 1118 0 9 9 0 01-18 0z|M12 8v4l3 3" },
          { label: "Blocked",         val: stats.blocked, c: "#dc2626", d: "M12 3a9 9 0 100 18 9 9 0 000-18z|M5.5 5.5l13 13" },
          { label: "Flagged",         val: stats.flagged, c: "#d97706", d: "M5 4v16|M5 4l9 4-9 4" },
          { label: "Critical",        val: stats.critical, c: "#ef4444", d: "M12 2L3 20h18L12 2z|M12 9v4M12 17h.01" },
        ] as const).map((s, i) => (
          <div key={i} style={{ ...cs, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            {isLoading ? (
              <>
                <Sk w={44} h={44} r={12} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Sk w="55%" h={28} r={6} />
                  <Sk w="80%" h={10} r={4} />
                </div>
              </>
            ) : (
              <>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.c}10`, border: `1.5px solid ${s.c}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">{s.d.split("|").map((p, j) => <path key={j} d={p} stroke={s.c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />)}</svg>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.c, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#8b949e", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{s.label}</div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 3 compact charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Trend */}
        <div style={{ ...cs, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: "#8b949e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Daily Trend</div>
          {isLoading ? <Sk h={52} r={8} /> : (
          <ResponsiveContainer width="100%" height={52}>
            <AreaChart data={trendData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs><linearGradient id="ilg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/><stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/></linearGradient></defs>
              <Tooltip
                cursor={{ stroke: "#2dd4bf44", strokeWidth: 1 }}
                contentStyle={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 8, fontSize: 11, color: "#e6edf3", padding: "6px 10px" }}
                itemStyle={{ color: "#2dd4bf" }}
                formatter={(v: unknown) => [`${v}`, "Incidents"]}
                labelFormatter={(l: unknown) => `${l}`}
              />
              <Area type="monotone" dataKey="count" stroke="#2dd4bf" strokeWidth={1.5} fill="url(#ilg)" dot={false} activeDot={{ r: 4, fill: "#2dd4bf", stroke: "#0d1117", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>

        {/* Severity Split */}
        <div style={{ ...cs, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: "#8b949e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Severity Split</div>
          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sk w={52} h={52} r={26} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <Sk h={9} r={4} /><Sk w="80%" h={9} r={4} /><Sk w="60%" h={9} r={4} />
              </div>
            </div>
          ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ResponsiveContainer width={56} height={52}>
              <PieChart>
                <Pie data={sevBrk} dataKey="value" cx="50%" cy="50%" innerRadius={14} outerRadius={24} strokeWidth={0}>
                  {sevBrk.map((_, idx) => <Cell key={idx} fill={PIE_C[idx % PIE_C.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 8, fontSize: 11, color: "#e6edf3", padding: "6px 10px" }}
                  formatter={(v: unknown, _: unknown, props: { payload?: { name?: string } }) => [`${v}`, props.payload?.name ?? ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {sevBrk.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 1, background: PIE_C[i % PIE_C.length] }} />
                  <span style={{ fontSize: 9, color: "#8b949e" }}>{s.name} <span style={{ color: "#e6edf3", fontWeight: 600 }}>{s.value}</span></span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Weekly Volume */}
        <div style={{ ...cs, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: "#8b949e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Weekly Volume</div>
          {isLoading ? <Sk h={52} r={8} /> : (
          <ResponsiveContainer width="100%" height={52}>
            <BarChart data={trendData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 8 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "#21262d" }}
                contentStyle={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 8, fontSize: 11, color: "#e6edf3", padding: "6px 10px" }}
                itemStyle={{ color: "#2dd4bf" }}
                formatter={(v: unknown) => [`${v}`, "Incidents"]}
              />
              <Bar dataKey="count" fill="#2dd4bf" radius={[2, 2, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Filters (screenshot style: single date button + severity dropdown + export) */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <button onClick={() => { setCalOpen(!calOpen); setSevOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, border: "1px solid #21262d", background: "#0d1117", fontSize: 12, color: "#8b949e", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#8b949e" strokeWidth="1.5"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#8b949e" strokeWidth="1.5" strokeLinecap="round"/></svg>
            {fmtRange(dateFrom, dateTo)}
            <span style={{ fontSize: 10, color: "#4a5568" }}>▾</span>
          </button>
          {calOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, padding: "14px 16px", background: "#161b22", border: "1px solid #21262d", borderRadius: 10, zIndex: 30, display: "flex", flexDirection: "column", gap: 10, minWidth: 220 }}>
              <label style={{ fontSize: 10, color: "#8b949e", fontWeight: 600 }}>From
                <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(0); }}
                  style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px", borderRadius: 6, border: "1px solid #21262d", background: "#0d1117", fontSize: 12, color: "#e6edf3", outline: "none" }} />
              </label>
              <label style={{ fontSize: 10, color: "#8b949e", fontWeight: 600 }}>To
                <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(0); }}
                  style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px", borderRadius: 6, border: "1px solid #21262d", background: "#0d1117", fontSize: 12, color: "#e6edf3", outline: "none" }} />
              </label>
              <button
                onClick={() => {
                  setCalOpen(false);
                  setPage(0);
                  
                  if (onFetch) {
                    const end = new Date(dateTo);
                    end.setHours(23, 59, 59, 999);
                    onFetch({
                      start_time: new Date(dateFrom).toISOString(),
                      end_time: end.toISOString(),
                      page: 0,
                      page_size: 200,
                    });
                  }
                }}
                style={{ marginTop: 2, padding: "6px 0", borderRadius: 6, border: "none", background: "#2dd4bf", color: "#0d1117", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                {isFetching ? "Loading…" : "Apply & Fetch"}
              </button>
            </div>
          )}
        </div>
        {/* Search input */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", left: 10, pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="7" stroke="#4a5568" strokeWidth="2"/>
            <path d="M16.5 16.5L21 21" stroke="#4a5568" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search employee, type, preview…"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
            style={{ paddingLeft: 30, paddingRight: searchQuery ? 28 : 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: "1px solid #21262d", background: "#0d1117", fontSize: 12, color: "#e6edf3", outline: "none", width: 220 }}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setPage(0); }}
              style={{ position: "absolute", right: 8, background: "none", border: "none", cursor: "pointer", color: "#4a5568", fontSize: 14, lineHeight: 1, padding: 0 }}>✕</button>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button onClick={() => { setSevOpen(!sevOpen); setCalOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, border: "1px solid #21262d", background: "#0d1117", fontSize: 12, color: "#8b949e", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M10 18h4" stroke="#8b949e" strokeWidth="1.5" strokeLinecap="round"/></svg>
            {sevFilter === "All" ? "All Severity" : sevFilter}
            <span style={{ fontSize: 10, color: "#4a5568" }}>▾</span>
          </button>
          {sevOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, background: "#161b22", border: "1px solid #21262d", borderRadius: 10, zIndex: 30, minWidth: 150, overflow: "hidden" }}>
              {["All", "Critical", "High", "Medium", "Low"].map(s => (
                <button key={s} onClick={() => { setSevFilter(s); setSevOpen(false); setPage(0); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", padding: "9px 14px", background: sevFilter === s ? "#21262d" : "transparent", color: sevFilter === s ? "#e6edf3" : "#8b949e", border: "none", fontSize: 12, cursor: "pointer" }}>
                  {s !== "All" && <span style={{ width: 8, height: 8, borderRadius: 2, background: sevStyles[s]?.bg ?? "#333" }} />}
                  {s === "All" ? "All Severity" : s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={handleExport}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 8, border: "1px solid #21262d", background: "#0d1117", fontSize: 12, color: "#e6edf3", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="#e6edf3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* Table — full width */}
      <div style={{ ...cs, padding: 0, overflow: "hidden" }}>
          <LazyCard delay={300}>
            {isFetching ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "40px 20px", color: "#8b949e", fontSize: 13 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                  <circle cx="12" cy="12" r="9" stroke="#21262d" strokeWidth="2.5"/>
                  <path d="M12 3a9 9 0 019 9" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                Fetching incidents…
              </div>
            ) : filtered.length === 0 ? <EmptyState text={searchQuery ? `No results for "${searchQuery}"` : "No incidents match your filters"} /> : (
              <>
                <div className="overflow-x-auto">
                  <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "1px solid #21262d" }}>
                      {["Employee", "Type", "Severity", "Status", "Detected At", "Preview", ""].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "12px 10px", color: "#8b949e", fontWeight: 600, fontSize: 11, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {(pageInc as GroupedIncident[]).map((inc, i) => {
                        const sv = sevStyles[inc.severity] ?? sevStyles.Medium;
                        const asc = alertStatusConfig[inc.alertStatus] ?? alertStatusConfig.Blocked;
                        return (
                          <tr key={`${inc.id}-${i}`} onClick={() => openDrawer(inc)}
                            style={{ borderBottom: "1px solid #21262d", cursor: "pointer", background: "transparent", transition: "background .15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#0f1319"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                            <td style={{ padding: "12px 10px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: inc.initialsColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{inc.initials}</div>
                                <div>
                                  <div style={{ color: "#e6edf3", fontWeight: 600, fontSize: 12 }}>{inc.name}</div>
                                  <div style={{ color: "#8b949e", fontSize: 10 }}>{inc.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "10px 10px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 11, color: "#e6edf3", fontWeight: 500, whiteSpace: "nowrap" }}>
                                  {inc.secretTypes.length > 1 ? inc.secretTypes[0] : inc.secretType}
                                </span>
                                {inc.secretTypes.length > 1 && (
                                  <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: "#1c1508", border: "1px solid #78350f44", color: "#fbbf24", whiteSpace: "nowrap" }}>
                                    +{inc.secretTypes.length - 1} type{inc.secretTypes.length > 2 ? "s" : ""}
                                  </span>
                                )}
                                {inc.count > 1 && (
                                  <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 10, background: "#0a1e1a", border: "1px solid #2dd4bf44", color: "#2dd4bf", whiteSpace: "nowrap" }}>×{inc.count}</span>
                                )}
                              </div>
                              <div style={{ display: "flex" }}>{inc.secretIcon}</div>
                            </td>
                            <td style={{ padding: "12px 10px" }}><span style={{ fontSize: 10, fontWeight: 600, padding: "2px 10px", borderRadius: 20, color: sv.color, background: sv.bg, border: `1px solid ${sv.border}` }}>{inc.severity}</span></td>
                            <td style={{ padding: "12px 10px" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, padding: "2px 10px", borderRadius: 20, color: asc.color, background: asc.bg, border: `1px solid ${asc.border}` }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: asc.dot, flexShrink: 0 }} />{inc.alertStatus}</span></td>
                            <td style={{ padding: "12px 10px", color: "#8b949e", fontSize: 11 }}><div style={{ fontSize: 10 }}>{inc.detectedTime || inc.detectedAt}</div></td>
                            <td style={{ padding: "12px 10px" }}><span style={{ fontFamily: "monospace", fontSize: 11, color: "#c9d1d9", letterSpacing: "0.02em" }}>{inc.preview}</span></td>
                            <td style={{ padding: "12px 6px", color: "#4a5568", fontSize: 16, textAlign: "center" }}>⋮</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 16px", borderTop: "1px solid #21262d", gap: 4 }}>
                  <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                    style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #21262d", background: "transparent", color: page === 0 ? "#4a5568" : "#e6edf3", cursor: page === 0 ? "default" : "pointer", fontSize: 13 }}>‹</button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i)}
                      style={{ width: 30, height: 30, borderRadius: 6, border: i === page ? "1.5px solid #2dd4bf" : "1px solid #21262d", background: "transparent", color: i === page ? "#2dd4bf" : "#8b949e", cursor: "pointer", fontSize: 12, fontWeight: i === page ? 700 : 400 }}>{i + 1}</button>
                  ))}
                  <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                    style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #21262d", background: "transparent", color: page >= totalPages - 1 ? "#4a5568" : "#e6edf3", cursor: page >= totalPages - 1 ? "default" : "pointer", fontSize: 13 }}>›</button>
                </div>
              </>
            )}
          </LazyCard>
        </div>

      {/* ── Slide-over Drawer ── */}
      <style>{`@keyframes drawerIn{from{opacity:0}to{opacity:1}}`}</style>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={closeDrawer}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 900, animation: "drawerIn 0.2s ease" }}
        />
      )}

      {/* Drawer panel */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100dvh",
        width: 540,
        maxWidth: "98vw",
        background: "#080e1a",
        borderLeft: "1px solid #1a2540",
        zIndex: 950,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",           /* outer panel must NOT scroll — only body below does */
        transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: drawerOpen ? "-12px 0 60px rgba(0,0,0,0.7)" : "none",
      }}>
        {drawerInc && (() => {
          const inc = drawerInc;
          const ac = alertStatusConfig[inc.alertStatus] ?? alertStatusConfig.Blocked;
          const sv = sevStyles[inc.severity] ?? sevStyles.Medium;
          const SHOW_LIMIT = 5;
          const hasMany = inc.count > 1;
          const pageUrl   = inc.details.find(d => d.label === "Page URL")?.value ?? "";
          const pageTitle = inc.details.find(d => d.label === "Page Title")?.value ?? "";
          const bi        = inc.browserInfo;
          const browserId = inc.details.find(d => d.label === "Browser ID")?.value ?? "";
          const extVer    = inc.details.find(d => d.label === "Extension Ver")?.value ?? "";
          const dateLabel = (() => {
            try { return new Date(inc.detectedAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }
            catch { return inc.detectedAt; }
          })();

          /* Incident ID formatted as INC-YYYY-MMDD-#### */
          const incId = (() => {
            const d = inc.detectedAt.replace(/-/g, "");
            const num = String(inc.id).replace(/\D/g, "").slice(0, 4).padStart(4, "0");
            return `INC-${d.slice(0, 4)}-${d.slice(4, 8)}-${num}`;
          })();

          /* Per-type occurrence counts */
          const typeCountMap = new Map<string, number>();
          inc.occurrences.forEach(occ => {
            typeCountMap.set(occ.secretType, (typeCountMap.get(occ.secretType) ?? 0) + 1);
          });
          const typeCounts = Array.from(typeCountMap.entries()).sort((a, b) => b[1] - a[1]);
          if (typeCounts.length === 0) typeCounts.push([inc.secretType, inc.count]);

          /* Severity → label + colours */
          const sevLabel = inc.severity;
          const sevColor = sv.color;

          /* Card style shared */
          const card: React.CSSProperties = { background: "#0d1525", border: "1px solid #1a2540", borderRadius: 12, padding: "14px 16px" };

          return (
            <>
              {/* ══ Header — sticky, never scrolls ══ */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px 16px", borderBottom: "1px solid #1a2540", flexShrink: 0, background: "#080e1a", position: "sticky", top: 0, zIndex: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,#3b5bdb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" fill="white" fillOpacity=".9"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#e6edf3", lineHeight: 1.2 }}>Detection Details</div>
                  <div style={{ fontSize: 11, color: "#4a5568", marginTop: 2 }}>Review and respond to the detected secret exposure</div>
                </div>
                <button onClick={closeDrawer} aria-label="Close"
                  style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #1a2540", background: "#111827", color: "#8b949e", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  ✕
                </button>
              </div>


              {(() => {
  const severityStyles: Record<string, { bg: string; color: string; border: string }> = {
    Critical: {
      bg: "#3b0d0d",
      color: "#ff6b6b",
      border: "#7f1d1d",
    },
    High: {
      bg: "#3a1d08",
      color: "#fb923c",
      border: "#7c2d12",
    },
    Medium: {
      bg: "#3b2d08",
      color: "#fbbf24",
      border: "#854d0e",
    },
    Low: {
      bg: "#0f2e1b",
      color: "#4ade80",
      border: "#166534",
    },
  };

  const sev = severityStyles[inc.severity] || severityStyles.High;

  return (
    <div
      style={{
        flexShrink: 0,
        padding: "16px",
        borderBottom: "1px solid #1f2b43",
      }}
    >
      <div
        style={{
          background: "#101827",
          border: "1px solid #253247",
          borderRadius: 14,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr auto 1fr",
          alignItems: "center",
          padding: "18px 22px",
        }}
      >
        {/* Incident */}
        <div>
          <div
            style={{
              fontSize: 12,
              color: "#94A3B8",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Incident ID
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                color: "#F8FAFC",
                fontWeight: 700,
                fontSize: 22,
                fontFamily: "monospace",
              }}
            >
              {incId || "INC-2026-0707-2496"}
            </span>

            <button
              onClick={() => navigator.clipboard.writeText(incId)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#60A5FA",
                fontSize: 16,
              }}
            >
              📋
            </button>
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "#94A3B8",
            }}
          >
            🕒 Detected: {inc.detectedAt || "2026-07-07"}
          </div>
        </div>

        <div
          style={{
            width: 1,
            height: 70,
            background: "#243247",
            margin: "0 26px",
          }}
        />

        {/* Risk */}
        <div>
          <div
            style={{
              color: "#94A3B8",
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            Risk Level
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: sev.bg,
              border: `1px solid ${sev.border}`,
              color: sev.color,
              padding: "8px 16px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            🛡 {inc.severity}
          </div>
        </div>

        <div
          style={{
            width: 1,
            height: 70,
            background: "#243247",
            margin: "0 26px",
          }}
        />

        {/* Status */}
        <div>
          <div
            style={{
              color: "#94A3B8",
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            Status
          </div>

          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#A78BFA",
              marginBottom: 10,
            }}
          >
            {ac.label}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#0F2E1B",
              border: "1px solid #166534",
              color: "#4ADE80",
              borderRadius: 999,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            ✓ Secrets are protected
          </div>
        </div>
      </div>
    </div>
  );
})()}

              {/* ══ Scrollable body ══ */}
              <div ref={drawerBodyRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

                {/* ── Employee card ── */}
                <div style={{ ...card, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: inc.initialsColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", flexShrink: 0, letterSpacing: 1 }}>
                    {inc.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3", lineHeight: 1.2 }}>{inc.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#4a5568"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                      <span style={{ fontSize: 12, color: "#8b949e" }}>{inc.email}</span>
                    </div>
                  </div>
                </div>

                {/* ── Detection Overview + Secret Types (2 col) ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {/* Left: Detection Overview */}
                  <div style={{ ...card, display: "flex", flexDirection: "column", gap: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "#111827", border: "1px solid #1a2540", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" fill="#60a5fa"/><rect x="10" y="7" width="4" height="14" rx="1" fill="#3b82f6"/><rect x="17" y="3" width="4" height="18" rx="1" fill="#2563eb"/></svg>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>Detection Overview</span>
                    </div>
                    {/* Big numbers */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                      <div style={{ flex: 1, textAlign: "center", padding: "10px 6px", background: "#080e1a", borderRadius: 8, border: "1px solid #1a2540" }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: "#3b82f6", lineHeight: 1 }}>{inc.secretTypes.length}</div>
                        <div style={{ fontSize: 9, color: "#4a5568", marginTop: 4, lineHeight: 1.3 }}>Secret Types<br/>Detected</div>
                      </div>
                      <div style={{ flex: 1, textAlign: "center", padding: "10px 6px", background: "#080e1a", borderRadius: 8, border: "1px solid #1a2540" }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: "#3b82f6", lineHeight: 1 }}>{inc.count}</div>
                        <div style={{ fontSize: 9, color: "#4a5568", marginTop: 4, lineHeight: 1.3 }}>Total<br/>Detections</div>
                      </div>
                    </div>
                    {/* First Seen | Status row */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      <div style={{ flex: 1, padding: "7px 8px", background: "#080e1a", borderRadius: 7, border: "1px solid #1a2540" }}>
                        <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 2 }}>First Seen</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#c9d1d9" }}>{inc.detectedAt}</div>
                      </div>
                      <div style={{ flex: 1, padding: "7px 8px", background: "#080e1a", borderRadius: 7, border: "1px solid #1a2540" }}>
                        <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 2 }}>Status</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: ac.color }}>{ac.label}</div>
                      </div>
                    </div>
                    {/* Masked note */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 7, padding: "8px 10px", background: "#080e1a", borderRadius: 8, border: "1px solid #1a2540" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke={ac.dot} strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={ac.dot} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{ fontSize: 10, color: "#8b949e", lineHeight: 1.5 }}>All detected secrets have been automatically {ac.label.toLowerCase()} to prevent exposure.</span>
                    </div>
                  </div>

                  {/* Right: Secret Types Detected */}
                  <div style={{ ...card, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "#0f2518", border: "1px solid #16422a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" stroke="#22c55e" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>Secret Types Detected</span>
                    </div>
                    {/* Type list — scrollable if many */}
                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5, maxHeight: 180 }}>
                      {typeCounts.map(([type, cnt], ti) => (
                        <div key={ti} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", borderRadius: 7, background: "#080e1a", border: "1px solid #1a2540" }}>
                          <span style={{ fontSize: 10, color: "#2dd4bf", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{type}</span>
                          <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 10, background: "#0a1e1a", border: "1px solid #2dd4bf33", color: "#2dd4bf", flexShrink: 0, marginLeft: 6 }}>×{cnt}</span>
                        </div>
                      ))}
                    </div>
                    {/* Occurrences (single type) — scrollable list */}
                    {inc.secretTypes.length === 1 && hasMany && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Occurrences</div>
                        <div style={{ maxHeight: showAllOccs ? 220 : 100, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
                          {(showAllOccs ? inc.occurrences : inc.occurrences.slice(0, SHOW_LIMIT)).map((occ, oi) => (
                            <div key={oi} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 7px", borderRadius: 6, background: "#080e1a", border: "1px solid #1a2540", flexShrink: 0 }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1h.01c1.71 0 3.1 1.39 3.1 3.1v2z" fill="#f97316"/></svg>
                              <span style={{ fontFamily: "monospace", fontSize: 9, color: "#c9d1d9", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{occ.preview}</span>
                              <span style={{ fontSize: 8, color: "#4a5568", flexShrink: 0, whiteSpace: "nowrap" }}>{occ.detectedTime?.split("·").pop()?.trim() ?? ""}</span>
                            </div>
                          ))}
                        </div>
                        {inc.count > SHOW_LIMIT && (
                          <button onClick={() => setShowAllOccs(v => !v)}
                            style={{ marginTop: 5, fontSize: 9, color: "#2dd4bf", background: "none", border: "none", cursor: "pointer", fontWeight: 700, padding: 0 }}>
                            {showAllOccs ? "↑ Collapse" : `+${inc.count - SHOW_LIMIT} more`}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Browser & Device Info ── */}
                {bi && (
                  <div style={card}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "#111827", border: "1px solid #1a2540", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#60a5fa" strokeWidth="1.8"/><path d="M8 21h8M12 17v4" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#c9d1d9" }}>Browser & Device Information</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      {[
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#4a5568"/></svg>, label: "OS", value: bi.os },
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="#4a5568" strokeWidth="1.8"/><circle cx="12" cy="18" r="1" fill="#4a5568"/></svg>, label: "Device Type", value: bi.deviceType },
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4a5568" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" stroke="#4a5568" strokeWidth="1.8"/><path d="M12 2a10 10 0 010 20M2 12h20" stroke="#4a5568" strokeWidth="1.4"/></svg>, label: "Browser", value: bi.browserName },
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="#4a5568"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" stroke="#4a5568" strokeWidth="1.8" strokeLinecap="round"/></svg>, label: "Browser Version", value: bi.browserVersion?.replace("Version ", "").replace(" (Official Build) (arm)", " (arm)") },
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#4a5568" strokeWidth="1.8"/><path d="M8 3v18M3 8h18" stroke="#4a5568" strokeWidth="1.4"/></svg>, label: "Viewport Width", value: bi.viewportWidth ? `${bi.viewportWidth}` : undefined },
                        { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="#4a5568" strokeWidth="1.8" strokeLinecap="round"/><rect x="3" y="3" width="18" height="18" rx="2" stroke="#4a5568" strokeWidth="1.4"/></svg>, label: "Viewport Height", value: bi.viewportHeight ? `${bi.viewportHeight}` : undefined },
                      ].filter(r => r.value).map((row, ri) => (
                        <div key={ri} style={{ padding: "8px 10px", background: "#080e1a", borderRadius: 8, border: "1px solid #1a2540" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                            {row.icon}
                            <span style={{ fontSize: 9, color: "#4a5568", fontWeight: 600 }}>{row.label}</span>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#c9d1d9", wordBreak: "break-word", lineHeight: 1.3 }}>{row.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Browser ID + Scanner Version ── */}
                {(browserId || extVer) && (
                  <div style={{ ...card, display: "flex", alignItems: "center", gap: 0, padding: 0, overflow: "hidden" }}>
                    {browserId && (
                      <div style={{ flex: 1, padding: "12px 14px", borderRight: extVer ? "1px solid #1a2540" : "none", display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><ellipse cx="12" cy="8" rx="5" ry="7" stroke="#4a5568" strokeWidth="1.6"/><path d="M7 8c0 3 2.24 5 5 5s5-2 5-5" stroke="#4a5568" strokeWidth="1.4"/><circle cx="12" cy="8" r="1.5" fill="#4a5568"/></svg>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 3, fontWeight: 600 }}>Browser ID</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{browserId}</span>
                            <button title="Copy" onClick={() => navigator.clipboard.writeText(browserId)}
                              style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 2, color: "#4a5568", display: "flex", alignItems: "center" }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#6b7280" strokeWidth="1.8"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#6b7280" strokeWidth="1.8"/></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {extVer && (
                      <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="1.8"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round"/></svg>
                        <div>
                          <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 3, fontWeight: 600 }}>Scanner Version</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#818cf8" }}>v{extVer}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Timeline ── */}
                <div style={{ ...card }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>Timeline</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 14 }}>{dateLabel}</div>

                  {/* Step 1: Browser session */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "#1e3a5f", border: "2px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#3b82f6" strokeWidth="1.8"/><path d="M8 21h8M12 17v4" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </div>
                      <div style={{ flex: 1, width: 2, background: "#2d3748", minHeight: 20, marginTop: 3 }} />
                    </div>
                    <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>{inc.detectedAt}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>Browser session active</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>SecureLint monitoring: {inc.email}</div>
                      {(pageUrl || pageTitle) && (
                        <div style={{ marginTop: 8, padding: "7px 10px", borderRadius: 7, background: "#080e1a", border: "1px solid #2d3748", display: "flex", flexDirection: "column", gap: 4 }}>
                          {pageUrl && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="1.6"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="#3b82f6" strokeWidth="1.6"/></svg>
                              <a href={pageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "#60a5fa", wordBreak: "break-all", lineHeight: 1.45, textDecoration: "none" }}>{pageUrl}</a>
                            </div>
                          )}
                          {pageTitle && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#94a3b8" strokeWidth="1.6"/><path d="M14 2v6h6M9 13h6M9 17h4" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round"/></svg>
                              <span style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.45 }}>{pageTitle}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {bi && (bi.browserName || bi.os) && (
                        <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {bi.browserName && <span style={{ fontSize: 9, color: "#94a3b8", background: "#080e1a", border: "1px solid #2d3748", borderRadius: 20, padding: "2px 8px" }}>{bi.browserName}</span>}
                          {bi.os && <span style={{ fontSize: 9, color: "#94a3b8", background: "#080e1a", border: "1px solid #2d3748", borderRadius: 20, padding: "2px 8px" }}>{bi.os}</span>}
                          {bi.viewportWidth && bi.viewportHeight && <span style={{ fontSize: 9, color: "#94a3b8", background: "#080e1a", border: "1px solid #2d3748", borderRadius: 20, padding: "2px 8px" }}>{bi.viewportWidth}×{bi.viewportHeight}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 2: Secret detected + occurrences */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "#2d1a0a", border: "2px solid #f97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="8" y="2" width="8" height="4" rx="1" stroke="#f97316" strokeWidth="1.6"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="#f97316" strokeWidth="1.6"/><path d="M9 12h6M9 16h4" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round"/></svg>
                      </div>
                      <div style={{ flex: 1, width: 2, background: "#2d3748", minHeight: 20, marginTop: 3 }} />
                    </div>
                    <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>
                        {inc.secretTypes.length > 1 ? `${inc.count} secrets detected — ${inc.secretTypes.length} types` : `${inc.secretType} detected${hasMany ? ` — ${inc.count} occurrences` : ""}`}
                      </div>
                      {hasMany && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ maxHeight: showAllOccs ? 260 : 130, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
                            {(showAllOccs ? inc.occurrences : inc.occurrences.slice(0, SHOW_LIMIT)).map((occ, oi) => (
                              <div key={oi} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", borderRadius: 6, background: "#080e1a", border: "1px solid #2d3748", flexShrink: 0 }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1h.01c1.71 0 3.1 1.39 3.1 3.1v2z" fill="#f97316"/></svg>
                                <span style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{occ.secretType}</span>
                                <span style={{ fontFamily: "monospace", fontSize: 10, color: "#e2e8f0", flex: 1, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{occ.preview}</span>
                                <span style={{ fontSize: 9, color: "#64748b", flexShrink: 0, whiteSpace: "nowrap" }}>{occ.detectedTime?.split("·").pop()?.trim() ?? occ.detectedAt}</span>
                              </div>
                            ))}
                          </div>
                          {inc.count > SHOW_LIMIT && (
                            <button onClick={() => setShowAllOccs(v => !v)}
                              style={{ marginTop: 5, display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 12, border: "1px solid #2dd4bf44", background: "#0a1e1a", color: "#2dd4bf", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                              {showAllOccs ? "↑ Collapse" : `+${inc.count - SHOW_LIMIT} more occurrences`}
                            </button>
                          )}
                        </div>
                      )}
                      {!hasMany && <div style={{ fontFamily: "monospace", fontSize: 11, color: "#94a3b8", marginTop: 3, wordBreak: "break-all" }}>{inc.preview}</div>}
                    </div>
                  </div>

                  {/* Step 3: Action taken */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: `${ac.dot}22`, border: `2px solid ${ac.dot}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={ac.dot} strokeWidth="1.8"/><path d="M9 12l2 2 4-4" stroke={ac.dot} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                    <div style={{ paddingBottom: 4 }}>
                      <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>{inc.detectedTime || inc.detectedAt}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>Action: <span style={{ color: ac.color }}>{ac.label}</span></div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>SecureLint Security Policy</div>
                    </div>
                  </div>
                </div>

                {/* bottom breathing room */}
                <div style={{ height: 8 }} />
              </div>
            </>
          );
        })()}
      </div>

      {/* Bottom analytics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div style={{ ...cs, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, color: "#8b949e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Severity Distribution</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sevBrk.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: "#e6edf3" }}>{s.name}</span>
                  <span style={{ fontSize: 11, color: "#8b949e", fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#161b22", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: PIE_C[i % PIE_C.length], width: `${Math.max(4, (s.value / Math.max(1, filtered.length)) * 100)}%`, transition: "width .4s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...cs, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, color: "#8b949e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Action Breakdown</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {statusBrk.map((s, i) => {
              const c = alertStatusConfig[s.name]?.color ?? "#8b949e";
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: "#e6edf3" }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: "#8b949e", fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "#161b22", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, background: c, width: `${Math.max(4, (s.value / Math.max(1, filtered.length)) * 100)}%`, transition: "width .4s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ ...cs, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, color: "#8b949e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Incident Timeline</div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={trendData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "#21262d" }}
                contentStyle={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 8, fontSize: 11, color: "#e6edf3", padding: "6px 10px" }}
                itemStyle={{ color: "#2dd4bf" }}
                formatter={(v: unknown) => [`${v}`, "Incidents"]}
              />
              <Bar dataKey="count" fill="#2dd4bf" radius={[3, 3, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
