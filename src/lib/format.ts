const usdFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Formats an amount in cents as US dollars, e.g. 5999 -> "$59.99". */
export const usd = (cents: number) => usdFmt.format(cents / 100);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function formatDate(d: string | Date, opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }) {
  const date = typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(`${d}T12:00:00`) : new Date(d);
  return date.toLocaleDateString("en-US", opts);
}

/** Image reference -> URL: catalog keys ("p/peony-dream") map to /public/images; "/media/…" and full URLs pass through. */
export const img = (key: string) => (key.startsWith("/") || key.startsWith("http") ? key : `/images/${key}.webp`);
