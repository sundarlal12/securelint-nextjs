// "use client";
// import { useState, useEffect, useRef, useCallback } from "react";

// export interface CarouselItem {
//   icon?: string;
//   title: string;
//   desc: string;
//   href?: string | null;
//   linkText?: string | null;
//   accentColor?: string;
//   titleColor?: string;
// }

// interface CardCarouselProps {
//   items: CarouselItem[];
//   accentColor?: string;
//   cardBg?: string;
// }

// const GAP = 20;

// export function CardCarousel({ items, accentColor = "#28ccb5", cardBg = "rgba(255,255,255,0.03)" }: CardCarouselProps) {
//   const [windowWidth, setWindowWidth] = useState(1200);
//   const [current, setCurrent] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [cardWidth, setCardWidth] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const dragStartX = useRef(0);
//   const dragDeltaX = useRef(0);

//   useEffect(() => {
//     const update = () => setWindowWidth(window.innerWidth);
//     update();
//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, []);

//   const visibleCount = windowWidth >= 1024 ? 3 : windowWidth >= 640 ? 2 : 1;
//   const maxIndex = Math.max(0, items.length - visibleCount);

//   useEffect(() => {
//     const updateWidth = () => {
//       if (containerRef.current) {
//         const w = containerRef.current.offsetWidth;
//         setCardWidth((w - GAP * (visibleCount - 1)) / visibleCount);
//       }
//     };
//     updateWidth();
//     const observer = new ResizeObserver(updateWidth);
//     const el = containerRef.current;
//     if (el) observer.observe(el);
//     return () => observer.disconnect();
//   }, [visibleCount]);

//   // Clamp current when visibleCount changes
//   useEffect(() => {
//     setCurrent((c) => Math.min(c, maxIndex));
//   }, [maxIndex]);

//   const next = useCallback(() => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)), [maxIndex]);
//   const prev = useCallback(() => setCurrent((c) => (c <= 0 ? maxIndex : c - 1)), [maxIndex]);

//   useEffect(() => {
//     if (paused) return;
//     const t = setInterval(next, 4000);
//     return () => clearInterval(t);
//   }, [paused, next]);

//   const handleMouseDown = (e: React.MouseEvent) => {
//     setIsDragging(true);
//     dragStartX.current = e.clientX;
//     dragDeltaX.current = 0;
//   };
//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging) return;
//     dragDeltaX.current = e.clientX - dragStartX.current;
//   };
//   const endDrag = () => {
//     if (!isDragging) return;
//     setIsDragging(false);
//     if (dragDeltaX.current < -50) next();
//     else if (dragDeltaX.current > 50) prev();
//     dragDeltaX.current = 0;
//   };
//   const handleTouchStart = (e: React.TouchEvent) => {
//     dragStartX.current = e.touches[0].clientX;
//     dragDeltaX.current = 0;
//   };
//   const handleTouchMove = (e: React.TouchEvent) => {
//     dragDeltaX.current = e.touches[0].clientX - dragStartX.current;
//   };
//   const handleTouchEnd = () => {
//     if (dragDeltaX.current < -50) next();
//     else if (dragDeltaX.current > 50) prev();
//     dragDeltaX.current = 0;
//   };

//   const arrowBtn: React.CSSProperties = {
//     width: 44,
//     height: 44,
//     borderRadius: "50%",
//     background: "rgba(255,255,255,0.06)",
//     border: "1px solid rgba(255,255,255,0.14)",
//     color: "#fff",
//     fontSize: 20,
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "background 0.2s ease, transform 0.2s ease",
//     flexShrink: 0,
//     lineHeight: 1,
//   };

//   return (
//     <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => { setPaused(false); endDrag(); }}>
//       {/* Arrow row */}
//       <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 24 }}>
//         <button
//           style={arrowBtn}
//           onClick={prev}
//           aria-label="Previous"
//           onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = accentColor; }}
//           onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
//         >
//           ‹
//         </button>
//         <button
//           style={arrowBtn}
//           onClick={next}
//           aria-label="Next"
//           onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = accentColor; }}
//           onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
//         >
//           ›
//         </button>
//       </div>

//       {/* Track */}
//       <div
//         ref={containerRef}
//         style={{ overflow: "hidden", cursor: isDragging ? "grabbing" : "grab" }}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={endDrag}
//         onMouseLeave={endDrag}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "stretch",
//             gap: GAP,
//             transform: `translateX(${-(current * (cardWidth + GAP))}px)`,
//             transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
//             userSelect: "none",
//           }}
//         >
//           {items.map((item, i) => (
//             <div
//               key={i}
//               style={{
//                 flex: `0 0 ${cardWidth}px`,
//                 width: cardWidth,
//                 minHeight: 220,
//                 background: cardBg,
//                 border: "1px solid rgba(255,255,255,0.08)",
//                 borderRadius: 16,
//                 padding: "28px 24px",
//                 boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
//                 transition: "transform 0.25s ease, box-shadow 0.25s ease",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 12,
//                 boxSizing: "border-box",
//               }}
//               onMouseEnter={(e) => {
//                 const el = e.currentTarget as HTMLDivElement;
//                 el.style.transform = "translateY(-6px)";
//                 el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.28)";
//               }}
//               onMouseLeave={(e) => {
//                 const el = e.currentTarget as HTMLDivElement;
//                 el.style.transform = "translateY(0)";
//                 el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)";
//               }}
//             >
//               {item.icon && (
//                 <div style={{ fontSize: 28, lineHeight: 1 }}>{item.icon}</div>
//               )}
//               <h3 style={{
//                 fontSize: "1.05rem",
//                 fontWeight: 700,
//                 color: item.titleColor ?? "var(--ink)",
//                 margin: 0,
//                 lineHeight: 1.3,
//               }}>
//                 {item.title}
//               </h3>
//               <p style={{
//                 color: "var(--ink-muted)",
//                 lineHeight: 1.7,
//                 fontSize: "0.92rem",
//                 margin: 0,
//                 flex: 1,
//               }}>
//                 {item.desc}
//               </p>
//               {item.href && (
//                 <a
//                   href={item.href}
//                   style={{
//                     color: item.accentColor ?? accentColor,
//                     fontSize: "0.88rem",
//                     fontWeight: 600,
//                     textDecoration: "none",
//                     marginTop: 4,
//                   }}
//                 >
//                   {item.linkText ?? "Learn more →"}
//                 </a>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Dots */}
//       {maxIndex > 0 && (
//         <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
//           {Array.from({ length: maxIndex + 1 }).map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrent(i)}
//               aria-label={`Slide ${i + 1}`}
//               style={{
//                 width: current === i ? 28 : 8,
//                 height: 8,
//                 borderRadius: 4,
//                 background: current === i ? accentColor : "rgba(255,255,255,0.18)",
//                 border: "none",
//                 cursor: "pointer",
//                 padding: 0,
//                 transition: "all 0.3s ease",
//               }}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export interface CarouselItem {
  icon?: string;
  title: string;
  desc: string;
  href?: string | null;
  linkText?: string | null;
  accentColor?: string;
  titleColor?: string;
}

