import { AlertTriangle, CheckCircle2, Siren, Timer } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchDashboardStats } from "../services/api";
import { loadIncidents } from "../store/incidentStore";
import type { DashboardStats as DashboardStatsType, Incident } from "../types";

const emptyStats: DashboardStatsType = {
	total_incidents: 0,
	critical_incidents: 0,
	resolved_incidents: 0,
	average_resolution_time_seconds: 0,
};

export default function Dashboard() {
	const [stats, setStats] = useState<DashboardStatsType>(emptyStats);
	const [latestIncident, setLatestIncident] = useState<Incident | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		const load = async () => {
			try {
				const [dashboardData, incidents] = await Promise.all([fetchDashboardStats(), loadIncidents()]);
				if (!mounted) return;
				setStats(dashboardData);
				setLatestIncident(incidents[0] ?? null);
			} finally {
				if (mounted) setIsLoading(false);
			}
		};

		void load();

		return () => {
			mounted = false;
		};
	}, []);

	const cards = [
		{
			label: "High-Risk Event",
			value: stats.total_incidents,
			icon: Siren,
			className: "kpi-violet",
			sub: "of incident total",
		},
		{
			label: "Risky Activities",
			value: stats.critical_incidents,
			icon: AlertTriangle,
			className: "kpi-cyan",
			sub: "currently active",
		},
		{
			label: "High-Risk User",
			value: stats.resolved_incidents,
			icon: CheckCircle2,
			className: "kpi-fuchsia",
			sub: "requiring review",
		},
		{
			label: "Devices with issues",
			value: stats.average_resolution_time_seconds,
			icon: Timer,
			className: "kpi-pink",
			sub: "across workloads",
		},
	];

	return (
		<div className="space-y-6">
			<h1 className="text-4xl font-semibold tracking-tight text-slate-100">Dashboard</h1>

			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{cards.map(({ label, value, icon: Icon, className, sub }) => (
					<article
						key={label}
						className={`${className} relative overflow-hidden rounded-2xl p-5 shadow-panel transition duration-300 hover:-translate-y-0.5`}
					>
						<div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
						<div className="mb-3 flex items-center justify-between">
							<p className="text-sm text-slate-100/80">{label}</p>
							<span className="rounded-lg border border-white/20 bg-white/10 p-2 text-white">
								<Icon size={16} />
							</span>
						</div>
						<p className="text-4xl font-semibold text-white">{isLoading ? "..." : value}</p>
						<p className="mt-1 text-xs text-white/70">{sub}</p>
					</article>
				))}
			</section>

			<section className="grid gap-4 xl:grid-cols-3">
				<div className="panel-soft rounded-2xl p-6 xl:col-span-2">
					<h2 className="mb-4 text-xl font-semibold text-slate-100">Files in Time</h2>
					<div className="h-64 rounded-xl border border-violet-300/15 bg-[#151739] p-4">
						<div className="grid h-full grid-rows-6">
							{[1, 2, 3, 4, 5, 6].map((r) => (
								<div key={r} className="border-b border-violet-300/10 last:border-0" />
							))}
						</div>
						<div className="-mt-44 flex h-36 items-end justify-between px-2">
							{[35, 52, 28, 60, 45, 72, 40, 66, 38, 58, 30, 62].map((h, i) => (
								<div
									key={i}
									className="w-3 rounded-t-sm bg-gradient-to-t from-cyan-500/70 to-fuchsia-500/70"
									style={{ height: `${h}%` }}
								/>
							))}
						</div>
					</div>
				</div>

				<div className="panel-soft rounded-2xl p-5">
					<h2 className="mb-4 text-xl font-semibold text-slate-100">Environment Settings</h2>
					<div className="space-y-3">
						{[1, 2, 3].map((item) => (
							<div key={item} className="rounded-xl border border-violet-300/15 bg-[#17193d] p-3">
								<p className="text-sm font-medium text-slate-200">Email Notifications</p>
								<p className="mt-1 text-xs text-slate-400">Activate alerts for risky events.</p>
								<button className="mt-3 rounded-full border border-violet-300/25 px-3 py-1 text-xs text-slate-300 hover:bg-violet-800/40">
									Read more
								</button>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="grid gap-4 xl:grid-cols-3">
				<div className="panel-soft rounded-2xl p-5">
					<h3 className="mb-3 text-lg font-semibold text-slate-100">Devices with issues</h3>
					<ul className="space-y-2 text-sm text-slate-300">
						<li className="rounded-lg border border-violet-300/15 bg-[#17193d] px-3 py-2">High CPU in cluster-a</li>
						<li className="rounded-lg border border-violet-300/15 bg-[#17193d] px-3 py-2">API gateway latency spike</li>
						<li className="rounded-lg border border-violet-300/15 bg-[#17193d] px-3 py-2">SLA risk approaching threshold</li>
					</ul>
				</div>

				<div className="panel-soft rounded-2xl p-5 xl:col-span-2">
					<h3 className="mb-3 text-lg font-semibold text-slate-100">Latest Incident Snapshot</h3>
					{!latestIncident ? (
						<p className="text-sm text-slate-400">
							{isLoading ? "Loading incidents..." : "No incidents available for this tenant yet."}
						</p>
					) : (
						<div className="grid gap-4 md:grid-cols-3">
							<div className="rounded-xl border border-violet-300/15 bg-[#17193d] p-4">
								<p className="text-xs uppercase tracking-wide text-slate-400">Root Cause</p>
								<p className="mt-2 text-sm text-slate-200">{latestIncident.root_cause}</p>
							</div>
							<div className="rounded-xl border border-violet-300/15 bg-[#17193d] p-4">
								<p className="text-xs uppercase tracking-wide text-slate-400">AI Action</p>
								<p className="mt-2 text-sm text-slate-200">{latestIncident.ai_action.split("_").join(" ")}</p>
							</div>
							<div className="rounded-xl border border-violet-300/15 bg-[#17193d] p-4">
								<p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
								<p className="mt-2 text-sm text-emerald-300">{latestIncident.status}</p>
							</div>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
