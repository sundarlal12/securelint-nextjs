"use client";
/**
 * Chart primitives modelled on the reference dashboards.
 *
 * These are *forms*, not just palettes: a gauge reads its value along an arc, a
 * stat tile pairs a figure with its own shape of history, a trend line states
 * its own average and labels where it ended. Each one is meant to be legible
 * without a caption.
 */
import { T, STATUS } from "@/lib/dashboardTheme";

/* ────────────────────────────────────────────────────────────────────────────
   Sparkline — a figure's recent shape, no axes, terminal dot marks "now".
   ──────────────────────────────────────────────────────────────────────────── */
export function Sparkline({
  data, width = 108, height = 40, stroke = T.text, fill,
}: {
  data: number[]; width?: number; height?: number; stroke?: string; fill?: string;
}) {
  if (data.length < 2) return <svg width={width} height={height} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg width={width} height={height} style={{ display: "block", overflow: "visible" }}>
      {fill && (
        <path
          d={`${d} L${pts[pts.length - 1][0]} ${height} L${pts[0][0]} ${height} Z`}
          fill={fill}
        />
      )}
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r={2.6} fill={stroke} />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Gauge — semicircular meter. Track stays grey; only the filled arc and the
   needle carry colour, so the reading is the coloured part.
   ──────────────────────────────────────────────────────────────────────────── */
export function Gauge({
  value, max = 100, size = 92, accent = STATUS.green,
}: {
  value: number; max?: number; size?: number; accent?: string;
}) {
  const pct = Math.max(0, Math.min(1, value / max));
  const w = size;
  const h = size * 0.62;
  const cx = w / 2;
  const cy = h - 6;
  const r = w / 2 - 9;
  const stroke = 7;

  const polar = (t: number) => {
    const a = Math.PI * (1 - t); // t=0 → left, t=1 → right
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)] as const;
  };
  const [sx, sy] = polar(0);
  const [ex, ey] = polar(1);
  const [vx, vy] = polar(pct);

  // Needle stops short of the arc so the two never visually merge.
  const [nx, ny] = (() => {
    const a = Math.PI * (1 - pct);
    const nr = r - 13;
    return [cx + nr * Math.cos(a), cy - nr * Math.sin(a)] as const;
  })();

  return (
    <svg width={w} height={h + 2} style={{ display: "block", overflow: "visible" }}>
      <path
        d={`M${sx} ${sy} A${r} ${r} 0 0 1 ${ex} ${ey}`}
        fill="none" stroke="#e9e9ec" strokeWidth={stroke} strokeLinecap="round"
      />
      <path
        d={`M${sx} ${sy} A${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${vx} ${vy}`}
        fill="none" stroke={accent} strokeWidth={stroke} strokeLinecap="round"
      />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={T.text} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={2.8} fill={T.text} />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   StatTile — label, figure, its own visual, then a ruled footer carrying the
   period-over-period delta and a way in.
   ──────────────────────────────────────────────────────────────────────────── */
export function StatTile({
  label, value, unit, delta, deltaDirection = "up", deltaLabel = "Last week",
  visual, href, onShowMore,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaDirection?: "up" | "down";
  deltaLabel?: string;
  visual?: React.ReactNode;
  href?: string;
  onShowMore?: () => void;
}) {
  // Direction is about the metric's movement, not whether it's good news —
  // the surrounding copy carries the judgement.
  const deltaColor = deltaDirection === "up" ? STATUS.green : STATUS.red;

  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: T.radius, boxShadow: T.shadow,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 18px 14px" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, color: T.text2, fontWeight: 500, whiteSpace: "nowrap" }}>{label}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 8 }}>
            <span style={{
              fontSize: 28, fontWeight: 680, letterSpacing: "-0.032em", lineHeight: 1,
              color: T.text, fontVariantNumeric: "tabular-nums",
            }}>{value}</span>
            {unit && <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>{unit}</span>}
          </div>
        </div>
        {visual && <div style={{ flexShrink: 0 }}>{visual}</div>}
      </div>

      <div style={{
        borderTop: `1px solid ${T.border}`, padding: "10px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          {delta && (
            <span style={{ fontSize: 12, fontWeight: 600, color: deltaColor, whiteSpace: "nowrap" }}>
              {deltaDirection === "up" ? "↗" : "↘"} {delta}
            </span>
          )}
          <span style={{ fontSize: 12, color: T.muted, whiteSpace: "nowrap" }}>{deltaLabel}</span>
        </span>
        {(href || onShowMore) && (
          <a
            href={href}
            onClick={onShowMore}
            style={{ fontSize: 12, color: T.text2, textDecoration: "none", whiteSpace: "nowrap", cursor: "pointer" }}
          >
            Show more →
          </a>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   RangeTabs — segmented period selector. The active pill is solid black; the
   rest are quiet, so the current range is unmistakable at a glance.
   ──────────────────────────────────────────────────────────────────────────── */
export function RangeTabs<K extends string>({
  options, value, onChange,
}: {
  options: readonly { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <div style={{ display: "inline-flex", gap: 4, background: T.inset, border: `1px solid ${T.border}`, borderRadius: 10, padding: 3 }}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            style={{
              padding: "6px 13px", borderRadius: 7, border: "none", cursor: "pointer",
              fontSize: 12.5, fontWeight: active ? 600 : 500,
              background: active ? T.text : "transparent",
              color: active ? "#ffffff" : T.text2,
              transition: "background .15s, color .15s",
              fontFamily: "inherit",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   DonutStat — composition with the total held in the middle and a legend that
   carries each slice's actual value, not just its name.
   ──────────────────────────────────────────────────────────────────────────── */
export function DonutStat({
  slices, centerValue, centerLabel, delta, size = 168,
}: {
  slices: { label: string; value: number; color: string }[];
  centerValue: string;
  centerLabel?: string;
  delta?: string;
  size?: number;
}) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const r = size / 2 - 12;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;

  // Resolve each arc's dash length and starting offset up front, so rendering
  // stays a pure map over precomputed geometry.
  const arcs = slices.reduce<{ dash: number; offset: number }[]>((acc, s) => {
    const prev = acc[acc.length - 1];
    const start = prev ? prev.offset + prev.dash : 0;
    return [...acc, { dash: (s.value / total) * circumference, offset: start }];
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {slices.map((s, i) => (
            <circle
              key={s.label}
              cx={c} cy={c} r={r}
              fill="none" stroke={s.color} strokeWidth={18}
              strokeDasharray={`${arcs[i].dash} ${circumference - arcs[i].dash}`}
              strokeDashoffset={-arcs[i].offset}
            />
          ))}
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 2,
        }}>
          <span style={{ fontSize: 22, fontWeight: 680, letterSpacing: "-0.03em", color: T.text, fontVariantNumeric: "tabular-nums" }}>
            {centerValue}
          </span>
          {centerLabel && <span style={{ fontSize: 11, color: T.muted }}>{centerLabel}</span>}
          {delta && <span style={{ fontSize: 11, fontWeight: 600, color: STATUS.green }}>▲ {delta}</span>}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0, flex: 1 }}>
        {slices.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: T.text2, flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {s.label}
            </span>
            <span style={{ fontSize: 13, fontWeight: 620, color: T.text, fontVariantNumeric: "tabular-nums" }}>
              {s.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   ProgressRows — ranked list where the bar length is the comparison and the
   number is the precise read.
   ──────────────────────────────────────────────────────────────────────────── */
export function ProgressRows({
  rows, suffix = "%",
}: {
  rows: { label: string; value: number; sub?: string; color?: string }[];
  suffix?: string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {rows.map((r) => (
        <div key={r.label}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 7 }}>
            <span style={{ fontSize: 12.5, color: T.text, fontWeight: 520, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.label}
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 620, color: T.text, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
              {r.value}{suffix}
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: T.hover, overflow: "hidden" }}>
            <div style={{
              width: `${(r.value / max) * 100}%`, height: "100%", borderRadius: 3,
              background: r.color ?? T.text, transition: "width .3s",
            }} />
          </div>
          {r.sub && <div style={{ fontSize: 11, color: T.muted, marginTop: 5 }}>{r.sub}</div>}
        </div>
      ))}
    </div>
  );
}
