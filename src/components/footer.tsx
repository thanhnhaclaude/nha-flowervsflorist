import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { footerMenu } from "@/lib/menu";
import { addressLine, site } from "@/lib/site";

const socials = [
  { label: "Facebook", href: site.social.facebook, d: "M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v9h4v-9h3l1-4h-4V9c0-.6.4-1 1-1z" },
  { label: "Instagram", href: site.social.instagram, d: "M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21 8c-.1-1.6-.4-3-1.6-4.2S16.6 2.1 15 2H9C7.4 2.1 6 2.4 4.8 3.6S3.1 6.4 3 8v8c.1 1.6.4 3 1.6 4.2S7.4 21.9 9 22h6c1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2V8zm-2 9.4a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.3.4s-4.1.1-5.3-.4a3 3 0 0 1-1.7-1.7C4.5 16.2 4.6 13.4 4.6 12s-.1-4.2.4-5.3A3 3 0 0 1 6.7 5c1.2-.5 4-.4 5.3-.4s4.1-.1 5.3.4A3 3 0 0 1 19 6.7c.5 1.2.4 4 .4 5.3s.1 4.2-.4 5.4z" },
  { label: "Pinterest", href: site.social.pinterest, d: "M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.8 0 1.2.6 1.2 1.4 0 .8-.5 2.1-.8 3.2-.2 1 .5 1.8 1.4 1.8 1.7 0 3-1.8 3-4.4 0-2.3-1.6-3.9-4-3.9-2.7 0-4.3 2-4.3 4.2 0 .8.3 1.7.7 2.2l.1.4-.3 1c0 .2-.2.3-.4.2-1.2-.6-2-2.4-2-3.8 0-3.1 2.2-5.9 6.5-5.9 3.4 0 6 2.4 6 5.7 0 3.4-2.1 6.1-5.1 6.1-1 0-2-.5-2.3-1.2l-.6 2.4c-.2.9-.8 2-1.2 2.6A10 10 0 1 0 12 2z" },
];

export function Footer() {
  return (
    <footer className="bg-plum-900 text-plum-100">
      <section id="newsletter" className="bg-gradient-to-r from-rose-600 to-plum-600 text-white">
        <div className="container-x grid items-center gap-6 py-10 md:grid-cols-2 md:py-12">
          <div>
            <p className="font-display text-3xl font-bold">Get 10% off your first order</p>
            <p className="mt-2 text-white/90">Join our flower club for exclusive offers, seasonal arrivals and holiday reminders. Unsubscribe anytime.</p>
          </div>
          <NewsletterForm dark />
        </div>
      </section>

      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-plum-100/90">
            Fresh flowers for every moment—shipped overnight for next-day delivery across the United States. Every bouquet is backed by our 100% satisfaction guarantee.
          </p>
          <ul className="mt-6 space-y-3 text-[0.95rem]">
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <a href={`tel:${site.phone}`} className="font-bold text-white hover:underline">{site.phoneDisplay}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <span>
                <a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a>
                <br />
                <a href={`mailto:${site.emailAlt}`} className="hover:underline">{site.emailAlt}</a>
              </span>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <span>{addressLine}</span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <span>{site.hours}</span>
            </li>
          </ul>
          <div className="mt-6 flex gap-2 empty:hidden">
            {socials.filter((s) => s.href).map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-rose-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        {footerMenu.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <p className="mb-4 font-display text-lg font-bold text-white">{g.title}</p>
            <ul className="space-y-2.5 text-[0.95rem]">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-sm text-plum-100/80 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.domain} is an online flower shop owned and operated by{" "}
            <a href={site.parent.url} target="_blank" rel="noopener" className="font-bold text-white underline-offset-2 hover:underline">
              {site.company.displayName}
            </a>
            , a {site.company.state} limited liability company, {addressLine}.
          </p>
          <div className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
            {["Visa", "Mastercard", "Amex", "Discover", "Apple Pay", "Google Pay"].map((p) => (
              <span key={p} className="rounded-md bg-white px-2 py-1 text-[0.6875rem] font-extrabold text-plum-800">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
