const TOKEN_KEY = "cloud_aiops_jwt";

export function setToken(token: string): void {
	localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
	localStorage.removeItem(TOKEN_KEY);
}
