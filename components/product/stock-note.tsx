import { LOW_STOCK, type Variant } from "@/lib/catalogue";
import { cn } from "@/lib/format";

/** Honest stock messaging: in stock, only n left, or sold out. */
export function StockNote({ variant, className }: { variant: Variant; className?: string }) {
  const q = variant.quantityAvailable;
  const tone = !variant.availableForSale ? "text-warn" : q <= LOW_STOCK ? "text-warn" : "text-ok";
  const text = !variant.availableForSale ? "Sold out in this finish" : q <= LOW_STOCK ? `Only ${q} left in this finish` : "In stock, ready to ship";
  return (
    <p className={cn("flex items-center gap-2 text-[0.88rem]", tone, className)}>
      <span aria-hidden="true" className="size-2 rounded-full bg-current" />
      {text}
    </p>
  );
}
