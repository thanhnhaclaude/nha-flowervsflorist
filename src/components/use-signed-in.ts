"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Whether a customer is signed in, read from the non-secret "fvf_in" flag cookie set next to the
 * httpOnly session. Reading it in the browser keeps storefront pages cacheable (no cookies() on the server).
 * Re-read on every navigation: sign-in/out redirect client-side without remounting the layout.
 */
export function useSignedIn() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with the cookie after each navigation
    setSignedIn(/(?:^|; )fvf_in=1(?:;|$)/.test(document.cookie));
  }, [pathname]);
  return signedIn;
}
