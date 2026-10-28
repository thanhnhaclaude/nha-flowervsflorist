import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Gift, HeartHandshake, Leaf, Truck } from "lucide-react";
import { Gallery } from "@/components/product/gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ReviewForm } from "@/components/product/review-form";
import { ProductGrid, Stars } from "@/components/product-card";
import { CutoffCountdown } from "@/components/cutoff-countdown";
import { Breadcrumbs, SectionHeading } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { categoryMap } from "@/data/categories";
import { toCard } from "@/lib/cards";
import { formatDate, img, usd } from "@/lib/format";
import { getProduct, getProductReviews, getRelated } from "@/lib/queries";
import { pageMeta, returnPolicyJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

// Cached and refreshed hourly (ISR) so Hostinger's CDN serves it from cache; admin edits revalidate the origin instantly (CDN copy within 1h).
export const revalidate = 3600;

/** Rendered on first visit, then cached (no database needed at build time). */
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return pageMeta({
    title: `${p.name} – ${usd(p.price)}${p.nextDay ? " | Next-Day Delivery" : ""}`,
    description: `${p.short} Order ${p.name} online${p.nextDay ? " for next-day flower delivery" : ""} from ${site.name}. Free card message included.`.slice(0, 300),
    path: `/product/${p.slug}`,
    image: p.images[0],
  });
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const [reviews, related] = await Promise.all([getProductReviews(product.id), getRelated(product)]);
  const primaryCat = product.categories.map((c) => categoryMap.get(c)).find((c) => c && c.group !== "collection") ?? categoryMap.get(product.categories[0]);

  const details = [
    { icon: Truck, title: "Delivery", text: product.nextDay ? "Order by 2 PM ET (Mon–Fri) for next-day delivery. Ships overnight by FedEx or UPS, Tuesday–Saturday delivery, with tracking." : "Needs one extra day to prepare. Ships overnight with tracking; choose your Tuesday–Saturday date at checkout." },
    { icon: Gift, title: "Free card message", text: "Add a personal message at checkout—printed on a premium enclosure card." },
    { icon: Leaf, title: "Care tips", text: "Trim stems at an angle, use the flower food included and refresh the water every 2 days." },
    { icon: HeartHandshake, title: "100% satisfaction", text: "Not delighted? Contact us within 7 days for a replacement or refund." },
  ];

  return (
    <>
      <div className="container-x pt-6">
        <Breadcrumbs items={[...(primaryCat ? [{ name: primaryCat.name, path: `/${primaryCat.slug}` }] : []), { name: product.name, path: `/product/${product.slug}` }]} />
      </div>

      <section className="container-x grid gap-8 py-6 lg:grid-cols-2 lg:gap-14 lg:py-10">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <Gallery images={product.images} name={product.name} />
        </div>
        <div>
          {product.badge && <span className="inline-block rounded-full bg-rose-600 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">{product.badge}</span>}
          <h1 className="mt-3 text-3xl font-bold leading-tight text-plum-700 md:text-[2.6rem]">{product.name}</h1>
          {product.reviewCount > 0 && product.rating ? (
            <a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-sm text-muted hover:underline">
              <Stars rating={product.rating} /> {product.rating.toFixed(1)} · {product.reviewCount} review{product.reviewCount > 1 ? "s" : ""}
            </a>
          ) : null}
          <p className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-ink">{usd(product.price)}</span>
            {product.compareAt && product.compareAt > product.price && <span className="text-lg text-muted line-through">{usd(product.compareAt)}</span>}
          </p>
          <p className="mt-3 text-lg text-muted">{product.short}</p>
          {product.nextDay ? (
            <div className="mt-4">
              <CutoffCountdown variant="inline" />
            </div>
          ) : (
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-plum-600">
              <CalendarDays className="h-4 w-4" /> Available for next-day or scheduled delivery
            </p>
          )}

          <PurchasePanel product={{ id: product.id, slug: product.slug, name: product.name, price: product.price, images: product.images, hasSizes: product.hasSizes, nextDay: product.nextDay }} />

          <div className="mt-8 space-y-6 border-t border-line pt-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-plum-700">About this bouquet</h2>
              <p className="mt-2 leading-relaxed text-[#3d2630]">{product.description}</p>
            </div>
            {product.includes.length > 0 && (
              <div>
                <h3 className="font-sans text-sm font-extrabold uppercase tracking-wider text-plum-700">What&apos;s included</h3>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {product.includes.map((i) => (
                    <li key={i} className="flex gap-2 text-[0.95rem]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" /> {i}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted">Each arrangement is hand-crafted; seasonal flowers and containers may vary slightly while keeping the same look, color palette and value.</p>
              </div>
            )}
            <ul className="grid gap-3 sm:grid-cols-2">
              {details.map((d) => (
                <li key={d.title} className="flex gap-3 rounded-2xl bg-blush p-4">
                  <d.icon className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                  <span>
                    <span className="block font-extrabold">{d.title}</span>
                    <span className="text-sm text-muted">{d.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="flex flex-wrap gap-2">
              {product.categories
                .map((c) => categoryMap.get(c))
                .filter(Boolean)
                .map((c) => (
                  <Link key={c!.slug} href={`/${c!.slug}`} className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-plum-700 hover:bg-blush">
                    {c!.name}
                  </Link>
                ))}
            </p>
          </div>
        </div>
      </section>

      <section id="reviews" className="container-x scroll-mt-40 border-t border-line py-14">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-plum-700">Customer Reviews</h2>
            {product.reviewCount > 0 && product.rating ? (
              <p className="mt-3 flex items-center gap-3">
                <span className="text-4xl font-extrabold">{product.rating.toFixed(1)}</span>
                <span>
                  <Stars rating={product.rating} className="h-5 w-5" />
                  <span className="block text-sm text-muted">
                    Based on {product.reviewCount} review{product.reviewCount > 1 ? "s" : ""}
                  </span>
                </span>
              </p>
            ) : (
              <p className="mt-3 text-muted">No reviews yet. Sent this bouquet? Be the first to share your experience.</p>
            )}
            <div className="mt-5">
              <ReviewForm productId={product.id} />
            </div>
          </div>
          <div className="space-y-5">
            {reviews.map((r) => (
              <article key={r.id} className="rounded-2xl border border-line p-5">
                <div className="flex items-center justify-between gap-3">
                  <Stars rating={r.rating} />
                  <time className="text-sm text-muted" dateTime={new Date(r.createdAt).toISOString()}>
                    {formatDate(r.createdAt)}
                  </time>
                </div>
                {r.title && <h3 className="mt-2 font-sans text-lg font-extrabold">{r.title}</h3>}
                <p className="mt-1 whitespace-pre-line text-[#3d2630]">{r.body}</p>
                <p className="mt-2 text-sm font-bold text-muted">— {r.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-blush py-14">
          <div className="container-x">
            <SectionHeading eyebrow="You may also love" title="More Beautiful Bouquets" />
            <ProductGrid products={related.map(toCard)} />
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          sku: `FVF-${product.id}`,
          image: product.images.map((i) => `${site.url}${img(i)}`),
          brand: { "@type": "Brand", name: site.name },
          offers: {
            "@type": "Offer",
            url: `${site.url}/product/${product.slug}`,
            priceCurrency: "USD",
            price: (product.price / 100).toFixed(2),
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@type": "Organization", name: site.name, url: site.url },
            hasMerchantReturnPolicy: returnPolicyJsonLd(),
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
              shippingRate: { "@type": "MonetaryAmount", value: "12.99", currency: "USD" },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: product.nextDay ? 0 : 1, unitCode: "DAY" },
                transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
              },
            },
          },
          ...(product.reviewCount > 0 && product.rating
            ? {
                aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating.toFixed(1), reviewCount: product.reviewCount },
                review: reviews.slice(0, 5).map((r) => ({ "@type": "Review", author: { "@type": "Person", name: r.name }, reviewRating: { "@type": "Rating", ratingValue: r.rating }, reviewBody: r.body })),
              }
            : {}),
        }}
      />
    </>
  );
}
