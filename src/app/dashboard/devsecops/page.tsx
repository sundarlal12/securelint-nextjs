"use client";
import { useEffect } from "react";
import { AreaChart, Area, XAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { CheckCircle, XCircle, Clock, Play, ShieldAlert } from "lucide-react";

const pipelines = [
  { name: "api-service / main", repo: "github/acme/api-service", status: "Passed", duration: "2m 14s", ago: "5m ago", secrets: 0 },
  { name: "frontend / release", repo: "github/acme/frontend", status: "Failed", duration: "1m 48s", ago: "12m ago", secrets: 2 },
  { name: "ml-pipeline / dev", repo: "gitlab/team/ml-pipeline", status: "Running", duration: "3m 21s", ago: "1m ago", secrets: 0 },
  { name: "infra-deploy / main", repo: "github/ops/infra", status: "Passed", duration: "4m 02s", ago: "32m ago", secrets: 0 },
  { name: "auth-service / feature/oauth", repo: "github/acme/auth", status: "Passed", duration: "1m 55s", ago: "1h ago", secrets: 1 },
  { name: "billing-svc / hotfix", repo: "github/acme/billing", status: "Passed", duration: "2m 30s", ago: "2h ago", secrets: 0 },
];

const sastIssues = [
  { file: "src/auth/login.ts:47", rule: "Hardcoded credential", severity: "Critical", language: "TypeScript" },
  { file: "src/api/handlers.go:128", rule: "SQL injection risk", severity: "High", language: "Go" },
  { file: "src/utils/crypto.py:22", rule: "Weak encryption (MD5)", severity: "High", language: "Python" },
  { file: "src/components/Form.tsx:91", rule: "XSS vulnerability", severity: "Medium", language: "TypeScript" },
  { file: "src/db/migrations/004.sql", rule: "Privileged role grant", severity: "Medium", language: "SQL" },
  { file: "Dockerfile:14", rule: "Running as root", severity: "Low", language: "Docker" },
];

const buildData = [{ m: "Mon", v: 8 }, { m: "Tue", v: 12 }, { m: "Wed", v: 6 }, { m: "Thu", v: 14 }, { m: "Fri", v: 10 }, { m: "Sat", v: 4 }, { m: "Sun", v: 7 }];
const secData = [{ m: "Mon", v: 2 }, { m: "Tue", v: 5 }, { m: "Wed", v: 1 }, { m: "Thu", v: 7 }, { m: "Fri", v: 3 }, { m: "Sat", v: 0 }, { m: "Sun", v: 2 }];

const statusStyle: Record<string, { color: string; bg: string }> = {
  Passed: { color: "#16a34a", bg: "#bbf7d0" },
  Failed: { color: "#dc2626", bg: "#fbefef" },
  Running: { color: "#d97706", bg: "#fef9ed" },
};

const sevStyle: Record<string, { color: string; bg: string }> = {
  Critical: { color: "#dc2626", bg: "#fbefef" },
  High: { color: "#f0883e", bg: "#fcf4ef" },
  Medium: { color: "#d97706", bg: "#fef9ed" },
  Low: { color: "#52525b", bg: "#e9e9ec" },
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "Passed") return <CheckCircle size={13} className="text-[#16a34a]" />;
  if (status === "Failed") return <XCircle size={13} className="text-[#dc2626]" />;
  return <Clock size={13} className="text-[#d97706]" />;
};

