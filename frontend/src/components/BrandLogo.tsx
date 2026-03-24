type BrandLogoProps = {
  size?: number;
  withWordmark?: boolean;
};

export default function BrandLogo({ size = 44, withWordmark = true }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative rounded-[28px] border-2 border-accent/55 bg-gradient-to-br from-primary/25 via-accent/15 to-primary/5 p-1.5 shadow-panel"
        style={{ width: size, height: size }}
      >
        <div className="grid h-full w-full place-items-center overflow-hidden rounded-[22px] bg-slate-950/55">
          <img
            src="/logo.png"
            alt="Cloud iOS logo"
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
        <span className="pointer-events-none absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border border-accent/70 bg-accent" />
      </div>

      {withWordmark ? (
        <div>
          <p className="text-xl font-bold tracking-tight text-text">Cloud iOS</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Multi-Cloud AIOps</p>
        </div>
      ) : null}
    </div>
  );
}
