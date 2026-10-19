"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";

const TOPICS = ["General question", "Order status", "Change an order", "Corporate & events", "Feedback"];

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    setErrors({});
    setMsg("");
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fd) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("idle");
      setErrors(data.errors ?? {});
      setMsg(data.message ?? "Something went wrong.");
      const first = Object.keys(data.errors ?? {})[0];
      if (first) document.getElementById(`ct-${first}`)?.focus();
      return;
    }
    setState("done");
  }

  if (state === "done")
    return (
      <div role="status" className="card p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-soft text-leaf">
          <Check className="h-7 w-7" />
        </span>
        <p className="mt-4 font-display text-2xl font-bold text-plum-700">Message sent!</p>
        <p className="mt-2 text-muted">Thank you—our team will reply within one business day.</p>
      </div>
    );

  const input = (k: string, label: string, type = "text", optional = false, auto?: string) => (
    <div>
      <label className="label" htmlFor={`ct-${k}`}>
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input id={`ct-${k}`} name={k} type={type} autoComplete={auto} className="field" required={!optional} aria-invalid={Boolean(errors[k]) || undefined} aria-describedby={errors[k] ? `ct-${k}-err` : undefined} />
      {errors[k] && (
        <p id={`ct-${k}-err`} className="error-text">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={submit} className="card space-y-4 p-6 md:p-8" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {input("name", "Your name", "text", false, "name")}
        {input("email", "Email", "email", false, "email")}
        {input("phone", "Phone", "tel", true, "tel")}
        {input("orderCode", "Order number", "text", true)}
      </div>
      <div>
        <label className="label" htmlFor="ct-topic">
          Topic
        </label>
        <select id="ct-topic" name="topic" className="field" defaultValue="General question">
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="ct-body">
          How can we help?
        </label>
        <textarea id="ct-body" name="body" rows={5} className="field" required maxLength={4000} aria-invalid={Boolean(errors.body) || undefined} aria-describedby={errors.body ? "ct-body-err" : undefined} />
        {errors.body && (
          <p id="ct-body-err" className="error-text">
            {errors.body}
          </p>
        )}
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {msg && !Object.keys(errors).length && (
        <p role="alert" className="error-text">
          {msg}
        </p>
      )}
      <button className="btn btn-primary" disabled={state === "sending"}>
        {state === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} Send Message
      </button>
    </form>
  );
}
