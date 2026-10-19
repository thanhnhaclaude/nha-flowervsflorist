import { Breadcrumbs } from "./ui";
import type { InfoPage } from "@/data/pages";
import { renderMarkdown } from "@/lib/markdown";

export function InfoPageView({ page }: { page: InfoPage }) {
  return (
    <>
      <section className="bg-gradient-to-b from-petal to-white">
        <div className="container-x max-w-3xl py-10 md:py-14">
          <Breadcrumbs items={[{ name: page.title, path: `/${page.slug}` }]} />
          <h1 className="mt-5 text-4xl font-bold text-plum-700 md:text-5xl">{page.title}</h1>
          {page.updated && <p className="mt-3 text-sm text-muted">Last updated: {page.updated}</p>}
        </div>
      </section>
      <div className="container-x max-w-3xl pb-20">
        <div className="prose-fvf" dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }} />
      </div>
    </>
  );
}
