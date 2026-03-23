import { Bell, BellRing, Cpu, Home, Menu, MessageSquareText, Search, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { clearToken } from "../store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/incidents", label: "Incidents", icon: BellRing },
  { to: "/metrics", label: "Metrics", icon: Cpu },
  { to: "/ai-actions", label: "AI Actions", icon: ShieldCheck },
];

export default function AppShell() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen text-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
        <aside
          className={`fixed z-40 h-full w-72 border-r border-violet-400/15 bg-[#131637]/95 p-6 shadow-panel backdrop-blur md:static md:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300`}
        >
          <div className="mb-6 flex items-center justify-between">
            <Link to="/dashboard" className="text-2xl font-semibold tracking-tight text-slate-100">
              Cloud AIOps
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-violet-300/20 p-2 text-violet-100 md:hidden"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mb-5 rounded-xl border border-violet-400/20 bg-[#191d45] px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Search size={14} />
              <span>Search...</span>
            </div>
          </div>

          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-violet-200/70">Menu</p>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-slate-100 shadow-lg shadow-violet-700/35"
                      : "text-slate-300 hover:bg-violet-900/40 hover:text-white"
                  }`
                }
              >
                <Icon size={17} className="opacity-90" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-700/70 via-indigo-700/60 to-fuchsia-700/50 p-4">
            <p className="text-xl font-semibold text-slate-100">Go Pro</p>
            <p className="mt-1 text-sm text-violet-100/80">Stay connected with your team</p>
            <button
              type="button"
              className="mt-4 w-full rounded-xl border border-violet-200/30 bg-violet-900/30 px-3 py-2 text-sm font-medium text-violet-100 transition hover:bg-violet-900/55"
            >
              Upgrade Now
            </button>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-5 w-full rounded-xl border border-violet-300/20 bg-violet-950/40 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-300"
          >
            Logout
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col bg-[#090d25]/60">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-violet-300/15 bg-[#17173d]/90 px-4 py-4 backdrop-blur md:px-8">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-lg border border-violet-300/20 p-2 text-slate-300 md:hidden"
            >
              <Menu size={18} />
            </button>
            <div className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-violet-300/20 bg-[#211f4c] px-4 py-2 md:flex">
              <Search size={16} className="text-violet-200/70" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <div className="rounded-lg border border-violet-300/20 bg-[#211f4c] p-2 text-violet-100/80">
                <Bell size={15} />
              </div>
              <div className="rounded-lg border border-violet-300/20 bg-[#211f4c] p-2 text-violet-100/80">
                <MessageSquareText size={15} />
              </div>
              <div className="rounded-xl border border-violet-300/20 bg-[#252152] px-3 py-1.5 text-sm text-slate-200">
                Robert
              </div>
            </div>
          </header>

          <main className="flex-1 animate-floatin p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
