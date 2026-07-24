"use client";
import { useState, useEffect } from "react";
import LiveSecretDetection, { LiveSecret } from "@/components/dashboard/cards/LiveSecretDetection";
import ThreatAnalytics from "@/components/dashboard/cards/ThreatAnalytics";
import AiSecurityAssistant from "@/components/dashboard/cards/AiSecurityAssistant";
import BrowserProtectionCard, { BrowserProtectionSettings } from "@/components/dashboard/cards/BrowserProtectionCard";
import EnterpriseMetrics from "@/components/dashboard/cards/EnterpriseMetrics";
import ComplianceCard from "@/components/dashboard/cards/ComplianceCard";
import { fetchDashboard, fetchCharts, fetchSettings } from "@/lib/adminApi";
import { SlidersHorizontal, Download } from "lucide-react";
import { T } from "@/lib/dashboardTheme";

export default function DashboardPage() {
  const [dashData,    setDashData]    = useState<Record<string, unknown> | null>(null);
  const [chartsData,  setChartsData]  = useState<Record<string, unknown> | null>(null);
  const [settingsData, setSettingsData] = useState<BrowserProtectionSettings | null>(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchDashboard().then(setDashData).catch(() => setDashData(null)),
      fetchCharts().then(setChartsData).catch(() => setChartsData(null)),
      fetchSettings().then((d) => {
        const raw = d as Record<string, unknown> | null;
        const s = (raw?.settings ?? raw) as BrowserProtectionSettings | null;
        setSettingsData(s);
      }).catch(() => setSettingsData(null)),
    ]).finally(() => setLoading(false));
  }, []);

  const stats         = dashData?.stats as Record<string, unknown> | undefined;
  const recentSecrets = (dashData?.recent_secrets ?? []) as LiveSecret[];
  const threatAn      = chartsData?.threat_analytics as Record<string, unknown> | undefined;

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1400 }}>
      {/* Page header — title left, actions right, per the reference layouts */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 660, letterSpacing: "-0.028em", color: T.text }}>
            Security Overview
          </h2>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: T.muted }}>{today}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <LiveSecretDetection
          incidents={recentSecrets}
          loading={loading}
        />
        <ThreatAnalytics
          loading={loading}
          dualTrend={threatAn?.dual_trend    as Record<string, unknown>[] | undefined}
          heatCells={threatAn?.heat_cells    as string[]                  | undefined}
          weekActivity={threatAn?.week_activity as Record<string, unknown>[] | undefined}
        />
        <AiSecurityAssistant />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <BrowserProtectionCard
          settings={settingsData ?? undefined}
          loading={loading}
        />
        <EnterpriseMetrics
          loading={loading}
          total_incidents={stats?.total_incidents     as number | undefined}
          team_members={stats?.team_members           as number | undefined}
          total_devices={stats?.total_devices         as number | undefined}
          threats_blocked={stats?.threats_blocked     as number | undefined}
          threats_masked={stats?.threats_masked       as number | undefined}
          critical_incidents={stats?.critical_incidents as number | undefined}
        />
        <ComplianceCard />
      </div>
    </div>
  );
}
