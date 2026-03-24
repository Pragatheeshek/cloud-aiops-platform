import { Activity, AlertTriangle, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
	{ to: "/dashboard", title: "Dashboard", icon: LayoutDashboard },
	{ to: "/incidents", title: "Incidents", icon: AlertTriangle },
	{ to: "/metrics", title: "Metrics", icon: Activity },
];

export default function Sidebar() {
	return (
		<aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-800/80 bg-card/95 p-6 backdrop-blur-md">
			<h1 className="text-2xl font-bold tracking-tight text-text">Cloud Orchestrator</h1>
			<p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">AI-Driven Control Plane</p>

			<nav className="mt-10 space-y-2">
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
		</aside>
	);
}
