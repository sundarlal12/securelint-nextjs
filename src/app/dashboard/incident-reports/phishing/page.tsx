"use client";
import { useState, useEffect } from "react";
import IncidentReportLayout, { Incident, ReportStats, FetchParams } from "@/components/dashboard/IncidentReportLayout";
import { fetchIncidentsPhishing, fetchCharts } from "@/lib/adminApi";
import { mapPhishingIncident, computeStats } from "@/lib/incidentMapper";

function MailIcon() {
  return <svg viewBox="0 0 20 16" width="20" height="16"><rect width="20" height="16" rx="3" fill="#dc2626" opacity="0.2"/><rect width="20" height="16" rx="3" fill="none" stroke="#dc2626" strokeWidth="1.5"/><path d="M2 3l8 5 8-5" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

const staticIncidents: Incident[] = [
  {
    id: "PHI-001", initials: "LR", initialsColor: "#dc2626",
    name: "Lisa Roberts", email: "lroberts@acme.com",
    secretType: "Credential Harvest", secretIcon: <MailIcon />,
    severity: "Critical", detectedAt: "May 18, 2025", detectedTime: "11:02 AM",
    preview: "paypal-secure████",
    alertTitle: "Alert: Phishing email impersonating PayPal targeting finance team — Blocked",
    alertDesc: "A credential harvesting email mimicking PayPal was intercepted before reaching the employee inbox.",
    alertStatus: "Blocked",
    details: [
      { icon: "👤", label: "Employee", value: "Lisa Roberts (lroberts@acme.com)" },
      { icon: "📧", label: "From", value: "security@paypal-alerts-verify.com" },
      { icon: "📎", label: "Subject", value: "Urgent: Verify your PayPal account" },
      { icon: "🔑", label: "Attack Type", value: "Credential Harvest" },
      { icon: "⚠️", label: "Severity", value: "Critical" },
      { icon: "✅", label: "Action", value: "Blocked" },
      { icon: "🛡️", label: "Policy", value: "Inbound Phishing Protection" },
      { icon: "🤖", label: "Detection Engine", value: "SecureLint AI + DMARC" },
      { icon: "#️⃣", label: "Incident ID", value: "PHI-2025-0518-1102" },
    ],
    maskedContent: "https://paypal-secure-verify████████████.com/login",
  },
];

const staticStats: ReportStats = {
  total: 31, blocked: 22, flagged: 5, critical: 4,
  weeklyData: [
    { day: "Mon", count: 5 }, { day: "Tue", count: 3 }, { day: "Wed", count: 6 },
    { day: "Thu", count: 4 }, { day: "Fri", count: 7 }, { day: "Sat", count: 3 }, { day: "Sun", count: 3 },
  ],
};

export default function PhishingReportPage() {
  const [incidents, setIncidents]   = useState<Incident[]>(staticIncidents);
  const [stats, setStats]           = useState<ReportStats>(staticStats);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading]   = useState(true);

  async function loadIncidents(params?: FetchParams) {
    setIsFetching(true);
    try {
      const data = await fetchIncidentsPhishing(params);
      if (data?.incidents && Array.isArray(data.incidents)) {
        const mapped = (data.incidents as Record<string, unknown>[]).map(inc =>
          mapPhishingIncident(inc, <MailIcon />)
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
    fetchCharts("phishing").then(charts => {
      const raw = charts?.incident_reports?.phishing_daily_7d ?? charts?.daily_7d ?? charts?.trend;
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
      title="Phishing Mail Report"
      subtitle="Review and investigate phishing email incidents, flagged sender domains, and impersonation attempts."
      incidents={incidents}
      stats={stats}
      onFetch={loadIncidents}
      isFetching={isFetching}
      isLoading={isLoading}
    />
  );
}
