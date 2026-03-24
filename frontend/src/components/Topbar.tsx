type TopbarProps = {
	title: string;
	lastUpdated?: Date | null;
};

export default function Topbar({ title, lastUpdated }: TopbarProps) {
	return (
		<header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800/70 bg-bg/95 px-8 py-5 backdrop-blur-md">
			<div>
				<h2 className="text-3xl font-bold tracking-tight text-text">{title}</h2>
				<p className="mt-1 text-xs text-slate-400">
					Real-time telemetry {lastUpdated ? `• ${lastUpdated.toLocaleTimeString()}` : "• waiting for data"}
				</p>
			</div>
			<div className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-right">
				<p className="text-xs uppercase tracking-[0.18em] text-slate-500">User</p>
				<p className="text-sm font-semibold text-text">Cloud Admin</p>
			</div>
		</header>
	);
}
