import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../services/auth";
import { setToken } from "../store/authStore";

export default function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const token = await login(email, password);
			setToken(token);
			navigate("/dashboard");
		} catch {
			setError("Invalid login details. Check email or password.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<div className="w-full max-w-md rounded-2xl border border-slate-700 bg-card/90 p-8 shadow-panel backdrop-blur">
				<h1 className="mb-2 text-3xl font-semibold">Welcome Back</h1>
				<p className="mb-6 text-sm text-slate-300">Sign in to the AI cloud command center.</p>

				<form onSubmit={onSubmit} className="space-y-4">
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
							className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-accent"
						/>
					</div>

					{error ? <p className="text-sm text-critical">{error}</p> : null}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-slate-100 transition hover:opacity-90 disabled:opacity-60"
					>
						{isLoading ? "Signing in..." : "Sign In"}
					</button>

					<p className="text-center text-sm text-slate-400">
						New organization?{" "}
						<Link to="/register" className="font-medium text-accent hover:text-cyan-300">
							Create account
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
