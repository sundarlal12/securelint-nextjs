"use client";
/**
 * TrendChart — the reference dashboards' primary line form.
 *
 * What makes it readable without a legend lookup:
 *  - a dashed mean line that labels itself ("AVG") instead of leaving the
 *    reader to eyeball the centre of the series,
 *  - a pill at the end of each series carrying its final value in the series'
 *    own colour, so the line and the number are self-identifying,
 *  - a vertical marker at the latest point, anchoring "now".
 */
import { useEffect, useRef, useState } from "react";
import { T } from "@/lib/dashboardTheme";

/**
 * Reports the element's current pixel width so the SVG viewBox can be 1:1 with
 * CSS pixels. Without this the viewBox has a fixed width and the browser
 * uniformly scales the whole drawing — text and bar widths included — to fit a
 * narrow card, which shrinks the chart instead of reflowing it.
 */
function useMeasuredWidth(fallback = 640) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width] as const;
}

export interface Series {
  label: string;
  color: string;
  data: number[];
  /** Soft wash under the line. Use on at most one series or they muddy. */
  area?: boolean;
}

export function TrendChart({
  series, xLabels, height = 240, showAverage = true, formatValue = (n: number) => String(Math.round(n)),
}: {
  series: Series[];
  xLabels: string[];
  height?: number;
  showAverage?: boolean;
  formatValue?: (n: number) => string;
}) {
  const [wrapRef, measured] = useMeasuredWidth();
  const all = series.flatMap((s) => s.data);
  if (!all.length) return <div ref={wrapRef} style={{ height }} />;

  const padL = 8, padR = 62, padT = 18, padB = 26;
  const W = measured; // 1 viewBox unit = 1 CSS pixel
  const H = height;

  const rawMin = Math.min(...all);
  const rawMax = Math.max(...all);
  // Pad the domain so peaks don't graze the frame.
  const span = rawMax - rawMin || 1;
  const min = rawMin - span * 0.15;
  const max = rawMax + span * 0.15;

  const n = Math.max(...series.map((s) => s.data.length));
  const x = (i: number) => padL + (i / Math.max(1, n - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);

  const mean = all.reduce((a, b) => a + b, 0) / all.length;
  const meanY = y(mean);

  // Gridlines at quartiles of the padded domain.
  const gridYs = [0.25, 0.5, 0.75, 1].map((t) => padT + t * (H - padT - padB));
  const lastIdx = n - 1;

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block", overflow: "visible" }}>
      <defs>
        {series.map((s, si) =>
          s.area ? (
            <linearGradient key={si} id={`tc-area-${si}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.14} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ) : null,
        )}
      </defs>

      {/* Horizontal gridlines — dotted and faint, present but never competing. */}
      {gridYs.map((gy, i) => (
        <line key={i} x1={padL} x2={W - padR} y1={gy} y2={gy}
          stroke="#efeff1" strokeWidth={1} strokeDasharray="2 4" />
      ))}

      {/* Mean reference, labelled at the right edge. */}
      {showAverage && (
        <>
          <line x1={padL} x2={W - padR} y1={meanY} y2={meanY}
            stroke="#c4c4c9" strokeWidth={1} strokeDasharray="5 5" />
          <text x={W - padR + 8} y={meanY + 4} fontSize={11} fill={T.muted} fontWeight={500}>AVG</text>
        </>
      )}

      {/* Vertical "now" marker at the latest reading. */}
      <line x1={x(lastIdx)} x2={x(lastIdx)} y1={padT} y2={H - padB}
        stroke={T.borderStrong} strokeWidth={1} />

      {series.map((s, si) => {
        const pts = s.data.map((v, i) => [x(i), y(v)] as const);
        const d = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
        return (
          <g key={si}>
            {s.area && (
              <path d={`${d} L${pts[pts.length - 1][0]} ${H - padB} L${pts[0][0]} ${H - padB} Z`}
                fill={`url(#tc-area-${si})`} />
            )}
            <path d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3.4}
              fill={s.color} stroke={T.surface} strokeWidth={2} />
          </g>
        );
      })}

      {/* Terminal value pills — colour-matched to their series. Nudged apart
          vertically when two series finish close together. */}
      {(() => {
        const ends = series
          .map((s, si) => ({ si, s, yy: y(s.data[s.data.length - 1]), v: s.data[s.data.length - 1] }))
          .sort((a, b) => a.yy - b.yy);
        let prev = -Infinity;
        return ends.map(({ si, s, yy, v }) => {
          const py = Math.max(yy, prev + 20);
          prev = py;
          const label = formatValue(v);
          const w = Math.max(34, label.length * 8 + 12);
          return (
            <g key={si} transform={`translate(${x(lastIdx) + 8}, ${py - 10})`}>
              <rect width={w} height={20} rx={5} fill={s.color} />
              <text x={w / 2} y={14} fontSize={11} fontWeight={650} fill="#ffffff" textAnchor="middle">
                {label}
              </text>
            </g>
          );
        });
      })()}

      {/* X axis labels — thinned so they never collide at narrow widths. */}
      {xLabels.map((lab, i) => {
        const step = Math.ceil(xLabels.length / 7);
        if (i % step !== 0 && i !== xLabels.length - 1) return null;
        return (
          <text key={i} x={x(i)} y={H - 6} fontSize={11} fill={T.muted} textAnchor="middle">
            {lab}
          </text>
        );
      })}
    </svg>
    </div>
  );
}

