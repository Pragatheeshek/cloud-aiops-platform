import { type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import Login from "./pages/Login";
import Metrics from "./pages/Metrics";
import Register from "./pages/Register";
import AiActions from "./pages/Settings";
import { getToken } from "./store/authStore";

function ProtectedRoute({ children }: { children: ReactNode }) {
	if (!getToken()) {
		return <Navigate to="/login" replace />;
	}

	return children;
}

export default function App() {
	return (
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
				<Route index element={<Navigate to="/dashboard" replace />} />
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="incidents" element={<Incidents />} />
				<Route path="metrics" element={<Metrics />} />
				<Route path="ai-actions" element={<AiActions />} />
			</Route>
			<Route path="*" element={<Navigate to="/dashboard" replace />} />
		</Routes>
	);
}
