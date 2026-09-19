import Link from "next/link";
import { author } from "@/lib/site";

/** Every page opens by saying what this is: a concept, and nothing is for sale. */
export function ConceptBar() {
  return (
    <div data-chrome className="bg-graphite text-bone">
      <p className="shell flex h-[var(--bar-h)] items-center justify-center gap-x-3 whitespace-nowrap text-[0.78rem]">
        <span className="md:hidden">
          <strong className="font-[620]">Concept store</strong> by {author.name} · nothing is for sale
        </span>
        <span className="hidden md:inline">
          <strong className="font-[620]">Self-initiated concept</strong> by {author.name}. NØVA is fictional: nothing here is for sale.
        </span>
        <Link href="/concept" className="hidden underline underline-offset-4 lg:inline">
          About this concept
        </Link>
      </p>
    </div>
  );
}
