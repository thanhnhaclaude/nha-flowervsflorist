import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Flower2, Truck } from "lucide-react";
import { ProductGrid } from "@/components/product-card";
import { CutoffCountdown } from "@/components/cutoff-countdown";
import { Faq, SectionHeading, TrustBar } from "@/components/ui";
import { categoryMap, flowerTypes } from "@/data/categories";
import { toCard } from "@/lib/cards";
import { formatDate, img } from "@/lib/format";
import { getPosts, getProducts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = pageMeta({
  title: "Flower Delivery | Send Flowers Online, Delivered Tomorrow | FlowerVsFlorist",
  description:
    "Send flowers online with next-day flower delivery nationwide. Fresh roses, birthday bouquets, sympathy flowers & plants, carefully packed and shipped overnight. Order by 2 PM ET!",
  path: "/",
});

const occasionTiles = ["birthday-flowers", "anniversary-flowers", "sympathy-flowers", "love-and-romance-flowers", "get-well-flowers", "thank-you-flowers", "congratulations-flowers", "new-baby-flowers"];

const homeFaqs = [
  { q: "Can I send flowers online for delivery tomorrow?", a: "Yes. Choose any bouquet marked Next-Day and order by 2 PM Eastern Time, Monday–Friday. It ships overnight by FedEx or UPS and arrives the next day, Tuesday–Saturday." },
  { q: "How much does flower delivery cost?", a: "Overnight shipping is $12.99 per order and free on orders of $79 or more. There are no hidden service fees—you'll see the exact total before you pay." },
  { q: "Where do you deliver flowers?", a: "We ship to homes and businesses throughout the continental United States. We can't deliver to P.O. boxes or APO/FPO addresses." },
  { q: "What if my flowers aren't perfect?", a: "Every order is backed by our 100% Satisfaction Guarantee. Contact us within 7 days and we'll send a replacement or issue a refund." },
];

export default async function HomePage() {
  const [products, posts] = await Promise.all([getProducts(), getPosts()]);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 8);
  const featured = products.filter((p) => p.featured && !p.bestSeller).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-plum-900">
        <Image src={img("hero/vibrant-bouquet")} alt="Colorful bouquet of sunflowers, roses and hydrangeas" fill fetchPriority="high" loading="eager" quality={60} sizes="100vw" className="object-cover object-[70%_center] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-plum-900/90 via-plum-900/75 to-plum-900/40 md:via-plum-900/55 md:to-plum-900/0" />
        <div className="container-x relative flex min-h-[540px] flex-col justify-center py-16 md:min-h-[600px]">
          <div className="max-w-xl text-white">
            <CutoffCountdown />
            <h1 className="mt-5 text-[2.6rem] font-bold leading-[1.05] md:text-6xl">
              Fresh Flowers,
              <br />
              <span className="italic text-gold">Delivered</span> Tomorrow
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/90 md:text-xl">
              Send flowers online for every moment. Gorgeous bouquets, carefully packed and shipped overnight anywhere in the USA.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/next-day-flower-delivery" className="btn btn-primary text-lg">
                <Truck className="h-5 w-5" /> Shop Next-Day Flowers
              </Link>
              <Link href="/best-sellers" className="btn btn-white text-lg">
                Best Sellers
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {["birthday-flowers", "sympathy-flowers", "roses", "anniversary-flowers"].map((s) => (
                <li key={s}>
                  <Link href={`/${s}`} className="inline-flex min-h-10 items-center rounded-full border border-white/40 px-4 text-sm font-bold text-white hover:bg-white hover:text-plum-700">
                    {categoryMap.get(s)!.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="container-x -mt-8 relative z-10">
        <div className="rounded-[1.75rem] bg-white p-3 shadow-lift md:p-4">
          <TrustBar compact />
        </div>
      </div>

      {/* Occasions */}
      <section className="container-x py-16 md:py-20">
        <SectionHeading eyebrow="Shop by occasion" title="Flowers for Every Moment" action={{ label: "All flowers", href: "/flowers" }} />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
          {occasionTiles.map((slug) => {
            const c = categoryMap.get(slug)!;
            return (
              <li key={slug}>
                <Link href={`/${slug}`} className="group block">
                  <span className="relative block aspect-square overflow-hidden rounded-[var(--radius-card)] bg-petal">
                    <Image src={img(c.image)} alt={`${c.name} flowers`} fill sizes="(min-width: 1280px) 300px, (min-width: 640px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-plum-900/75 to-transparent" />
                    <span className="absolute bottom-3 left-3 right-3 font-display text-lg font-bold leading-tight text-white lg:left-4 lg:text-2xl">{c.name}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Best sellers */}
      <section className="bg-blush py-16 md:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Customer favorites" title="Best-Selling Flowers" text="Our most-loved bouquets—every one available for next-day delivery." action={{ label: "Shop all best sellers", href: "/best-sellers" }} />
          <ProductGrid products={bestSellers.map(toCard)} />
        </div>
      </section>

      {/* Promo banners */}
      <section className="container-x grid gap-5 py-16 md:grid-cols-2 md:py-20">
        <Link href="/sympathy-flowers" className="group relative flex min-h-[340px] overflow-hidden rounded-[1.75rem] bg-plum-800">
          <Image src={img("brand/sympathy")} alt="White sympathy bouquet" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-plum-900/90 via-plum-900/30 to-transparent" />
          <span className="relative mt-auto p-7 text-white md:p-9">
            <span className="eyebrow !text-gold">Sympathy & Funeral</span>
            <span className="mt-2 block font-display text-3xl font-bold md:text-4xl">Comfort When It Matters Most</span>
            <span className="mt-2 block max-w-sm text-white/85">Peaceful bouquets and plants sent with care to the family home.</span>
            <span className="mt-5 inline-flex items-center gap-2 font-extrabold">
              Shop sympathy flowers <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </span>
        </Link>
        <Link href="/luxury-flowers" className="group relative flex min-h-[340px] overflow-hidden rounded-[1.75rem] bg-rose-600">
          <Image src={img("cat/luxury")} alt="Luxury pink roses in a keepsake box" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-rose-700/90 via-rose-700/20 to-transparent" />
          <span className="relative mt-auto p-7 text-white md:p-9">
            <span className="eyebrow !text-gold-soft">The Luxury Collection</span>
            <span className="mt-2 block font-display text-3xl font-bold md:text-4xl">Showstopping Rose Boxes</span>
            <span className="mt-2 block max-w-sm text-white/90">Premium stems and keepsake presentation for unforgettable moments.</span>
            <span className="mt-5 inline-flex items-center gap-2 font-extrabold">
              Explore luxury <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </span>
        </Link>
      </section>

      {/* Shop by flower */}
      <section className="border-y border-line bg-white py-14">
        <div className="container-x">
          <SectionHeading eyebrow="Shop by flower" title="Find Their Favorite Bloom" center />
          <ul className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-9 md:overflow-visible md:px-0">
            {flowerTypes.map((c) => (
              <li key={c.slug} className="w-28 shrink-0 snap-start md:w-auto">
                <Link href={`/${c.slug}`} className="group flex flex-col items-center gap-3 text-center">
                  <span className="relative block aspect-square w-full overflow-hidden rounded-full ring-4 ring-petal transition-all group-hover:ring-rose-500">
                    <Image src={img(c.image)} alt="" fill sizes="140px" className="object-cover" />
                  </span>
                  <span className="font-bold group-hover:text-rose-600">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Next-day explainer */}
      <section className="container-x grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="relative aspect-[7/5] overflow-hidden rounded-[1.75rem]">
          <Image src={img("brand/florist-arranging")} alt="Fresh flowers being arranged into a bouquet" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="eyebrow">Next-day flower delivery</p>
          <h2 className="mt-2 text-3xl font-bold text-plum-700 md:text-[2.5rem] md:leading-[1.1]">Fresh Flowers, Delivered Tomorrow in 3 Easy Steps</h2>
          <ol className="mt-8 space-y-6">
            {[
              { icon: Flower2, title: "Choose a bouquet", text: "Pick any design marked Next-Day—roses, birthday bouquets, sympathy flowers and more." },
              { icon: CalendarDays, title: "Pick a delivery date", text: "Order by 2 PM ET (Mon–Fri) for tomorrow, or schedule any Tuesday–Saturday up to 90 days ahead. Add a free card message." },
              { icon: Truck, title: "We ship it overnight", text: "Your bouquet is packed in a protective box with water and shipped by FedEx or UPS. You get a tracking link by email." },
            ].map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-petal text-rose-600">
                  <s.icon className="h-6 w-6" />
                  <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-plum-600 text-xs font-extrabold text-white">{i + 1}</span>
                </span>
                <span>
                  <span className="block text-lg font-extrabold">{s.title}</span>
                  <span className="text-muted">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <Link href="/next-day-flower-delivery" className="btn btn-primary mt-8">
            Send Flowers for Tomorrow
          </Link>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="bg-gradient-to-b from-petal to-white py-16 md:py-20">
          <div className="container-x">
            <SectionHeading eyebrow="Florist favorites" title="Designed to Wow" action={{ label: "Luxury collection", href: "/luxury-flowers" }} />
            <ProductGrid products={featured.map(toCard)} />
          </div>
        </section>
      )}

      {/* Plants & gifts */}
      <section className="container-x py-16">
        <div className="grid overflow-hidden rounded-[1.75rem] bg-leaf-soft md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="eyebrow !text-leaf">Gifts that keep growing</p>
            <h2 className="mt-2 text-3xl font-bold text-plum-700 md:text-4xl">Plants, Orchids & Flower Gift Boxes</h2>
            <p className="mt-3 text-lg text-muted">Low-maintenance succulents, elegant orchids and blooming gift boxes—perfect for new homes, offices and plant lovers.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/plants" className="btn btn-plum">Shop Plants</Link>
              <Link href="/flower-gifts" className="btn btn-outline">Gift Boxes</Link>
            </div>
          </div>
          <div className="relative min-h-[280px]">
            <Image src={img("brand/delivery-box")} alt="Flowers and a card in an open delivery box" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="bg-blush py-16 md:py-20">
          <div className="container-x">
            <SectionHeading eyebrow="The flower journal" title="Tips, Meanings & Inspiration" action={{ label: "Read the blog", href: "/blog" }} />
            <div className="grid gap-6 md:grid-cols-3">
              {posts.slice(0, 3).map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group card overflow-hidden">
                  <span className="relative block aspect-[7/4] overflow-hidden">
                    {p.cover && <Image src={img(p.cover)} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                  </span>
                  <span className="block p-6">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600">{p.category}</span>
                    <span className="mt-2 block font-display text-xl font-bold leading-snug text-ink group-hover:text-plum-600">{p.title}</span>
                    <span className="mt-2 block text-sm text-muted">{formatDate(p.publishedAt)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO copy + FAQ */}
      <section className="container-x grid gap-12 py-16 md:py-20 lg:grid-cols-2">
        <div className="prose-fvf">
          <h2 className="!mt-0">Send Flowers Online with Next-Day Flower Delivery</h2>
          <p>
            {site.name} makes it easy to send flowers online for any occasion. Whether you need <Link href="/birthday-flowers">birthday flowers</Link> delivered tomorrow, a romantic{" "}
            <Link href="/roses">dozen roses</Link> for your anniversary, or thoughtful <Link href="/sympathy-flowers">sympathy flowers</Link> for a grieving family, every
            bouquet is made with fresh, premium blooms and packed with care.
          </p>
          <p>
            Our <Link href="/next-day-flower-delivery">next-day flower delivery</Link> ships overnight to homes and offices across the continental U.S. Order by 2 PM Eastern Time, Monday–Friday,
            and your flowers arrive the next day. Planning ahead? Schedule delivery up to 90 days in advance.
          </p>
          <h3>Affordable flowers, never ordinary</h3>
          <p>
            From <Link href="/flowers-under-50">beautiful bouquets under $50</Link> to our <Link href="/luxury-flowers">luxury rose boxes</Link>, every design includes a free personalized card
            message and is backed by our 100% satisfaction guarantee.
          </p>
        </div>
        <Faq faqs={homeFaqs} title="Flower Delivery FAQ" />
      </section>
    </>
  );
}
