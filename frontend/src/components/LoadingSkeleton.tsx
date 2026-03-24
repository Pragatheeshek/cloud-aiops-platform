type LoadingSkeletonProps = {
	className?: string;
};

export default function LoadingSkeleton({ className = "h-28" }: LoadingSkeletonProps) {
	return <div className={`${className} animate-pulse rounded-2xl border border-slate-800 bg-slate-900/65`} />;
}
