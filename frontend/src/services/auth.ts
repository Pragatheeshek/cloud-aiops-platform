import { loginRequest, registerRequest } from "./api";

export async function login(email: string, password: string): Promise<string> {
	const data = await loginRequest(email, password);
	return data.access_token;
}

export async function register(companyName: string, email: string, password: string): Promise<void> {
	await registerRequest({
		company_name: companyName,
		email,
		password,
	});
}
