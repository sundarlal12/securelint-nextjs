"use client";
import { useState, useEffect } from "react";
import IncidentReportLayout, { Incident, ReportStats, FetchParams } from "@/components/dashboard/IncidentReportLayout";
import { fetchIncidentsSecrets, fetchCharts } from "@/lib/adminApi";
import { mapSecretIncident, computeStats } from "@/lib/incidentMapper";
import { SecretBrandIcon } from "@/lib/secretIcons";

const staticIncidents: Incident[] = [
  {
    id: "INC-001", initials: "JS", initialsColor: "#2563eb",
    name: "James Smith", email: "jsmith@acme.com",
    secretType: "AWS_ACCESS_KEY", secretIcon: <SecretBrandIcon secretType="AWS_ACCESS_KEY" />,
    severity: "High", detectedAt: new Date().toISOString().split("T")[0], detectedTime: "10:24 AM",
    preview: "AKIA████████████",
    alertTitle: "AWS_ACCESS_KEY secret exposure — Blocked",
    alertDesc: [
      "Credential type: AWS_ACCESS_KEY identified in an active browser session",
      "Response: Secret automatically blocked to prevent exposure",
      "Session context: Project Backup and AWS Credentials",
      "Scan engine: Real-time browser extension monitoring",
      "Severity classification: High",
    ].join("\n"),
    alertStatus: "Blocked",
    details: [
      { icon: "", label: "Employee", value: "James Smith (jsmith@acme.com)" },
      { icon: "", label: "Email", value: "jsmith@acme.com" },
      { icon: "", label: "Secret Type", value: "AWS_ACCESS_KEY" },
      { icon: "", label: "Severity", value: "High" },
      { icon: "", label: "Action", value: "Blocked" },
      { icon: "", label: "Page Title", value: "Project Backup and AWS Credentials" },
      { icon: "", label: "Incident ID", value: "INC-001" },
    ],
    maskedContent: "AKIA██████████████████████████████",
  },
];

const staticStats: ReportStats = {
  total: 47, blocked: 28, flagged: 12, critical: 7,
  weeklyData: [
    { day: "Mon", count: 8 }, { day: "Tue", count: 6 }, { day: "Wed", count: 10 },
    { day: "Thu", count: 7 }, { day: "Fri", count: 9 }, { day: "Sat", count: 4 }, { day: "Sun", count: 3 },
  ],
};

function mapRow(inc: Record<string, unknown>) {
  return mapSecretIncident(inc, <SecretBrandIcon secretType={String(inc.secret_type ?? "")} />);
}

export default function SecretsReportPage() {
  const [incidents, setIncidents]   = useState<Incident[]>(staticIncidents);
  const [stats, setStats]           = useState<ReportStats>(staticStats);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading]   = useState(true);

  async function loadIncidents(params?: FetchParams) {
    setIsFetching(true);
    try {
      const data = await fetchIncidentsSecrets(params);
      if (data?.incidents && Array.isArray(data.incidents)) {
        const mapped = (data.incidents as Record<string, unknown>[]).map(mapRow);
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
    fetchCharts("secrets").then(charts => {
      const raw = charts?.incident_reports?.secrets_daily_7d ?? charts?.daily_7d ?? charts?.trend;
      if (raw && Array.isArray(raw) && raw.length > 0) {
        const weeklyData = (raw as Record<string, unknown>[]).map((item, i) => ({
          day: String(item.day ?? item.date ?? item.label ?? `D${i + 1}`).slice(0, 3),
          count: Number(item.count ?? item.total ?? item.value ?? 0),
        }));
        setStats(prev => ({ ...prev, weeklyData }));
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IncidentReportLayout
      title="Secrets Report"
      subtitle="Review and investigate detected secret exposure incidents and policy violations."
      incidents={incidents}
      stats={stats}
      onFetch={loadIncidents}
      isFetching={isFetching}
      isLoading={isLoading}
    />
  );
}
