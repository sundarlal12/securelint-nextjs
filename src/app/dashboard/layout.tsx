"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { usePathname } from "next/navigation";
import { HideStartupBar } from "@/components/ui/HideStartupBar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/live-threats": "Live Threats",
  "/dashboard/secret-scanner": "Secret Scanner",
  "/dashboard/browser-protection": "Browser Protection",
  "/dashboard/ai-monitoring": "Phishing Monitoring",
  "/dashboard/integrations": "Integrations",
  "/dashboard/compliance": "Compliance",
  "/dashboard/settings": "Settings",
  "/dashboard/profile":  "My Profile",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#080b0f" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #21262d", borderTop: "3px solid #39d353", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#080b0f] overflow-hidden antialiased">
      <HideStartupBar />
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#080b0f]">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main
          className="flex-1 overflow-y-auto bg-[#090d12]"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#30363d #090d12", padding: "20px 24px" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
