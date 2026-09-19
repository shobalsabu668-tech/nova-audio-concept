import type { Money } from "./catalogue";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/** ₹29,900 — Indian digit grouping. */
export function formatMoney(value: Money | number): string {
  return inr.format(typeof value === "number" ? value : value.amount);
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
