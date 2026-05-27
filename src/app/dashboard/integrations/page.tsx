"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LazyCard } from "@/components/dashboard/CardLoader";
import { fetchIntegrations } from "@/lib/adminApi";

const cs: React.CSSProperties = { background: "#0d1117", border: "1px solid #21262d", borderRadius: 14 };

function GhIcon() { return <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.16.58.67.48A10 10 0 0022 12c0-5.52-4.48-10-10-10z" fill="#e6edf3"/></svg>; }
function GlIcon() { return <svg viewBox="0 0 24 24" width="22" height="22"><path d="M22.65 14.39L12.27 4.01a.92.92 0 00-1.3 0L8.45 6.53l1.64 1.64a1.09 1.09 0 011.4 1.4l1.58 1.58a1.1 1.1 0 11-.66.63l-1.47-1.47v3.87a1.1 1.1 0 11-.9-.02V9.83a1.1 1.1 0 01-.6-1.44L7.82 6.77l-6.47 6.47a.92.92 0 000 1.3l10.38 10.38a.92.92 0 001.3 0l9.62-9.62a.92.92 0 000-1.3z" fill="#fc6d26"/></svg>; }
function AwIcon() { return <svg viewBox="0 0 28 18" width="26" height="16"><rect width="28" height="18" rx="3" fill="#232f3e"/><text x="4" y="12" fontSize="9" fontWeight="800" fill="#ff9900" fontFamily="Arial">AWS</text></svg>; }
function DkIcon() { return <svg viewBox="0 0 24 24" width="22" height="22"><path d="M13.98 11.08h2.12v-2.13h-2.12v2.13zm-2.54 0h2.12v-2.13h-2.12v2.13zm-2.53 0h2.12v-2.13H8.91v2.13zm-2.54 0h2.12v-2.13H6.37v2.13zm-2.53 0h2.12v-2.13H3.84v2.13zm2.53-2.54h2.12V6.41H6.37v2.13zm2.54 0h2.12V6.41H8.91v2.13zm2.53 0h2.12V6.41h-2.12v2.13zm0-2.54h2.12V3.87h-2.12V6z" fill="#2496ed"/><path d="M23.15 11.82c-.41-.27-.87-.41-1.37-.41-.1 0-.2.01-.3.03a3.25 3.25 0 00-1.68-2.1c-.14.6-.48 1.12-.95 1.48a5.07 5.07 0 01-2.75.88H2.72A2.72 2.72 0 000 14.42a2.72 2.72 0 002.72 2.72h15.42c1.27 0 2.42-.45 3.3-1.2.81.36 1.72.38 2.54.06.6-.24 1.05-.72 1.17-1.3.13-.57-.04-1.16-.46-1.55-.16-.14-.33-.24-.54-.33z" fill="#2496ed"/></svg>; }
function SlIcon() { return <svg viewBox="0 0 24 24" width="22" height="22"><path d="M5.04 15.16a2.53 2.53 0 01-2.52 2.52A2.53 2.53 0 010 15.16a2.53 2.53 0 012.52-2.52h2.52v2.52zm1.27 0a2.53 2.53 0 012.52-2.52 2.53 2.53 0 012.52 2.52v6.31A2.53 2.53 0 018.83 24a2.53 2.53 0 01-2.52-2.53v-6.31z" fill="#e01e5a"/><path d="M8.83 5.04a2.53 2.53 0 01-2.52-2.52A2.53 2.53 0 018.83 0a2.53 2.53 0 012.52 2.52v2.52H8.83zm0 1.27a2.53 2.53 0 012.52 2.52 2.53 2.53 0 01-2.52 2.52H2.52A2.53 2.53 0 010 8.83a2.53 2.53 0 012.52-2.52h6.31z" fill="#36c5f0"/><path d="M18.96 8.83a2.53 2.53 0 012.52-2.52A2.53 2.53 0 0124 8.83a2.53 2.53 0 01-2.52 2.52h-2.52V8.83zm-1.27 0a2.53 2.53 0 01-2.52 2.52 2.53 2.53 0 01-2.52-2.52V2.52A2.53 2.53 0 0115.17 0a2.53 2.53 0 012.52 2.52v6.31z" fill="#2eb67d"/><path d="M15.17 18.96a2.53 2.53 0 012.52 2.52A2.53 2.53 0 0115.17 24a2.53 2.53 0 01-2.52-2.52v-2.52h2.52zm0-1.27a2.53 2.53 0 01-2.52-2.52 2.53 2.53 0 012.52-2.52h6.31A2.53 2.53 0 0124 15.17a2.53 2.53 0 01-2.52 2.52h-6.31z" fill="#ecb22e"/></svg>; }
function K8Icon() { return <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19.5a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" fill="#326ce5"/></svg>; }
function JnIcon() { return <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#d33833"/></svg>; }
function VcIcon() { return <svg viewBox="0 0 24 24" width="22" height="22"><path d="M24 22.525H0l12-21.05 12 21.05z" fill="#e6edf3"/></svg>; }

const iconMap: Record<string, React.ComponentType> = { github: GhIcon, gitlab: GlIcon, aws: AwIcon, docker: DkIcon, slack: SlIcon, k8s: K8Icon, kubernetes: K8Icon, jenkins: JnIcon, vercel: VcIcon };

const defaultIntegrations = [
  { id: "github", name: "GitHub", cat: "Source Control", status: "Connected", Icon: GhIcon, desc: "Monitor commits, PRs, and code pushes for exposed secrets and vulnerabilities.", stats: [{ l: "Repos Scanned", v: "142" }, { l: "Secrets Found", v: "23" }, { l: "Last Scan", v: "2m ago" }], cfg: { wh: "https://github.com/settings/hooks/securelint", scope: "repo, admin:org_hook" } },
  { id: "gitlab", name: "GitLab", cat: "Source Control", status: "Connected", Icon: GlIcon, desc: "Scan GitLab repositories and CI/CD pipelines for credential leaks.", stats: [{ l: "Repos Scanned", v: "67" }, { l: "Secrets Found", v: "8" }, { l: "Last Scan", v: "5m ago" }], cfg: { wh: "https://gitlab.com/-/profile/personal_access_tokens", scope: "read_api, read_repository" } },
  { id: "aws", name: "AWS", cat: "Cloud", status: "Connected", Icon: AwIcon, desc: "Monitor AWS CloudTrail, S3 buckets, and IAM roles for misconfiguration.", stats: [{ l: "Resources", v: "891" }, { l: "Alerts", v: "12" }, { l: "Region", v: "us-east-1" }], cfg: { wh: "arn:aws:iam::123456789:role/SecureLintRole", scope: "ReadOnly + CloudTrail" } },
  { id: "docker", name: "Docker", cat: "Container", status: "Connected", Icon: DkIcon, desc: "Scan Docker images and container environments for embedded secrets.", stats: [{ l: "Images", v: "34" }, { l: "Issues", v: "3" }, { l: "Last Scan", v: "1h ago" }], cfg: { wh: "registry-1.docker.io/securelint", scope: "pull, manifest" } },
  { id: "slack", name: "Slack", cat: "Communication", status: "Warning", Icon: SlIcon, desc: "Monitor Slack channels for accidental credential sharing and webhook leaks.", stats: [{ l: "Channels", v: "28" }, { l: "Alerts Sent", v: "156" }, { l: "Status", v: "Reconnect" }], cfg: { wh: "https://hooks.slack.com/...", scope: "channels:history, chat:write" } },
  { id: "k8s", name: "Kubernetes", cat: "Orchestration", status: "Disconnected", Icon: K8Icon, desc: "Protect Kubernetes secrets, ConfigMaps, and service account tokens.", stats: [{ l: "Clusters", v: "0" }, { l: "Namespaces", v: "0" }, { l: "Status", v: "Not setup" }], cfg: { wh: "kubeconfig.yaml required", scope: "secrets, configmaps" } },
  { id: "jenkins", name: "Jenkins", cat: "CI/CD", status: "Connected", Icon: JnIcon, desc: "Monitor Jenkins pipelines and build logs for credential exposure.", stats: [{ l: "Pipelines", v: "19" }, { l: "Issues", v: "1" }, { l: "Last Run", v: "30m ago" }], cfg: { wh: "https://jenkins.acme.com/api/...", scope: "Job/Build read access" } },
  { id: "vercel", name: "Vercel", cat: "Deployment", status: "Connected", Icon: VcIcon, desc: "Scan Vercel deployments and environment variables for exposed secrets.", stats: [{ l: "Projects", v: "11" }, { l: "Env Vars", v: "87" }, { l: "Issues", v: "0" }], cfg: { wh: "https://api.vercel.com/v1/integrations", scope: "read:env, read:deployment" } },
];

type Integration = typeof defaultIntegrations[0];

const categories = ["All", "Source Control", "Cloud", "Container", "Communication", "Orchestration", "CI/CD", "Deployment"];
const defaultActivityData = [{ d: "Mon", v: 12 }, { d: "Tue", v: 8 }, { d: "Wed", v: 18 }, { d: "Thu", v: 14 }, { d: "Fri", v: 22 }, { d: "Sat", v: 6 }, { d: "Sun", v: 4 }];

export default function IntegrationsPage() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>(defaultIntegrations);
  const [activityData] = useState(defaultActivityData);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash) { setSelected(hash); setTimeout(() => document.getElementById(`integ-${hash}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 100); }
  }, []);

  useEffect(() => {
    fetchIntegrations()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.integrations ?? null;
        if (list && list.length > 0) {
          const mapped: Integration[] = list.map((item: Record<string, unknown>) => {
            const id = String(item.id ?? "");
            const IconComp = iconMap[id] ?? iconMap[String(item.name ?? "").toLowerCase()] ?? GhIcon;
            return {
              id,
              name: String(item.name ?? ""),
              cat: String(item.cat ?? item.category ?? ""),
              status: String(item.status ?? "Disconnected"),
              Icon: IconComp,
              desc: String(item.desc ?? item.description ?? ""),
              stats: (item.stats as Integration["stats"]) ?? [],
              cfg: (item.cfg ?? item.config ?? { wh: "", scope: "" }) as Integration["cfg"],
            };
          });
          setIntegrations(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const visible = filter === "All" ? integrations : integrations.filter(i => i.cat === filter);
  const connected = integrations.filter(i => i.status === "Connected").length;
  const warnings = integrations.filter(i => i.status === "Warning").length;
  const disconnected = integrations.filter(i => i.status === "Disconnected").length;

  const pieData = [
    { name: "Connected", value: connected, c: "#39d353" },
    { name: "Warning", value: warnings, c: "#d29922" },
    { name: "Disconnected", value: disconnected, c: "#f85149" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1400 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.5px", margin: 0 }}>INTEGRATIONS</h2>
        <p style={{ fontSize: 14, color: "#8b949e", marginTop: 6 }}>Connect your tools and platforms to enable real-time secret detection and security monitoring.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: "Total Integrations", val: integrations.length, c: "#2dd4bf", d: "M13 10V3L4 14h7v7l9-11h-7z" },
          { label: "Connected", val: connected, c: "#39d353", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Warnings", val: warnings, c: "#d29922", d: "M12 2L3 20h18L12 2zM12 9v4m0 4h.01" },
          { label: "Disconnected", val: disconnected, c: "#f85149", d: "M18.36 5.64l-12.72 12.72M5.64 5.64l12.72 12.72" },
        ] as const).map((s, i) => (
          <LazyCard key={i} delay={150 + i * 100}>
            <div style={{ ...cs, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.c}10`, border: `1.5px solid ${s.c}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d={s.d} stroke={s.c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.c, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "#8b949e", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          </LazyCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={{ ...cs, padding: "16px 20px" }}>
          <LazyCard delay={600}>
            <div style={{ fontSize: 10, color: "#8b949e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Integration Activity (7d)</div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={activityData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="d" tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Bar dataKey="v" fill="#2dd4bf" radius={[3, 3, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </LazyCard>
        </div>
        <div style={{ ...cs, padding: "16px 20px" }}>
          <LazyCard delay={700}>
            <div style={{ fontSize: 10, color: "#8b949e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Status Overview</div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <ResponsiveContainer width={80} height={80}>
                <PieChart><Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={22} outerRadius={36} strokeWidth={0}>
                  {pieData.map((e, idx) => <Cell key={idx} fill={e.c} />)}
                </Pie></PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {pieData.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: p.c }} />
                    <span style={{ fontSize: 12, color: "#e6edf3", fontWeight: 600 }}>{p.value}</span>
                    <span style={{ fontSize: 11, color: "#8b949e" }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </LazyCard>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all .15s",
              border: filter === cat ? "1px solid rgba(57,211,83,.4)" : "1px solid #21262d",
              background: filter === cat ? "#1f4a3c" : "#0d1117",
              color: filter === cat ? "#39d353" : "#8b949e",
            }}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {visible.map((integ, idx) => {
          const expanded = selected === integ.id;
          const stColor = integ.status === "Connected" ? "#39d353" : integ.status === "Warning" ? "#d29922" : "#f85149";
          const stBg = integ.status === "Connected" ? "#0f2318" : integ.status === "Warning" ? "#1a1508" : "#1a0f0f";
          return (
            <LazyCard key={integ.id} delay={300 + idx * 80}>
              <div id={`integ-${integ.id}`}
                style={{ ...cs, padding: "20px", display: "flex", flexDirection: "column", gap: 14, transition: "border-color .2s",
                  borderColor: expanded ? "rgba(57,211,83,.5)" : "#21262d",
                  boxShadow: expanded ? "0 0 0 2px rgba(57,211,83,.12)" : "none",
                }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "#161b22", border: "1px solid #21262d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><integ.Icon /></div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3" }}>{integ.name}</div>
                      <div style={{ fontSize: 10, color: "#8b949e", marginTop: 1 }}>{integ.cat}</div>
                    </div>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, color: stColor, background: stBg, border: `1px solid ${stColor}33` }}>
                    <svg width="8" height="8"><circle cx="4" cy="4" r="4" fill={stColor}/></svg>
                    {integ.status}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#8b949e", lineHeight: 1.6, margin: 0 }}>{integ.desc}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "12px", borderRadius: 10, background: "#161b22", border: "1px solid #21262d" }}>
                  {integ.stats.map((s, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#2dd4bf" }}>{s.v}</div>
                      <div style={{ fontSize: 9, color: "#8b949e", marginTop: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                {expanded && (
                  <div style={{ padding: "12px", borderRadius: 10, background: "#161b22", border: "1px solid #21262d" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Configuration</div>
                    <div style={{ fontFamily: "monospace", fontSize: 11, color: "#e6edf3", wordBreak: "break-all", marginBottom: 4 }}>{integ.cfg.wh}</div>
                    <div style={{ fontSize: 10, color: "#8b949e" }}>Scope: {integ.cfg.scope}</div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <button onClick={() => setSelected(expanded ? null : integ.id)}
                    style={{ flex: 1, padding: "9px 14px", fontSize: 11, fontWeight: 700, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .15s",
                      border: integ.status === "Connected" ? "1px solid #21262d" : "none",
                      background: integ.status === "Connected" ? "#161b22" : "#39d353",
                      color: integ.status === "Connected" ? "#8b949e" : "#0d1117",
                    }}>
                    {integ.status === "Connected" ? (expanded ? "Hide config" : "Configure") : "Connect"}
                  </button>
                  <button style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #21262d", background: "#161b22", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#8b949e", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </LazyCard>
          );
        })}
      </div>
    </div>
  );
}
