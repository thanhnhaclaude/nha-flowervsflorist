"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "./product-card";
import { sortProducts, type ListItem, type SortKey } from "@/lib/cards";

export const PRICE_RANGES = [
  { key: "under-50", label: "Under $50", min: 0, max: 4999 },
  { key: "50-75", label: "$50 – $75", min: 5000, max: 7499 },
  { key: "75-100", label: "$75 – $100", min: 7500, max: 9999 },
  { key: "100-plus", label: "$100+", min: 10000, max: Infinity },
] as const;

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "newest", label: "Newest" },
  { key: "name", label: "Name A–Z" },
];

const COLOR_SWATCH: Record<string, string> = {
  red: "#dc2626",
  pink: "#f472b6",
  white: "#ffffff",
  yellow: "#facc15",
  orange: "#fb923c",
  purple: "#9333ea",
  green: "#16a34a",
};

export type ListingParams = { color?: string; price?: string; sort?: string; nextday?: string };

const KEYS = ["color", "price", "sort", "nextday"] as const;
const readParams = (search: string): ListingParams => {
  const sp = new URLSearchParams(search);
  return Object.fromEntries(KEYS.flatMap((k) => (sp.get(k) ? [[k, sp.get(k)!]] : [])));
};

function applyFilters(list: ListItem[], params: ListingParams) {
  let out = list;
  if (params.color) out = out.filter((p) => p.colors.includes(params.color!));
  const range = PRICE_RANGES.find((r) => r.key === params.price);
  if (range) out = out.filter((p) => p.price >= range.min && p.price <= range.max);
  if (params.nextday === "1") out = out.filter((p) => p.nextDay);
  const sort = (SORTS.find((s) => s.key === params.sort)?.key ?? "featured") as SortKey;
  return sortProducts(out, sort);
}

/**
 * Filter bar + grid. The page is cached (ISR), so filters run in the browser: `children` is the
 * server-rendered default grid (what crawlers and first paint see); once a filter is chosen the grid is
 * rebuilt client-side from `items`. Filters stay real links (?color=red) for no-JS and shareable URLs.
 */
export function Listing({ basePath, items, children }: { basePath: string; items: ListItem[]; children: React.ReactNode }) {
  const [params, setParams] = useState<ListingParams>({});

  useEffect(() => {
    const sync = () => setParams(readParams(window.location.search));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const href = (patch: Partial<ListingParams>) => {
    const next = { ...params, ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const url = e.currentTarget.getAttribute("href")!;
    window.history.pushState(null, "", url);
    setParams(readParams(url.split("?")[1] ?? ""));
  };

  const filtering = Object.keys(params).length > 0;
  const shown = filtering ? applyFilters(items, params) : items;
  const colors = [...new Set(items.flatMap((p) => p.colors))].filter((c) => COLOR_SWATCH[c]);
  const active = Boolean(params.color || params.price || params.nextday);
  const chip = (on: boolean) =>
    `inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors ${on ? "border-plum-600 bg-plum-600 text-white" : "border-line bg-white text-ink hover:border-plum-200 hover:bg-blush"}`;

  return (
    <div>
      <div className="mb-8 space-y-4 rounded-[var(--radius-card)] border border-line bg-white p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 flex items-center gap-2 text-sm font-extrabold text-plum-700">
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </span>
          <a href={href({ nextday: params.nextday === "1" ? undefined : "1" })} onClick={go} className={chip(params.nextday === "1")} rel="nofollow">
            Next-day delivery
          </a>
          {PRICE_RANGES.map((r) => (
            <a key={r.key} href={href({ price: params.price === r.key ? undefined : r.key })} onClick={go} className={chip(params.price === r.key)} rel="nofollow">
              {r.label}
            </a>
          ))}
        </div>
        {colors.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-extrabold text-plum-700">Color</span>
            {colors.map((c) => (
              <a key={c} href={href({ color: params.color === c ? undefined : c })} onClick={go} className={chip(params.color === c)} aria-current={params.color === c ? "true" : undefined} rel="nofollow">
                <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: COLOR_SWATCH[c] }} aria-hidden="true" />
                <span className="capitalize">{c}</span>
              </a>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-sm text-muted" aria-live="polite">
            <strong className="text-ink">{shown.length}</strong> {shown.length === 1 ? "design" : "designs"}
            {active && (
              <a href={basePath} onClick={go} className="ml-3 font-bold text-rose-600 hover:underline">
                Clear filters
              </a>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <span className="font-bold text-muted">Sort:</span>
            {SORTS.map((s) => {
              const on = (params.sort ?? "featured") === s.key;
              return (
                <a key={s.key} href={href({ sort: s.key === "featured" ? undefined : s.key })} onClick={go} rel="nofollow" aria-current={on ? "true" : undefined} className={`rounded-full px-3 py-1.5 font-bold ${on ? "bg-petal text-plum-700" : "text-ink hover:bg-blush"}`}>
                  {s.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <h2 className="sr-only">Products</h2>
      {!filtering ? (
        children
      ) : shown.length ? (
        <ProductGrid products={shown} />
      ) : (
        <div className="rounded-[var(--radius-card)] bg-blush p-10 text-center">
          <p className="font-display text-2xl font-bold text-plum-700">No designs match those filters</p>
          <a href={basePath} onClick={go} className="btn btn-primary mt-5">
            Clear filters
          </a>
        </div>
      )}
    </div>
  );
}
