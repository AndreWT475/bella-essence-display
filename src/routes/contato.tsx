import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import {
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  whatsappGeneralLink,
  WHATSAPP_NUMBER,
} from "@/lib/brand";
import { WhatsAppIcon } from "@/components/Header";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Bella Guimarães" },
      {
        name: "description",
        content: "Fale conosco pelo WhatsApp ou Instagram para comprar ou tirar dúvidas.",
      },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const phoneDisplay = `+55 (${WHATSAPP_NUMBER.slice(2, 4)}) ${WHATSAPP_NUMBER.slice(4, 9)}-${WHATSAPP_NUMBER.slice(9)}`;

  return (
    <SiteLayout>
      <section className="monogram-bg relative">
        <div className="monogram-bg-layer" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center">
          <span className="text-[11px] tracking-[0.35em] uppercase text-[var(--champagne)]/70">
            Atendimento
          </span>
          <h1 className="font-serif text-5xl text-[var(--champagne)] mt-3">
            Vamos conversar?
          </h1>
          <p className="mt-5 text-[var(--champagne)]/85 leading-relaxed">
            Estamos aqui para apresentar nossas peças, esclarecer dúvidas e ajudar você a
            encontrar o look perfeito. Chame a loja pelo WhatsApp para um atendimento
            personalizado e exclusivo.
          </p>

          <a
            href={whatsappGeneralLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 btn-gold btn-gold-hover px-8 py-4 rounded-full"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Falar pelo WhatsApp
          </a>
          <p className="mt-4 text-sm text-[var(--champagne)]/70">{phoneDisplay}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="grid sm:grid-cols-2 gap-5">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 rounded-md border border-[var(--champagne)]/25 bg-[var(--wine)] hover:border-[var(--champagne)] transition"
          >
            <Instagram className="h-6 w-6 text-[var(--champagne)]" />
            <div>
              <div className="font-serif text-xl text-[var(--champagne)]">Instagram</div>
              <div className="text-sm text-[var(--champagne)]/70">@{INSTAGRAM_HANDLE}</div>
            </div>
          </a>
          <a
            href={whatsappGeneralLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 rounded-md border border-[var(--champagne)]/25 bg-[var(--wine)] hover:border-[var(--champagne)] transition"
          >
            <MessageCircle className="h-6 w-6 text-[var(--champagne)]" />
            <div>
              <div className="font-serif text-xl text-[var(--champagne)]">WhatsApp</div>
              <div className="text-sm text-[var(--champagne)]/70">{phoneDisplay}</div>
            </div>
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
