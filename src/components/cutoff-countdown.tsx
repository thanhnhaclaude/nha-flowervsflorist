"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cutoffCountdown } from "@/lib/delivery";
import { formatDate } from "@/lib/format";

/**
 * "Order within 2h 15m for delivery Wednesday, Oct 21" — computed on the client so cached pages stay
 * accurate. Before the 2 PM ET ship cut-off it counts down; afterwards it shows the next arrival date.
 */
export function CutoffCountdown({ variant = "pill" }: { variant?: "pill" | "inline" }) {
  const [state, setState] = useState<ReturnType<typeof cutoffCountdown> | undefined>(undefined);

  useEffect(() => {
    const tick = () => setState(cutoffCountdown());
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  // Same box as the real pill/line (invisible) so the text below doesn't shift when it appears.
  if (state === undefined)
    return variant === "pill" ? (
      <p className="invisible inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm" aria-hidden="true">
        Order within 10h 59m for delivery Wednesday, Oct 28
      </p>
    ) : (
      <p className="invisible flex items-center gap-2 text-sm" aria-hidden="true">
        Order within 10h 59m for delivery Wednesday, Oct 28
      </p>
    );

  const arrives = formatDate(state.arrives, { weekday: "long", month: "short", day: "numeric" });
  const text = state.open ? (
    <>
      Order within{" "}
      <strong className="tabular-nums">
        {state.hours > 0 ? `${state.hours}h ` : ""}
        {state.minutes}m
      </strong>{" "}
      for delivery <strong>{arrives}</strong>
    </>
  ) : (
    <>
      Order now for delivery <strong>{arrives}</strong>
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
