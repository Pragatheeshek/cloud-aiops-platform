import { useCallback, useMemo, useState } from "react";

import IncidentTable from "../components/IncidentTable";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { usePolling } from "../hooks/usePolling";
import { fetchIncidents } from "../services/api";

const POLLING_MS = 3000;

export default function Incidents() {
	const loadIncidents = useCallback(() => fetchIncidents(), []);
	const { data, isLoading, error, lastUpdated } = usePolling(loadIncidents, POLLING_MS);
	const [statusFilter, setStatusFilter] = useState<"all" | "open" | "resolved">("all");
	const [severityFilter, setSeverityFilter] = useState<"all" | "critical" | "warning" | "normal">("all");
	const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">("7d");
	const [searchTerm, setSearchTerm] = useState("");

	const incidents = data ?? [];
	const filteredIncidents = useMemo(() => {
		const now = Date.now();
		const rangeMs =
			timeRange === "24h" ? 24 * 60 * 60 * 1000 : timeRange === "7d" ? 7 * 24 * 60 * 60 * 1000 : timeRange === "30d" ? 30 * 24 * 60 * 60 * 1000 : null;

		return incidents.filter((incident) => {
			const statusMatches =
				statusFilter === "all" ? true : String(incident.status).toLowerCase() === statusFilter;
			const severityMatches =
				severityFilter === "all" ? true : String(incident.severity).toLowerCase() === severityFilter;
			const timeMatches =
				rangeMs === null
					? true
					: now - new Date(incident.created_at).getTime() <= rangeMs;
			const searchMatches =
				searchTerm.trim().length === 0
					? true
					: `${incident.root_cause} ${incident.ai_action} ${incident.risk_level}`
							.toLowerCase()
							.includes(searchTerm.trim().toLowerCase());

			return statusMatches && severityMatches && timeMatches && searchMatches;
		});
	}, [incidents, searchTerm, severityFilter, statusFilter, timeRange]);

	const openCount = incidents.filter((incident) => String(incident.status).toLowerCase() === "open").length;
	const criticalCount = incidents.filter((incident) => String(incident.severity).toLowerCase() === "critical").length;

	return (
		<div className="space-y-4">
			<div className="panel-soft rounded-2xl p-5">
				<div className="flex flex-wrap items-end justify-between gap-2">
					<h3 className="text-2xl font-bold text-text">Incidents</h3>
					<p className="text-sm text-slate-400">
						Auto-refresh every 3 seconds
						{lastUpdated ? ` • ${lastUpdated.toLocaleTimeString()}` : ""}
					</p>
				</div>
				<div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
					<span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-slate-300">
						Total: {incidents.length}
					</span>
					<span className="rounded-full border border-warning/45 bg-warning/10 px-3 py-1 text-warning">
						Open: {openCount}
					</span>
					<span className="rounded-full border border-danger/45 bg-danger/10 px-3 py-1 text-danger">
						Critical: {criticalCount}
					</span>
				</div>
				<div className="mt-4 grid gap-3 md:grid-cols-4">
					<input
						type="text"
						placeholder="Search cause/action/risk"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary"
					/>
					<select
						value={statusFilter}
						onChange={(event) => setStatusFilter(event.target.value as "all" | "open" | "resolved")}
						className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
					>
						<option value="all">All status</option>
						<option value="open">Open</option>
						<option value="resolved">Resolved</option>
					</select>
					<select
						value={severityFilter}
						onChange={(event) =>
							setSeverityFilter(event.target.value as "all" | "critical" | "warning" | "normal")
						}
						className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
					>
						<option value="all">All severity</option>
						<option value="critical">Critical</option>
						<option value="warning">Warning</option>
						<option value="normal">Normal</option>
					</select>
					<select
						value={timeRange}
						onChange={(event) => setTimeRange(event.target.value as "24h" | "7d" | "30d" | "all")}
						className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
					>
						<option value="24h">Last 24 hours</option>
						<option value="7d">Last 7 days</option>
						<option value="30d">Last 30 days</option>
						<option value="all">All time</option>
					</select>
				</div>
			</div>

			{error ? (
				<p className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm font-semibold text-danger">{error}</p>
			) : null}

			{isLoading ? (
				<div className="space-y-3">
					<LoadingSkeleton className="h-28" />
					<LoadingSkeleton className="h-28" />
					<LoadingSkeleton className="h-28" />
				</div>
			) : (
				<div className="panel-soft rounded-2xl p-5">
					<IncidentTable incidents={filteredIncidents} />
				</div>
			)}
		</div>
	);
}
