const stats = [
  { value: "99.99%", label: "Detection Accuracy" },
  { value: "<50ms", label: "Threat Scan" },
  { value: "24/7", label: "Protection" },
  { value: "Zero Trust", label: "Security" },
];

export default function StatsBar() {
  return (
    <div style={{
      background: "#10161d", border: "1px solid #1b222c", borderRadius: 12, padding: "20px 16px",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{ textAlign: "center", borderLeft: i > 0 ? "1px solid #1b222c" : "none" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#39d353", letterSpacing: "-0.5px", lineHeight: 1, textShadow: "0 0 12px rgba(57,211,83,0.35)" }}>
            {s.value}
          </div>
          <div style={{ fontSize: 11, color: "#e6edf3", marginTop: 8, fontWeight: 500 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
