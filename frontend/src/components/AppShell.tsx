import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { clearToken } from "../store/authStore";

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const titleByPath: Array<{ match: (path: string) => boolean; title: string }> = [
    { match: (path) => path === "/overview", title: "Overview" },
    { match: (path) => path === "/dashboard", title: "Live Dashboard" },
    { match: (path) => path === "/incidents", title: "Incidents" },
    { match: (path) => path === "/incidents/active", title: "Active Incidents" },
    { match: (path) => path === "/incidents/resolved", title: "Resolved Incidents" },
    { match: (path) => path === "/ai-decisions", title: "AI Decisions" },
    { match: (path) => path === "/metrics", title: "Metrics" },
    { match: (path) => path === "/metrics/cpu", title: "CPU Usage" },
    { match: (path) => path === "/metrics/memory", title: "Memory Usage" },
    { match: (path) => path === "/metrics/network", title: "Network Traffic" },
    { match: (path) => path === "/metrics/error", title: "Error Rate" },
    { match: (path) => path === "/sla-monitor", title: "SLA Monitor" },
    { match: (path) => path === "/timeline", title: "Incident Timeline" },
    { match: (path) => path === "/system-health", title: "System Health" },
    { match: (path) => path === "/settings", title: "Settings" },
  ];

  const title = titleByPath.find((entry) => entry.match(location.pathname))?.title ?? "Cloud iOS";

  const logout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar onLogout={logout} />
      <div className="ml-72 min-h-screen">
        <Topbar title={title} />
        <main className="animate-floatin p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
