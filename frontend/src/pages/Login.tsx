import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthLogo from "../components/AuthLogo";
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
			navigate("/overview");
		} catch (requestError: unknown) {
			setError(
				requestError instanceof Error ? requestError.message : "Invalid login details. Check email or password.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center px-5">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35 }}
				className="w-full max-w-md rounded-2xl border border-slate-800 bg-card/95 p-8 shadow-panel"
			>
				<AuthLogo subtitle="Secure enterprise observability access" />
				<h1 className="text-4xl font-bold tracking-tight text-text">AI Multi-Cloud Console</h1>
				<p className="mt-2 text-sm text-slate-400">Sign in to monitor incidents and live orchestration metrics.</p>

				<form onSubmit={onSubmit} className="mt-8 space-y-4">
					<label className="block text-sm font-semibold text-slate-300">
						Email
						<input
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
							className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/75 px-4 py-3 text-text outline-none transition focus:border-primary"
						/>
					</label>

					<label className="block text-sm font-semibold text-slate-300">
						Password
						<input
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							required
							className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/75 px-4 py-3 text-text outline-none transition focus:border-primary"
						/>
					</label>

					{error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
					>
						{isLoading ? "Signing in..." : "Sign In"}
					</button>

					<p className="text-center text-sm text-slate-400">
						Need an account?{" "}
						<Link to="/register" className="font-semibold text-accent hover:text-cyan-300">
							Create tenant
						</Link>
					</p>
				</form>
			</motion.div>
		</div>
	);
}
