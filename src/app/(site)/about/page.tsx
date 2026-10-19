import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Leaf, Sparkles, Truck } from "lucide-react";
import { Breadcrumbs, TrustBar } from "@/components/ui";
import { img } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { addressLine, site } from "@/lib/site";

export const metadata = pageMeta({
  title: "About Us – Fresh Flowers, Florist-Crafted",
  description: `Meet ${site.name}: an online flower shop operated by ${site.company.displayName} in Macon, Georgia, delivering hand-arranged flowers across the USA.`,
  path: "/about",
  image: "brand/florist-studio",
});

const values = [
  { icon: Sparkles, title: "Florist-crafted", text: "Every design is arranged by hand by skilled florists—never mass-assembled in a warehouse." },
  { icon: Leaf, title: "Fresh first", text: "We choose in-season, premium stems and ship them cool so they last longer at home." },
  { icon: Truck, title: "Fast & reliable", text: "Same-day delivery across the country when you order by 2 PM recipient's time." },
  { icon: HeartHandshake, title: "Real people", text: "Our customer care team in Georgia answers the phone and fixes problems—fast." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-petal to-white">
        <div className="container-x grid items-center gap-10 py-10 md:grid-cols-2 md:py-16">
          <div>
            <Breadcrumbs items={[{ name: "About Us", path: "/about" }]} />
            <p className="eyebrow mt-6">Our story</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight text-plum-700 md:text-5xl">Why choose a florist over just “flowers”?</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Our name says it all. Anyone can sell flowers—but a <em>florist</em> brings artistry, care and know-how to every stem. {site.name} was created to give you the
              convenience of ordering online with the personal touch of a real florist, delivered to your door the very same day.
            </p>
          </div>
          <div className="relative aspect-[7/5] overflow-hidden rounded-[1.75rem] shadow-lift">
            <Image src={img("brand/florist-studio")} alt="A florist arranging flowers in the studio" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
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
              {site.domain} is owned and operated by <strong>{site.company.displayName}</strong>, a {site.company.state} limited liability company headquartered at {addressLine}. Our team
              curates every collection, sets our quality standards and supports every order personally.
            </p>
            <p>
              When you place an order, we route it to a skilled florist near your recipient, who hand-arranges your design with fresh flowers and delivers it in person. That&apos;s how we deliver
              beautiful flowers the same day—without boxes of wilted stems shipped across the country.
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
            ["Doing business as", `${site.name} (${site.domain})`],
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
