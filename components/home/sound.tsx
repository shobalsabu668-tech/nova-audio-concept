import Image from "next/image";

const stats = [
  { value: "360°", label: "Even sound in every direction" },
  { value: "45 Hz", label: "Lowest note, from a 4-inch woofer" },
  { value: "11,000", label: "Laser-cut holes in the grille" },
];

/**
 * 360° SOUND — the idea in one picture: the speaker from above, with sound
 * radiating evenly around it. Pure CSS/SVG; the rings stop under reduced motion.
 */
export function Sound() {
  return (
    <section aria-labelledby="sound-title" className="section overflow-hidden bg-graphite text-bone">
      <div className="shell grid items-center gap-16 lg:grid-cols-12">
        <div className="relative mx-auto aspect-square w-full max-w-[36rem] lg:col-span-6">
          <svg viewBox="0 0 400 400" aria-hidden="true" className="absolute inset-0 size-full">
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx="200" cy="200" r="60" fill="none" stroke="#3d6bff" strokeWidth="1.2" className="sound-ring" style={{ animationDelay: `${i * 0.8}s` }} />
            ))}
            {[80, 120, 160, 196].map((r) => (
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#ece9e2" strokeOpacity="0.08" />
            ))}
          </svg>
          <div className="absolute inset-[27%]">
            <Image src="/renders/nova-one-graphite-2.webp" alt="NØVA ONE seen from above" fill sizes="(min-width: 1024px) 20vw, 45vw" className="object-contain" />
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="t-eyebrow !text-bone/60" data-reveal>
            360° sound
          </p>
          <h2 id="sound-title" className="t-h2 mt-3" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
            There&rsquo;s no wrong place to put it.
          </h2>
          <p className="t-lead mt-6 !text-bone/75" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            Most speakers point at a sofa. NØVA ONE sends sound out evenly in every direction from a waveguide above a
            down-firing woofer, so the corner of a room sounds as good as the centre.
          </p>
          <dl className="mt-10 grid gap-6 border-t border-bone/15 pt-8 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div key={s.label} data-reveal style={{ "--d": i + 2 } as React.CSSProperties}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-[2.2rem] font-[680] leading-none tracking-[-0.03em] [font-stretch:112%]">{s.value}</span>
                  <span className="mt-2 block text-[0.88rem] text-bone/70">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
