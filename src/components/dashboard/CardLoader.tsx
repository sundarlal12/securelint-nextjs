// "use client";
// import { useState, useEffect, ReactNode } from "react";

// export function CardLoader() {
//   return (
//     <div style={{
//       display: "flex", alignItems: "center", justifyContent: "center",
//       minHeight: 120, width: "100%",
//     }}>
//       <style>{`
//         @keyframes cardSpin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//       <div style={{ position: "relative", width: 36, height: 36 }}>
//         <div style={{
//           width: 36, height: 36, borderRadius: "50%",
//           border: "3px solid #21262d",
//           borderTopColor: "#2dd4bf",
//           animation: "cardSpin 0.8s linear infinite",
//         }} />
//         <div style={{
//           position: "absolute", inset: 10, borderRadius: "50%",
//           background: "#2dd4bf", opacity: 0.3,
//         }} />
//       </div>
//     </div>
//   );
// }

// export function LazyCard({ children, delay = 400 }: { children: ReactNode; delay?: number }) {
//   const [ready, setReady] = useState(false);
//   useEffect(() => {
//     const t = setTimeout(() => setReady(true), delay);
//     return () => clearTimeout(t);
//   }, [delay]);
//   if (!ready) return <CardLoader />;
//   return <>{children}</>;
// }


"use client";
import { useState, useEffect, ReactNode } from "react";

const styles = `
  @keyframes cardLoaderSpin {
    to { transform: rotate(360deg); }
  }
  @keyframes cardFadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export function CardLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 120,
        width: "100%",
      }}
    >
      <style>{styles}</style>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "2px solid #e5e7eb",      // track
          borderTopColor: "#0d9488",          // teal — matches logo background
          animation: "cardLoaderSpin 0.75s cubic-bezier(0.4,0,0.2,1) infinite",
        }}
      />
    </div>
  );
}

export function LazyCard({
  children,
  delay = 400,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!ready) return <CardLoader />;

  return (
    <div
      style={{
        animation: "cardFadeUp 0.35s ease both",
      }}
    >
      {children}
    </div>
  );
}