import type { Metadata } from "next";
import { Checkout } from "@/components/checkout/checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description: "A concept checkout. Nothing is charged and no details are sent.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return (
    <main id="main" className="flex-1">
      <Checkout />
    </main>
  );
}
