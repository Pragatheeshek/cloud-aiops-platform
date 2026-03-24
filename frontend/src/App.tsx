import { Suspense, lazy, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "./components/AppShell";
import { getToken } from "./store/authStore";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Overview = lazy(() => import("./pages/Overview"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Incidents = lazy(() => import("./pages/Incidents"));
const ActiveIncidents = lazy(() => import("./pages/ActiveIncidents"));
const ResolvedIncidents = lazy(() => import("./pages/ResolvedIncidents"));
const AIDecisions = lazy(() => import("./pages/AIDecisions"));
const Metrics = lazy(() => import("./pages/Metrics"));
const MetricDetail = lazy(() => import("./pages/MetricDetail"));
const SLAMonitor = lazy(() => import("./pages/SLAMonitor"));
const IncidentTimeline = lazy(() => import("./pages/IncidentTimeline"));
const SystemHealth = lazy(() => import("./pages/SystemHealth"));
const Settings = lazy(() => import("./pages/Settings"));

function ProtectedRoute({ children }: { children: ReactNode }) {
	if (!getToken()) {
		return <Navigate to="/login" replace />;
	}

	return children;
}

function RouteLoader() {
	return (
		<div className="grid min-h-[40vh] place-items-center">
			<div className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
				Loading page...
			</div>
		</div>
	);
}

export default function App() {
	return (
		<Suspense fallback={<RouteLoader />}>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<AppShell />
						</ProtectedRoute>
					}
				>
					<Route index element={<Navigate to="/overview" replace />} />
					<Route path="overview" element={<Overview />} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="incidents" element={<Incidents />} />
					<Route path="incidents/active" element={<ActiveIncidents />} />
					<Route path="incidents/resolved" element={<ResolvedIncidents />} />
					<Route path="ai-decisions" element={<AIDecisions />} />
					<Route path="metrics" element={<Metrics />} />
					<Route path="metrics/:metricType" element={<MetricDetail />} />
					<Route path="sla-monitor" element={<SLAMonitor />} />
					<Route path="timeline" element={<IncidentTimeline />} />
					<Route path="system-health" element={<SystemHealth />} />
					<Route path="settings" element={<Settings />} />
				</Route>
				<Route path="*" element={<Navigate to={getToken() ? "/overview" : "/login"} replace />} />
			</Routes>
		</Suspense>
	);
}
