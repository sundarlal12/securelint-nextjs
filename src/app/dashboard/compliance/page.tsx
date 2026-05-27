"use client";
import { BarChart, Bar, XAxis, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { LazyCard } from "@/components/dashboard/CardLoader";

const cs: React.CSSProperties = { background: "#0d1117", border: "1px solid #21262d", borderRadius: 14 };

const frameworks = [
  {
    name: "SOC 2 Type II", abbr: "SOC2", score: 94, status: "Compliant", accent: "#39d353",
    controls: [
      { name: "Access Control", st: "Pass" }, { name: "Encryption at Rest", st: "Pass" },
      { name: "Audit Logging", st: "Pass" }, { name: "Incident Response", st: "Warning" },
    ],
    history: [{ m: "Jan", v: 88 }, { m: "Feb", v: 90 }, { m: "Mar", v: 91 }, { m: "Apr", v: 93 }, { m: "May", v: 94 }],
  },
  {
    name: "ISO 27034", abbr: "ISO", score: 89, status: "Compliant", accent: "#d29922",
    controls: [
      { name: "Application Security", st: "Pass" }, { name: "Secure SDLC", st: "Pass" },
      { name: "Vulnerability Mgmt", st: "Warning" }, { name: "Code Review", st: "Pass" },
    ],
    history: [{ m: "Jan", v: 82 }, { m: "Feb", v: 84 }, { m: "Mar", v: 86 }, { m: "Apr", v: 88 }, { m: "May", v: 89 }],
  },
  {
    name: "GDPR", abbr: "GDPR", score: 96, status: "Compliant", accent: "#39d353",
    controls: [
      { name: "Data Minimization", st: "Pass" }, { name: "Right to Erasure", st: "Pass" },
      { name: "Privacy by Design", st: "Pass" }, { name: "Data Portability", st: "Pass" },
    ],
    history: [{ m: "Jan", v: 92 }, { m: "Feb", v: 93 }, { m: "Mar", v: 94 }, { m: "Apr", v: 95 }, { m: "May", v: 96 }],
  },
  {
    name: "PCI DSS", abbr: "PCI", score: 78, status: "Warning", accent: "#f85149",
    controls: [
      { name: "Cardholder Data", st: "Pass" }, { name: "Network Security", st: "Warning" },
      { name: "Access Control", st: "Pass" }, { name: "Encryption", st: "Fail" },
    ],
    history: [{ m: "Jan", v: 72 }, { m: "Feb", v: 74 }, { m: "Mar", v: 76 }, { m: "Apr", v: 77 }, { m: "May", v: 78 }],
  },
];

const stIcon = (st: string) => {
  if (st === "Pass" || st === "Compliant") return { c: "#39d353", d: "M9 12l2 2 4-4" };
  if (st === "Warning") return { c: "#d29922", d: "M12 2L3 20h18L12 2zM12 9v4m0 4h.01" };
  return { c: "#f85149", d: "M18 6L6 18M6 6l12 12" };
};

const auditLog = [
  { time: "Today 09:14", action: "SOC 2 — Incident Response control reviewed", user: "admin@acme.com", st: "Pass" },
  { time: "Today 08:30", action: "PCI DSS — Encryption check failed on 2 services", user: "system", st: "Fail" },
  { time: "Yesterday", action: "GDPR — Data minimization audit completed", user: "admin@acme.com", st: "Pass" },
  { time: "2 days ago", action: "ISO 27034 — Vulnerability management scan", user: "system", st: "Warning" },
  { time: "3 days ago", action: "SOC 2 — Access control quarterly review", user: "admin@acme.com", st: "Pass" },
];

const overallRadial = [{ name: "score", value: 89, fill: "#2dd4bf" }];

export default function CompliancePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1400 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.5px", margin: 0 }}>COMPLIANCE</h2>
        <p style={{ fontSize: 14, color: "#8b949e", marginTop: 6 }}>Monitor and manage compliance with industry security standards and regulatory frameworks.</p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: "Overall Score", val: "89%", c: "#2dd4bf", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
          { label: "Frameworks Active", val: "4", c: "#2dd4bf", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
          { label: "Controls Passing", val: "13/16", c: "#39d353", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Open Issues", val: "3", c: "#d29922", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
        ] as const).map((s, i) => (
          <LazyCard key={i} delay={150 + i * 100}>
            <div style={{ ...cs, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.c}10`, border: `1.5px solid ${s.c}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d={s.d} stroke={s.c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "#8b949e", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          </LazyCard>
        ))}
      </div>

      {/* Overall gauge + controls summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div style={{ ...cs, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <LazyCard delay={600}>
            <div style={{ fontSize: 10, color: "#8b949e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, textAlign: "center" }}>Overall Compliance</div>
            <ResponsiveContainer width={120} height={120}>
              <RadialBarChart innerRadius={40} outerRadius={56} data={overallRadial} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: "#161b22" }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#2dd4bf", marginTop: -72, textAlign: "center", position: "relative" }}>89%</div>
            <div style={{ height: 44 }} />
          </LazyCard>
        </div>
        <div className="md:col-span-2" style={{ ...cs, padding: "20px" }}>
          <LazyCard delay={700}>
            <div style={{ fontSize: 10, color: "#8b949e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Framework Scores</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {frameworks.map(fw => {
                const c = fw.score >= 90 ? "#39d353" : fw.score >= 80 ? "#d29922" : "#f85149";
                return (
                  <div key={fw.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#e6edf3", fontWeight: 600 }}>{fw.name}</span>
                      <span style={{ fontSize: 12, color: c, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fw.score}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "#161b22", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 3, background: c, width: `${fw.score}%`, transition: "width .4s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </LazyCard>
        </div>
      </div>

      {/* Framework detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {frameworks.map((fw, idx) => {
          const sc = fw.score >= 90 ? "#39d353" : fw.score >= 80 ? "#d29922" : "#f85149";
          const si = stIcon(fw.status);
          return (
            <LazyCard key={fw.name} delay={400 + idx * 100}>
              <div style={{ ...cs, padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${sc}10`, border: `1.5px solid ${sc}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: sc, flexShrink: 0 }}>{fw.abbr}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3" }}>{fw.name}</div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, marginTop: 3, color: si.c, background: `${si.c}15`, border: `1px solid ${si.c}33` }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d={si.d} stroke={si.c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {fw.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: sc, lineHeight: 1 }}>{fw.score}%</div>
                    <div style={{ fontSize: 9, color: "#8b949e", marginTop: 2, textTransform: "uppercase" }}>compliance</div>
                  </div>
                </div>

                {/* Progress */}
                <div style={{ height: 5, borderRadius: 3, background: "#161b22", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: sc, width: `${fw.score}%`, transition: "width .4s" }} />
                </div>

                {/* Trend chart */}
                <div style={{ padding: "10px 12px", borderRadius: 10, background: "#161b22", border: "1px solid #21262d" }}>
                  <div style={{ fontSize: 9, color: "#8b949e", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>5-Month Trend</div>
                  <ResponsiveContainer width="100%" height={40}>
                    <BarChart data={fw.history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis dataKey="m" tick={{ fill: "#6b7280", fontSize: 8 }} axisLine={false} tickLine={false} />
                      <Bar dataKey="v" fill={sc} radius={[2, 2, 0, 0]} barSize={12} opacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Controls */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {fw.controls.map((ctrl, i) => {
                    const ci = stIcon(ctrl.st);
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, background: "#161b22", border: "1px solid #21262d" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d={ci.d} stroke={ci.c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span style={{ fontSize: 11, color: "#8b949e" }}>{ctrl.name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #21262d", background: "#161b22", color: "#8b949e", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    View Report
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #21262d", background: "#161b22", color: "#8b949e", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Export PDF
                  </button>
                </div>
              </div>
            </LazyCard>
          );
        })}
      </div>

      {/* Audit log */}
      <div style={{ ...cs, padding: "20px" }}>
        <LazyCard delay={900}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Recent Compliance Audit Log</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {auditLog.map((log, i) => {
              const li = stIcon(log.st);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < auditLog.length - 1 ? "1px solid #21262d" : "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d={li.d} stroke={li.c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: "#e6edf3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.action}</div>
                    <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>{log.user}</div>
                  </div>
                  <span style={{ fontSize: 10, color: "#8b949e", flexShrink: 0 }}>{log.time}</span>
                </div>
              );
            })}
          </div>
        </LazyCard>
      </div>
    </div>
  );
}
