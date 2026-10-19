"use client";

import { useEffect } from "react";
import { useCart } from "./cart/cart-context";

/** Empties the cart once an order has been placed. */
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
