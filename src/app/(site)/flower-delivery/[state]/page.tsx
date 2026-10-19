import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-card";
import { CutoffCountdown } from "@/components/cutoff-countdown";
import { Breadcrumbs, Faq, TrustBar } from "@/components/ui";
import { stateBySlug } from "@/data/states";
import { toCard } from "@/lib/cards";
import { getProducts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { addressLine, site } from "@/lib/site";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ state: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = stateBySlug.get((await params).state);
  if (!s) return {};
  const cities = s.cities.slice(0, 3).join(", ");
  return pageMeta({
    title: `Flower Delivery ${s.name} – Same-Day Flowers in ${s.cities[0] ?? s.name}`,
    description: `Send flowers to ${s.name} with same-day flower delivery${cities ? ` in ${cities} and more` : ""}. Fresh roses, birthday and sympathy flowers hand-delivered by local florists.`,
    path: `/flower-delivery/${s.slug}`,
  });
}

export default async function StatePage({ params }: Props) {
  const s = stateBySlug.get((await params).state);
  if (!s) notFound();
  const products = (await getProducts()).filter((p) => p.sameDay && p.bestSeller).slice(0, 8);
  const isHome = s.code === "GA";
  const cityList = s.cities.join(", ");

  const faqs = [
    { q: `Do you offer same-day flower delivery in ${s.name}?`, a: `Yes. Order by 2 PM local time Monday–Friday (12 PM weekends) and a local florist will hand-deliver your flowers today anywhere we serve in ${s.name}${s.cities.length ? `, including ${cityList}` : ""}.` },
    { q: `How much does flower delivery cost in ${s.name}?`, a: "Delivery is $12.99, free on orders of $79 or more. Same-day priority adds $5." },
    { q: `Can you deliver to hospitals and funeral homes in ${s.name}?`, a: "Absolutely. Add the room number or service details in the delivery instructions and we'll coordinate with the venue." },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-petal via-blush to-white">
        <div className="container-x py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Flower Delivery", path: "/flower-delivery" }, { name: s.name, path: `/flower-delivery/${s.slug}` }]} />
          <h1 className="mt-4 text-4xl font-bold text-plum-700 md:text-5xl">Flower Delivery in {s.name}</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted">
            Send fresh, florist-arranged flowers anywhere in {s.name}
            {s.cities.length ? ` — from ${s.cities.slice(0, -1).join(", ")}${s.cities.length > 1 ? " to " : ""}${s.cities[s.cities.length - 1]}` : ""}. Order by 2 PM for same-day delivery.
          </p>
          <div className="mt-5">
            <CutoffCountdown />
          </div>
        </div>
      </section>

      <section className="container-x py-12">
        <h2 className="mb-8 text-3xl font-bold text-plum-700">Popular Flowers for Same-Day Delivery in {s.name}</h2>
        <ProductGrid products={products.map(toCard)} priorityCount={4} />
        <p className="mt-8 text-center">
          <Link href="/same-day-flower-delivery" className="btn btn-primary">
            See All Same-Day Flowers
          </Link>
        </p>
      </section>

      <section className="bg-blush py-14">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div className="prose-fvf">
            <h2 className="!mt-0">Send flowers to {s.name} today</h2>
            <p>
              Whether you&apos;re celebrating a birthday in {s.cities[0] ?? s.name}, sending sympathy flowers to a family in {s.cities[1] ?? s.cities[0] ?? s.name}, or surprising someone special just
              because, {site.name} makes it easy. Every order is hand-arranged by a skilled local florist and delivered in person—never shipped in a box.
            </p>
            {isHome && (
              <p>
                <strong>Our home state.</strong> {site.name} is operated by {site.company.displayName}, headquartered at {addressLine}. Georgia customers can call us directly at{" "}
                <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a> for help with weddings, events and corporate orders.
              </p>
            )}
            {s.cities.length > 0 && (
              <>
                <h3>Cities we deliver to in {s.name}</h3>
                <p>{cityList} and surrounding communities.</p>
              </>
            )}
            <h3>Popular occasions</h3>
            <p>
              <Link href="/birthday-flowers">Birthday flowers</Link>, <Link href="/anniversary-flowers">anniversary roses</Link>, <Link href="/sympathy-flowers">sympathy & funeral flowers</Link>,{" "}
              <Link href="/get-well-flowers">get well bouquets</Link> and <Link href="/plants">plants</Link>.
            </p>
          </div>
          <Faq faqs={faqs} title={`${s.name} Flower Delivery FAQ`} />
        </div>
      </section>

      <section className="container-x py-12">
        <TrustBar />
        <p className="mt-8 text-center text-sm">
          <Link href="/flower-delivery" className="font-bold text-plum-700 underline">
            Browse flower delivery in other states
          </Link>
        </p>
      </section>
    </>
  );
}
