import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "./Logo";
import { whatsappGeneralLink } from "@/lib/brand";

const navItems = [
  { label: "Home", to: "/" as const },
  { label: "Bolsas", to: "/categoria/$slug" as const, slug: "bolsas" },
  { label: "Blusas", to: "/categoria/$slug" as const, slug: "blusas" },
  { label: "Vestidos", to: "/categoria/$slug" as const, slug: "vestidos" },
  { label: "Acessórios", to: "/categoria/$slug" as const, slug: "acessorios" },
  { label: "Contato", to: "/contato" as const },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate({ to: "/buscar", search: { q } });
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--wine-deep)]/85 border-b border-[var(--champagne)]/15">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 md:py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <Logo />

        <nav className="hidden lg:flex items-center justify-center gap-7">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              {...(item.slug ? { params: { slug: item.slug } } : {})}
              className="text-[12px] uppercase tracking-[0.22em] text-[var(--champagne)]/85 hover:text-[var(--champagne)] transition-colors"
              activeProps={{ className: "text-[var(--champagne)]" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3 justify-end">
          <form onSubmit={onSearch} className="hidden md:flex items-center gap-2 border border-[var(--champagne)]/30 rounded-full px-3 py-1.5 focus-within:border-[var(--champagne)] transition-colors">
            <Search className="h-4 w-4 text-[var(--champagne)]/70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar peça..."
              className="bg-transparent text-sm text-[var(--champagne)] placeholder:text-[var(--champagne)]/40 outline-none w-32 lg:w-48"
              maxLength={80}
            />
          </form>
          <a
            href={whatsappGeneralLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full btn-gold btn-gold-hover"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>
          <button
            className="lg:hidden text-[var(--champagne)] p-2"
            onClick={() => setOpen((s) => !s)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[var(--champagne)]/15 bg-[var(--wine-deep)]">
          <div className="px-4 py-4 flex flex-col gap-3">
            <form onSubmit={onSearch} className="flex items-center gap-2 border border-[var(--champagne)]/30 rounded-full px-3 py-2">
              <Search className="h-4 w-4 text-[var(--champagne)]/70" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar peça..."
                className="bg-transparent text-sm text-[var(--champagne)] placeholder:text-[var(--champagne)]/40 outline-none flex-1"
                maxLength={80}
              />
            </form>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                {...(item.slug ? { params: { slug: item.slug } } : {})}
                className="text-sm uppercase tracking-[0.2em] text-[var(--champagne)]/90 py-2 border-b border-[var(--champagne)]/10"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.01 0C5.4 0 .06 5.34.06 11.95c0 2.11.55 4.16 1.6 5.97L0 24l6.27-1.64a11.94 11.94 0 0 0 5.74 1.46h.01c6.6 0 11.95-5.34 11.95-11.95 0-3.19-1.24-6.19-3.45-8.39ZM12.02 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.72.97 1-3.62-.24-.37a9.83 9.83 0 0 1-1.51-5.24c0-5.45 4.44-9.88 9.88-9.88 2.64 0 5.12 1.03 6.99 2.9a9.81 9.81 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.9 9.88Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.19-.24-.57-.49-.5-.66-.5l-.57-.01c-.2 0-.5.07-.77.37-.27.3-1.02 1-1.02 2.44s1.05 2.83 1.2 3.03c.15.2 2.07 3.16 5.01 4.43.7.3 1.25.49 1.67.62.7.22 1.34.19 1.85.12.56-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}
