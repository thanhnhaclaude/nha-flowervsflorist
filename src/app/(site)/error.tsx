"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { site } from "@/lib/site";

/** Shown inside the store layout when a page fails (e.g. the database is briefly unavailable). */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-x max-w-2xl py-20 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-2 text-4xl font-bold text-plum-700">We couldn&apos;t load this page</h1>
      <p className="mt-4 text-lg text-muted">
        Please try again in a moment. If you were placing an order, your cart is saved. Need help right away? Call{" "}
        <a href={`tel:${site.phone}`} className="font-bold text-plum-700 underline">
          {site.phoneDisplay}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="btn btn-primary">
          <RefreshCw className="h-5 w-5" /> Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Back to Home
        </Link>
      </div>
      {error.digest && <p className="mt-6 text-xs text-muted">Reference: {error.digest}</p>}
    </section>
  );
}
