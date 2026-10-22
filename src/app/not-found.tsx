import Link from "next/link";
import { LogoMark } from "@/components/logo";

/** 404 for URLs outside the store layout (e.g. deep unknown paths). */
export default function RootNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-blush p-6 text-center">
      <div>
        <LogoMark className="mx-auto h-14 w-14" />
        <p className="eyebrow mt-6">Error 404</p>
        <h1 className="mt-2 text-4xl font-bold text-plum-700">This page has wilted</h1>
        <p className="mt-3 text-lg text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link href="/flowers" className="btn btn-outline">
            Shop Flowers
          </Link>
        </div>
      </div>
    </main>
  );
}
