"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { defaultVariant, getProduct } from "@/lib/catalogue";
import { formatMoney } from "@/lib/format";
import { renderSrc } from "@/lib/renders";
import { Arrow } from "@/components/ui/icons";

type Pick = { handles: string[]; why: string };

function recommend(m2: number): Pick {
  if (m2 < 12) return { handles: ["nova-orb", "nova-mini"], why: "A bedroom or study: ORB on the bedside, or MINI if you want to take it with you." };
  if (m2 < 20) return { handles: ["nova-orb", "nova-one"], why: "A larger bedroom or a small living room. ORB is enough; ONE if music matters most." };
  if (m2 < 36) return { handles: ["nova-one"], why: "A typical living room. ONE fills it from any corner." };
  if (m2 < 55) return { handles: ["nova-arc", "nova-one"], why: "A large or open-plan room: ARC for width, or two ONEs as a stereo pair." };
  return { handles: ["nova-arc", "nova-sub"], why: "A big, open space. ARC with SUB underneath is the full NØVA system." };
}

/** ROOM ADVISOR — a slider instead of a spec sheet: how big is your room? */
export function RoomAdvisor() {
  const id = useId();
  const [m2, setM2] = useState(24);
  const pick = recommend(m2);
  const picks = pick.handles.map((h) => getProduct(h)!);
  const total = picks.reduce((n, p) => n + defaultVariant(p).price.amount, 0);

  return (
    <section aria-labelledby="advisor-title" className="section bg-paper">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="t-eyebrow">Room advisor</p>
          <h2 id="advisor-title" className="t-h2 mt-3">
            Which one is for your room?
          </h2>
          <p className="t-lead mt-6">Move the slider to the size of the room you&rsquo;ll listen in.</p>

          <div className="mt-10">
            <label htmlFor={id} className="flex items-baseline justify-between">
              <span className="font-[560]">Room size</span>
              <span className="t-price text-[2rem] tracking-[-0.02em]">
                {m2} m²
                <span className="ml-2 text-[0.9rem] font-[400] text-graphite-soft">≈ {Math.round(m2 * 10.764)} sq ft</span>
              </span>
            </label>
            <input
              id={id}
              type="range"
              min={6}
              max={80}
              step={1}
              value={m2}
              onChange={(e) => setM2(Number(e.target.value))}
              aria-valuetext={`${m2} square metres`}
              className="mt-4 w-full accent-ion-deep"
            />
            <div className="mt-2 flex justify-between text-[0.8rem] text-graphite-soft" aria-hidden="true">
              <span>Study</span>
              <span>Bedroom</span>
              <span>Living room</span>
              <span>Open plan</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7" aria-live="polite">
          <p className="t-lead !text-graphite">{pick.why}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {picks.map((p) => {
              const v = defaultVariant(p);
              return (
                <li key={p.handle}>
                  <Link href={`/products/${p.handle}`} className="card group flex items-center gap-4 !bg-bone p-4 transition-colors hover:!bg-bone-2">
                    <span className="relative size-24 shrink-0">
                      <Image src={renderSrc(p, v.finish)} alt="" fill sizes="96px" className="object-contain" />
                    </span>
                    <span>
                      <span className="block font-[640]">{p.title}</span>
                      <span className="t-price block text-[0.92rem] text-graphite-soft">{formatMoney(v.price)}</span>
                      <span className="mt-2 inline-flex items-center gap-1 text-[0.88rem] font-[560] text-ion-deep">
                        View <Arrow size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {picks.length > 1 && pick.handles.includes("nova-sub") ? (
            <p className="mt-4 text-[0.92rem] text-graphite-soft">
              Together: <span className="t-price text-graphite">{formatMoney(total)}</span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
