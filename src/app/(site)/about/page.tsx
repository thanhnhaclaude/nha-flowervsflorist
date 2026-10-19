import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Leaf, Sparkles, Truck } from "lucide-react";
import { Breadcrumbs, TrustBar } from "@/components/ui";
import { img } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { addressLine, site } from "@/lib/site";

export const metadata = pageMeta({
  title: "About Us – Fresh Flowers, Florist-Crafted",
  description: `Meet ${site.name}: an online flower shop owned and operated by ${site.company.displayName}, a Macon, Georgia company, delivering florist-arranged flowers across the USA.`,
  path: "/about",
  image: "brand/florist-studio",
});

const values = [
  { icon: Sparkles, title: "Beautifully designed", text: "A curated collection of bouquets, plants and gifts for every occasion and budget." },
  { icon: Leaf, title: "Fresh first", text: "Premium stems, packed with a water source and shipped overnight so they last longer at home." },
  { icon: Truck, title: "Fast & reliable", text: "Next-day delivery across the U.S. when you order by 2 PM Eastern, Monday–Friday." },
  { icon: HeartHandshake, title: "Real people", text: "Our Macon, Georgia team answers the phone and email and personally resolves any problem." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-petal to-white">
        <div className="container-x grid items-center gap-10 py-10 md:grid-cols-2 md:py-16">
          <div>
            <Breadcrumbs items={[{ name: "About Us", path: "/about" }]} />
            <p className="eyebrow mt-6">Our story</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight text-plum-700 md:text-5xl">Flower vs. florist? Get the best of both.</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Our name says it all. You shouldn&apos;t have to choose between beautiful flowers and a simple, honest way to send them. {site.name} brings you thoughtfully
              designed bouquets, clear prices and overnight delivery to any door in the continental U.S.—with real people standing behind every order.
            </p>
          </div>
          <div className="relative aspect-[7/5] overflow-hidden rounded-[1.75rem] shadow-lift">
            <Image src={img("brand/florist-studio")} alt="Fresh flowers being arranged in a studio" fill fetchPriority="high" loading="eager" sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-petal text-rose-600">
                <v.icon className="h-6 w-6" />
              </span>
              <h2 className="mt-4 font-sans text-lg font-extrabold">{v.title}</h2>
              <p className="mt-1 text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blush py-14">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[7/5] overflow-hidden rounded-[1.75rem]">
            <Image src={img("brand/shop-front")} alt="A flower shop storefront filled with fresh blooms" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="prose-fvf">
            <h2 className="!mt-0">From Macon, Georgia to every corner of the U.S.</h2>
            <p>
              {site.name} is an online flower shop owned and operated by <strong>{site.company.displayName}</strong>, a {site.company.state} limited liability company founded in 2012 and
              headquartered at {addressLine}. M&amp;R is {site.parent.description}—learn more at{" "}
              <a href={site.parent.url} target="_blank" rel="noopener">
                mandr-group.com
              </a>
              .
            </p>
            <p>
              We built {site.name} to make sending flowers simple and dependable: a carefully curated collection, honest pricing with no hidden fees, and a real customer-care team that stands
              behind every order.
            </p>
            <p>
              Every order is packed in a protective box with a water source and shipped overnight by FedEx or UPS, so it arrives fresh the next day. Many stems travel in bud and open
              beautifully at home—and you get a tracking link the moment your gift ships.
            </p>
            <p>
              Questions or special requests? Call us at <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a> or email <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-14">
        <h2 className="mb-6 text-3xl font-bold text-plum-700">Company Information</h2>
        <dl className="card grid gap-x-10 gap-y-4 p-6 sm:grid-cols-2 md:p-8">
          {[
            ["Business name", site.company.legalName],
            ["Online store", `${site.name} (${site.domain})`],
            ["Parent company website", "www.mandr-group.com"],
            ["Business type", site.company.type],
            ["State of formation", site.company.state],
            ["Principal office", addressLine],
            ["Contact", site.contactPerson],
            ["Phone", site.phoneDisplay],
            ["Email", `${site.email} · ${site.emailAlt}`],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm font-bold text-muted">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10">
          <TrustBar />
        </div>
        <p className="mt-10 text-center">
          <Link href="/best-sellers" className="btn btn-primary">
            Shop Our Best Sellers
          </Link>
        </p>
      </section>
    </>
  );
}
