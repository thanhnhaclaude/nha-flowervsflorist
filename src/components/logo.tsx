export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="-32 -32 64 64" className={className} aria-hidden="true">
      <rect x="-32" y="-32" width="64" height="64" rx="16" fill="#7a1f5c" />
      <g transform="translate(0 -1)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} rx="7.5" ry="12" fill="#f43f5e" transform={`rotate(${r}) translate(0 -11)`} />
        ))}
        <circle r="6.5" fill="#f5a524" />
      </g>
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2 sm:gap-2.5">
      <LogoMark className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
      <span className="leading-none">
        <span className={`block font-display text-[1.15rem] font-bold tracking-tight sm:text-[1.35rem] ${light ? "text-white" : "text-plum-700"}`}>
          Flower<span className={`italic ${light ? "text-gold" : "text-rose-600"}`}>Vs</span>Florist
        </span>
        <span className={`mt-1 hidden text-[0.625rem] font-extrabold uppercase tracking-[0.22em] sm:block ${light ? "text-plum-100" : "text-muted"}`}>
          Next-day flower delivery
        </span>
      </span>
    </span>
  );
}
