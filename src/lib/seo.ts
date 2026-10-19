import type { Metadata } from "next";
import { addressLine, site } from "./site";
import { img } from "./format";

export function pageMeta(opts: { title: string; description: string; path: string; image?: string; noindex?: boolean; type?: "website" | "article" }): Metadata {
  const url = `${site.url}${opts.path === "/" ? "" : opts.path}`;
  const image = opts.image ? `${site.url}${img(opts.image)}` : `${site.url}/images/hero/vibrant-bouquet.webp`;
  return {
    // Titles that already carry the brand skip the "| FlowerVsFlorist" template
    title: opts.title.includes(site.name) ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: url || site.url },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: opts.type ?? "website",
      url,
      siteName: site.name,
      title: opts.title,
      description: opts.description,
      images: [{ url: image }],
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [image] },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    // An online store (no walk-in shop at the office address), owned by M&R Marketing Group.
    "@type": "OnlineStore",
    "@id": `${site.url}/#business`,
    name: site.name,
    legalName: site.company.legalName,
    url: site.url,
    logo: `${site.url}/apple-icon`,
    image: `${site.url}/images/hero/vibrant-bouquet.webp`,
    description: site.description,
    telephone: site.phone,
    email: site.email,
    parentOrganization: { "@type": "Organization", name: site.parent.name, legalName: site.company.legalName, url: site.parent.url, sameAs: site.parent.sameAs },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.company.street,
      addressLocality: site.company.city,
      addressRegion: site.company.region,
      postalCode: site.company.postalCode,
      addressCountry: "US",
    },
    areaServed: { "@type": "Country", name: "United States" },
    hasMerchantReturnPolicy: returnPolicyJsonLd(),
    contactPoint: { "@type": "ContactPoint", telephone: site.phone, email: site.email, contactType: "customer service", areaServed: "US", availableLanguage: "English" },
  };
}

/** Fresh flowers are perishable and aren't sent back; problems are fixed by replacement or refund (see /refund-policy). */
export function returnPolicyJsonLd() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    merchantReturnLink: `${site.url}/refund-policy`,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: site.url,
    name: site.name,
    potentialAction: { "@type": "SearchAction", target: `${site.url}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export const companyLine = `${site.company.displayName} · ${addressLine}`;
