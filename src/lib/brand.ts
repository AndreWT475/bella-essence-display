export const WHATSAPP_NUMBER = "5577991867745";
export const INSTAGRAM_HANDLE = "belaguimaraes";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;
export const BRAND_NAME = "Bella Guimarães";
export const BRAND_SLOGAN = "Essência e beleza";

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function whatsappProductLink(productName: string, price: number): string {
  const msg = `Olá, tenho interesse no produto ${productName} no valor de ${formatPrice(
    price,
  )}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function whatsappGeneralLink(
  text = "Olá! Gostaria de conhecer melhor as peças da Bella Guimarães.",
): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const CATEGORIES = ["Bolsas", "Blusas", "Vestidos", "Acessórios"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_SLUGS: Record<string, Category> = {
  bolsas: "Bolsas",
  blusas: "Blusas",
  vestidos: "Vestidos",
  acessorios: "Acessórios",
};

export function slugForCategory(c: Category): string {
  return Object.entries(CATEGORY_SLUGS).find(([, v]) => v === c)?.[0] ?? "bolsas";
}
