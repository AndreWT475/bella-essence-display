import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/products";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bella Guimarães — Essência e beleza" },
      {
        name: "description",
        content:
          "Boutique feminina Bella Guimarães. Peças exclusivas em bolsas, blusas, vestidos e acessórios. Compre direto pelo WhatsApp.",
      },
      { property: "og:title", content: "Bella Guimarães — Essência e beleza" },
      {
        property: "og:description",
        content: "Exclusividade e elegância para mulheres que valorizam sua essência.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const fallback = featured.length ? featured : products.slice(0, 8);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-36 text-center">
          <span className="inline-block text-[11px] tracking-[0.4em] uppercase text-[var(--champagne)]/80 border border-[var(--champagne)]/30 rounded-full px-4 py-1.5">
            Nova Coleção
          </span>
          <h1 className="mt-8 font-serif text-5xl md:text-7xl text-[var(--champagne)] leading-[1.05]">
            Exclusividade
            <br />
            <em className="not-italic text-[var(--gold)]">e Elegância</em>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-base md:text-lg text-[var(--champagne)]/80 leading-relaxed">
            Peças únicas para mulheres que valorizam sua essência. Selecionadas com olhar refinado e entregues com afeto.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/categoria/$slug"
              params={{ slug: "bolsas" }}
              className="btn-gold btn-gold-hover px-7 py-3 rounded-full inline-flex items-center gap-2"
            >
              Ver produtos <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contato"
              className="btn-outline-gold px-7 py-3 rounded-full inline-flex items-center gap-2"
            >
              Falar conosco
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Bolsas", slug: "bolsas" },
            { label: "Blusas", slug: "blusas" },
            { label: "Vestidos", slug: "vestidos" },
            { label: "Acessórios", slug: "acessorios" },
          ].map((c) => (
            <Link
              key={c.slug}
              to="/categoria/$slug"
              params={{ slug: c.slug }}
              className="group relative aspect-[3/4] md:aspect-[4/5] rounded-md border border-[var(--champagne)]/25 overflow-hidden flex items-end p-5 bg-[var(--wine)] hover:border-[var(--champagne)] transition-colors"
            >
              
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--champagne)]/60">Categoria</span>
                <div className="font-serif text-2xl md:text-3xl text-[var(--champagne)] mt-1">
                  {c.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] tracking-[0.35em] uppercase text-[var(--champagne)]/70">Vitrine</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--champagne)] mt-2">
              Peças em destaque
            </h2>
          </div>
          <Link
            to="/categoria/$slug"
            params={{ slug: "bolsas" }}
            className="hidden sm:inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em] text-[var(--champagne)]/80 hover:text-[var(--champagne)]"
          >
            Ver todos <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {fallback.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--champagne)]/25 rounded-md">
            <p className="text-[var(--champagne)]/70">
              Em breve, novas peças. Acompanhe nosso Instagram!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fallback.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
