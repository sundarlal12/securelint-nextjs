const stats = [
  { value: "99.99%", label: "Detection Accuracy" },
  { value: "<50ms", label: "Threat Scan" },
  { value: "24/7", label: "Protection" },
  { value: "Zero Trust", label: "Security" },
];

export default function StatsBar() {
  return (
    <div style={{
      background: "#ffffff", border: "1px solid #e9e9ec", borderRadius: 12, padding: "20px 16px",
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{ textAlign: "center", borderLeft: i > 0 ? "1px solid #e9e9ec" : "none" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.5px", lineHeight: 1, textShadow: "0 0 12px rgba(22,163,74,0.14)" }}>
            {s.value}
          </div>
          <div style={{ fontSize: 11, color: "#0a0a0a", marginTop: 8, fontWeight: 500 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
