"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarDays, Gift, Loader2, Lock, MapPin, ShieldCheck, Tag, User, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { QtyStepper, FreeDeliveryMeter } from "@/components/cart/cart-drawer";
import { addDays, earliestDate, latestDate, todayET } from "@/lib/delivery";
import { formatDate, img, usd } from "@/lib/format";
import { addOnOf, computeTotals, sizeOf, type CouponLike } from "@/lib/pricing";
import { US_STATES, deliveryWindows } from "@/lib/site";

type Prefill = {
  name?: string;
  email?: string;
  phone?: string | null;
  addresses: { id: number; label: string; recipientName: string; recipientPhone: string; company: string | null; street: string; apt: string | null; city: string; state: string; zip: string }[];
};

const ADDRESS_TYPES = [
  { value: "residence", label: "Home" },
  { value: "business", label: "Business" },
  { value: "hospital", label: "Hospital" },
  { value: "funeral_home", label: "Funeral home" },
  { value: "church", label: "Church / venue" },
];

function Section({ n, icon: Icon, title, children }: { n: number; icon: typeof User; title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 md:p-7" aria-labelledby={`step-${n}`}>
      <h2 id={`step-${n}`} className="mb-5 flex items-center gap-3 font-display text-2xl font-bold text-plum-700">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-plum-600 font-sans text-base text-white">{n}</span>
        <Icon className="h-5 w-5 text-rose-600" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CheckoutForm({ prefill, canceled, online }: { prefill: Prefill; canceled: boolean; online: boolean }) {
  const { lines, ready, subtotal, allSameDay, setQty, remove, lineTotal } = useCart();
  const [f, setF] = useState<Record<string, string>>({
    senderName: prefill.name ?? "",
    senderEmail: prefill.email ?? "",
    senderPhone: prefill.phone ?? "",
    recipientName: "",
    recipientPhone: "",
    addressType: "residence",
    company: "",
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    deliveryDate: "",
    deliveryWindow: "anytime",
    cardMessage: "",
    cardSignature: "",
    instructions: "",
    website: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [serverMsg, setServerMsg] = useState(canceled ? "Payment was canceled. Your cart is saved—you can try again whenever you're ready." : "");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<(CouponLike & { code: string; description: string }) | null>(null);
  const [couponMsg, setCouponMsg] = useState("");

  const minDate = useMemo(() => earliestDate(allSameDay), [allSameDay]);
  const maxDate = useMemo(() => latestDate(), []);
  const quickDates = useMemo(() => [0, 1, 2, 3].map((i) => addDays(minDate, i)), [minDate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- default to the earliest valid date once the cart is known
    if (ready && (!f.deliveryDate || f.deliveryDate < minDate)) setF((x) => ({ ...x, deliveryDate: minDate }));
  }, [ready, minDate, f.deliveryDate]);

  const sameDay = f.deliveryDate === todayET();
  const totals = computeTotals(subtotal, { sameDay, coupon });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((x) => ({ ...x, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: "" }));
  };

  const field = (k: string, label: string, opts: { type?: string; auto?: string; optional?: boolean; placeholder?: string; className?: string; inputMode?: "numeric" | "tel" | "email" } = {}) => (
    <div className={opts.className}>
      <label className="label" htmlFor={`co-${k}`}>
        {label} {opts.optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input
        id={`co-${k}`}
        name={k}
        type={opts.type ?? "text"}
        autoComplete={opts.auto}
        inputMode={opts.inputMode}
        placeholder={opts.placeholder}
        value={f[k]}
        onChange={set(k)}
        className="field"
        aria-invalid={Boolean(errors[k]) || undefined}
        aria-describedby={errors[k] ? `co-${k}-err` : undefined}
        required={!opts.optional}
      />
      {errors[k] && (
        <p id={`co-${k}-err`} className="error-text">
          {errors[k]}
        </p>
      )}
    </div>
  );

  async function applyCoupon() {
    setCouponMsg("");
    const res = await fetch("/api/coupon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponInput, subtotal }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setCoupon(null);
      setCouponMsg(data.message ?? "That code isn't valid.");
      return;
    }
    setCoupon(data);
    setCouponMsg("");
  }

  function applySavedAddress(id: string) {
    const a = prefill.addresses.find((x) => String(x.id) === id);
    if (!a) return;
    setF((x) => ({ ...x, recipientName: a.recipientName, recipientPhone: a.recipientPhone, company: a.company ?? "", street: a.street, apt: a.apt ?? "", city: a.city, state: a.state, zip: a.zip }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setServerMsg("");
    setErrors({});
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, agree, couponCode: coupon?.code, items: lines.map((l) => ({ productId: l.productId, size: l.size, addOns: l.addOns, qty: l.qty })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.redirect) {
        setErrors(data.errors ?? {});
        setServerMsg(data.message ?? "Something went wrong. Please try again.");
        setStatus("idle");
        const first = Object.keys(data.errors ?? {})[0];
        if (first) document.getElementById(`co-${first}`)?.focus();
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      window.location.href = data.redirect;
    } catch {
      setServerMsg("Network error. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (!ready) return <div className="h-[600px] animate-pulse rounded-[var(--radius-card)] bg-blush" aria-label="Loading checkout" />;

  if (lines.length === 0)
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <p className="font-display text-2xl font-bold text-plum-700">Your cart is empty</p>
        <p className="mt-2 text-muted">Add a bouquet to get started.</p>
        <Link href="/best-sellers" className="btn btn-primary mt-6">
          Shop Best Sellers
        </Link>
      </div>
    );

  const msgLen = f.cardMessage.length;

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        {serverMsg && (
          <p role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-50 p-4 font-semibold text-rose-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> {serverMsg}
          </p>
        )}
        {!prefill.email && (
          <p className="rounded-2xl bg-blush p-4 text-sm">
            Have an account?{" "}
            <Link href="/account/login?next=/checkout" className="font-extrabold text-rose-600 hover:underline">
              Sign in
            </Link>{" "}
            for faster checkout and order history. Guest checkout works too.
          </p>
        )}

        <Section n={1} icon={User} title="Your Information">
          <div className="grid gap-4 sm:grid-cols-2">
            {field("senderName", "Full name", { auto: "name", className: "sm:col-span-2" })}
            {field("senderEmail", "Email", { type: "email", auto: "email", inputMode: "email" })}
            {field("senderPhone", "Phone", { type: "tel", auto: "tel", inputMode: "tel" })}
          </div>
          <p className="mt-3 text-xs text-muted">We&apos;ll send your order confirmation and delivery updates here.</p>
        </Section>

        <Section n={2} icon={MapPin} title="Delivery Address">
          {prefill.addresses.length > 0 && (
            <div className="mb-5">
              <label className="label" htmlFor="co-saved">
                Use a saved address
              </label>
              <select id="co-saved" className="field" defaultValue="" onChange={(e) => applySavedAddress(e.target.value)}>
                <option value="">Select…</option>
                {prefill.addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label || a.recipientName} — {a.street}, {a.city}
                  </option>
                ))}
              </select>
            </div>
          )}
          <fieldset className="mb-5">
            <legend className="label">Delivering to a</legend>
            <div className="flex flex-wrap gap-2">
              {ADDRESS_TYPES.map((t) => (
                <label key={t.value} className={`inline-flex min-h-10 cursor-pointer items-center rounded-full border-2 px-4 text-sm font-bold ${f.addressType === t.value ? "border-plum-600 bg-plum-50 text-plum-700" : "border-line"}`}>
                  <input type="radio" name="addressType" value={t.value} checked={f.addressType === t.value} onChange={set("addressType")} className="sr-only" />
                  {t.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("recipientName", "Recipient's full name", { auto: "shipping name" })}
            {field("recipientPhone", "Recipient's phone", { type: "tel", auto: "shipping tel", inputMode: "tel" })}
            {f.addressType !== "residence" &&
              field("company", f.addressType === "hospital" ? "Hospital name" : f.addressType === "funeral_home" ? "Funeral home name" : "Business / venue name", { auto: "shipping organization", optional: true, className: "sm:col-span-2" })}
            {field("street", "Street address", { auto: "shipping address-line1", className: "sm:col-span-2" })}
            {field("apt", f.addressType === "hospital" ? "Room / floor" : "Apt, suite, floor", { auto: "shipping address-line2", optional: true })}
            {field("city", "City", { auto: "shipping address-level2" })}
            <div>
              <label className="label" htmlFor="co-state">
                State
              </label>
              <select id="co-state" className="field" value={f.state} onChange={set("state")} autoComplete="shipping address-level1" aria-invalid={Boolean(errors.state) || undefined} aria-describedby={errors.state ? "co-state-err" : undefined}>
                <option value="">Select a state</option>
                {US_STATES.map(([c, n]) => (
                  <option key={c} value={c}>
                    {n}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p id="co-state-err" className="error-text">
                  {errors.state}
                </p>
              )}
            </div>
            {field("zip", "ZIP code", { auto: "shipping postal-code", inputMode: "numeric" })}
          </div>
        </Section>

        <Section n={3} icon={CalendarDays} title="Delivery Date">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {quickDates.map((d) => {
              const on = f.deliveryDate === d;
              const isToday = d === todayET();
              return (
                <button
                  type="button"
                  key={d}
                  onClick={() => setF((x) => ({ ...x, deliveryDate: d }))}
                  aria-pressed={on}
                  className={`rounded-2xl border-2 p-3 text-center transition-colors ${on ? "border-plum-600 bg-plum-50" : "border-line hover:border-plum-200"}`}
                >
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-rose-600">{isToday ? "Today" : formatDate(d, { weekday: "short" })}</span>
                  <span className="block text-lg font-extrabold">{formatDate(d, { month: "short", day: "numeric" })}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="co-deliveryDate">
                Or pick a date
              </label>
              <input id="co-deliveryDate" type="date" min={minDate} max={maxDate} value={f.deliveryDate} onChange={set("deliveryDate")} className="field" aria-invalid={Boolean(errors.deliveryDate) || undefined} aria-describedby="co-deliveryDate-help" />
              <p id="co-deliveryDate-help" className={errors.deliveryDate ? "error-text" : "mt-1.5 text-xs text-muted"}>
                {errors.deliveryDate || (allSameDay ? "Same-day available until 2 PM recipient's time (12 PM weekends)." : "One or more items need at least 1 day's notice.")}
              </p>
            </div>
            <div>
              <label className="label" htmlFor="co-deliveryWindow">
                Time window
              </label>
              <select id="co-deliveryWindow" className="field" value={f.deliveryWindow} onChange={set("deliveryWindow")}>
                {deliveryWindows.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-muted">We do our best to honor time windows; they aren&apos;t guaranteed.</p>
            </div>
          </div>
          <div className="mt-4">
            <label className="label" htmlFor="co-instructions">
              Delivery instructions <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea id="co-instructions" rows={2} maxLength={500} value={f.instructions} onChange={set("instructions")} className="field" placeholder="Gate code, leave with front desk, service time for funerals…" />
          </div>
        </Section>

        <Section n={4} icon={Gift} title="Card Message">
          <label className="label" htmlFor="co-cardMessage">
            Your message <span className="font-normal text-muted">(free)</span>
          </label>
          <textarea id="co-cardMessage" rows={4} maxLength={300} value={f.cardMessage} onChange={set("cardMessage")} className="field" placeholder="Happy birthday! Wishing you a year as bright as these flowers." aria-describedby="co-cardMessage-count" />
          <p id="co-cardMessage-count" className="mt-1 text-right text-xs text-muted" aria-live="polite">
            {msgLen}/300
          </p>
          {field("cardSignature", "Sign the card as", { optional: true, placeholder: "With love, Sarah" })}
        </Section>

        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" value={f.website} onChange={set("website")} />
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-36 lg:self-start">
        <div className="card p-5 md:p-6">
          <h2 className="font-display text-2xl font-bold text-plum-700">Order Summary</h2>
          <ul className="mt-4 divide-y divide-line">
            {lines.map((l) => (
              <li key={l.id} className="flex gap-3 py-3">
                <Image src={img(l.image)} alt="" width={64} height={80} className="h-20 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="font-bold leading-snug">{l.name}</p>
                    <button type="button" onClick={() => remove(l.id)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-blush" aria-label={`Remove ${l.name}`}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted">
                    {l.hasSizes ? sizeOf(l.size).label : "One size"}
                    {l.addOns.length > 0 && ` · + ${l.addOns.map((k) => addOnOf(k)?.label).join(", ")}`}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <QtyStepper qty={l.qty} onChange={(n) => setQty(l.id, n)} label={l.name} />
                    <span className="font-extrabold">{usd(lineTotal(l))}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3">
            <FreeDeliveryMeter subtotal={subtotal} />
          </div>

          <div className="mt-4">
            {coupon ? (
              <p className="flex items-center justify-between rounded-xl bg-leaf-soft px-3 py-2.5 text-sm font-bold text-leaf">
                <span className="flex items-center gap-2">
                  <Tag className="h-4 w-4" /> {coupon.code} applied
                </span>
                <button type="button" className="underline" onClick={() => setCoupon(null)}>
                  Remove
                </button>
              </p>
            ) : (
              <div>
                <label className="label" htmlFor="co-couponCode">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input id="co-couponCode" className="field uppercase" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} aria-invalid={Boolean(couponMsg || errors.couponCode) || undefined} aria-describedby="co-coupon-msg" />
                  <button type="button" className="btn btn-outline btn-sm !min-h-12" onClick={applyCoupon} disabled={!couponInput.trim()}>
                    Apply
                  </button>
                </div>
                {(couponMsg || errors.couponCode) && (
                  <p id="co-coupon-msg" className="error-text">
                    {couponMsg || errors.couponCode}
                  </p>
                )}
              </div>
            )}
          </div>

          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[0.95rem]">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-bold">{usd(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-bold">{totals.deliveryFee ? usd(totals.deliveryFee) : <span className="text-leaf">FREE</span>}</dd>
            </div>
            {totals.sameDayFee > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Same-day priority</dt>
                <dd className="font-bold">{usd(totals.sameDayFee)}</dd>
              </div>
            )}
            {totals.discount > 0 && (
              <div className="flex justify-between text-leaf">
                <dt>Discount</dt>
                <dd className="font-bold">−{usd(totals.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-3 text-xl">
              <dt className="font-extrabold">Total</dt>
              <dd className="font-extrabold text-plum-700">{usd(totals.total)}</dd>
            </div>
            <p className="text-xs text-muted">Sales tax, if applicable, is calculated on the payment page.</p>
          </dl>

          <label className="mt-5 flex items-start gap-3 text-sm">
            <input id="co-agree" type="checkbox" checked={agree} onChange={(e) => (setAgree(e.target.checked), setErrors((x) => ({ ...x, agree: "" })))} className="mt-0.5 h-5 w-5 accent-rose-600" aria-invalid={Boolean(errors.agree) || undefined} aria-describedby={errors.agree ? "co-agree-err" : undefined} />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="font-bold text-plum-600 underline" target="_blank">
                Terms of Use
              </Link>
              ,{" "}
              <Link href="/delivery-information" className="font-bold text-plum-600 underline" target="_blank">
                Delivery Policy
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="font-bold text-plum-600 underline" target="_blank">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.agree && (
            <p id="co-agree-err" className="error-text">
              {errors.agree}
            </p>
          )}

          <button className="btn btn-primary mt-5 w-full text-lg" disabled={status === "sending"}>
            {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
            {online ? `Continue to Secure Payment` : "Place Order"}
          </button>
          <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-leaf" />
            {online ? "Payments are processed securely by Stripe. We never see your card number." : "Online payment is being set up — we'll call to confirm payment by phone."}
          </p>
        </div>
      </aside>
    </form>
  );
}
