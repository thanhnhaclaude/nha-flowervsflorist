import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { states } from "@/data/states";
import { getPosts, getProducts } from "@/lib/queries";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (p: string) => `${site.url}${p}`;
  const now = new Date();
  const statics = ["/", "/flowers", "/blog", "/about", "/contact", "/faq", "/delivery-information", "/refund-policy", "/terms", "/privacy-policy", "/flower-delivery", "/track-order"];
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  try {
    [products, posts] = await Promise.all([getProducts(), getPosts()]);
  } catch (e) {
    console.error("[sitemap] database unavailable:", (e as Error).message);
  }
  return [
    ...statics.map((p) => ({ url: u(p), lastModified: now, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.5 })),
    ...categories.map((c) => ({ url: u(`/${c.slug}`), lastModified: now, changeFrequency: "daily" as const, priority: c.group === "collection" || c.group === "occasion" ? 0.9 : 0.8 })),
    ...products.map((p) => ({ url: u(`/product/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.7, images: p.images.map((i) => u(i.startsWith("/") ? i : `/images/${i}.webp`)) })),
    ...posts.map((p) => ({ url: u(`/blog/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...states.map((s) => ({ url: u(`/flower-delivery/${s.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
