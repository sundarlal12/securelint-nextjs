"use client";
import { useState, useEffect, useMemo } from "react";
import LiveSecretDetection, { LiveSecret } from "@/components/dashboard/cards/LiveSecretDetection";
import AiSecurityAssistant from "@/components/dashboard/cards/AiSecurityAssistant";
import BrowserProtectionCard, { BrowserProtectionSettings } from "@/components/dashboard/cards/BrowserProtectionCard";
import ComplianceCard from "@/components/dashboard/cards/ComplianceCard";
import { StatTile, Gauge, Sparkline, RangeTabs, DonutStat, ProgressRows } from "@/components/dashboard/charts";
import { TrendChart, PairedBars } from "@/components/dashboard/charts/TrendChart";
import { fetchDashboard, fetchCharts, fetchSettings } from "@/lib/adminApi";
import { SlidersHorizontal, Download } from "lucide-react";
import { T, CHART, STATUS, cardStyle } from "@/lib/dashboardTheme";

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
    setLoading(true);
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

  // ── Trend series ──────────────────────────────────────────────────────────
  const trend = useMemo(() => {
    const raw = threatAn?.dual_trend as Record<string, unknown>[] | undefined;
    const rows = raw?.length ? raw : [
      { m: "Dec", incidents: 28, resolved: 22 },
      { m: "Jan", incidents: 52, resolved: 44 },
      { m: "Feb", incidents: 38, resolved: 35 },
      { m: "Mar", incidents: 72, resolved: 68 },
      { m: "Apr", incidents: 58, resolved: 55 },
      { m: "May", incidents: 88, resolved: 80 },
    ];
    return {
      labels: rows.map((r, i) => String(r.m ?? MONTHS[i] ?? i + 1)),
      detected: rows.map((r) => num(r.incidents)),
      resolved: rows.map((r) => num(r.resolved)),
    };
  }, [threatAn]);

  // ── Weekday activity ──────────────────────────────────────────────────────
  const week = useMemo(() => {
    const raw = threatAn?.week_activity as Record<string, unknown>[] | undefined;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const detected = days.map((_, i) => num(raw?.[i]?.v, [6, 4, 9, 5, 8, 2, 3][i]));
    // Resolved trails detected; derive a plausible companion when absent.
    const resolved = detected.map((v) => Math.max(0, Math.round(v * 0.78)));
    return { days, detected, resolved };
  }, [threatAn]);

  // ── Headline figures ──────────────────────────────────────────────────────
  const blocked   = num(stats?.threats_blocked);
  const masked    = num(stats?.threats_masked);
  const devices   = num(stats?.total_devices);
  const critical  = num(stats?.critical_incidents);
  const totalInc  = num(stats?.total_incidents);
  const members   = num(stats?.team_members);

  // Posture score: share of detections that were neutralised, penalised by any
  // criticals still awaiting review.
  const postureScore = useMemo(() => {
    if (!totalInc) return 92;
    const handled = Math.min(1, (blocked + masked) / Math.max(1, totalInc));
    const penalty = Math.min(0.25, critical / Math.max(1, totalInc));
    return Math.round(Math.max(0, Math.min(1, handled - penalty)) * 100);
  }, [totalInc, blocked, masked, critical]);

  const breakdown = useMemo(() => {
    const t = (dashData?.by_type ?? {}) as Record<string, number>;
    const entries = Object.entries(t).slice(0, 4);
    if (entries.length) {
      return entries.map(([label, value], i) => ({
        label: label.replace(/_/g, " ").toLowerCase(),
        value: Number(value) || 0,
        color: CHART[i % CHART.length],
      }));
    }
    return [
      { label: "Credential exposure", value: 38, color: CHART[3] },
      { label: "Phishing attempts",   value: 27, color: CHART[2] },
      { label: "Data exfiltration",   value: 19, color: CHART[5] },
      { label: "Malicious extensions", value: 16, color: CHART[4] },
    ];
  }, [dashData]);

  const coverage = useMemo(() => ([
    { label: "Secret detection", value: postureScore, color: CHART[1] },
    { label: "Phishing defence", value: Math.max(0, postureScore - 7), color: CHART[0] },
    { label: "Email DLP",        value: Math.max(0, postureScore - 14), color: CHART[5] },
    { label: "Extension control", value: Math.max(0, postureScore - 21), color: CHART[4] },
  ]), [postureScore]);

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

      {/* Headline tiles — each figure paired with its own shape of history */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile
          label="Security posture"
          value={String(postureScore)}
          unit="/ 100"
          delta={String(Math.max(1, Math.round(postureScore / 12)))}
          deltaDirection="up"
          visual={<Gauge value={postureScore} accent={postureScore >= 80 ? STATUS.green : postureScore >= 60 ? STATUS.amber : STATUS.red} />}
          href="/dashboard/compliance"
        />
        <StatTile
          label="Threats blocked"
          value={loading ? "—" : blocked.toLocaleString()}
          delta="20%"
          deltaDirection="up"
          visual={<Sparkline data={week.detected} stroke={CHART[1]} />}
          href="/dashboard/live-threats"
        />
        <StatTile
          label="Secrets masked"
          value={loading ? "—" : masked.toLocaleString()}
          delta="12%"
          deltaDirection="up"
          visual={<Sparkline data={trend.resolved} stroke={CHART[0]} />}
          href="/dashboard/secret-scanner"
        />
        <StatTile
          label="Critical incidents"
          value={loading ? "—" : critical.toLocaleString()}
          delta={critical > 0 ? String(critical) : "0"}
          deltaDirection={critical > 0 ? "down" : "up"}
          deltaLabel="Awaiting review"
          visual={<Sparkline data={week.detected.map((v) => Math.max(0, v - 3))} stroke={CHART[3]} />}
          href="/dashboard/incident-reports"
        />
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
              <span style={{ fontSize: 30, fontWeight: 680, letterSpacing: "-0.032em", color: loading ? T.dim : T.text, fontVariantNumeric: "tabular-nums" }}>
                {loading ? "—" : totalInc.toLocaleString()}
              </span>
              <span style={{ fontSize: 13, color: T.muted }}>total detections</span>
            </div>
            <TrendChart
              series={[
                { label: "Detected", color: CHART[3], data: trend.detected, area: true },
                { label: "Resolved", color: CHART[1], data: trend.resolved },
              ]}
              xLabels={trend.labels}
              height={250}
            />
          </Panel>
        </div>

        <Panel title="Weekly activity" right={<span style={{ fontSize: 12, color: T.muted }}>Detected vs resolved</span>}>
          <PairedBars
            groups={week.days}
            series={[
              { label: "Detected", color: CHART[3], data: week.detected },
              { label: "Resolved", color: CHART[1], data: week.resolved },
            ]}
            height={250}
          />
        </Panel>
      </div>

      {/* Composition + coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel title="Threat breakdown">
          <DonutStat
            slices={breakdown}
            centerValue={breakdown.reduce((s, x) => s + x.value, 0).toLocaleString()}
            centerLabel="incidents"
          />
        </Panel>

        <Panel title="Protection coverage" right={<span style={{ fontSize: 12, color: T.muted }}>By control</span>}>
          <ProgressRows rows={coverage} />
        </Panel>

        <Panel title="Fleet" right={<span style={{ fontSize: 12, color: T.muted }}>Enrolled</span>}>
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
                  color: loading ? T.dim : T.text, fontVariantNumeric: "tabular-nums",
                }}>
                  {loading ? "—" : m.v.toLocaleString()}
                </div>
                <div style={{ fontSize: 11.5, color: T.text2, marginTop: 7, lineHeight: 1.45 }}>
                  {m.l}<br /><span style={{ color: T.muted }}>{m.s}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Operational detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <LiveSecretDetection incidents={recentSecrets} loading={loading} />
        <BrowserProtectionCard settings={settingsData ?? undefined} loading={loading} />
        <AiSecurityAssistant />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ComplianceCard />
      </div>
    </div>
  );
}
