"use client";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell,
} from "recharts";
import { LazyCard } from "@/components/dashboard/CardLoader";
import {
  T, CHART, STATUS, cardStyle,
  tooltipStyle, tooltipItemStyle, tooltipLabelStyle, skeleton,
} from "@/lib/dashboardTheme";

type DataPoint = Record<string, unknown>;

interface ThreatAnalyticsProps {
  dualTrend?:    DataPoint[];
  heatCells?:    string[];
  weekActivity?: DataPoint[];
  loading?:      boolean;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** One hue per weekday, cycling the categorical palette. */
const DAY_FILLS = [CHART[0], CHART[5], CHART[2], CHART[3], CHART[1], CHART[4], CHART[0]];

const defaultDualTrend = [
  { m: "Dec", incidents: 28, resolved: 22 },
  { m: "Jan", incidents: 52, resolved: 44 },
  { m: "Feb", incidents: 38, resolved: 35 },
  { m: "Mar", incidents: 72, resolved: 68 },
  { m: "Apr", incidents: 58, resolved: 55 },
  { m: "May", incidents: 88, resolved: 80 },
];

/** Risk scale — a sequential ramp from empty grey through amber to deep red. */
function heatColor(count: number): string {
  if (count === 0)  return "#f1f1f3";
  if (count <= 2)   return "#bbf7d0"; // low
  if (count <= 5)   return "#fcd34d"; // medium
  if (count <= 10)  return "#f87171"; // high
  return "#b91c1c";                   // critical
}

const HEAT_LEGEND = [
  { c: "#bbf7d0", l: "Low"  },
  { c: "#fcd34d", l: "Med"  },
  { c: "#f87171", l: "High" },
  { c: "#b91c1c", l: "Crit" },
];

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
  ...cardStyle,
  padding: 18, display: "flex", flexDirection: "column", gap: 14, minHeight: 340,
};

const sectionLabel: React.CSSProperties = {
  fontSize: 10.5, color: T.muted, marginBottom: 9,
  fontWeight: 560, textTransform: "uppercase", letterSpacing: "0.06em",
};

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
          {/* Series legend doubles as the key for the line chart below */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {[{ c: CHART[3], l: "Detected" }, { c: CHART[1], l: "Resolved" }].map(({ c, l }) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.text2 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Line chart */}
        {loading ? (
          <div style={{ ...skeleton("100%", 116, 10) }} />
        ) : (
          <div className="dash-chart" style={{ height: 116, width: "100%", minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={116}>
              <LineChart data={trend} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: T.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.muted, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, "auto"]} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                <Line type="monotone" dataKey="incidents" name="Detected" stroke={CHART[3]} strokeWidth={2.25} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: T.surface }} />
                <Line type="monotone" dataKey="resolved"  name="Resolved" stroke={CHART[1]} strokeWidth={2.25} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: T.surface }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 2 }}>
          {/* Heatmap */}
          <div>
            <div style={sectionLabel}>Heatmap of risk</div>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} style={{ ...skeleton("100%", 0, 3), aspectRatio: "1", minHeight: 10 }} />
                ))}
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                  {cells.map((c, i) => (
                    <div key={i} style={{ background: c, borderRadius: 3, aspectRatio: "1", minHeight: 10 }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {DAYS.map((n) => <span key={n} style={{ fontSize: 8, color: T.dim, fontWeight: 500 }}>{n.slice(0, 1)}</span>)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 7, gap: 4 }}>
                  {HEAT_LEGEND.map(({ c, l }) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
                      <span style={{ fontSize: 8, color: T.muted }}>{l}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Threat activity bars — Mon through Sun */}
          <div style={{ minWidth: 0 }}>
            <div style={sectionLabel}>Threat activity</div>
            {loading ? (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 96 }}>
                {DAYS.map((d) => (
                  <div key={d} style={{ flex: 1, height: "60%", ...skeleton("100%", 0, 3), borderRadius: "4px 4px 0 0" }} />
                ))}
              </div>
            ) : (
              <div className="dash-chart" style={{ height: 96, width: "100%", minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={96}>
                  <BarChart data={activity} margin={{ top: 2, right: 2, left: 2, bottom: 0 }} barCategoryGap="20%">
                    <XAxis
                      dataKey="n"
                      tick={{ fill: T.muted, fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      /* guarantee day-name labels even if API sends something else */
                      tickFormatter={(val, idx) => DAYS[idx] ?? String(val)}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: T.hover }}
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
                        <Cell key={`c-${i}`} fill={(e.fill as string) ?? STATUS.blue} />
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
