"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4 (gtag.js), loaded on the visitor's first interaction (scroll, tap, click, key)
 * instead of during page load, so it never slows down rendering or Core Web Vitals.
 * GA4 enhanced measurement records the initial page view and later client-side navigations.
 */
export function GoogleAnalytics({ id }: { id: string }) {
  useEffect(() => {
    const events = ["scroll", "pointerdown", "keydown", "touchstart", "mousemove"] as const;
    let loaded = false;

    const load = () => {
      if (loaded) return;
      loaded = true;
      events.forEach((e) => window.removeEventListener(e, load));
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // gtag.js expects the `arguments` object, not an array
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", id);
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(s);
    };

    events.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, load));
  }, [id]);

  return null;
}
