import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string | null;
  featured: boolean;
  created_at: string;
};

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProducts });
}

const urlCache = new Map<string, { url: string; expires: number }>();

export async function resolveImageUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const cached = urlCache.get(path);
  if (cached && cached.expires > Date.now()) return cached.url;
  const { data } = await supabase.storage
    .from("product-images")
    .createSignedUrl(path, 3600);
  if (!data?.signedUrl) return null;
  urlCache.set(path, { url: data.signedUrl, expires: Date.now() + 3500_000 });
  return data.signedUrl;
}

export function useSignedImage(path: string | null) {
  return useQuery({
    queryKey: ["signed-image", path],
    queryFn: () => resolveImageUrl(path),
    enabled: !!path,
    staleTime: 50 * 60 * 1000,
  });
}
