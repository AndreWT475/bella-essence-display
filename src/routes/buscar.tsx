import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/products";

const searchSchema = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/buscar")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Buscar — Bella Guimarães" },
      { name: "description", content: "Busque peças na vitrine Bella Guimarães." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data: products = [], isLoading } = useProducts();
  const term = q.trim().toLowerCase();
  const results = term
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term),
      )
    : products;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-10">
        <span className="text-[11px] tracking-[0.35em] uppercase text-[var(--champagne)]/70">Busca</span>
        <h1 className="font-serif text-4xl text-[var(--champagne)] mt-2">
          {term ? `Resultados para "${q}"` : "Todas as peças"}
        </h1>
        <p className="mt-2 text-sm text-[var(--champagne)]/70">{results.length} peça(s) encontrada(s)</p>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-20">
        {isLoading ? (
          <p className="text-[var(--champagne)]/70 py-20 text-center">Carregando...</p>
        ) : results.length === 0 ? (
          <p className="text-[var(--champagne)]/70 py-20 text-center">Nenhuma peça encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
