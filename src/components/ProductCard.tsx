import { ImageOff } from "lucide-react";
import type { Product } from "@/lib/products";
import { useSignedImage } from "@/lib/products";
import { formatPrice, whatsappProductLink } from "@/lib/brand";
import { WhatsAppIcon } from "./Header";

export function ProductCard({ product }: { product: Product }) {
  const { data: imgUrl } = useSignedImage(product.image_url);

  return (
    <article className="group flex flex-col bg-[var(--champagne-light)] text-[var(--card-foreground)] rounded-md overflow-hidden border border-[var(--champagne)]/30 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.5)] hover:shadow-[0_14px_40px_-18px_rgba(0,0,0,0.55)] transition-shadow">
      <div className="aspect-[4/5] bg-[var(--wine-soft)]/15 relative overflow-hidden">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-[var(--wine)]/40">
            <ImageOff className="h-10 w-10" />
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.22em] bg-[var(--wine-deep)] text-[var(--champagne)] px-2.5 py-1 rounded-full border border-[var(--champagne)]/40">
            Destaque
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--wine)]/60">
          {product.category}
        </span>
        <h3 className="font-serif text-xl text-[var(--wine-deep)] leading-tight">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-[var(--wine)]/75 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-auto pt-3 flex items-end justify-between gap-3">
          <span className="font-serif text-2xl text-[var(--wine-deep)]">
            {formatPrice(Number(product.price))}
          </span>
        </div>
        <a
          href={whatsappProductLink(product.name, Number(product.price))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[var(--wine-deep)] text-[var(--champagne)] border border-[var(--wine-deep)] hover:bg-[var(--wine)] transition-colors text-[11px] uppercase tracking-[0.2em]"
        >
          <WhatsAppIcon className="h-4 w-4" /> Comprar pelo WhatsApp
        </a>
      </div>
    </article>
  );
}
