/**
 * Dashboard design tokens.
 *
 * The dashboard is monochrome by default: canvas, cards, borders, text, nav and
 * buttons are all black/white/grey. Saturated colour is spent *only* on data —
 * chart series, severity badges and status dots — so that a coloured pixel
 * always means something.
 *
 * Mirrors the CSS custom properties in globals.css; keep the two in sync.
 */

/** Structural greyscale. */
export const T = {
  /** App canvas behind the cards. */
  bg: "#f7f7f8",
  /** Card / panel fill. */
  surface: "#ffffff",
  /** Inputs, wells and recessed tiles. */
  inset: "#fafafa",
  /** Row hover and active nav fill. */
  hover: "#f4f4f5",
  /** Hairline divider. */
  border: "#e9e9ec",
  /** Border for interactive controls that need to read as an edge. */
  borderStrong: "#dcdce0",

  /** Headings and numerals. */
  text: "#0a0a0a",
  /** Body copy. */
  text2: "#52525b",
  /** Labels, captions, axis ticks. */
  muted: "#8e8e93",
  /** Placeholder and disabled. */
  dim: "#a1a1aa",

  shadow: "0 1px 2px rgba(16, 17, 20, 0.04)",
  shadowLg: "0 16px 48px rgba(16, 17, 20, 0.12)",
  radius: 14,
} as const;

/**
 * Categorical chart palette. Ordered so that adjacent series never sit next to
 * each other in hue — safe to slice from the front for an n-series chart.
 */
export const CHART = [
  "#2563eb", // blue
  "#16a34a", // green
  "#f59e0b", // amber
  "#dc2626", // red
  "#7c3aed", // violet
  "#0d9488", // teal
] as const;

/** Status hues. Same values as the chart palette so the two never clash. */
export const STATUS = {
  green: "#16a34a",
  teal: "#0d9488",
  blue: "#2563eb",
  amber: "#d97706",
  orange: "#ea580c",
  red: "#dc2626",
  violet: "#7c3aed",
} as const;

/** Badge recipe: light wash + matching border + saturated ink. */
export interface Tone {
  color: string;
  bg: string;
  border: string;
}

export const TONE: Record<
  "green" | "teal" | "blue" | "amber" | "orange" | "red" | "violet" | "neutral",
  Tone
> = {
  green:   { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  teal:    { color: "#0f766e", bg: "#f0fdfa", border: "#99f6e4" },
  blue:    { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  amber:   { color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  orange:  { color: "#c2410c", bg: "#fff7ed", border: "#fed7aa" },
  red:     { color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
  violet:  { color: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe" },
  neutral: { color: "#52525b", bg: "#f4f4f5", border: "#e4e4e7" },
};

/** Incident severity → tone. Escalates red as severity climbs. */
export const SEVERITY_TONE: Record<string, Tone> = {
  critical: TONE.red,
  high:     TONE.orange,
  medium:   TONE.amber,
  low:      TONE.green,
  info:     TONE.blue,
};

export function severityTone(severity?: string): Tone {
  return SEVERITY_TONE[severity?.toLowerCase() ?? ""] ?? TONE.neutral;
}

/** Standard card chrome, for components that style inline. */
export const cardStyle: React.CSSProperties = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  boxShadow: T.shadow,
};

/** Recharts tooltip chrome — white card, hairline border, near-black ink. */
export const tooltipStyle: React.CSSProperties = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: 10,
  boxShadow: "0 8px 24px rgba(16,17,20,0.10)",
  color: T.text,
  fontSize: 12,
  padding: "8px 12px",
};
export const tooltipItemStyle: React.CSSProperties = { color: T.text2 };
export const tooltipLabelStyle: React.CSSProperties = {
  color: T.text,
  fontWeight: 600,
  marginBottom: 4,
};

/** Skeleton block used while a card's data is in flight. */
export function skeleton(
  width: number | string,
  height: number,
  radius = 6,
): React.CSSProperties {
  return {
    width,
    height,
    borderRadius: radius,
    background: "#eeeef0",
    animation: "sk-pulse 1.4s ease-in-out infinite",
  };
}
