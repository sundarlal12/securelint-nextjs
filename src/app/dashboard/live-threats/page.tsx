"use client";
import { useState, useEffect } from "react";
import LiveIncidentTable, { RawIncident } from "@/components/dashboard/cards/LiveIncidentTable";
import RealTimeAttackMap from "@/components/dashboard/cards/RealTimeAttackMap";
import LiveThreatAnalytics from "@/components/dashboard/cards/LiveThreatAnalytics";
import LiveAiAssistant from "@/components/dashboard/cards/LiveAiAssistant";
import SecurityMetricsCards from "@/components/dashboard/cards/SecurityMetricsCards";
import { fetchLiveThreats, fetchCharts, fetchDashboard } from "@/lib/adminApi";

export default function LiveThreatsPage() {
  const [incidents,    setIncidents]    = useState<RawIncident[]>([]);
  const [weekActivity, setWeekActivity] = useState<Record<string, unknown>[] | undefined>(undefined);
  const [hubWeekly,    setHubWeekly]    = useState<Record<string, unknown>[] | undefined>(undefined);
  const [stats,        setStats]        = useState<Record<string, number> | undefined>(undefined);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchLiveThreats(50).then((d) => {
        const raw = d as Record<string, unknown> | null;
        const list = Array.isArray(raw) ? raw : ((raw?.incidents ?? []) as RawIncident[]);
        setIncidents(list);
      }).catch(() => {}),

      fetchCharts().then((d) => {
        const raw = d as Record<string, unknown> | null;
        const ta  = raw?.threat_analytics  as Record<string, unknown> | undefined;
        const ir  = raw?.incident_reports  as Record<string, unknown> | undefined;
        if (ta?.week_activity) setWeekActivity(ta.week_activity as Record<string, unknown>[]);
        if (ir?.hub_weekly)    setHubWeekly(ir.hub_weekly    as Record<string, unknown>[]);
      }).catch(() => {}),

      fetchDashboard().then((d) => {
        const raw = d as Record<string, unknown> | null;
        const s   = raw?.stats as Record<string, number> | undefined;
        if (s) setStats(s);
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1400 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 24, fontWeight: 660, color: "#0a0a0a", letterSpacing: "-0.028em", margin: 0 }}>
          LIVE THREATS
        </h2>
        <p style={{ fontSize: 14, color: "#52525b", marginTop: 6 }}>
          Real-time enterprise threat monitoring and AI-powered incident detection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <LiveIncidentTable incidents={incidents} loading={loading} />
        </div>
        <div>
          <RealTimeAttackMap />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" style={{ alignItems: "stretch" }}>
        <div className="lg:col-span-2">
          <LiveThreatAnalytics
            weekActivity={weekActivity}
            hubWeekly={hubWeekly}
            severityBreakdown={stats?.severity_breakdown as Record<string, number> | undefined}
            actionBreakdown={stats?.action_breakdown   as Record<string, number> | undefined}
            loading={loading}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <LiveAiAssistant />
          <SecurityMetricsCards
            loading={loading}
            total_devices={stats?.total_devices}
            threats_blocked={stats?.threats_blocked}
            threats_masked={stats?.threats_masked}
            critical_incidents={stats?.critical_incidents}
          />
        </div>
      </div>
    </div>
  );
}
