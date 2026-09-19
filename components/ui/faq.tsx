import type { QA } from "@/lib/support";
import { Plus } from "./icons";

/** Accordion on native <details>: keyboard, screen reader and find-in-page friendly. */
export function Faq({ items, name = "faq" }: { items: QA[]; name?: string }) {
  return (
    <div className="divide-y divide-graphite/10 border-y border-graphite/10">
      {items.map((f) => (
        <details key={f.q} name={name} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.05rem] font-[580] [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus size={16} className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
          </summary>
          <p className="t-body -mt-1 max-w-2xl pb-6">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
