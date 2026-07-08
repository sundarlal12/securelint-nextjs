"use client";
import { useState, useEffect } from "react";
import IncidentReportLayout, { Incident, ReportStats, FetchParams } from "@/components/dashboard/IncidentReportLayout";
import { fetchIncidentsExtension, fetchExtensionStats } from "@/lib/adminApi";
import { mapExtensionIncident, computeStats } from "@/lib/incidentMapper";

function ExtIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20">
      <rect width="20" height="20" rx="3" fill="#7c3aed" opacity="0.2"/>
      <rect width="20" height="20" rx="3" fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
      <path d="M6 7h8M6 10h8M6 13h5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="15" cy="13" r="2.5" fill="#7c3aed" opacity="0.6"/>
    </svg>
  );
}

const staticIncidents: Incident[] = [
  {
    id: "EXT-001", initials: "AB", initialsColor: "#7c3aed",
    name: "Alex Brown", email: "abrown@acme.com",
    secretType: "Malicious Extension", secretIcon: <ExtIcon />,
    severity: "High", detectedAt: "2026-07-01", detectedTime: "Jul 1, 2026 · 10:15 AM",
    preview: "DataMiner Pro",
    alertTitle: "Malicious Extension — DataMiner Pro — Blocked",
    alertDesc: "A potentially malicious browser extension was detected and blocked.",
    alertStatus: "Blocked",
    details: [
      { icon: "👤", label: "Employee",      value: "Alex Brown" },
      { icon: "📧", label: "Email",         value: "abrown@acme.com" },
      { icon: "🧩", label: "Activity Type", value: "Malicious Extension" },
      { icon: "📦", label: "Extension",     value: "DataMiner Pro" },
      { icon: "⚠️", label: "Severity",      value: "High" },
      { icon: "✅", label: "Action",        value: "Blocked" },
    ],
    maskedContent: "DataMiner Pro",
  },
];

const staticStats: ReportStats = {
  total: 12, blocked: 8, flagged: 3, critical: 1,
  weeklyData: [
    { day: "Mon", count: 2 }, { day: "Tue", count: 1 }, { day: "Wed", count: 3 },
    { day: "Thu", count: 2 }, { day: "Fri", count: 2 }, { day: "Sat", count: 1 }, { day: "Sun", count: 1 },
  ],
};

export default function ExtensionsReportPage() {
  const [incidents, setIncidents]   = useState<Incident[]>(staticIncidents);
  const [stats, setStats]           = useState<ReportStats>(staticStats);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading]   = useState(true);

  async function loadIncidents(params?: FetchParams) {
    setIsFetching(true);
    try {
      const data = await fetchIncidentsExtension(params);
      if (data?.incidents && Array.isArray(data.incidents)) {
        const mapped = (data.incidents as Record<string, unknown>[]).map(inc =>
          mapExtensionIncident(inc, <ExtIcon />)
        );
        setIncidents(mapped);
        setStats(prev => ({ ...prev, ...computeStats(mapped) }));
      }
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();

    /* Pull trend data from extension-stats */
    fetchExtensionStats().then(stats => {
      const daily = stats?.daily_trend ?? stats?.hourly_trend_24h;
      if (Array.isArray(daily) && daily.length > 0) {
        const weeklyData = (daily as Record<string, unknown>[]).slice(0, 7).map((item, i) => ({
          day: String(item.day ?? item.date ?? item.hour ?? `D${i + 1}`).slice(0, 3),
          count: Number(item.count ?? item.total ?? item.value ?? 0),
        }));
        setStats(prev => ({ ...prev, weeklyData }));
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IncidentReportLayout
      title="Browser Extension Report"
      subtitle="Monitor browser extension activity — installations, removals, malicious extensions, and blacklist violations across your org."
      incidents={incidents}
      stats={stats}
      onFetch={loadIncidents}
      isFetching={isFetching}
      isLoading={isLoading}
    />
  );
}
