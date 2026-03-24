import { type FormEvent, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

import AuthLogo from "../components/AuthLogo";
import { register } from "../services/auth";

function getRegisterErrorMessage(error: unknown): string {
	if (!isAxiosError(error)) {
		return "Unable to create account due to an unexpected error.";
	}

	if (!error.response) {
		return "Backend is not reachable. Start the FastAPI server on http://127.0.0.1:8000.";
	}

	if (error.response.status === 409) {
		return "Unable to create account. Email is already registered.";
	}

	if (error.response.status === 422) {
		return "Please check the input values and try again.";
	}

	const detail = error.response.data?.detail;
	if (typeof detail === "string" && detail.trim()) {
		return detail;
	}

	return `Registration failed with status ${error.response.status}.`;
}

export default function Register() {
	const navigate = useNavigate();
	const [companyName, setCompanyName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		setError("");
		setSuccessMessage("");

		try {
			await register(companyName, email, password);
			setSuccessMessage("Account created. Redirecting to login...");
			setTimeout(() => {
				navigate("/login");
			}, 900);
		} catch (error: unknown) {
			setError(getRegisterErrorMessage(error));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<div className="w-full max-w-md rounded-2xl border border-slate-700 bg-card/90 p-8 shadow-panel backdrop-blur">
				<AuthLogo subtitle="Create your tenant workspace" />
				<h1 className="mb-2 text-3xl font-semibold">Create Tenant Account</h1>
				<p className="mb-6 text-sm text-slate-300">Register your cloud provider workspace credentials.</p>

				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="mb-1 block text-sm text-slate-300">Company Name</label>
						<input
							type="text"
							value={companyName}
							onChange={(e) => setCompanyName(e.target.value)}
							required
							minLength={2}
							className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-accent"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm text-slate-300">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-accent"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm text-slate-300">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
							className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-accent"
						/>
					</div>

					{error ? <p className="text-sm text-critical">{error}</p> : null}
					{successMessage ? <p className="text-sm text-success">{successMessage}</p> : null}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-slate-100 transition hover:opacity-90 disabled:opacity-60"
					>
						{isLoading ? "Creating account..." : "Create Account"}
					</button>

					<p className="text-center text-sm text-slate-400">
						Already registered?{" "}
						<Link to="/login" className="font-medium text-accent hover:text-cyan-300">
							Go to Login
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
