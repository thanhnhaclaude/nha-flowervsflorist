import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/format";

export default function NotFound() {
  return (
    <section className="container-x grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
      <div className="relative aspect-square overflow-hidden rounded-[1.75rem]">
        <Image src={img("cat/tulips")} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-2 text-4xl font-bold text-plum-700 md:text-5xl">This page has wilted</h1>
        <p className="mt-4 text-lg text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to fresh flowers.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link href="/same-day-flower-delivery" className="btn btn-outline">
            Same-Day Flowers
          </Link>
        </div>
      </div>
    </section>
  );
}
