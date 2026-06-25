import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Acesso administrativo — Bella Guimarães" }],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-6 py-20">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size="lg" />
          <h1 className="mt-6 font-serif text-3xl text-[var(--champagne)]">
            Área administrativa
          </h1>
          <p className="mt-2 text-sm text-[var(--champagne)]/70">
            {mode === "signin" ? "Entre para gerenciar os produtos" : "Crie sua conta de administradora"}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-[var(--wine)] border border-[var(--champagne)]/25 rounded-md p-6 space-y-4"
        >
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-[var(--champagne)]/70 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--wine-deep)] border border-[var(--champagne)]/30 rounded-md px-3 py-2.5 text-[var(--champagne)] outline-none focus:border-[var(--champagne)]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-[var(--champagne)]/70 mb-1.5">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--wine-deep)] border border-[var(--champagne)]/30 rounded-md px-3 py-2.5 text-[var(--champagne)] outline-none focus:border-[var(--champagne)]"
            />
          </div>
          {error && (
            <p className="text-sm text-[var(--destructive)] bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold btn-gold-hover py-3 rounded-full disabled:opacity-60"
          >
            {loading ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode((m) => (m === "signin" ? "signup" : "signin"));
            }}
            className="w-full text-sm text-[var(--champagne)]/80 hover:text-[var(--champagne)]"
          >
            {mode === "signin"
              ? "Primeira vez? Criar conta"
              : "Já tem conta? Entrar"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs uppercase tracking-[0.25em] text-[var(--champagne)]/70 hover:text-[var(--champagne)]">
            ← Voltar à loja
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
