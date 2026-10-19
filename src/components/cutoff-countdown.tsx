"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cutoffCountdown } from "@/lib/delivery";

/** "Order within 3h 12m for same-day delivery" — computed on the client so cached pages stay accurate. */
export function CutoffCountdown({ variant = "pill" }: { variant?: "pill" | "inline" }) {
  const [state, setState] = useState<ReturnType<typeof cutoffCountdown> | undefined>(undefined);

  useEffect(() => {
    const tick = () => setState(cutoffCountdown());
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  if (state === undefined) return <span className={variant === "pill" ? "inline-block h-9" : ""} aria-hidden="true" />;

  const text = state ? (
    <>
      Order within{" "}
      <strong className="tabular-nums">
        {state.hours > 0 ? `${state.hours}h ` : ""}
        {state.minutes}m
      </strong>{" "}
      for <strong>same-day delivery</strong>
    </>
  ) : (
    <>
      Order now for <strong>next-day delivery</strong>
    </>
  );

  if (variant === "inline")
    return (
      <p className="flex items-center gap-2 text-sm text-leaf">
        <Clock className="h-4 w-4 shrink-0" />
        <span>{text}</span>
      </p>
    );

  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm text-ink shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-leaf" />
      </span>
      <span>{text}</span>
    </p>
  );
}