export default function DevSecOpsPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 24, fontWeight: 660, color: "#0a0a0a", letterSpacing: "-0.028em" }}>DevSecOps</h2>
        <p style={{ fontSize: 14, color: "#52525b", marginTop: 4 }}>Continuous security scanning across CI/CD pipelines, code repositories, and deployment workflows.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pipelines Monitored", val: "24", color: "#0d9488" },
          { label: "Builds Today", val: "67", color: "#16a34a" },
          { label: "Secrets Detected", val: "8", color: "#dc2626" },
          { label: "Security Score", val: "94%", color: "#16a34a" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-5 text-center" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
            <div className="text-2xl" style={{ color: "#0a0a0a", fontWeight: 680, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{s.val}</div>
            <div className="text-[11px] mt-1" style={{ color: "#52525b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <section id="cicd" className="scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="card-title">CI/CD Pipeline Status</span>
              <button className="flex items-center gap-1.5 text-[11px] font-bold bg-[#16a34a] text-[#f3f5f8] px-3 py-1.5 rounded-lg hover:bg-[#0d9488] transition-colors">
                <Play size={11} /> Run Scan
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b" style={{ borderColor: "#e9e9ec" }}>
                    {["Pipeline", "Status", "Duration", "Secrets", "Time"].map(h => (
                      <th key={h} className="text-left font-semibold py-2 pr-4 whitespace-nowrap" style={{ color: "#52525b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pipelines.map((p, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-[#fafafa] transition-colors" style={{ borderColor: "#e9e9ec" }}>
                      <td className="py-3 pr-4">
                        <div className="font-medium" style={{ color: "#0a0a0a" }}>{p.name}</div>
                        <div className="text-[10px] font-mono" style={{ color: "#52525b" }}>{p.repo}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded w-fit" style={{ color: statusStyle[p.status].color, background: statusStyle[p.status].bg }}>
                          <StatusIcon status={p.status} />
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4" style={{ color: "#52525b" }}>{p.duration}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-[11px] font-bold ${p.secrets > 0 ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
                          {p.secrets > 0 ? `⚠ ${p.secrets} found` : "✓ Clean"}
                        </span>
                      </td>
                      <td className="py-3" style={{ color: "#52525b" }}>{p.ago}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
              <div className="card-title mb-2">Build Activity (this week)</div>
              <ResponsiveContainer width="100%" height={70}>
                <BarChart data={buildData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="m" tick={{ fill: "#52525b", fontSize: 8 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="v" fill="#2563eb" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
              <div className="card-title mb-2">Secrets per Day</div>
              <ResponsiveContainer width="100%" height={70}>
                <AreaChart data={secData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="sdg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} /><stop offset="95%" stopColor="#dc2626" stopOpacity={0} /></linearGradient></defs>
                  <Area type="monotone" dataKey="v" stroke="#dc2626" strokeWidth={1.5} fill="url(#sdg)" dot={false} />
                  <XAxis dataKey="m" tick={{ fill: "#52525b", fontSize: 8 }} axisLine={false} tickLine={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section id="sast" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={14} className="text-[#16a34a]" />
            <span className="card-title">SAST Scan Results</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: "#e9e9ec" }}>
                  {["File / Location", "Rule", "Severity", "Language"].map(h => (
                    <th key={h} className="text-left font-semibold py-2 pr-4 whitespace-nowrap" style={{ color: "#52525b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sastIssues.map((s, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-[#fafafa] transition-colors" style={{ borderColor: "#e9e9ec" }}>
                    <td className="py-3 pr-4 font-mono text-[11px]" style={{ color: "#0a0a0a" }}>{s.file}</td>
                    <td className="py-3 pr-4" style={{ color: "#0a0a0a" }}>{s.rule}</td>
                    <td className="py-3 pr-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ color: sevStyle[s.severity].color, background: sevStyle[s.severity].bg }}>
                        {s.severity}
                      </span>
                    </td>
                    <td className="py-3" style={{ color: "#52525b" }}>{s.language}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
          <div className="card-title mb-3">Severity Breakdown</div>
          <div className="flex flex-col gap-2.5">
            {[
              { label: "Critical", val: 2, color: "#dc2626" },
              { label: "High", val: 5, color: "#f0883e" },
              { label: "Medium", val: 11, color: "#d97706" },
              { label: "Low", val: 28, color: "#52525b" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px]" style={{ color: "#52525b" }}>{item.label}</span>
                  <span className="text-[11px] font-bold" style={{ color: item.color }}>{item.val}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#fafafa" }}>
                  <div className="h-full rounded-full" style={{ width: `${(item.val / 46) * 100}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
        <div className="card-title mb-4">Active Security Policies</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "Block commits with secrets", status: "Active", desc: "Prevents code containing API keys or credentials from being committed." },
            { name: "Mandatory secret rotation", status: "Active", desc: "Alerts and blocks deployments when secrets are older than 90 days." },
            { name: "PR security gate", status: "Active", desc: "All pull requests must pass SAST scan before merge approval." },
            { name: "Container image scanning", status: "Active", desc: "Docker images are scanned for vulnerabilities before deployment." },
            { name: "IAM least privilege", status: "Warning", desc: "Some AWS IAM roles have excessive permissions — review recommended." },
            { name: "Dependency vulnerability check", status: "Active", desc: "npm/pip packages are scanned for known CVEs on every build." },
          ].map((p, i) => (
            <div key={i} className="rounded-lg p-3" style={{ background: "#fafafa", border: "1px solid #e9e9ec" }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-semibold" style={{ color: "#0a0a0a" }}>{p.name}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${p.status === "Active" ? "bg-[#bbf7d0] text-[#16a34a]" : "bg-[#fef9ed] text-[#d97706]"}`}>{p.status}</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: "#52525b" }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
