import BrandLogo from "./BrandLogo";

type AuthLogoProps = {
  subtitle?: string;
};

export default function AuthLogo({ subtitle = "AI-Driven Multi-Cloud Incident Orchestration" }: AuthLogoProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <BrandLogo size={48} withWordmark={false} />
      <div>
        <p className="text-xl font-bold tracking-tight text-text">Cloud iOS</p>
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}
