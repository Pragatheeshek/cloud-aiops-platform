import axios from "axios";

import { getToken } from "../store/authStore";
import type { DashboardStats, Incident, LoginResponse } from "../types";

const api = axios.create({
	baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
	const formData = new URLSearchParams();
	formData.append("username", email);
	formData.append("password", password);

	const response = await api.post<LoginResponse>("/auth/login", formData, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});

	return response.data;
}

type RegisterPayload = {
	company_name: string;
	email: string;
	password: string;
};

export async function registerRequest(payload: RegisterPayload): Promise<void> {
	await api.post("/auth/register", payload, {
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
	const response = await api.get<DashboardStats>("/dashboard");
	return response.data;
}

export async function fetchIncidents(): Promise<Incident[]> {
	const response = await api.get<Incident[]>("/incidents");
	return response.data;
}

export default api;
