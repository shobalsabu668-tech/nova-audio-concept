import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Your bag",
  alternates: { canonical: "/cart" },
};

export default function Page() {
  return (
    <main id="main" className="flex-1">
      <CartPage />
    </main>
  );
}
