import type { Product } from "./catalogue";
import { site } from "./site";

/** SUPPORT — policies and answers. Fictional, written as a real store would. */

export type QA = { q: string; a: string };

export const policies = [
  {
    id: "delivery",
    title: "Delivery",
    body: [
      `Free delivery across India on orders over ₹${site.freeShippingOver.toLocaleString("en-IN")}; ₹250 below that.`,
      "Orders placed before 2 pm ship the same day from Bengaluru. Most of South India receives them in one to two business days, the rest of the country in three to seven.",
      "Every order is tracked and needs a signature on delivery.",
    ],
  },
  {
    id: "returns",
    title: "Returns",
    body: [
      "Thirty days to decide. If it isn't right for your room, we collect it from your door and refund you in full, including delivery.",
      "Products should come back in their original packaging, with everything that was in the box.",
    ],
  },
  {
    id: "warranty",
    title: "Warranty",
    body: [
      "Every NØVA speaker has a two-year warranty covering manufacturing faults, and batteries are covered for 80% of their original capacity for the same period.",
      "If something goes wrong, we repair or replace it. You don't need to keep the receipt; your order number is enough.",
    ],
  },
];

export const faqs: QA[] = [
  { q: "Can I pair speakers together?", a: "Yes. Two ONEs pair as a stereo set, SUB pairs with ONE or ARC and tunes its own crossover, and up to eight MINIs can play the same music." },
  { q: "Does NØVA need an app?", a: "No. Everything works over Bluetooth or Wi-Fi from your phone's own controls. The optional app adds room tuning and EQ." },
  { q: "Which speaker suits my room?", a: "ORB for a bedroom or study, ONE for most living rooms, ARC (with SUB, if you like bass) for large or open-plan spaces, and MINI for everywhere else." },
  { q: "How do I pay?", a: "At checkout you'd choose UPI, a card or cash on delivery. This is a concept store, so no payment is ever taken." },
  { q: "Is NØVA a real company?", a: "No. NØVA is a self-initiated concept by Shobal Sabu, built to show what a premium storefront can be. Nothing here can be bought." },
];

export function productFaq(p: Product): QA[] {
  const specific: QA[] = [];
  if (p.productType === "Speaker") {
    specific.push({ q: `How long does ${p.title} take to set up?`, a: "About two minutes. Plug it in (or charge it), hold the top for three seconds, and it appears in your phone's Bluetooth or Wi-Fi settings." });
  }
  if (p.tags.includes("portable")) {
    specific.push({ q: `Can ${p.title} get wet?`, a: "MINI is rated IP67: dust-tight and waterproof to one metre for thirty minutes. Rinse it with fresh water after the beach." });
  }
  if (p.room) {
    const size = { small: "up to about 15 m²", medium: "about 15 to 35 m²", large: "35 m² and above" }[p.room];
    specific.push({ q: "What size of room is it for?", a: `${p.title} is tuned for rooms ${size}.` });
  }
  specific.push({ q: "What if it isn't right for me?", a: "Return it within thirty days. We collect it from your door and refund you in full, including delivery." });
  return specific;
}
