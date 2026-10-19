"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

export function NewsletterForm({ source = "footer", dark = false }: { source?: string; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setState("done");
      setMsg(data.message);
    } catch (err) {
      setState("error");
      setMsg((err as Error).message);
    }
  }

  if (state === "done") {
    return (
      <p role="status" className={`flex items-start gap-2 rounded-2xl p-4 font-semibold ${dark ? "bg-white/10 text-white" : "bg-leaf-soft text-leaf"}`}>
        <Check className="mt-0.5 h-5 w-5 shrink-0" /> {msg}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="w-full" noValidate>
      <label htmlFor={`nl-${source}`} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`nl-${source}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-invalid={state === "error" || undefined}
          aria-describedby={state === "error" ? `nl-${source}-err` : undefined}
          className="field flex-1 !rounded-full !border-transparent"
        />
        <button className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          Get 10% Off
        </button>
      </div>
      {state === "error" && (
        <p id={`nl-${source}-err`} className={`mt-2 text-sm font-semibold ${dark ? "text-rose-100" : "text-danger"}`}>
          {msg}
        </p>
      )}
    </form>
  );
}
