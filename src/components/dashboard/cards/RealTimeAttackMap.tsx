"use client";
import dynamic from "next/dynamic";
import { LazyCard } from "@/components/dashboard/CardLoader";

const WorldMap = dynamic(() => import("@/components/ui/world-map"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", aspectRatio: "2/1", background: "#ffffff", borderRadius: 8 }} />
  ),
});

// Enterprise HQ → India (Bengaluru). Attack routes show threat origins → India
const attackRoutes = [
  { start: { lat: 40.7,  lng: -74.0,  label: "New York"  }, end: { lat: 12.97, lng: 77.59, label: "Bengaluru" } },
  { start: { lat: 51.5,  lng: -0.1,   label: "London"    }, end: { lat: 12.97, lng: 77.59, label: "Bengaluru" } },
  { start: { lat: 35.7,  lng: 139.7,  label: "Tokyo"     }, end: { lat: 12.97, lng: 77.59, label: "Bengaluru" } },
  { start: { lat: 39.9,  lng: 116.4,  label: "Beijing"   }, end: { lat: 12.97, lng: 77.59, label: "Bengaluru" } },
  { start: { lat: 12.97, lng: 77.59,  label: "Bengaluru" }, end: { lat: 28.6,  lng: 77.2,  label: "Delhi"     } },
];

const pointData: Record<string, { status: string; threats: number; color: string }> = {
  "Bengaluru": { status: "5 Active", threats: 5, color: "#dc2626" },
  "Delhi":     { status: "2 Active", threats: 2, color: "#ea580c" },
  "New York":  { status: "Origin",   threats: 1, color: "#d97706" },
  "London":    { status: "Origin",   threats: 1, color: "#d97706" },
  "Tokyo":     { status: "Origin",   threats: 1, color: "#0d9488" },
  "Beijing":   { status: "Origin",   threats: 2, color: "#dc2626" },
};

const mapAssets = [
  { label: "Bengaluru", status: "5 Active", color: "#dc2626" },
  { label: "Delhi",     status: "2 Active", color: "#ea580c" },
  { label: "New York",  status: "Origin",   color: "#d97706" },
  { label: "London",    status: "Origin",   color: "#d97706" },
  { label: "Beijing",   status: "Origin",   color: "#dc2626" },
];

export default function RealTimeAttackMap() {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e9e9ec", borderRadius: 14, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: "1px solid #e9e9ec",
      }}>
        <span className="card-title">Real-Time Attack Map</span>
        <span style={{ color: "#a1a1aa", cursor: "pointer", fontSize: 18 }}>···</span>
      </div>
      <div style={{ padding: "4px 8px 0", flex: 1 }}>
        <WorldMap dots={attackRoutes} lineColor="#0d9488" pointData={pointData} />
      </div>
      {/* Map assets / legend */}
      <div style={{
        display: "flex", gap: 0, padding: "8px 12px 10px",
        borderTop: "1px solid #e9e9ec",
      }}>
        {mapAssets.map((a, i) => (
          <div key={i} style={{
            flex: 1, display: "flex", alignItems: "center", gap: 6,
            padding: "0 6px",
            borderLeft: i > 0 ? "1px solid #e9e9ec" : "none",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: a.color, flexShrink: 0,
              boxShadow: `0 0 6px ${a.color}55`,
            }} />
            <div>
              <div style={{ fontSize: 10, color: "#0a0a0a", fontWeight: 600, lineHeight: 1.2 }}>{a.label}</div>
              <div style={{ fontSize: 9, color: "#52525b", lineHeight: 1.2 }}>{a.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
