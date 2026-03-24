import axios from "axios";

import { clearToken, getToken } from "../store/authStore";
import type { DashboardStats, Incident, LoginResponse, MetricPoint } from "../types";

export type HealthStatus = {
	status: string;
};

export type ServiceHealthStatus = {
	name: string;
	status: "healthy" | "degraded" | "critical";
	detail: string;
};

const api = axios.create({
	baseURL: "http://localhost:8000",
	timeout: 10000,
});

api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error: unknown) => {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			clearToken();
			if (typeof window !== "undefined") {
				const currentPath = window.location.pathname;
				if (currentPath !== "/login" && currentPath !== "/register") {
					window.location.href = "/login";
				}
			}
		}

		return Promise.reject(error);
	},
);

function normalizeIncident(raw: Record<string, unknown>): Incident {
	const status = String(raw.status ?? "open").toLowerCase();
	const severity = String(raw.severity ?? "warning").toLowerCase();

	return {
		id: String(raw.id ?? raw._id ?? crypto.randomUUID()),
		tenant_id: String(raw.tenant_id ?? ""),
		metric_id: raw.metric_id ? String(raw.metric_id) : undefined,
		alerts: Array.isArray(raw.alerts) ? raw.alerts.map((value) => String(value)) : [],
		root_cause: String(raw.root_cause ?? "Unknown"),
		severity: severity === "critical" ? "critical" : severity === "normal" ? "normal" : "warning",
		sla_risk_score: Number(raw.sla_risk_score ?? 0),
		risk_level:
			raw.risk_level === "HIGH" || raw.risk_level === "MEDIUM" || raw.risk_level === "LOW"
				? raw.risk_level
				: "LOW",
		ai_action: String(raw.ai_action ?? "monitor"),
		status: status === "resolved" ? "resolved" : "open",
		created_at: String(raw.created_at ?? new Date().toISOString()),
		resolved_at: raw.resolved_at ? String(raw.resolved_at) : null,
	};
}

function withApiMessage(error: unknown, fallback: string): Error {
	if (axios.isAxiosError(error)) {
		const detail = error.response?.data?.detail;
		if (typeof detail === "string" && detail.trim()) {
			return new Error(detail);
		}
		if (error.response) {
			return new Error(`${fallback} (HTTP ${error.response.status})`);
		}
		return new Error(`${fallback} (backend unreachable)`);
	}
	return new Error(fallback);
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
	const formData = new URLSearchParams();
	formData.append("username", email);
	formData.append("password", password);

	try {
		const response = await api.post<LoginResponse>("/auth/login", formData, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return response.data;
	} catch (error: unknown) {
		throw withApiMessage(error, "Login failed");
	}
}

type RegisterPayload = {
	company_name: string;
	email: string;
	password: string;
};

export async function registerRequest(payload: RegisterPayload): Promise<void> {
	try {
		await api.post("/auth/register", payload, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error: unknown) {
		throw withApiMessage(error, "Registration failed");
	}
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
	try {
		const response = await api.get<DashboardStats>("/dashboard");
		return response.data;
	} catch (error: unknown) {
		throw withApiMessage(error, "Failed to fetch dashboard stats");
	}
}

export async function fetchIncidents(): Promise<Incident[]> {
	try {
		const response = await api.get<Record<string, unknown>[]>("/incidents");
		return response.data.map((incident) => normalizeIncident(incident));
	} catch (error: unknown) {
		throw withApiMessage(error, "Failed to fetch incidents");
	}
}

export async function fetchLatestMetric(): Promise<MetricPoint> {
	try {
		const response = await api.get<MetricPoint>("/metrics/latest");
		return response.data;
	} catch (latestError: unknown) {
		if (axios.isAxiosError(latestError)) {
			const status = latestError.response?.status;
			// Only try legacy fallback endpoint when /metrics/latest is genuinely missing.
			if (status !== 404) {
				throw withApiMessage(latestError, "Failed to fetch metrics");
			}
		}

		try {
			const response = await api.get<MetricPoint[] | MetricPoint>("/metrics");
			if (Array.isArray(response.data)) {
				if (!response.data.length) {
					throw new Error("No metrics found yet");
				}
				return response.data[0];
			}
			return response.data;
		} catch {
			throw withApiMessage(latestError, "Failed to fetch metrics");
		}
	}
}

export async function fetchHealth(): Promise<HealthStatus> {
	try {
		const response = await api.get<HealthStatus>("/health");
		return response.data;
	} catch (error: unknown) {
		throw withApiMessage(error, "Failed to fetch backend health");
	}
}

export async function fetchServiceHealth(): Promise<ServiceHealthStatus[]> {
	try {
		const response = await api.get<ServiceHealthStatus[]>("/health/services");
		return response.data;
	} catch (error: unknown) {
		throw withApiMessage(error, "Failed to fetch service health");
	}
}

export default api;
