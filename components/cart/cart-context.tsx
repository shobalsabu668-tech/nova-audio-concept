"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { getVariant, type Product, type Variant } from "@/lib/catalogue";
import { finishes } from "@/lib/catalogue";
import { site } from "@/lib/site";

/**
 * CART — one reducer shared by every surface (product cards, the product
 * page, the drawer, the cart page, checkout), so they always agree on
 * quantities and totals. Persisted to localStorage as a per-visitor
 * convenience; if storage is unavailable, the cart simply lives in memory.
 */

export type Line = { variantId: string; qty: number };
export type DetailedLine = Line & { product: Product; variant: Variant; total: number };

type Action =
  | { type: "add"; variantId: string; qty: number }
  | { type: "set"; variantId: string; qty: number }
  | { type: "remove"; variantId: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: Line[] };

const MAX_QTY = 9;
const STORAGE_KEY = "nova-cart-v1";

function reducer(state: Line[], action: Action): Line[] {
  switch (action.type) {
    case "add": {
      const stock = getVariant(action.variantId)?.variant.quantityAvailable ?? MAX_QTY;
      const cap = Math.min(MAX_QTY, stock);
      const hit = state.find((l) => l.variantId === action.variantId);
      if (hit) return state.map((l) => (l.variantId === action.variantId ? { ...l, qty: Math.min(cap, l.qty + action.qty) } : l));
      return [...state, { variantId: action.variantId, qty: Math.min(cap, action.qty) }];
    }
    case "set": {
      if (action.qty <= 0) return state.filter((l) => l.variantId !== action.variantId);
      const stock = getVariant(action.variantId)?.variant.quantityAvailable ?? MAX_QTY;
      return state.map((l) => (l.variantId === action.variantId ? { ...l, qty: Math.min(MAX_QTY, stock, action.qty) } : l));
    }
    case "remove":
      return state.filter((l) => l.variantId !== action.variantId);
    case "clear":
      return [];
    case "hydrate":
      return action.lines.filter((l) => getVariant(l.variantId)?.variant.availableForSale);
  }
}

type CartValue = {
  lines: DetailedLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (variantId: string, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  /** Most recent change, for the live region and the "added" toast. */
  notice: { id: number; text: string; variantId?: string } | null;
  maxFor: (variantId: string) => number;
  /** False until the saved bag has been read from storage. */
  ready: boolean;
};

const CartContext = createContext<CartValue | null>(null);

export const SHIPPING_FEE = 250;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, dispatch] = useReducer(reducer, []);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<CartValue["notice"]>(null);
  const hydrated = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) dispatch({ type: "hydrate", lines: saved });
    } catch {
      /* storage unavailable: the cart lives in memory */
    }
    hydrated.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* ignore */
    }
  }, [raw]);

  const lines = useMemo<DetailedLine[]>(
    () =>
      raw.flatMap((l) => {
        const hit = getVariant(l.variantId);
        return hit ? [{ ...l, ...hit, total: hit.variant.price.amount * l.qty }] : [];
      }),
    [raw],
  );

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.total, 0);
  const shipping = count === 0 || subtotal >= site.freeShippingOver ? 0 : SHIPPING_FEE;

  const say = (text: string, variantId?: string) => setNotice({ id: Date.now(), text, variantId });

  const add = useCallback((variantId: string, qty = 1) => {
    const hit = getVariant(variantId);
    if (!hit || !hit.variant.availableForSale) return;
    dispatch({ type: "add", variantId, qty });
    say(`Added ${qty} × ${hit.product.title}, ${finishes[hit.variant.finish].name}, to your bag.`, variantId);
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    const hit = getVariant(variantId);
    dispatch({ type: "set", variantId, qty });
    if (hit) say(qty <= 0 ? `Removed ${hit.product.title} from your bag.` : `${hit.product.title}: quantity ${qty}.`);
  }, []);

  const remove = useCallback((variantId: string) => {
    const hit = getVariant(variantId);
    dispatch({ type: "remove", variantId });
    if (hit) say(`Removed ${hit.product.title}, ${finishes[hit.variant.finish].name}, from your bag.`);
  }, []);

  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const maxFor = useCallback((variantId: string) => Math.min(MAX_QTY, getVariant(variantId)?.variant.quantityAvailable ?? MAX_QTY), []);

  const value: CartValue = { lines, count, subtotal, shipping, total: subtotal + shipping, open, setOpen, add, setQty, remove, clear, notice, maxFor, ready };

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only" role="status" aria-live="polite">
        {notice?.text}
      </p>
    </CartContext.Provider>
  );
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
