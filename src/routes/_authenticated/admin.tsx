import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Pencil, Trash2, Plus, LogOut, Star, ImageOff, X } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, useSignedImage, type Product } from "@/lib/products";
import { CATEGORIES, formatPrice, type Category } from "@/lib/brand";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel — Bella Guimarães" }] }),
  component: AdminPage,
});

const productSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(120),
  category: z.enum(CATEGORIES),
  description: z.string().trim().max(500).default(""),
  price: z.number().min(0, "Preço inválido"),
  featured: z.boolean(),
});

type FormState = {
  id?: string;
  name: string;
  category: Category;
  description: string;
  price: string;
  featured: boolean;
  imagePath: string | null;
  imageFile: File | null;
};

const emptyForm: FormState = {
  name: "",
  category: "Bolsas",
  description: "",
  price: "",
  featured: false,
  imagePath: null,
  imageFile: null,
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useProducts();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  function startCreate() {
    setForm(emptyForm);
    setError(null);
    setOpen(true);
  }

  function startEdit(p: Product) {
    setForm({
      id: p.id,
      name: p.name,
      category: p.category as Category,
      description: p.description,
      price: String(p.price),
      featured: p.featured,
      imagePath: p.image_url,
      imageFile: null,
    });
    setError(null);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = productSchema.safeParse({
      name: form.name,
      category: form.category,
      description: form.description,
      price: Number(form.price.replace(",", ".")),
      featured: form.featured,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }

    setSaving(true);
    try {
      let imagePath = form.imagePath;
      if (form.imageFile) {
        const ext = form.imageFile.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("product-images")
          .upload(path, form.imageFile, { upsert: false });
        if (upErr) throw upErr;
        imagePath = path;
      }

      if (form.id) {
        const { error } = await supabase
          .from("products")
          .update({
            ...parsed.data,
            image_url: imagePath,
          })
          .eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .insert({ ...parsed.data, image_url: imagePath });
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: Product) {
    if (!confirm(`Remover "${p.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      alert(error.message);
      return;
    }
    if (p.image_url && !p.image_url.startsWith("http")) {
      await supabase.storage.from("product-images").remove([p.image_url]);
    }
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function toggleFeatured(p: Product) {
    const { error } = await supabase
      .from("products")
      .update({ featured: !p.featured })
      .eq("id", p.id);
    if (error) {
      alert(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-20">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 mb-8">
          <div className="min-w-0">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[var(--champagne)]/70">Painel</span>
            <h1 className="font-serif text-4xl text-[var(--champagne)] mt-2 truncate">
              Gerenciar produtos
            </h1>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={startCreate}
              className="btn-gold btn-gold-hover px-5 py-2.5 rounded-full inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Novo produto
            </button>
            <button
              onClick={signOut}
              className="btn-outline-gold px-4 py-2.5 rounded-full inline-flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>

        <div className="bg-[var(--wine)] border border-[var(--champagne)]/25 rounded-md overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-[var(--champagne)]/70">Carregando...</div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center text-[var(--champagne)]/70">
              Nenhum produto cadastrado.{" "}
              <button onClick={startCreate} className="underline">
                Adicionar o primeiro
              </button>
              .
            </div>
          ) : (
            <ul className="divide-y divide-[var(--champagne)]/15">
              {products.map((p) => (
                <AdminRow
                  key={p.id}
                  product={p}
                  onEdit={() => startEdit(p)}
                  onRemove={() => remove(p)}
                  onToggleFeatured={() => toggleFeatured(p)}
                />
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-[var(--champagne)]/60 mt-4">
          Dica: produtos marcados como destaque aparecem na página inicial.{" "}
          <Link to="/" className="underline">Ver site</Link>
        </p>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => !saving && setOpen(false)}
        >
          <form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--wine-deep)] border border-[var(--champagne)]/30 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--champagne)]/20">
              <h2 className="font-serif text-2xl text-[var(--champagne)]">
                {form.id ? "Editar produto" : "Novo produto"}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[var(--champagne)]/70 hover:text-[var(--champagne)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Field label="Nome">
                <input
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="input"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Categoria">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value as Category }))
                    }
                    className="input"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Preço (R$)">
                  <input
                    required
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="199,90"
                    className="input"
                  />
                </Field>
              </div>

              <Field label="Descrição">
                <textarea
                  rows={3}
                  maxLength={500}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="input resize-none"
                />
              </Field>

              <Field label="Imagem">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageFile: e.target.files?.[0] ?? null }))
                  }
                  className="text-sm text-[var(--champagne)]/80 file:mr-3 file:rounded-full file:border file:border-[var(--champagne)]/40 file:bg-transparent file:text-[var(--champagne)] file:px-3 file:py-1.5"
                />
                {form.imagePath && !form.imageFile && (
                  <p className="text-xs text-[var(--champagne)]/60 mt-1">
                    Imagem atual mantida. Envie outra para substituir.
                  </p>
                )}
              </Field>

              <label className="flex items-center gap-2 text-sm text-[var(--champagne)]/90">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="h-4 w-4 accent-[var(--champagne)]"
                />
                Marcar como destaque na página inicial
              </label>

              {error && (
                <p className="text-sm text-[var(--destructive)] bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-[var(--champagne)]/20">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-outline-gold px-5 py-2 rounded-full"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-gold btn-gold-hover px-6 py-2 rounded-full disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        .input {
          width: 100%;
          background: var(--wine);
          border: 1px solid color-mix(in oklab, var(--champagne) 30%, transparent);
          border-radius: 6px;
          padding: 0.55rem 0.75rem;
          color: var(--champagne);
          outline: none;
          font-size: 0.9rem;
        }
        .input:focus { border-color: var(--champagne); }
      `}</style>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[var(--champagne)]/70 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function AdminRow({
  product,
  onEdit,
  onRemove,
  onToggleFeatured,
}: {
  product: Product;
  onEdit: () => void;
  onRemove: () => void;
  onToggleFeatured: () => void;
}) {
  const { data: imgUrl } = useSignedImage(product.image_url);
  return (
    <li className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 p-4">
      <div className="h-16 w-16 rounded-md overflow-hidden bg-[var(--wine-deep)] border border-[var(--champagne)]/20 grid place-items-center shrink-0">
        {imgUrl ? (
          <img src={imgUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <ImageOff className="h-5 w-5 text-[var(--champagne)]/40" />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg text-[var(--champagne)] truncate">
            {product.name}
          </span>
          {product.featured && (
            <Star className="h-3.5 w-3.5 text-[var(--gold)] fill-[var(--gold)] shrink-0" />
          )}
        </div>
        <div className="text-xs text-[var(--champagne)]/70 mt-0.5">
          {product.category} · {formatPrice(Number(product.price))}
        </div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={onToggleFeatured}
          title={product.featured ? "Remover destaque" : "Marcar destaque"}
          className="p-2 rounded-md text-[var(--champagne)]/80 hover:bg-[var(--champagne)]/10"
        >
          <Star className={`h-4 w-4 ${product.featured ? "fill-[var(--gold)] text-[var(--gold)]" : ""}`} />
        </button>
        <button onClick={onEdit} className="p-2 rounded-md text-[var(--champagne)]/80 hover:bg-[var(--champagne)]/10">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={onRemove} className="p-2 rounded-md text-[var(--destructive)] hover:bg-[var(--destructive)]/10">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
