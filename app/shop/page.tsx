import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopBrowser, ShopView } from "@/components/shop/shop-browser";

export const metadata: Metadata = {
  title: "Shop",
  description: "The NØVA range: ONE, MINI, ARC, ORB and SUB speakers, and accessories. Filter by room, use and finish.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <main id="main" className="flex-1">
      <Suspense fallback={<ShopView search="" />}>
        <ShopBrowser />
      </Suspense>
    </main>
  );
}
