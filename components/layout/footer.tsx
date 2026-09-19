import Link from "next/link";
import { author, site } from "@/lib/site";
import { ArrowUpRight } from "@/components/ui/icons";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/shop?type=speaker", label: "Speakers" },
      { href: "/shop?type=accessory", label: "Accessories" },
      { href: "/products/nova-orb", label: "New: NØVA ORB" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/support#delivery", label: "Delivery" },
      { href: "/support#returns", label: "Returns" },
      { href: "/support#warranty", label: "Warranty" },
      { href: "/support", label: "FAQ" },
    ],
  },
  {
    title: "NØVA",
    links: [
      { href: "/about", label: "About" },
      { href: "/concept", label: "About this concept" },
    ],
  },
];

export function Footer() {
  return (
    <footer data-chrome className="mt-auto bg-graphite text-bone">
      <div className="shell grid gap-12 pb-12 pt-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-[1.6rem] font-[760] tracking-[-0.02em] [font-stretch:120%]">{site.name}</p>
          <p className="mt-4 max-w-xs text-bone/70">{site.tagline} Designed in {site.city}.</p>
          <a href={`mailto:${site.email}`} className="mt-6 inline-block underline underline-offset-4">
            {site.email}
          </a>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="md:col-span-2">
            <p className="t-eyebrow !text-bone/60">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-bone/85 hover:text-bone hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="shell flex flex-col gap-3 border-t border-bone/10 py-6 text-[0.82rem] text-bone/70 sm:flex-row sm:items-center sm:justify-between">
        <p>A self-initiated concept. NØVA and its products are fictional; every product image is rendered from code.</p>
        <p className="flex flex-wrap gap-x-5">
          <span>
            Designed &amp; built by{" "}
            <a href={author.portfolio} className="text-bone underline underline-offset-4">
              {author.name}
            </a>
          </span>
          <a href={author.repo} className="inline-flex items-center gap-1 underline underline-offset-4">
            Source code <ArrowUpRight size={12} />
          </a>
        </p>
      </div>
    </footer>
  );
}
