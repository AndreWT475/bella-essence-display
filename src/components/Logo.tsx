import { Link } from "@tanstack/react-router";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-20 w-20" : size === "sm" ? "h-10 w-10" : "h-14 w-14";
  const text = size === "lg" ? "text-4xl" : size === "sm" ? "text-lg" : "text-2xl";
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <span
        className={`${dim} grid place-items-center rounded-full border border-[var(--champagne)] text-[var(--champagne)] font-serif italic ${text} shrink-0 transition-transform group-hover:scale-105`}
        style={{
          background:
            "radial-gradient(circle, oklch(0.28 0.09 17) 0%, oklch(0.22 0.07 15) 100%)",
        }}
        aria-label="Bella Guimarães"
      >
        BG
      </span>
      {size !== "sm" && (
        <span className="hidden sm:flex flex-col leading-tight">
          <span className="font-serif text-xl md:text-2xl text-[var(--champagne)] tracking-wide">
            Bella Guimarães
          </span>
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[var(--champagne)]/70">
            Essência e beleza
          </span>
        </span>
      )}
    </Link>
  );
}
