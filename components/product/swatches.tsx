"use client";

import { useId } from "react";
import { finishes, type Finish, type Variant } from "@/lib/catalogue";
import { cn } from "@/lib/format";

/**
 * FINISH SWATCHES — a native radio group, so arrow keys move between
 * finishes. Sold-out finishes stay selectable (so they can be viewed) but
 * are marked.
 */
export function Swatches({
  variants,
  value,
  onChange,
  size = "md",
  label = "Finish",
  showName = true,
}: {
  variants: Variant[];
  value: Finish;
  onChange: (f: Finish) => void;
  size?: "sm" | "md";
  label?: string;
  showName?: boolean;
}) {
  const id = useId();
  const current = variants.find((v) => v.finish === value);
  return (
    <fieldset>
      <legend className={cn(showName ? "mb-3 text-[0.92rem]" : "sr-only")}>
        {label}: <span className="font-[620]">{finishes[value].name}</span>
        {current && !current.availableForSale ? <span className="text-warn"> · sold out</span> : null}
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {variants.map((v) => {
          const on = v.finish === value;
          return (
            <label
              key={v.id}
              title={finishes[v.finish].name}
              className={cn(
                "relative grid cursor-pointer place-items-center rounded-full border transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ion-deep",
                size === "sm" ? "size-7" : "size-11",
                on ? "border-graphite" : "border-transparent hover:border-graphite/30",
              )}
            >
              <input
                type="radio"
                name={id}
                value={v.finish}
                checked={on}
                onChange={() => onChange(v.finish)}
                className="sr-only"
                aria-label={`${finishes[v.finish].name}${v.availableForSale ? "" : ", sold out"}`}
              />
              <span
                aria-hidden="true"
                className={cn("rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]", size === "sm" ? "size-5" : "size-8")}
                style={{ background: `radial-gradient(circle at 35% 30%, rgb(255 255 255 / 0.35), transparent 55%), ${finishes[v.finish].swatch}` }}
              />
              {!v.availableForSale ? <span aria-hidden="true" className="absolute h-px w-[70%] rotate-45 bg-graphite/60" /> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