interface CardCarouselProps {
  items: CarouselItem[];
  accentColor?: string;
  cardBg?: string;
}

const GAP = 20;
// Extra vertical breathing room inside the clipped track so the
// hover lift + shadow don't get cut off by overflow:hidden.
const VPAD = 18;

export function CardCarousel({ items, accentColor = "#28ccb5", cardBg = "rgba(255,255,255,0.03)" }: CardCarouselProps) {
  const [windowWidth, setWindowWidth] = useState(1200);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragDeltaX = useRef(0);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const visibleCount = windowWidth >= 1024 ? 3 : windowWidth >= 640 ? 2 : 1;
  const maxIndex = Math.max(0, items.length - visibleCount);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Measure the inner content width (padding is vertical-only so this is unaffected)
        const w = containerRef.current.clientWidth;
        setCardWidth((w - GAP * (visibleCount - 1)) / visibleCount);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    const el = containerRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount]);

  // Clamp current when visibleCount changes
  useEffect(() => {
    setCurrent((c) => Math.min(c, maxIndex));
  }, [maxIndex]);

  const next = useCallback(() => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)), [maxIndex]);
  const prev = useCallback(() => setCurrent((c) => (c <= 0 ? maxIndex : c - 1)), [maxIndex]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragDeltaX.current = 0;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    dragDeltaX.current = e.clientX - dragStartX.current;
  };
  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDeltaX.current < -50) next();
    else if (dragDeltaX.current > 50) prev();
    dragDeltaX.current = 0;
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    dragDeltaX.current = 0;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    dragDeltaX.current = e.touches[0].clientX - dragStartX.current;
  };
  const handleTouchEnd = () => {
    if (dragDeltaX.current < -50) next();
    else if (dragDeltaX.current > 50) prev();
    dragDeltaX.current = 0;
  };

  const arrowBtn: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s ease, transform 0.2s ease",
    flexShrink: 0,
    lineHeight: 1,
  };

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => { setPaused(false); endDrag(); }}>
      <style>{`
        @keyframes cc-icon-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .cc-icon {
          animation: cc-icon-float 3s ease-in-out infinite;
        }
        .cc-card:hover .cc-icon {
          animation-duration: 1.4s;
        }
      `}</style>

      {/* Arrow row */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 24 }}>
        <button
          style={arrowBtn}
          onClick={prev}
          aria-label="Previous"
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = accentColor; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
        >
          ‹
        </button>
        <button
          style={arrowBtn}
          onClick={next}
          aria-label="Next"
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = accentColor; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
        >
          ›
        </button>
      </div>

      {/* Track */}
      <div
        ref={containerRef}
        style={{
          overflow: "hidden",
          cursor: isDragging ? "grabbing" : "grab",
          // vertical-only padding keeps hover-lift + shadow from being clipped,
          // pulled back out via negative margin so surrounding layout doesn't shift
          paddingTop: VPAD,
          paddingBottom: VPAD,
          marginTop: -VPAD,
          marginBottom: -VPAD,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: GAP,
            transform: `translateX(${-(current * (cardWidth + GAP))}px)`,
            transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
            userSelect: "none",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="cc-card"
              style={{
                flex: `0 0 ${cardWidth}px`,
                width: cardWidth,
                minHeight: 160,
                background: cardBg,
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "22px 22px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.28)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, height: "100%" }}>
                {/* Left: text content */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: item.titleColor ?? "var(--ink)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: "var(--ink-muted)",
                    lineHeight: 1.7,
                    fontSize: "0.92rem",
                    margin: 0,
                    flex: 1,
                  }}>
                    {item.desc}
                  </p>
                  {item.href && (
                    <a
                      href={item.href}
                      style={{
                        color: item.accentColor ?? accentColor,
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        textDecoration: "none",
                        marginTop: 4,
                      }}
                    >
                      {item.linkText ?? "Learn more →"}
                    </a>
                  )}
                </div>

                {/* Right: animated icon */}
                {item.icon && (
                  <div
                    className="cc-icon"
                    style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}
                  >
                    {item.icon}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {maxIndex > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: current === i ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: current === i ? accentColor : "rgba(255,255,255,0.18)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}