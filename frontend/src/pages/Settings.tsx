import { useCallback, useEffect, useMemo, useState } from "react";

import RemediationCard from "../components/RemediationCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { usePolling } from "../hooks/usePolling";
import { fetchHealth, fetchIncidents } from "../services/api";

const DEFAULT_REFRESH_INTERVAL_MS = 3000;
const STORAGE_KEY = "cloud-orchestrator-settings";

type LocalSettings = {
	refreshIntervalMs: number;
	cpuThreshold: number;
	errorThreshold: number;
	enableEmailAlerts: boolean;
	enableInAppAlerts: boolean;
	compactCards: boolean;
};

const defaultSettings: LocalSettings = {
	refreshIntervalMs: DEFAULT_REFRESH_INTERVAL_MS,
	cpuThreshold: 85,
	errorThreshold: 5,
	enableEmailAlerts: true,
	enableInAppAlerts: true,
	compactCards: false,
};

export default function Settings() {
	const [settings, setSettings] = useState<LocalSettings>(defaultSettings);
	const [isSaved, setIsSaved] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState<"idle" | "checking" | "ok" | "failed">("idle");
	const [connectionMessage, setConnectionMessage] = useState("");

	useEffect(() => {
		try {
			const savedRaw = localStorage.getItem(STORAGE_KEY);
			if (!savedRaw) return;
			const parsed = JSON.parse(savedRaw) as Partial<LocalSettings>;
			setSettings({ ...defaultSettings, ...parsed });
		} catch {
			setSettings(defaultSettings);
		}
	}, []);

	const refreshIntervalMs = useMemo(() => settings.refreshIntervalMs, [settings.refreshIntervalMs]);
	const loadIncidents = useCallback(() => fetchIncidents(), []);
	const { data, isLoading, error, lastUpdated } = usePolling(loadIncidents, refreshIntervalMs);
	const incidents = data ?? [];

	const onSaveSettings = () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
		setIsSaved(true);
		setTimeout(() => setIsSaved(false), 1400);
	};

	const onTestConnection = async () => {
		setConnectionStatus("checking");
		setConnectionMessage("");
		try {
			const health = await fetchHealth();
			setConnectionStatus("ok");
			setConnectionMessage(`Backend reachable (${health.status})`);
		} catch (requestError: unknown) {
			setConnectionStatus("failed");
			setConnectionMessage(requestError instanceof Error ? requestError.message : "Backend test failed");
		}
	};

	return (
		<div className="space-y-6">
			<div className="panel-soft rounded-2xl p-5">
				<h2 className="text-2xl font-bold">Settings & Automation Controls</h2>
				<p className="text-sm text-slate-400">
					Configure runtime behavior, alert policy, and delivery channels.
					{lastUpdated ? ` • Updated ${lastUpdated.toLocaleTimeString()}` : ""}.
				</p>
			</div>

			<section className="grid gap-4 lg:grid-cols-2">
				<div className="panel-soft rounded-2xl p-5">
					<h3 className="text-lg font-bold text-text">Runtime Preferences</h3>
					<div className="mt-4 space-y-4 text-sm">
						<label className="flex flex-col gap-2">
							<span className="text-slate-300">Auto-refresh interval</span>
							<select
								value={settings.refreshIntervalMs}
								onChange={(event) =>
									setSettings((previous) => ({ ...previous, refreshIntervalMs: Number(event.target.value) }))
								}
								className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
							>
								<option value={3000}>Every 3 seconds</option>
								<option value={5000}>Every 5 seconds</option>
								<option value={10000}>Every 10 seconds</option>
							</select>
						</label>
						<label className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
							<span className="text-slate-300">Compact cards in dashboards</span>
							<input
								type="checkbox"
								checked={settings.compactCards}
								onChange={(event) =>
									setSettings((previous) => ({ ...previous, compactCards: event.target.checked }))
								}
								className="h-4 w-4 accent-accent"
							/>
						</label>
					</div>
				</div>

				<div className="panel-soft rounded-2xl p-5">
					<h3 className="text-lg font-bold text-text">Alert Policy</h3>
					<div className="mt-4 space-y-4 text-sm">
						<label className="flex flex-col gap-2">
							<span className="text-slate-300">CPU threshold (%)</span>
							<input
								type="number"
								min={1}
								max={100}
								value={settings.cpuThreshold}
								onChange={(event) =>
									setSettings((previous) => ({ ...previous, cpuThreshold: Number(event.target.value) }))
								}
								className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
							/>
						</label>
						<label className="flex flex-col gap-2">
							<span className="text-slate-300">Error-rate threshold</span>
							<input
								type="number"
								min={0}
								max={100}
								value={settings.errorThreshold}
								onChange={(event) =>
									setSettings((previous) => ({ ...previous, errorThreshold: Number(event.target.value) }))
								}
								className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
							/>
						</label>
					</div>
				</div>
			</section>

			<section className="grid gap-4 lg:grid-cols-2">
				<div className="panel-soft rounded-2xl p-5">
					<h3 className="text-lg font-bold text-text">Notification Channels</h3>
					<div className="mt-4 space-y-3 text-sm">
						<label className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
							<span className="text-slate-300">Email alerts</span>
							<input
								type="checkbox"
								checked={settings.enableEmailAlerts}
								onChange={(event) =>
									setSettings((previous) => ({ ...previous, enableEmailAlerts: event.target.checked }))
								}
								className="h-4 w-4 accent-accent"
							/>
						</label>
						<label className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
							<span className="text-slate-300">In-app banners</span>
							<input
								type="checkbox"
								checked={settings.enableInAppAlerts}
								onChange={(event) =>
									setSettings((previous) => ({ ...previous, enableInAppAlerts: event.target.checked }))
								}
								className="h-4 w-4 accent-accent"
							/>
						</label>
					</div>
				</div>

				<div className="panel-soft rounded-2xl p-5">
					<h3 className="text-lg font-bold text-text">Connectivity Diagnostics</h3>
					<p className="mt-2 text-sm text-slate-400">Run backend health checks without leaving settings.</p>
					<div className="mt-4 flex flex-wrap items-center gap-3">
						<button
							type="button"
							onClick={() => void onTestConnection()}
							className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-accent/60 hover:text-accent"
						>
							{connectionStatus === "checking" ? "Checking..." : "Test Backend Connection"}
						</button>
						<span
							className={`text-sm font-semibold ${
								connectionStatus === "ok"
									? "text-success"
									: connectionStatus === "failed"
										? "text-danger"
										: "text-slate-400"
							}`}
						>
							{connectionMessage || "No test run yet"}
						</span>
					</div>
				</div>
			</section>

			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={onSaveSettings}
					className="rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
				>
					Save Settings
				</button>
				{isSaved ? <span className="text-sm font-semibold text-success">Saved</span> : null}
			</div>

			{error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}

			<section className="panel-soft rounded-2xl p-5">
				<h3 className="mb-3 text-lg font-bold text-text">AI Actions Feed</h3>
				<p className="mb-4 text-sm text-slate-400">Real incidents mapped to autonomous remediation actions.</p>

			{isLoading ? (
				<div className="grid gap-4 md:grid-cols-2">
					<LoadingSkeleton className="h-40" />
					<LoadingSkeleton className="h-40" />
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2">
					{incidents.map((incident) => (
						<RemediationCard key={incident.id} incident={incident} />
					))}
					{incidents.length === 0 ? <p className="text-sm text-slate-400">No AI actions available yet.</p> : null}
				</div>
			)}
			</section>
		</div>
	);
}
