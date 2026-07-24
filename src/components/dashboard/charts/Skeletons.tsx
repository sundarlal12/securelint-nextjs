"use client";
/**
 * Loading and empty states for the chart kit.
 *
 * Two rules here:
 *  1. While data is in flight, show a shimmer shaped like the chart that is
 *     coming, so the layout doesn't jump when it lands.
 *  2. When a request succeeds but returns nothing, say so. Never substitute
 *     invented numbers — a plausible-looking chart the viewer can't distinguish
 *     from real data is worse than an empty panel.
 */
import { T } from "@/lib/dashboardTheme";

/** Fixed pseudo-random heights: stable across renders, never mistaken for data. */
const BAR_HEIGHTS = [58, 40, 72, 47, 66, 30, 38];

export function Shimmer({
  width = "100%", height = 12, radius = 8, style,
}: {
  width?: number | string; height?: number | string; radius?: number; style?: React.CSSProperties;
}) {
  return <div className="dash-shimmer" style={{ width, height, borderRadius: radius, ...style }} />;
}

/** Silhouette of a line chart: axis ticks plus a soft band where the line goes. */
export function TrendSkeleton({ height = 250 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "flex-end" }}>
        <Shimmer height="72%" style={{ borderRadius: 10 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        {Array.from({ length: 6 }).map((_, i) => <Shimmer key={i} width={30} height={9} radius={4} />)}
      </div>
    </div>
  );
}

/** Silhouette of grouped bars, matching PairedBars' rhythm. */
export function BarsSkeleton({ height = 250, groups = 7 }: { height?: number; groups?: number }) {
  return (
    <div style={{ width: "100%", height, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* minHeight:0 + an explicit 100% on the pair wrapper: without a definite
          height on the parent chain the bars' percentage heights collapse. */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: 10 }}>
        {Array.from({ length: groups }).map((_, i) => (
          <div key={i} style={{ height: "100%", display: "flex", alignItems: "flex-end", gap: 4 }}>
            <Shimmer width={12} height={`${BAR_HEIGHTS[i % BAR_HEIGHTS.length]}%`} radius={3} />
            <Shimmer width={12} height={`${BAR_HEIGHTS[i % BAR_HEIGHTS.length] * 0.72}%`} radius={3} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", gap: 8 }}>
        {Array.from({ length: groups }).map((_, i) => <Shimmer key={i} width={24} height={9} radius={4} />)}
      </div>
    </div>
  );
}

/** Ring plus legend rows, matching DonutStat's two-column layout. */
export function DonutSkeleton({ size = 168 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
      <div
        className="dash-shimmer"
        style={{
          width: size, height: size, borderRadius: "50%", flexShrink: 0,
          // Punch the middle out so it reads as a ring, not a filled disc.
          WebkitMask: "radial-gradient(circle, transparent 46%, #000 47%)",
          mask: "radial-gradient(circle, transparent 46%, #000 47%)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, minWidth: 120 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Shimmer width={8} height={8} radius={4} />
            <Shimmer height={10} style={{ flex: 1 }} />
            <Shimmer width={26} height={10} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Label + track pairs, matching ProgressRows. */
export function RowsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 7 }}>
            <Shimmer width={`${52 - i * 4}%`} height={11} />
            <Shimmer width={30} height={11} />
          </div>
          <Shimmer height={6} radius={3} />
        </div>
      ))}
    </div>
  );
}

/** Arc silhouette for the Gauge. */
export function GaugeSkeleton({ size = 92 }: { size?: number }) {
  const h = size * 0.62;
  return (
    <div
      className="dash-shimmer"
      style={{
        width: size, height: h, borderRadius: 0,
        WebkitMask: `radial-gradient(circle at 50% 100%, transparent 58%, #000 59%, #000 82%, transparent 83%)`,
        mask: `radial-gradient(circle at 50% 100%, transparent 58%, #000 59%, #000 82%, transparent 83%)`,
      }}
    />
  );
}

/** Grid of figure + caption pairs, matching the Fleet panel. */
export function FiguresSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 20px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Shimmer width={54} height={24} />
          <Shimmer width="80%" height={10} style={{ marginTop: 9 }} />
          <Shimmer width="60%" height={9} style={{ marginTop: 5 }} />
        </div>
      ))}
    </div>
  );
}

/**
 * Shown when a request succeeded but there is genuinely nothing to plot. Says
 * which metric is empty rather than leaving a blank rectangle.
 */
export function EmptyState({
  message = "No data for this period",
  hint,
  height,
}: {
  message?: string; hint?: string; height?: number;
}) {
  return (
    <div style={{
      minHeight: height ?? 140, flex: 1,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 6, textAlign: "center", padding: "24px 12px",
    }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 3v18h18" stroke={T.border} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7 15l3.5-3.5L14 15l4-5" stroke={T.dim} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />
      </svg>
      <span style={{ fontSize: 13, color: T.text2, fontWeight: 500 }}>{message}</span>
      {hint && <span style={{ fontSize: 11.5, color: T.muted, maxWidth: 260 }}>{hint}</span>}
    </div>
  );
}
