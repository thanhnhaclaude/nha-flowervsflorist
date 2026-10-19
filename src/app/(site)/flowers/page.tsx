import Link from "next/link";
import type { Metadata } from "next";
import { Listing, type ListingParams } from "@/components/listing";
import { Breadcrumbs } from "@/components/ui";
import { CutoffCountdown } from "@/components/cutoff-countdown";
import { flowerTypes, occasions } from "@/data/categories";
import { getProducts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<ListingParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  return pageMeta({
    title: "Shop All Flowers Online | Fresh Bouquets & Arrangements",
    description: "Shop all fresh flowers online: roses, sunflowers, tulips, lilies, orchids, plants and gifts. Same-day flower delivery across the USA.",
    path: "/flowers",
    noindex: Boolean(sp.color || sp.price || sp.sort || sp.sameday),
  });
}

export default async function AllFlowersPage({ searchParams }: Props) {
  const [products, sp] = await Promise.all([getProducts(), searchParams]);
  return (
    <>
      <section className="bg-gradient-to-br from-petal via-blush to-white">
        <div className="container-x py-10 md:py-12">
          <Breadcrumbs items={[{ name: "All Flowers", path: "/flowers" }]} />
          <h1 className="mt-4 text-4xl font-bold text-plum-700 md:text-5xl">Shop All Flowers</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">Every bouquet, plant and gift in our shop—hand-arranged by expert florists and ready to deliver.</p>
          <div className="mt-5">
            <CutoffCountdown />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[...occasions.slice(0, 6), ...flowerTypes.slice(0, 4)].map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-sm font-bold text-plum-700 shadow-sm hover:bg-plum-600 hover:text-white">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container-x py-10">
        <Listing basePath="/flowers" all={products} params={sp} />
      </section>
    </>
  );
}
