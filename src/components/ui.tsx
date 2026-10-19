import Link from "next/link";
import { ChevronDown, ChevronRight, HeartHandshake, Lock, Sparkles, Truck } from "lucide-react";
import { JsonLd } from "./json-ld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {it.name}
                </span>
              ) : (
                <Link href={it.path} className="hover:text-rose-600 hover:underline">
                  {it.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}

export function SectionHeading({ eyebrow, title, text, action, center = false }: { eyebrow?: string; title: string; text?: string; action?: { label: string; href: string }; center?: boolean }) {
  return (
    <div className={`mb-8 flex flex-col gap-3 md:mb-10 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-3xl font-bold text-plum-700 md:text-[2.5rem] md:leading-[1.1]">{title}</h2>
        {text && <p className="mt-3 text-lg text-muted">{text}</p>}
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex shrink-0 items-center gap-1 font-extrabold text-rose-600 hover:text-rose-700">
          {action.label} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function Faq({ faqs, title = "Frequently Asked Questions" }: { faqs: { q: string; a: string }[]; title?: string }) {
  return (
    <section aria-labelledby="faq-title">
      <h2 id="faq-title" className="mb-6 text-3xl font-bold text-plum-700">
        {title}
      </h2>
      <div className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-1 md:px-6">
            <summary className="flex min-h-14 list-none items-center justify-between gap-4 py-3 text-lg font-bold [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown className="h-5 w-5 shrink-0 text-plum-600 transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-5 leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqJsonLd(faqs)} />
    </section>
  );
}

const trust = [
  { icon: Truck, title: "Same-Day Delivery", text: "Order by 2 PM recipient's time" },
  { icon: Sparkles, title: "Hand-Arranged Fresh", text: "Designed by expert florists" },
  { icon: HeartHandshake, title: "100% Satisfaction", text: "Love it or we'll make it right" },
  { icon: Lock, title: "Secure Checkout", text: "Encrypted payments via Stripe" },
];

export function TrustBar({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`grid grid-cols-2 gap-3 lg:grid-cols-4 ${compact ? "" : "md:gap-5"}`}>
      {trust.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-center gap-3 rounded-2xl bg-blush p-3.5 md:p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-rose-600 shadow-sm">
            <Icon className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-extrabold text-ink md:text-[0.95rem]">{title}</span>
            <span className="text-xs text-muted md:text-sm">{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PageHero({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <section className="bg-gradient-to-b from-petal to-white">
      <div className="container-x py-12 text-center md:py-16">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="mx-auto max-w-3xl text-4xl font-bold text-plum-700 md:text-5xl">{title}</h1>
        {text && <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{text}</p>}
      </div>
    </section>
  );
}
