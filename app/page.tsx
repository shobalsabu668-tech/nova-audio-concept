import { Hero } from "@/components/home/hero";
import { Range } from "@/components/home/range";
import { Sound } from "@/components/home/sound";
import { FinishesShowcase } from "@/components/home/finishes-showcase";
import { RoomAdvisor } from "@/components/home/room-advisor";
import { Story } from "@/components/home/story";
import { conceptJsonLd, jsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />
      <Range />
      <Sound />
      <FinishesShowcase />
      <RoomAdvisor />
      <Story />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(conceptJsonLd()) }} />
    </main>
  );
}
