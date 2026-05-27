"use client";
import { useState, useEffect } from "react";
import IncidentReportLayout, { Incident, ReportStats, FetchParams } from "@/components/dashboard/IncidentReportLayout";
import { fetchIncidentsEmailDlp, fetchCharts } from "@/lib/adminApi";
import { mapDlpIncident, computeStats } from "@/lib/incidentMapper";

function DlpIcon() {
  return <svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="10" r="9" fill="#2563eb" opacity="0.15"/><path d="M10 3L4 7v6l6 4 6-4V7z" fill="none" stroke="#2563eb" strokeWidth="1.5"/><path d="M10 10v4M8 12h4" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

const staticIncidents: Incident[] = [
  {
    id: "DLP-001", initials: "MK", initialsColor: "#2563eb",
    name: "Maria Kim", email: "mkim@acme.com",
    secretType: "PII Data", secretIcon: <DlpIcon />,
    severity: "High", detectedAt: "May 18, 2025", detectedTime: "10:45 AM",
    preview: "SSN: ███-██-████",
    alertTitle: "Alert: Employee attempted to send PII data (Social Security Numbers) externally — Blocked",
    alertDesc: "SecureLint DLP detected Social Security Numbers in an outbound email and blocked the transmission.",
    alertStatus: "Blocked",
    details: [
      { icon: "👤", label: "Employee", value: "Maria Kim (mkim@acme.com)" },
      { icon: "📧", label: "To", value: "external-vendor@supplier.com" },
      { icon: "📎", label: "Subject", value: "Employee records for onboarding" },
      { icon: "🔑", label: "Data Type", value: "PII – Social Security Numbers" },
      { icon: "⚠️", label: "Severity", value: "High" },
      { icon: "✅", label: "Action", value: "Blocked" },
      { icon: "🛡️", label: "Policy", value: "Outbound DLP – PII Protection" },
      { icon: "🤖", label: "Detection Engine", value: "SecureLint AI + Regex" },
      { icon: "#️⃣", label: "Incident ID", value: "DLP-2025-0518-1045" },
    ],
    maskedContent: "SSN: ███-██-████, ███-██-████, ███-██-████ (3 records)",
  },
];

const staticStats: ReportStats = {
  total: 23, blocked: 16, flagged: 4, critical: 3,
  weeklyData: [
    { day: "Mon", count: 4 }, { day: "Tue", count: 2 }, { day: "Wed", count: 3 },
    { day: "Thu", count: 4 }, { day: "Fri", count: 5 }, { day: "Sat", count: 3 }, { day: "Sun", count: 2 },
  ],
};

export default function EmailDlpReportPage() {
  const [incidents, setIncidents]   = useState<Incident[]>(staticIncidents);
  const [stats, setStats]           = useState<ReportStats>(staticStats);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading]   = useState(true);

  async function loadIncidents(params?: FetchParams) {
    setIsFetching(true);
    try {
      const data = await fetchIncidentsEmailDlp(params);
      if (data?.incidents && Array.isArray(data.incidents)) {
        const mapped = (data.incidents as Record<string, unknown>[]).map(inc =>
          mapDlpIncident(inc, <DlpIcon />)
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
    fetchCharts("email_dlp").then(charts => {
      const raw = charts?.incident_reports?.dlp_daily_7d ?? charts?.daily_7d ?? charts?.trend;
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
      title="Email DLP Report"
      subtitle="Review and investigate outbound data loss prevention violations and sensitive content exfiltration attempts."
      incidents={incidents}
      stats={stats}
      onFetch={loadIncidents}
      isFetching={isFetching}
      isLoading={isLoading}
    />
  );
}
