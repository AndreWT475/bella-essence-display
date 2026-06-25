import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/products";
import { CATEGORY_SLUGS } from "@/lib/brand";
import { Search } from "lucide-react";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    if (!CATEGORY_SLUGS[params.slug]) throw notFound();
    return { category: CATEGORY_SLUGS[params.slug] };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category ?? "Categoria"} — Bella Guimarães` },
      {
        name: "description",
        content: `Vitrine de ${loaderData?.category?.toLowerCase() ?? "produtos"} da Bella Guimarães. Compre direto pelo WhatsApp.`,
      },
    ],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl text-[var(--champagne)]">Categoria não encontrada</h1>
        <Link to="/" className="mt-6 inline-block btn-outline-gold px-6 py-2 rounded-full">
          Voltar à home
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center text-[var(--champagne)]">
        <p>Ocorreu um erro: {error.message}</p>
      </div>
    </SiteLayout>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { data: products = [], isLoading } = useProducts();
  const [q, setQ] = useState("");

  const filtered = products
    .filter((p) => p.category === category)
    .filter((p) =>
      q ? p.name.toLowerCase().includes(q.toLowerCase()) : true,
    );

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-6">
        <span className="text-[11px] tracking-[0.35em] uppercase text-[var(--champagne)]/70">Vitrine</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--champagne)] mt-2">{category}</h1>
        <div className="gold-divider mt-6 max-w-[160px]" />

        <div className="mt-8 flex items-center gap-2 border border-[var(--champagne)]/30 rounded-full px-4 py-2 max-w-md focus-within:border-[var(--champagne)]">
          <Search className="h-4 w-4 text-[var(--champagne)]/70" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Buscar em ${category.toLowerCase()}...`}
            className="bg-transparent text-sm text-[var(--champagne)] placeholder:text-[var(--champagne)]/40 outline-none flex-1"
            maxLength={80}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        {isLoading ? (
          <p className="text-[var(--champagne)]/70 py-20 text-center">Carregando...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--champagne)]/25 rounded-md">
            <p className="text-[var(--champagne)]/70">Nenhuma peça encontrada nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
