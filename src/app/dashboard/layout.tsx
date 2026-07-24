"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { usePathname } from "next/navigation";
import { HideStartupBar } from "@/components/ui/HideStartupBar";
import { T } from "@/lib/dashboardTheme";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/live-threats": "Live Threats",
  "/dashboard/secret-scanner": "Secret Scanner",
  "/dashboard/browser-protection": "Browser Protection",
  "/dashboard/ai-monitoring": "Phishing Monitoring",
  "/dashboard/integrations": "Integrations",
  "/dashboard/compliance": "Compliance",
  "/dashboard/controls": "Controls",
  "/dashboard/team-activity": "Team Activity",
  "/dashboard/devsecops": "DevSecOps",
  "/dashboard/incident-reports": "Incident Reports",
  "/dashboard/settings": "Settings",
  "/dashboard/profile":  "My Profile",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  // Routes resolve with a trailing slash, which would miss every map key.
  const routeKey = pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;
  const title = pageTitles[routeKey] ?? "Dashboard";
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  if (!authChecked) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: T.bg }}>
        <div style={{ width: 30, height: 30, border: `2px solid ${T.border}`, borderTop: `2px solid ${T.text}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden antialiased" style={{ background: T.bg }}>
      <HideStartupBar />
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ background: T.bg }}>
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main
          className="flex-1 overflow-y-auto dash-scroll"
          style={{ background: T.bg, scrollbarWidth: "thin", scrollbarColor: "#dcdce0 transparent", padding: "24px 28px 32px" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
