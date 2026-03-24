import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { clearToken } from "../store/authStore";

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const title =
    location.pathname === "/incidents"
      ? "Incidents"
      : location.pathname === "/metrics"
        ? "Metrics"
        : "Dashboard";

  const logout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar />
      <div className="ml-72 min-h-screen">
        <Topbar title={title} />
        <main className="animate-floatin p-8">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={logout}
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-primary/55 hover:text-primary"
            >
              Logout
            </button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
