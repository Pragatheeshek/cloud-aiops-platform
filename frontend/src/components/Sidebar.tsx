import {
	Activity,
	AlertTriangle,
	Bot,
	CheckCircle2,
	Gauge,
	HeartPulse,
	LayoutDashboard,
	ListOrdered,
	LogOut,
	Radar,
	Settings,
	ShieldAlert,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import BrandLogo from "./BrandLogo";

const menuItems = [
	{ to: "/overview", title: "Overview", icon: LayoutDashboard },
	{ to: "/dashboard", title: "Live Dashboard", icon: Radar },
	{ to: "/incidents", title: "Incidents", icon: AlertTriangle },
	{ to: "/incidents/active", title: "Active Incidents", icon: ShieldAlert },
	{ to: "/incidents/resolved", title: "Resolved Incidents", icon: CheckCircle2 },
	{ to: "/ai-decisions", title: "AI Decisions", icon: Bot },
	{ to: "/metrics", title: "Metrics", icon: Activity },
	{ to: "/sla-monitor", title: "SLA Monitor", icon: Gauge },
	{ to: "/timeline", title: "Incident Timeline", icon: ListOrdered },
	{ to: "/system-health", title: "System Health", icon: HeartPulse },
	{ to: "/settings", title: "Settings", icon: Settings },
];

type SidebarProps = {
	onLogout: () => void;
};

export default function Sidebar({ onLogout }: SidebarProps) {
	return (
		<aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-800/80 bg-card/95 p-6 backdrop-blur-md">
			<BrandLogo size={42} withWordmark />

			<nav className="mt-10 max-h-[72vh] space-y-2 overflow-auto pr-1 scrollbar-thin">
				{menuItems.map(({ to, title, icon: Icon }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
								isActive
									? "border-primary/50 bg-primary/20 text-primary"
									: "border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80"
							}`
						}
					>
						<Icon size={18} />
						<span>{title}</span>
					</NavLink>
				))}
			</nav>

			<div className="absolute bottom-6 left-6 right-6">
				<button
					type="button"
					onClick={onLogout}
					className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-primary/55 hover:text-primary"
				>
					<LogOut size={16} />
					Logout
				</button>
			</div>
		</aside>
	);
}
