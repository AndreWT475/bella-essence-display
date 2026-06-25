import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, whatsappGeneralLink } from "@/lib/brand";
import { WhatsAppIcon } from "./Header";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--champagne)]/15 bg-[var(--wine-deep)]">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-3 text-[var(--champagne)]/85">
        <div>
          <div className="font-serif text-2xl text-[var(--champagne)]">Bella Guimarães</div>
          <p className="mt-2 text-sm italic text-[var(--champagne)]/70">Essência e beleza</p>
          <p className="mt-4 text-sm leading-relaxed">
            Inspirando essência, beleza e elegância em cada peça selecionada com carinho.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg text-[var(--champagne)] mb-3">Navegação</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[var(--champagne)]">Home</Link></li>
            <li><Link to="/categoria/$slug" params={{ slug: "bolsas" }} className="hover:text-[var(--champagne)]">Bolsas</Link></li>
            <li><Link to="/categoria/$slug" params={{ slug: "blusas" }} className="hover:text-[var(--champagne)]">Blusas</Link></li>
            <li><Link to="/categoria/$slug" params={{ slug: "vestidos" }} className="hover:text-[var(--champagne)]">Vestidos</Link></li>
            <li><Link to="/categoria/$slug" params={{ slug: "acessorios" }} className="hover:text-[var(--champagne)]">Acessórios</Link></li>
            <li><Link to="/contato" className="hover:text-[var(--champagne)]">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-[var(--champagne)] mb-3">Contato</h4>
          <div className="flex flex-col gap-3 text-sm">
            <a href={whatsappGeneralLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--champagne)]">
              <WhatsAppIcon className="h-4 w-4" /> Falar pelo WhatsApp
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--champagne)]">
              <Instagram className="h-4 w-4" /> @{INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
      </div>
      <div className="gold-divider mx-8" />
      <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-[var(--champagne)]/60">
        © 2026 Bella Guimarães. Todos os direitos reservados. · Inspirando essência, beleza e elegância.
      </div>
    </footer>
  );
}
