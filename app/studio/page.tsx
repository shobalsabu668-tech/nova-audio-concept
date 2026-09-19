"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Finish, ModelId } from "@/lib/catalogue";

const StudioScene = dynamic(() => import("@/components/three/studio-scene").then((m) => m.StudioScene), { ssr: false });

/**
 * Internal render stage used by `npm run renders`. Not linked anywhere,
 * excluded from the sitemap and marked noindex by robots.txt.
 */
function Stage() {
  const q = useSearchParams();
  const model = (q.get("m") ?? "one") as ModelId;
  const finish = (q.get("f") ?? "graphite") as Finish;
  const angle = Number(q.get("a") ?? 0);
  return (
    <div id="stage" style={{ position: "fixed", inset: 0, background: "transparent" }}>
      <StudioScene model={model} finish={finish} angle={angle} />
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense>
      <Stage />
    </Suspense>
  );
}
