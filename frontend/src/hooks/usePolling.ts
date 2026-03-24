import { useEffect, useRef, useState } from "react";

type UsePollingOptions = {
	enabled?: boolean;
	immediate?: boolean;
};

export function usePolling<T>(
	fetcher: () => Promise<T>,
	intervalMs: number,
	options: UsePollingOptions = {}
) {
	const { enabled = true, immediate = true } = options;
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(Boolean(immediate));
	const [error, setError] = useState<string>("");
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const inFlightRef = useRef(false);

	useEffect(() => {
		if (!enabled) return;

		let mounted = true;
		let timerId: ReturnType<typeof setInterval> | null = null;

		const run = async () => {
			if (inFlightRef.current) return;
			inFlightRef.current = true;
			try {
				const response = await fetcher();
				if (!mounted) return;
				setData(response);
				setError("");
				setLastUpdated(new Date());
			} catch (requestError: unknown) {
				if (!mounted) return;
				setError(requestError instanceof Error ? requestError.message : "Request failed");
			} finally {
				if (mounted) {
					setIsLoading(false);
				}
				inFlightRef.current = false;
			}
		};

		if (immediate) {
			void run();
		}

		timerId = setInterval(() => {
			void run();
		}, intervalMs);

		return () => {
			mounted = false;
			if (timerId) clearInterval(timerId);
		};
	}, [enabled, fetcher, immediate, intervalMs]);

	return {
		data,
		isLoading,
		error,
		lastUpdated,
	};
}
