import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "./product-card";
import { toCard } from "@/lib/cards";
import { sortProducts, type ProductWithRating, type SortKey } from "@/lib/queries";

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

export type ListingParams = { color?: string; price?: string; sort?: string; sameday?: string };

export function applyFilters(list: ProductWithRating[], params: ListingParams) {
  let out = list;
  if (params.color) out = out.filter((p) => p.colors.includes(params.color!));
  const range = PRICE_RANGES.find((r) => r.key === params.price);
  if (range) out = out.filter((p) => p.price >= range.min && p.price <= range.max);
  if (params.sameday === "1") out = out.filter((p) => p.sameDay);
  const sort = (SORTS.find((s) => s.key === params.sort)?.key ?? "featured") as SortKey;
  return sortProducts(out, sort);
}

/** Server-rendered filter bar + grid. Filters are plain links, so they work without JavaScript. */
export function Listing({ basePath, all, params }: { basePath: string; all: ProductWithRating[]; params: ListingParams }) {
  const shown = applyFilters(all, params);
  const colors = [...new Set(all.flatMap((p) => p.colors))].filter((c) => COLOR_SWATCH[c]);
  const href = (patch: Partial<ListingParams>) => {
    const next = { ...params, ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  const active = Boolean(params.color || params.price || params.sameday);
  const chip = (on: boolean) =>
    `inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors ${on ? "border-plum-600 bg-plum-600 text-white" : "border-line bg-white text-ink hover:border-plum-200 hover:bg-blush"}`;

  return (
    <div>
      <div className="mb-8 space-y-4 rounded-[var(--radius-card)] border border-line bg-white p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 flex items-center gap-2 text-sm font-extrabold text-plum-700">
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </span>
          <Link href={href({ sameday: params.sameday === "1" ? undefined : "1" })} className={chip(params.sameday === "1")} scroll={false}>
            Same-day delivery
          </Link>
          {PRICE_RANGES.map((r) => (
            <Link key={r.key} href={href({ price: params.price === r.key ? undefined : r.key })} className={chip(params.price === r.key)} scroll={false}>
              {r.label}
            </Link>
          ))}
        </div>
        {colors.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-extrabold text-plum-700">Color</span>
            {colors.map((c) => (
              <Link key={c} href={href({ color: params.color === c ? undefined : c })} className={chip(params.color === c)} scroll={false} aria-pressed={params.color === c}>
                <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: COLOR_SWATCH[c] }} aria-hidden="true" />
                <span className="capitalize">{c}</span>
              </Link>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-sm text-muted" aria-live="polite">
            <strong className="text-ink">{shown.length}</strong> {shown.length === 1 ? "design" : "designs"}
            {active && (
              <Link href={basePath} className="ml-3 font-bold text-rose-600 hover:underline" scroll={false}>
                Clear filters
              </Link>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <span className="font-bold text-muted">Sort:</span>
            {SORTS.map((s) => {
              const on = (params.sort ?? "featured") === s.key;
              return (
                <Link key={s.key} href={href({ sort: s.key === "featured" ? undefined : s.key })} scroll={false} aria-current={on ? "true" : undefined} className={`rounded-full px-3 py-1.5 font-bold ${on ? "bg-petal text-plum-700" : "text-ink hover:bg-blush"}`}>
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {shown.length ? (
        <ProductGrid products={shown.map(toCard)} priorityCount={4} />
      ) : (
        <div className="rounded-[var(--radius-card)] bg-blush p-10 text-center">
          <p className="font-display text-2xl font-bold text-plum-700">No designs match those filters</p>
          <Link href={basePath} className="btn btn-primary mt-5">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
