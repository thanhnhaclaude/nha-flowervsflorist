import Link from "next/link";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-card";
import { PageHero } from "@/components/ui";
import { categories } from "@/data/categories";
import { toCard } from "@/lib/cards";
import { searchProducts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return pageMeta({ title: q ? `Search results for “${q}”` : "Search", description: "Search fresh flowers, plants and gifts.", path: "/search", noindex: true });
}

export default async function SearchPage({ searchParams }: Props) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 80);
  const results = q ? await searchProducts(q) : [];
  const catMatches = q ? categories.filter((c) => `${c.name} ${c.h1}`.toLowerCase().includes(q.toLowerCase())) : [];
  return (
    <>
      <PageHero eyebrow="Search" title={q ? `Results for “${q}”` : "Search our flowers"} text={q ? `${results.length} matching design${results.length === 1 ? "" : "s"}` : undefined} />
      <div className="container-x pb-20">
        <form action="/search" role="search" className="mx-auto mb-10 flex max-w-xl gap-2">
          <label htmlFor="q" className="sr-only">
            Search
          </label>
          <input id="q" name="q" type="search" defaultValue={q} className="field !rounded-full" placeholder="Try “roses”, “sympathy” or “sunflowers”" />
          <button className="btn btn-primary">Search</button>
        </form>
        {catMatches.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {catMatches.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="rounded-full bg-petal px-4 py-2 font-bold text-plum-700 hover:bg-plum-600 hover:text-white">
                Shop {c.name} →
              </Link>
            ))}
          </div>
        )}
        {results.length > 0 ? (
          <ProductGrid products={results.map(toCard)} />
        ) : (
          q && (
            <div className="mx-auto max-w-lg rounded-[var(--radius-card)] bg-blush p-10 text-center">
              <p className="font-display text-2xl font-bold text-plum-700">No exact matches</p>
              <p className="mt-2 text-muted">Try a broader term, or browse our most popular flowers.</p>
              <Link href="/best-sellers" className="btn btn-primary mt-5">
                Shop Best Sellers
              </Link>
            </div>
          )
        )}
      </div>
    </>
  );
}
