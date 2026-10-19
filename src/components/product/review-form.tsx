"use client";

import { useState } from "react";
import { Check, Loader2, Star } from "lucide-react";

export function ReviewForm({ productId }: { productId: number }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setErrors({});
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, name: fd.get("name"), email: fd.get("email"), title: fd.get("title"), body: fd.get("body"), website: fd.get("website") }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("idle");
      setErrors(data.errors ?? {});
      setMsg(data.message ?? "Please check the form.");
      return;
    }
    setState("done");
  }

  if (state === "done")
    return (
      <p role="status" className="flex items-center gap-2 rounded-2xl bg-leaf-soft p-4 font-semibold text-leaf">
        <Check className="h-5 w-5" /> Thank you! Your review will appear after a quick check by our team.
      </p>
    );

  if (!open)
    return (
      <button className="btn btn-outline" onClick={() => setOpen(true)}>
        Write a Review
      </button>
    );

  const err = (k: string) => errors[k] && <p className="error-text" id={`rv-${k}-err`}>{errors[k]}</p>;

  return (
    <form onSubmit={submit} className="card space-y-4 p-5 md:p-6" noValidate>
      <fieldset>
        <legend className="label">Your rating</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button type="button" key={i} onClick={() => setRating(i)} aria-label={`${i} star${i > 1 ? "s" : ""}`} aria-pressed={rating === i} className="grid h-11 w-11 place-items-center rounded-full text-gold hover:bg-gold-soft">
              <Star className="h-7 w-7" fill={rating >= i ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="rv-name">Name</label>
          <input id="rv-name" name="name" className="field" required maxLength={80} aria-invalid={Boolean(errors.name) || undefined} aria-describedby={errors.name ? "rv-name-err" : undefined} />
          {err("name")}
        </div>
        <div>
          <label className="label" htmlFor="rv-email">Email <span className="font-normal text-muted">(not published)</span></label>
          <input id="rv-email" name="email" type="email" className="field" maxLength={190} aria-invalid={Boolean(errors.email) || undefined} />
          {err("email")}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="rv-title">Headline</label>
        <input id="rv-title" name="title" className="field" maxLength={120} />
      </div>
      <div>
        <label className="label" htmlFor="rv-body">Your review</label>
        <textarea id="rv-body" name="body" rows={4} className="field" required maxLength={2000} aria-invalid={Boolean(errors.body) || undefined} aria-describedby={errors.body ? "rv-body-err" : undefined} />
        {err("body")}
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {msg && Object.keys(errors).length === 0 && <p className="error-text">{msg}</p>}
      <button className="btn btn-primary" disabled={state === "sending"}>
        {state === "sending" && <Loader2 className="h-5 w-5 animate-spin" />} Submit Review
      </button>
    </form>
  );
}