/**
 * PairedBars — grouped comparison. Each bar carries a cap tick at its top, the
 * detail that keeps thin bars from reading as flat blocks.
 */
export function PairedBars({
  groups, series, height = 200, formatValue = (n: number) => String(n),
}: {
  groups: string[];
  series: { label: string; color: string; data: number[] }[];
  height?: number;
  formatValue?: (n: number) => string;
}) {
  const [wrapRef, measured] = useMeasuredWidth();
  const all = series.flatMap((s) => s.data);
  if (!all.length) return <div ref={wrapRef} style={{ height }} />;
  const max = Math.max(...all) || 1;

  const W = measured;
  const H = height;
  const padT = 14, padB = 26, padR = 44, padL = 6;
  const bandW = (W - padL - padR) / groups.length;
  // Bars grow with the band so a wide card doesn't leave hairline bars adrift.
  const barW = Math.max(6, Math.min(16, (bandW * 0.56) / series.length));
  const gap = Math.max(3, barW * 0.34);

  const gridYs = [0.33, 0.66, 1].map((t) => padT + t * (H - padT - padB));

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block", overflow: "visible" }}>
      {gridYs.map((gy, i) => (
        <line key={i} x1={padL} x2={W - padR} y1={gy} y2={gy}
          stroke="#efeff1" strokeWidth={1} strokeDasharray="2 4" />
      ))}
      {[max, max / 2].map((v, i) => (
        <text key={i} x={W - padR + 8} y={padT + (i === 0 ? 4 : (H - padT - padB) / 2 + 4)}
          fontSize={11} fill={T.muted}>{formatValue(Math.round(v))}</text>
      ))}

      {groups.map((g, gi) => {
        const groupW = series.length * barW + (series.length - 1) * gap;
        const startX = padL + gi * bandW + (bandW - groupW) / 2;
        return (
          <g key={g}>
            {series.map((s, si) => {
              const v = s.data[gi] ?? 0;
              const h = (v / max) * (H - padT - padB);
              const bx = startX + si * (barW + gap);
              const by = H - padB - h;
              return (
                <g key={si}>
                  <rect x={bx} y={by} width={barW} height={Math.max(h, 1)} rx={2} fill={s.color} opacity={0.9} />
                  {/* Cap tick — reads as a measured top rather than a clipped block. */}
                  <rect x={bx} y={by - 2.5} width={barW} height={2.5} rx={1} fill={s.color} />
                </g>
              );
            })}
            <text x={padL + gi * bandW + bandW / 2} y={H - 6} fontSize={11} fill={T.muted} textAnchor="middle">
              {g}
            </text>
          </g>
        );
      })}
    </svg>
    </div>
  );
}
