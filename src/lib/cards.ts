export type CardProduct = {
  id: number;
  slug: string;
  name: string;
  price: number;
  compareAt: number | null;
  images: string[];
  nextDay: boolean;
  hasSizes: boolean;
  badge: string | null;
  rating: number | null;
  reviewCount: number;
};

/** Strip a DB product down to what product cards need (keeps client payloads small). */
export function toCard(p: CardProduct): CardProduct {
  return { id: p.id, slug: p.slug, name: p.name, price: p.price, compareAt: p.compareAt, images: p.images, nextDay: p.nextDay, hasSizes: p.hasSizes, badge: p.badge, rating: p.rating, reviewCount: p.reviewCount };
}

/** A card plus the fields listing filters/sorting need (browser-side filtering on category pages). */
export type ListItem = CardProduct & { colors: string[]; featured: boolean; bestSeller: boolean; sortOrder: number };

export const toListItem = (p: ListItem): ListItem => ({ ...toCard(p), colors: p.colors, featured: p.featured, bestSeller: p.bestSeller, sortOrder: p.sortOrder });

export type SortKey = "featured" | "price-asc" | "price-desc" | "name" | "newest";

type Sortable = { id: number; name: string; price: number; featured: boolean; bestSeller: boolean; sortOrder: number };

export function sortProducts<T extends Sortable>(list: T[], sort: SortKey) {
  const l = [...list];
  switch (sort) {
    case "price-asc":
      return l.sort((a, b) => a.price - b.price);
    case "price-desc":
      return l.sort((a, b) => b.price - a.price);
    case "name":
      return l.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return l.sort((a, b) => b.id - a.id);
    default:
      return l.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller) || a.sortOrder - b.sortOrder);
  }
}
