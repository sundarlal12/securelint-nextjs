"use client";
import { useState, useEffect, useMemo } from "react";
import LiveSecretDetection, { LiveSecret } from "@/components/dashboard/cards/LiveSecretDetection";
import AiSecurityAssistant from "@/components/dashboard/cards/AiSecurityAssistant";
import BrowserProtectionCard, { BrowserProtectionSettings } from "@/components/dashboard/cards/BrowserProtectionCard";
import { RangeTabs, DonutStat, ProgressRows } from "@/components/dashboard/charts";
import { TrendChart, PairedBars } from "@/components/dashboard/charts/TrendChart";
import {
  Shimmer, TrendSkeleton, BarsSkeleton, DonutSkeleton, RowsSkeleton,
  FiguresSkeleton, EmptyState,
} from "@/components/dashboard/charts/Skeletons";
import { fetchDashboard, fetchCharts, fetchSettings } from "@/lib/adminApi";
import { SlidersHorizontal, Download } from "lucide-react";
import { T, CHART, cardStyle } from "@/lib/dashboardTheme";

const RANGES = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
] as const;
type RangeKey = typeof RANGES[number]["key"];

const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];

/** Card shell with a titled header row. */
function Panel({
  title, right, children, style,
}: {
  title: string; right?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div style={{ ...cardStyle, padding: 18, display: "flex", flexDirection: "column", ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <span className="card-title">{title}</span>
        {right}
      </div>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const [dashData,     setDashData]     = useState<Record<string, unknown> | null>(null);
  const [chartsData,   setChartsData]   = useState<Record<string, unknown> | null>(null);
  const [settingsData, setSettingsData] = useState<BrowserProtectionSettings | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [range,        setRange]        = useState<RangeKey>("month");

  useEffect(() => {
    // `loading` already initialises to true and this effect runs once, so
    // there is nothing to reset here.
    Promise.all([
      fetchDashboard().then(setDashData).catch(() => setDashData(null)),
      fetchCharts().then(setChartsData).catch(() => setChartsData(null)),
      fetchSettings().then((d) => {
        const raw = d as Record<string, unknown> | null;
        setSettingsData((raw?.settings ?? raw) as BrowserProtectionSettings | null);
      }).catch(() => setSettingsData(null)),
    ]).finally(() => setLoading(false));
  }, []);

  const stats         = dashData?.stats as Record<string, unknown> | undefined;
  const recentSecrets = (dashData?.recent_secrets ?? []) as LiveSecret[];
  const threatAn      = chartsData?.threat_analytics as Record<string, unknown> | undefined;

  const num = (v: unknown, fallback = 0) => (typeof v === "number" ? v : Number(v) || fallback);

  // Every series below returns null when the API gave us nothing. Nothing on
  // this page invents numbers — a panel either shows real data, a shimmer while
  // it loads, or an explicit empty state.

  // ── Trend series ──────────────────────────────────────────────────────────
  const trend = useMemo(() => {
    const raw = threatAn?.dual_trend as Record<string, unknown>[] | undefined;
    if (!raw?.length) return null;
    return {
      labels: raw.map((r, i) => String(r.m ?? MONTHS[i] ?? i + 1)),
      detected: raw.map((r) => num(r.incidents)),
      resolved: raw.map((r) => num(r.resolved)),
    };
  }, [threatAn]);

  // ── Weekday activity ──────────────────────────────────────────────────────
  const week = useMemo(() => {
    const raw = threatAn?.week_activity as Record<string, unknown>[] | undefined;
    if (!raw?.length) return null;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const detected = days.map((_, i) => num(raw[i]?.v));
    const resolved = days.map((_, i) => num(raw[i]?.resolved));
    // Only plot the second series if the API actually supplies it.
    const hasResolved = resolved.some((v) => v > 0);
    return { days, detected, resolved, hasResolved };
  }, [threatAn]);

  // ── Headline figures ──────────────────────────────────────────────────────
  const hasStats = !!stats;
  const blocked   = num(stats?.threats_blocked);
  const masked    = num(stats?.threats_masked);
  const devices   = num(stats?.total_devices);
  const critical  = num(stats?.critical_incidents);
  const totalInc  = num(stats?.total_incidents);
  const members   = num(stats?.team_members);

  const breakdown = useMemo(() => {
    const t = (dashData?.by_type ?? {}) as Record<string, number>;
    const entries = Object.entries(t).filter(([, v]) => Number(v) > 0).slice(0, 6);
    if (!entries.length) return null;
    return entries.map(([label, value], i) => ({
      label: label.replace(/_/g, " ").toLowerCase(),
      value: Number(value) || 0,
      color: CHART[i % CHART.length],
    }));
  }, [dashData]);

  // Coverage is a real ratio per control: how many of its detections were
  // neutralised. Without detections there is no rate to report.
  const coverage = useMemo(() => {
    if (!hasStats || !totalInc) return null;
    const pct = (n: number) => Math.round(Math.min(1, n / totalInc) * 100);
    return [
      { label: "Threats blocked",  value: pct(blocked),  color: CHART[1] },
      { label: "Secrets masked",   value: pct(masked),   color: CHART[0] },
      { label: "Resolved overall", value: pct(blocked + masked), color: CHART[5] },
      { label: "Awaiting review",  value: pct(critical), color: CHART[3] },
    ];
  }, [hasStats, totalInc, blocked, masked, critical]);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1400 }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 660, letterSpacing: "-0.028em", color: T.text }}>
            Security Overview
          </h2>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: T.muted }}>{today}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
          <RangeTabs options={RANGES} value={range} onChange={setRange} />
          <button type="button" className="dash-btn-ghost">
            <SlidersHorizontal size={14} strokeWidth={2} />
            Filter
          </button>
          <button type="button" className="dash-btn-primary">
            <Download size={14} strokeWidth={2} />
            Export report
          </button>
        </div>
      </div>

      {/* Trend + weekday comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Panel
            title="Detections over time"
            right={
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {[{ c: CHART[3], l: "Detected" }, { c: CHART[1], l: "Resolved" }].map(({ c, l }) => (
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.text2 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                    {l}
                  </span>
                ))}
              </div>
            }
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: -4, marginBottom: 10 }}>
              {loading ? (
                <Shimmer width={90} height={30} />
              ) : (
                <>
                  <span style={{ fontSize: 30, fontWeight: 680, letterSpacing: "-0.032em", color: hasStats ? T.text : T.dim, fontVariantNumeric: "tabular-nums" }}>
                    {hasStats ? totalInc.toLocaleString() : "—"}
                  </span>
                  <span style={{ fontSize: 13, color: T.muted }}>total detections</span>
                </>
              )}
            </div>

            {loading ? (
              <TrendSkeleton height={250} />
            ) : trend ? (
              <TrendChart
                series={[
                  { label: "Detected", color: CHART[3], data: trend.detected, area: true },
                  { label: "Resolved", color: CHART[1], data: trend.resolved },
                ]}
                xLabels={trend.labels}
                height={250}
              />
            ) : (
              <EmptyState
                height={250}
                message="No detections recorded yet"
                hint="Once endpoints start reporting, the trend will appear here."
              />
            )}
          </Panel>
        </div>

        <Panel title="Weekly activity" right={<span style={{ fontSize: 12, color: T.muted }}>Last 7 days</span>}>
          {loading ? (
            <BarsSkeleton height={250} />
          ) : week ? (
            <PairedBars
              groups={week.days}
              series={[
                { label: "Detected", color: CHART[3], data: week.detected },
                ...(week.hasResolved
                  ? [{ label: "Resolved", color: CHART[1], data: week.resolved }]
                  : []),
              ]}
              height={250}
            />
          ) : (
            <EmptyState height={250} message="No activity this week" />
          )}
        </Panel>
      </div>

      {/* Composition + coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel title="Threat breakdown">
          {loading ? (
            <DonutSkeleton />
          ) : breakdown ? (
            <DonutStat
              slices={breakdown}
              centerValue={breakdown.reduce((s, x) => s + x.value, 0).toLocaleString()}
              centerLabel="incidents"
            />
          ) : (
            <EmptyState message="Nothing detected yet" hint="Breakdown appears once incidents are categorised." />
          )}
        </Panel>

        <Panel title="Protection coverage" right={<span style={{ fontSize: 12, color: T.muted }}>Share of detections</span>}>
          {loading ? (
            <RowsSkeleton />
          ) : coverage ? (
            <ProgressRows rows={coverage} />
          ) : (
            <EmptyState message="No detections to measure" hint="Coverage is the share of detections handled by each control." />
          )}
        </Panel>

        <Panel title="Fleet" right={<span style={{ fontSize: 12, color: T.muted }}>Enrolled</span>}>
          {loading ? (
            <FiguresSkeleton />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 20px" }}>
              {[
                { v: devices,  l: "Protected devices", s: "enrolled endpoints" },
                { v: members,  l: "Team members",      s: "covered by policy" },
                { v: blocked,  l: "Threats blocked",   s: "all time" },
                { v: masked,   l: "Secrets masked",    s: "all time" },
              ].map((m) => (
                <div key={m.l}>
                  <div style={{
                    fontSize: 24, fontWeight: 680, letterSpacing: "-0.03em", lineHeight: 1,
                    color: hasStats ? T.text : T.dim, fontVariantNumeric: "tabular-nums",
                  }}>
                    {hasStats ? m.v.toLocaleString() : "—"}
                  </div>
                  <div style={{ fontSize: 11.5, color: T.text2, marginTop: 7, lineHeight: 1.45 }}>
                    {m.l}<br /><span style={{ color: T.muted }}>{m.s}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* Operational detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <LiveSecretDetection incidents={recentSecrets} loading={loading} />
        <BrowserProtectionCard settings={settingsData ?? undefined} loading={loading} />
        <AiSecurityAssistant />
      </div>
    </div>
  );
}
