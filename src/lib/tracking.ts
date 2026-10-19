/** Carrier tracking links for shipped orders. */
export const CARRIERS = [
  { value: "fedex", label: "FedEx", url: (n: string) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}` },
  { value: "ups", label: "UPS", url: (n: string) => `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}` },
  { value: "usps", label: "USPS", url: (n: string) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(n)}` },
] as const;

export function trackingUrl(carrier: string | null | undefined, number: string | null | undefined) {
  if (!carrier || !number) return null;
  return CARRIERS.find((c) => c.value === carrier)?.url(number) ?? null;
}

export const carrierLabel = (carrier: string | null | undefined) => CARRIERS.find((c) => c.value === carrier)?.label ?? carrier ?? "";
