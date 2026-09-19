import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="shell grid flex-1 items-center gap-10 py-16 md:grid-cols-2">
      <div>
        <p className="t-eyebrow">404</p>
        <h1 className="t-display mt-4">Silence.</h1>
        <p className="t-lead mt-5 max-w-md">This page doesn&rsquo;t exist, so there&rsquo;s nothing to play. The speakers are still here, though.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="btn btn-primary">
            Shop the range
          </Link>
          <Link href="/" className="btn btn-ghost">
            Home
          </Link>
        </div>
      </div>
      <div className="relative aspect-square">
        <Image src="/renders/nova-orb-bone-0.webp" alt="" fill sizes="50vw" className="object-contain p-[12%]" />
      </div>
    </main>
  );
}
