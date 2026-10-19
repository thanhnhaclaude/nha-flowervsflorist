import "server-only";

/**
 * Tiny in-process cache for catalog reads (products, posts, ratings). Storefront pages render on
 * every request, so this keeps TTFB low without hitting MySQL each time. Admin edits call
 * invalidate() so changes show immediately; the TTL covers anything else.
 */
type Entry = { at: number; value: Promise<unknown> };
const g = globalThis as unknown as { __fvfMemo?: Map<string, Entry> };
const store = (g.__fvfMemo ??= new Map());
const TTL = 5 * 60_000;

export function memo<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value as Promise<T>;
  const value = load().catch((e) => {
    store.delete(key);
    throw e;
  });
  store.set(key, { at: Date.now(), value });
  return value;
}

export function invalidate(prefix = "") {
  for (const k of store.keys()) if (k.startsWith(prefix)) store.delete(k);
}
