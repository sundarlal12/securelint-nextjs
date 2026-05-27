"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
  pointData?: Record<string, { status: string; threats: number; color: string }>;
}

export default function WorldMap({ dots = [], lineColor = "#2dd4bf", pointData = {} }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<{ x: number; y: number; label: string } | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dRef = useRef({ x: 0, y: 0, px: 0, py: 0 });

  const map = new DottedMap({ height: 100, grid: "diagonal" });
  const svgMap = map.getSVG({ radius: 0.22, color: "#FFFFFF30", shape: "circle", backgroundColor: "#0d1117" });

  const proj = (lat: number, lng: number) => ({ x: (lng + 180) * (800 / 360), y: (90 - lat) * (400 / 180) });

  const curve = (s: { x: number; y: number }, e: { x: number; y: number }) => {
    const mx = (s.x + e.x) / 2, my = Math.min(s.y, e.y) - 50;
    return `M ${s.x} ${s.y} Q ${mx} ${my} ${e.x} ${e.y}`;
  };

  const onDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    dRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  }, [pan]);
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: dRef.current.px + e.clientX - dRef.current.x, y: dRef.current.py + e.clientY - dRef.current.y });
  }, [dragging]);
  const onUp = useCallback(() => setDragging(false), []);

  const pts: { lat: number; lng: number; label: string }[] = [];
  const seen = new Set<string>();
  dots.forEach(d => [d.start, d.end].forEach(p => {
    const k = `${p.lat},${p.lng}`;
    if (!seen.has(k) && p.label) { seen.add(k); pts.push({ lat: p.lat, lng: p.lng, label: p.label }); }
  }));

  return (
    <div ref={containerRef} className="w-full aspect-[2/1] rounded-lg relative font-sans"
      style={{ background: "#0d1117", overflow: "hidden", cursor: dragging ? "grabbing" : "grab" }}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
      <div style={{ transform: `translate(${pan.x}px, ${pan.y}px)`, position: "relative", width: "100%", height: "100%" }}>
        <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
          alt="world map" height="495" width="1056" draggable={false} />
        <svg ref={svgRef} viewBox="0 0 800 400" className="w-full h-full absolute inset-0 select-none" style={{ pointerEvents: "none" }}>
          <defs>
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
              <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          {dots.map((dot, i) => {
            const sp = proj(dot.start.lat, dot.start.lng), ep = proj(dot.end.lat, dot.end.lng);
            const path = curve(sp, ep);
            return (
              <g key={`p-${i}`}>
                <motion.path d={path} fill="none" stroke="url(#path-gradient)" strokeWidth="1"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.5 * i, ease: "easeOut" }} />
                <circle r="2" fill={lineColor}>
                  <animateMotion dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" path={path} />
                  <animate attributeName="opacity" values="0;1;1;0" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}
          {pts.map((p, i) => {
            const pt = proj(p.lat, p.lng);
            const c = pointData[p.label]?.color ?? lineColor;
            return (
              <g key={`pt-${i}`} style={{ pointerEvents: "all", cursor: "pointer" }}
                onMouseEnter={() => setHovered({ x: pt.x, y: pt.y, label: p.label })}
                onMouseLeave={() => setHovered(null)}>
                <circle cx={pt.x} cy={pt.y} r="3" fill={c} opacity="0.15">
                  <animate attributeName="r" values="3;18;3" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                </circle>
                <circle cx={pt.x} cy={pt.y} r="3" fill={c} opacity="0.1">
                  <animate attributeName="r" values="3;12;3" dur="2s" begin={`${i * 0.3 + 0.5}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.15;0;0.15" dur="2s" begin={`${i * 0.3 + 0.5}s`} repeatCount="indefinite" />
                </circle>
                <circle cx={pt.x} cy={pt.y} r="3.5" fill={c} opacity="0.9">
                  <animate attributeName="r" values="3.5;4.5;3.5" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx={pt.x} cy={pt.y} r="1.5" fill="#fff" opacity="0.7" />
                <circle cx={pt.x} cy={pt.y} r="15" fill="transparent" />
              </g>
            );
          })}
        </svg>
      </div>
      {hovered && (() => {
        const d = pointData[hovered.label];
        return (
          <div style={{
            position: "absolute", left: `${(hovered.x / 800) * 100}%`, top: `${(hovered.y / 400) * 100 - 10}%`,
            transform: "translate(-50%, -100%)", background: "#161b22", border: "1px solid #30363d",
            borderRadius: 8, padding: "8px 12px", pointerEvents: "none", zIndex: 10, minWidth: 110,
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#e6edf3", marginBottom: 3 }}>{hovered.label}</div>
            {d && (<>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, boxShadow: `0 0 6px ${d.color}` }} />
                <span style={{ fontSize: 11, color: "#c9d1d9" }}>{d.status}</span>
              </div>
              <div style={{ fontSize: 10, color: "#8b949e" }}>{d.threats} threat{d.threats !== 1 ? "s" : ""} detected</div>
            </>)}
          </div>
        );
      })()}
    </div>
  );
}
