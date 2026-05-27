"use client";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import { LazyCard } from "@/components/dashboard/CardLoader";

type DataPoint = Record<string, unknown>;

interface ThreatAnalyticsProps {
  dualTrend?:    DataPoint[];
  heatCells?:    string[];
  weekActivity?: DataPoint[];
  loading?:      boolean;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FILLS = ["#39d353", "#2dd4bf", "#d29922", "#f85149", "#58a6ff", "#bc8cff", "#39d353"];

const defaultDualTrend = [
  { m: "Dec", incidents: 28, resolved: 22 },
  { m: "Jan", incidents: 52, resolved: 44 },
  { m: "Feb", incidents: 38, resolved: 35 },
  { m: "Mar", incidents: 72, resolved: 68 },
  { m: "Apr", incidents: 58, resolved: 55 },
  { m: "May", incidents: 88, resolved: 80 },
];

// Risk colour scale: 0 = empty, low = green, medium = amber, high = red
function heatColor(count: number): string {
  if (count === 0)  return "#161b22";
  if (count <= 2)   return "#39d353"; // low  → green
  if (count <= 5)   return "#d29922"; // med  → amber
  if (count <= 10)  return "#f85149"; // high → red
  return "#9e1515";                   // very high → deep red
}

const defaultHeatCells = Array.from({ length: 28 }, (_, i) => {
  const v = [0,1,3,0,2,5,1, 0,4,7,2,1,6,3, 1,0,3,8,2,4,1, 5,2,0,3,1,4,2][i] ?? 0;
  return heatColor(v);
});

const defaultWeekActivity = DAYS.map((n, d) => ({
  n,
  v: [6, 4, 9, 5, 8, 2, 3][d],
  fill: DAY_FILLS[d],
}));

const card: React.CSSProperties = {
  background: "#10161d", border: "1px solid #1b222c", borderRadius: 12,
  padding: 16, display: "flex", flexDirection: "column", gap: 12, minHeight: 340,
};
const tooltipStyle = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, color: "#e6edf3", fontSize: 11, padding: "6px 10px" };
const tooltipItemStyle = { color: "#e6edf3" };
const tooltipLabelStyle = { color: "#c9d1d9", fontWeight: 700, marginBottom: 2 };

const sk = (w: number | string, h: number, r = 5): React.CSSProperties => ({
  width: w, height: h, borderRadius: r, background: "#1b222c",
  animation: "sk-pulse 1.4s ease-in-out infinite",
});

export default function ThreatAnalytics({ dualTrend, heatCells, weekActivity, loading }: ThreatAnalyticsProps = {}) {
  const trend    = dualTrend    ?? defaultDualTrend;
  const cells    = heatCells    ?? defaultHeatCells;
  const activity = weekActivity ?? defaultWeekActivity;

  return (
    <div style={card}>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>
      <LazyCard delay={300}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="card-title">Threat Analytics</span>
          <button type="button" style={{ color: "#8b949e", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>···</button>
        </div>

        {/* Line chart */}
        {loading ? (
          <div style={{ ...sk("100%", 112), borderRadius: 8 }} />
        ) : (
          <div style={{ height: 112, width: "100%", minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={112}>
              <LineChart data={trend} margin={{ top: 2, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="m" tick={{ fill: "#8b949e", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, "auto"]} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                <Line type="monotone" dataKey="incidents" name="Detected"  stroke="#39d353" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="resolved"  name="Resolved"  stroke="#58a6ff" strokeWidth={2} strokeOpacity={0.9} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 4 }}>
          {/* Heatmap */}
          <div>
            <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>Heatmap of risk</div>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} style={{ ...sk("100%", 0, 2), aspectRatio: "1", minHeight: 10 }} />
                ))}
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                  {cells.map((c, i) => (
                    <div key={i} style={{ background: c, borderRadius: 2, aspectRatio: "1", minHeight: 10 }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {DAYS.map((n) => <span key={n} style={{ fontSize: 7, color: "#6e7681", fontWeight: 500 }}>{n.slice(0, 1)}</span>)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5, gap: 4 }}>
                  {[
                    { c: "#39d353", l: "Low"  },
                    { c: "#d29922", l: "Med"  },
                    { c: "#f85149", l: "High" },
                    { c: "#9e1515", l: "Crit" },
                  ].map(({ c, l }) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
                      <span style={{ fontSize: 7, color: "#8b949e" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Threat activity bars — Mon through Sun */}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>Threat activity</div>
            {loading ? (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 96 }}>
                {DAYS.map((d) => (
                  <div key={d} style={{ flex: 1, height: "60%", ...sk("100%", 0, 2), borderRadius: "3px 3px 0 0" }} />
                ))}
              </div>
            ) : (
              <div style={{ height: 96, width: "100%", minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={96}>
                  <BarChart data={activity} margin={{ top: 2, right: 2, left: 2, bottom: 0 }} barCategoryGap="18%">
                    <XAxis
                      dataKey="n"
                      tick={{ fill: "#8b949e", fontSize: 8 }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      /* guarantee day-name labels even if API sends something else */
                      tickFormatter={(val, idx) => DAYS[idx] ?? String(val)}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: "#1b222c", opacity: 0.35 }}
                      contentStyle={tooltipStyle}
                      itemStyle={tooltipItemStyle}
                      labelStyle={tooltipLabelStyle}
                      formatter={(value: unknown) => [`${value} incidents`, "Threats"]}
                      labelFormatter={(_val, payload) => {
                        const idx = payload?.[0]?.payload ? activity.indexOf(payload[0].payload) : -1;
                        return idx >= 0 ? DAYS[idx] ?? String(_val) : String(_val);
                      }}
                    />
                    <Bar dataKey="v" radius={[4, 4, 0, 0]} maxBarSize={18}>
                      {activity.map((e, i) => (
                        <Cell key={`c-${i}`} fill={(e.fill as string) ?? "#39d353"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </LazyCard>
    </div>
  );
}
