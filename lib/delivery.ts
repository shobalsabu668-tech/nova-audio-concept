/**
 * DELIVERY — business-day estimates from the first digit of an Indian PIN
 * code (a simplified, fictional network shipping from Bengaluru).
 */

const ZONE_DAYS: Record<string, [number, number]> = {
  "5": [1, 2],
  "6": [2, 3],
  "4": [2, 4],
  "3": [3, 5],
  "1": [3, 5],
  "2": [3, 5],
  "7": [4, 6],
  "8": [4, 6],
  "9": [5, 7],
};

export const isPin = (pin: string) => /^[1-9]\d{5}$/.test(pin);

export function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) added++;
  }
  return d;
}

const fmt = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" });
export const formatDay = (d: Date) => fmt.format(d);

/** Estimated delivery window for a PIN code; `express` shaves a day off both ends. */
export function estimate(pin: string, express = false, from = new Date()): { from: Date; to: Date } | null {
  if (!isPin(pin)) return null;
  const [lo, hi] = ZONE_DAYS[pin[0]];
  const shift = express ? 1 : 0;
  return { from: addBusinessDays(from, Math.max(1, lo - shift)), to: addBusinessDays(from, Math.max(1, hi - shift)) };
}

export function formatWindow(w: { from: Date; to: Date }): string {
  return w.from.toDateString() === w.to.toDateString() ? formatDay(w.to) : `${formatDay(w.from)} – ${formatDay(w.to)}`;
}

export const EXPRESS_FEE = 450;

export const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];
