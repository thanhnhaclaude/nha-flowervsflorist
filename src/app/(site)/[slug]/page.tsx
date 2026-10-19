import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Listing, type ListingParams } from "@/components/listing";
import { CutoffCountdown } from "@/components/cutoff-countdown";
import { Breadcrumbs, Faq, TrustBar } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { categories, categoryMap } from "@/data/categories";
import { img } from "@/lib/format";
import { getCategoryProducts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<ListingParams> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryMap.get(slug);
  if (!c) return {};
  const sp = await searchParams;
  const filtered = Boolean(sp.color || sp.price || sp.sort || sp.sameday);
  return pageMeta({ title: c.seoTitle, description: c.seoDescription, path: `/${slug}`, image: c.image, noindex: filtered });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const c = categoryMap.get(slug);
  if (!c) notFound();
  const [products, sp] = await Promise.all([getCategoryProducts(slug), searchParams]);
  const siblings = categories.filter((x) => x.group === c.group && x.slug !== c.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-petal via-blush to-white">
        <div className="container-x grid items-center gap-8 py-8 md:grid-cols-[1.2fr_1fr] md:py-12">
          <div>
            <Breadcrumbs items={[{ name: c.name, path: `/${c.slug}` }]} />
            <h1 className="mt-4 text-4xl font-bold leading-tight text-plum-700 md:text-5xl">{c.h1}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{c.intro}</p>
            <div className="mt-5">
              <CutoffCountdown />
            </div>
          </div>
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-lift md:block">
            <Image src={img(c.image)} alt={c.h1} fill priority sizes="40vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="container-x py-10">
        <Listing basePath={`/${c.slug}`} all={products} params={sp} />
      </section>

      <section className="container-x pb-12">
        <TrustBar />
      </section>

      <section className="bg-blush py-14">
        <div className="container-x grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="prose-fvf">
            {c.body.map((b) => (
              <div key={b.heading}>
                <h2 className="first:!mt-0">{b.heading}</h2>
                <p>{b.text}</p>
              </div>
            ))}
            <p>
              Need help choosing? Call our florists at <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a> or explore our <Link href="/same-day-flower-delivery">same-day flower delivery</Link>{" "}
              collection.
            </p>
          </div>
          <aside>
            <p className="eyebrow mb-3">Explore more</p>
            <ul className="flex flex-wrap gap-2">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-plum-200 bg-white px-4 text-sm font-bold text-plum-700 hover:bg-plum-600 hover:text-white">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {c.faqs && (
        <section className="container-x max-w-4xl py-14">
          <Faq faqs={c.faqs} title={`${c.name} Flowers FAQ`.replace("Flowers Flowers", "Flowers")} />
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: c.h1,
          description: c.seoDescription,
          url: `${site.url}/${c.slug}`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: products.slice(0, 20).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/product/${p.slug}`, name: p.name })),
          },
        }}
      />
    </>
  );
}
