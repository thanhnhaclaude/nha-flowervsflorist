import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { formatDate, img } from "@/lib/format";
import { readingMinutes } from "@/lib/markdown";
import { getPosts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

// Cached and refreshed hourly (ISR) so Hostinger's CDN serves it from cache; admin edits revalidate the origin instantly (CDN copy within 1h).
export const revalidate = 3600;
export const metadata = pageMeta({
  title: "Flower Blog: Meanings, Care Tips & Gifting Guides",
  description: "Flower meanings, care tips, etiquette and gifting ideas from the florists at FlowerVsFlorist.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;
  return (
    <>
      <PageHero eyebrow="The flower journal" title="Flower Tips, Meanings & Inspiration" text="Practical advice to help you choose, send and care for flowers." />
      <div className="container-x pb-20">
        {lead && (
          <Link href={`/blog/${lead.slug}`} className="group card mb-10 grid overflow-hidden md:grid-cols-2">
            <span className="relative block aspect-[7/4] md:aspect-auto md:min-h-[360px]">
              {lead.cover && <Image src={img(lead.cover)} alt="" fill fetchPriority="high" loading="eager" sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
            </span>
            <span className="flex flex-col justify-center p-7 md:p-10">
              <span className="eyebrow">{lead.category}</span>
              <span className="mt-2 font-display text-3xl font-bold leading-tight text-plum-700 group-hover:text-rose-600">{lead.title}</span>
              <span className="mt-3 text-lg text-muted">{lead.excerpt}</span>
              <span className="mt-4 text-sm text-muted">
                {formatDate(lead.publishedAt)} · {readingMinutes(lead.content)} min read
              </span>
            </span>
          </Link>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="group card overflow-hidden">
              <span className="relative block aspect-[7/4] overflow-hidden">
                {p.cover && <Image src={img(p.cover)} alt="" fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
              </span>
              <span className="block p-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600">{p.category}</span>
                <span className="mt-2 block font-display text-xl font-bold leading-snug group-hover:text-plum-600">{p.title}</span>
                <span className="mt-2 line-clamp-2 block text-sm text-muted">{p.excerpt}</span>
                <span className="mt-3 block text-xs text-muted">
                  {formatDate(p.publishedAt)} · {readingMinutes(p.content)} min read
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
