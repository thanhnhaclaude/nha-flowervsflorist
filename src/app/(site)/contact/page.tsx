import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { pageMeta } from "@/lib/seo";
import { addressLine, site } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata = pageMeta({
  title: "Contact Us – Flower Delivery Customer Care",
  description: `Contact ${site.name} customer care: call ${site.phoneDisplay}, email ${site.email}, or send us a message. ${addressLine}.`,
  path: "/contact",
});

export default function ContactPage() {
  const items = [
    { icon: Phone, title: "Call us", body: <a href={`tel:${site.phone}`} className="text-lg font-extrabold text-plum-700 hover:underline">{site.phoneDisplay}</a> },
    {
      icon: Mail,
      title: "Email",
      body: (
        <>
          <a href={`mailto:${site.email}`} className="font-bold text-plum-700 hover:underline">{site.email}</a>
          <br />
          <a href={`mailto:${site.emailAlt}`} className="text-sm text-muted hover:underline">{site.emailAlt}</a>
        </>
      ),
    },
    { icon: Clock, title: "Hours", body: <span className="text-sm">{site.hours}</span> },
    {
      icon: MapPin,
      title: "Office",
      body: (
        <span className="text-sm">
          {site.company.displayName}
          <br />
          {addressLine}
        </span>
      ),
    },
  ];
  return (
    <>
      <PageHero eyebrow="We're here to help" title="Contact Customer Care" text={`Questions about an order, delivery or a special request? Reach ${site.contactPerson} and our team by phone, email or the form below.`} />
      <div className="container-x grid gap-8 pb-20 lg:grid-cols-[360px_1fr]">
        <ul className="space-y-4">
          {items.map((it) => (
            <li key={it.title} className="card flex gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-petal text-rose-600">
                <it.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-extrabold uppercase tracking-wider text-muted">{it.title}</span>
                {it.body}
              </span>
            </li>
          ))}
        </ul>
        <ContactForm />
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", url: `${site.url}/contact`, about: { "@id": `${site.url}/#business` } }} />
    </>
  );
}
