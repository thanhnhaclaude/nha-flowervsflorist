import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { formatDate, img } from "@/lib/format";
import { headings, readingMinutes, renderMarkdown } from "@/lib/markdown";
import { getPost, getPosts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  return pageMeta({ title: p.seoTitle || p.title, description: p.seoDescription || p.excerpt, path: `/blog/${p.slug}`, image: p.cover ?? undefined, type: "article" });
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const more = (await getPosts()).filter((p) => p.id !== post.id).slice(0, 3);
  const toc = headings(post.content);
  return (
    <article>
      <header className="bg-gradient-to-b from-petal to-white">
        <div className="container-x max-w-4xl py-8 md:py-12">
          <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />
          <p className="eyebrow mt-6">{post.category}</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight text-plum-700 md:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
          <p className="mt-4 text-sm text-muted">
            By {post.author} · <time dateTime={new Date(post.publishedAt).toISOString()}>{formatDate(post.publishedAt)}</time> · {readingMinutes(post.content)} min read
          </p>
        </div>
      </header>
      {post.cover && (
        <div className="container-x max-w-5xl">
          <div className="relative aspect-[7/4] overflow-hidden rounded-[1.75rem]">
            <Image src={img(post.cover)} alt={post.title} fill fetchPriority="high" loading="eager" sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
          </div>
        </div>
      )}
      <div className="container-x grid max-w-5xl gap-10 py-12 lg:grid-cols-[1fr_240px]">
        <div className="prose-fvf" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
        <aside className="space-y-6 lg:sticky lg:top-40 lg:self-start">
          {toc.length > 2 && (
            <nav aria-label="On this page" className="rounded-2xl bg-blush p-5">
              <p className="mb-2 text-sm font-extrabold uppercase tracking-wider text-plum-700">On this page</p>
              <ul className="space-y-1.5 text-sm">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="hover:text-rose-600">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="rounded-2xl bg-plum-700 p-5 text-white">
            <p className="font-display text-xl font-bold">Send flowers tomorrow</p>
            <p className="mt-1 text-sm text-plum-100">Next-day delivery when you order by 2 PM ET.</p>
            <Link href="/next-day-flower-delivery" className="btn btn-primary btn-sm mt-4 w-full">
              Shop now
            </Link>
          </div>
        </aside>
      </div>
      {more.length > 0 && (
        <section className="bg-blush py-14">
          <div className="container-x">
            <h2 className="mb-8 text-3xl font-bold text-plum-700">Keep Reading</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {more.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group card overflow-hidden">
                  <span className="relative block aspect-[7/4]">{p.cover && <Image src={img(p.cover)} alt="" fill sizes="33vw" className="object-cover" />}</span>
                  <span className="block p-5 font-display text-lg font-bold group-hover:text-rose-600">{p.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.cover ? `${site.url}${img(post.cover)}` : undefined,
          datePublished: new Date(post.publishedAt).toISOString(),
          dateModified: new Date(post.updatedAt).toISOString(),
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` } },
          mainEntityOfPage: `${site.url}/blog/${post.slug}`,
        }}
      />
    </article>
  );
}
