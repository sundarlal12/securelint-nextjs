"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { fetchTeam, fetchCharts } from "@/lib/adminApi";
import { CHART, TONE } from "@/lib/dashboardTheme";

// Avatar fills come from the categorical palette so initials stay legible in
// white and the roster reads as the one colourful element on the page.
const defaultMembers = [
  { initials: "JS", name: "James Smith", email: "jsmith@acme.com", role: "Developer", color: CHART[0], secrets: 3, threats: 1, score: 87, status: "Active" },
  { initials: "EW", name: "Emily Walker", email: "ewalker@acme.com", role: "DevOps", color: CHART[1], secrets: 0, threats: 0, score: 99, status: "Active" },
  { initials: "RJ", name: "Robert Johnson", email: "rjohnson@acme.com", role: "Developer", color: CHART[3], secrets: 1, threats: 2, score: 72, status: "Warning" },
  { initials: "MP", name: "Michael Patel", email: "mpatel@acme.com", role: "Security", color: CHART[4], secrets: 0, threats: 0, score: 100, status: "Active" },
  { initials: "KL", name: "Kevin Lee", email: "klee@acme.com", role: "Developer", color: CHART[5], secrets: 2, threats: 0, score: 91, status: "Active" },
  { initials: "SD", name: "Sophia Davis", email: "sdavis@acme.com", role: "QA", color: CHART[0], secrets: 0, threats: 0, score: 95, status: "Active" },
  { initials: "AT", name: "Andrew Thomas", email: "athomas@acme.com", role: "Backend", color: CHART[3], secrets: 4, threats: 3, score: 62, status: "At Risk" },
  { initials: "LM", name: "Linda Martinez", email: "lmartinez@acme.com", role: "Frontend", color: CHART[4], secrets: 0, threats: 0, score: 98, status: "Active" },
];

const defaultActivityData = [
  { d: "Mon", events: 12 }, { d: "Tue", events: 19 }, { d: "Wed", events: 8 },
  { d: "Thu", events: 24 }, { d: "Fri", events: 16 }, { d: "Sat", events: 5 }, { d: "Sun", events: 3 },
];

const defaultScoreData = [
  { d: "W1", v: 82 }, { d: "W2", v: 85 }, { d: "W3", v: 79 }, { d: "W4", v: 88 },
];

const statusColor = {
  "Active": TONE.green,
  "Warning": TONE.amber,
  "At Risk": TONE.red,
};

type Member = typeof defaultMembers[0];

export default function TeamActivityPage() {
  const [members, setMembers] = useState<Member[]>(defaultMembers);
  const [activityData, setActivityData] = useState(defaultActivityData);
  const [scoreData, setScoreData] = useState(defaultScoreData);

  useEffect(() => {
    fetchTeam()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.members ?? null;
        if (list) setMembers(list);
      })
      .catch(() => {});

    fetchCharts()
      .then((data) => {
        const ta = data?.team_activity;
        if (ta?.activity_data) setActivityData(ta.activity_data);
        if (ta?.score_trend) setScoreData(ta.score_trend);
      })
      .catch(() => {});
  }, []);

  const totalMembers = members.length;
  const avgScore = members.length ? Math.round(members.reduce((s, m) => s + m.score, 0) / members.length) : 0;
  const totalSecrets = members.reduce((s, m) => s + (m.secrets ?? 0), 0);
  const atRiskCount = members.filter(m => m.status === "At Risk").length;

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 24, fontWeight: 660, color: "#0a0a0a", letterSpacing: "-0.028em" }}>Team Activity</h2>
        <p style={{ fontSize: 14, color: "#52525b", marginTop: 4 }}>Monitor team security behavior, secret exposure events, and individual compliance scores.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Team Members", val: String(totalMembers), color: "#0d9488" },
          { label: "Avg Security Score", val: `${avgScore}%`, color: "#16a34a" },
          { label: "Secrets This Week", val: String(totalSecrets), color: "#dc2626" },
          { label: "Members At Risk", val: String(atRiskCount), color: "#d97706" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-5 text-center" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
            <div className="text-2xl" style={{ color: "#0a0a0a", fontWeight: 680, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{s.val}</div>
            <div className="text-[11px] mt-1" style={{ color: "#52525b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
          <div className="card-title mb-4">Team Members Security Status</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: "#e9e9ec" }}>
                  {["Member", "Role", "Secrets", "Threats", "Score", "Status"].map(h => (
                    <th key={h} className="text-left font-semibold py-2 pr-3 whitespace-nowrap" style={{ color: "#52525b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-[#fafafa] transition-colors" style={{ borderColor: "#e9e9ec" }}>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: m.color, color: "#fff" }}>{m.initials}</div>
                        <div>
                          <div className="font-medium" style={{ color: "#0a0a0a" }}>{m.name}</div>
                          <div className="text-[10px]" style={{ color: "#52525b" }}>{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3" style={{ color: "#52525b" }}>{m.role}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`font-bold ${m.secrets > 0 ? "text-[#dc2626]" : "text-[#16a34a]"}`}>{m.secrets}</span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className={`font-bold ${m.threats > 0 ? "text-[#d97706]" : "text-[#16a34a]"}`}>{m.threats}</span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-[#e9e9ec] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${m.score}%`, background: m.score >= 90 ? "#16a34a" : m.score >= 70 ? "#d97706" : "#dc2626" }} />
                        </div>
                        <span style={{ color: "#52525b" }}>{m.score}%</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ color: statusColor[m.status as keyof typeof statusColor]?.color, background: statusColor[m.status as keyof typeof statusColor]?.bg }}>{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
            <div className="card-title mb-2">Team Activity This Week</div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="d" tick={{ fill: "#52525b", fontSize: 8 }} axisLine={false} tickLine={false} />
                <Bar dataKey="events" fill="#16a34a" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
            <div className="card-title mb-2">Avg Team Score Trend</div>
            <ResponsiveContainer width="100%" height={70}>
              <AreaChart data={scoreData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs><linearGradient id="tsg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/><stop offset="95%" stopColor="#16a34a" stopOpacity={0}/></linearGradient></defs>
                <Area type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={1.5} fill="url(#tsg)" dot={false} />
                <XAxis dataKey="d" tick={{ fill: "#52525b", fontSize: 8 }} axisLine={false} tickLine={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "#ffffff", border: "1px solid #e9e9ec" }}>
            <div className="card-title mb-4">At Risk Members</div>
            <div className="flex flex-col gap-2.5">
              {members.filter(m => m.status !== "Active").map((m, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-lg p-2.5" style={{ background: "#fafafa", border: "1px solid #e9e9ec" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: m.color, color: "#fff" }}>{m.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium truncate" style={{ color: "#0a0a0a" }}>{m.name}</div>
                    <div className="text-[10px]" style={{ color: "#52525b" }}>{m.secrets} secrets · {m.threats} threats</div>
                  </div>
                  {m.status === "At Risk" ? <AlertTriangle size={13} className="text-[#dc2626] shrink-0" /> : <Shield size={13} className="text-[#d97706] shrink-0" />}
                </div>
              ))}
              {members.filter(m => m.status === "Active" && m.score === 100).slice(0, 2).map((m, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-lg p-2.5" style={{ background: "#fafafa", border: "1px solid #e9e9ec" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: m.color, color: "#fff" }}>{m.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium truncate" style={{ color: "#0a0a0a" }}>{m.name}</div>
                    <div className="text-[10px] text-[#16a34a]">Perfect score ✓</div>
                  </div>
                  <CheckCircle size={13} className="text-[#16a34a] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
