"use client";

import { Minus, Plus } from "@/components/ui/icons";
import { cn } from "@/lib/format";

/** Quantity stepper with an accessible name that includes the product. */
export function Qty({ value, max, onChange, label, size = "md" }: { value: number; max: number; onChange: (n: number) => void; label: string; size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-8" : "size-10";
  return (
    <div role="group" aria-label={`Quantity, ${label}`} className="inline-flex items-center rounded-full border border-graphite/15 bg-white">
      <button type="button" onClick={() => onChange(value - 1)} className={cn(box, "grid place-items-center rounded-full hover:bg-graphite/5")} aria-label={value <= 1 ? `Remove ${label}` : `One fewer ${label}`}>
        <Minus size={14} />
      </button>
      <output className="t-price w-7 text-center text-[0.95rem]" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={cn(box, "grid place-items-center rounded-full hover:bg-graphite/5 disabled:cursor-not-allowed disabled:opacity-30")}
        aria-label={`One more ${label}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
