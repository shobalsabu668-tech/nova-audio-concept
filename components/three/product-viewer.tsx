"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Finish, Product } from "@/lib/catalogue";
import { finishes } from "@/lib/catalogue";
import { hotspots as allHotspots } from "@/lib/hotspots";
import { renderSrc } from "@/lib/renders";
import { cn } from "@/lib/format";
import { Rotate } from "@/components/ui/icons";
import type { ViewerControl } from "./viewer-canvas";

const ViewerCanvas = dynamic(() => import("./viewer-canvas"), { ssr: false });

/** WebGL2, not on Save-Data, and a GPU that isn't a software fallback. */
function canRender(): boolean {
  try {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return false;
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!gl) return false;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|software/i.test(renderer);
  } catch {
    return false;
  }
}

type Props = {
  product: Product;
  finish: Finish;
  className?: string;
  /** Show numbered hotspots with a caption. */
  withHotspots?: boolean;
  /** Load immediately (hero) rather than when scrolled near. */
  eager?: boolean;
  priority?: boolean;
  sizes?: string;
};

/** Large pointer-driven screens load 3D automatically; phones and tablets on request. */
function autoLoads(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;
}

/**
 * PRODUCT VIEWER — the rendered still shows first (it's the LCP image and the
 * fallback); the live 3D model fades in over it once it's ready, only on
 * devices that can render it well. On desktops it loads when the browser is
 * idle; on phones it waits for a tap on "View in 3D", so three.js is never
 * downloaded unless someone wants it. Drag or use the buttons to turn it.
 */
export function ProductViewer({ product, finish, className, withHotspots = false, eager = false, priority = false, sizes = "(min-width: 1024px) 50vw, 100vw" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const control = useRef<ViewerControl>({ yaw: 0, touched: false });
  const drag = useRef<{ x: number; yaw: number } | null>(null);
  const [capable, setCapable] = useState(false);
  const [wanted, setWanted] = useState(false);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [still, setStill] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const spots = withHotspots ? (allHotspots[product.model] ?? []) : [];
  const spot = spots.find((s) => s.id === active);

  useEffect(() => {
    setCapable(canRender());
    setWanted(autoLoads());
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setArmed(true);
      },
      { rootMargin: eager ? "0px" : "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  // Heroes wait for the page to settle so the 3D never competes with first paint.
  const [settled, setSettled] = useState(!eager);
  useEffect(() => {
    if (!eager) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const go = () => setTimeout(() => (w.requestIdleCallback ? w.requestIdleCallback(() => setSettled(true), { timeout: 2000 }) : setSettled(true)), 400);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, [eager]);

  const live = capable && armed && settled && wanted;

  const turn = (by: number) => {
    control.current.touched = true;
    control.current.yaw += by;
  };

  return (
    <div className={className ?? "relative"}>
      <div
        ref={root}
        className={cn("relative size-full touch-pan-y select-none", live && ready && "cursor-grab active:cursor-grabbing")}
        onPointerDown={(e) => {
          if (!live) return;
          drag.current = { x: e.clientX, yaw: control.current.yaw };
          control.current.touched = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          control.current.yaw = drag.current.yaw + (e.clientX - drag.current.x) * 0.012;
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <Image
          src={renderSrc(product, finish, 0)}
          alt={`${product.title} in ${finishes[finish].name}`}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-contain p-[8%] transition-opacity duration-700", live && ready ? "opacity-0" : "opacity-100")}
        />
        {live ? (
          <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")} aria-hidden={!withHotspots}>
            <ViewerCanvas
              model={product.model}
              finish={finish}
              control={control}
              paused={!visible}
              still={still}
              hotspots={spots}
              active={active}
              onHotspot={(id) => setActive((a) => (a === id ? null : id))}
              onReady={() => setReady(true)}
              dpr={[1, 1.75]}
            />
          </div>
        ) : null}
      </div>

      {capable && !wanted ? (
        <button
          type="button"
          onClick={() => {
            setWanted(true);
            setSettled(true);
          }}
          className="page-in absolute bottom-4 left-4 flex h-10 items-center gap-2 rounded-full bg-paper/90 px-4 text-[0.88rem] font-[560] shadow-sm backdrop-blur"
        >
          <Rotate size={15} /> View in 3D
        </button>
      ) : null}

      {live && !ready ? (
        <p className="t-mono absolute bottom-6 left-6 text-graphite-soft" role="status">
          Loading 3D…
        </p>
      ) : null}

      {live && ready ? (
        <div className="page-in absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-paper/85 p-1 shadow-sm backdrop-blur">
          <button type="button" onClick={() => turn(-0.8)} className="grid size-9 place-items-center rounded-full hover:bg-graphite/5" aria-label="Turn left">
            <Rotate size={15} className="-scale-x-100" />
          </button>
          <span className="t-mono px-1 text-graphite-soft">Drag to turn</span>
          <button type="button" onClick={() => turn(0.8)} className="grid size-9 place-items-center rounded-full hover:bg-graphite/5" aria-label="Turn right">
            <Rotate size={15} />
          </button>
        </div>
      ) : null}

      {withHotspots && live && ready ? (
        <div className="absolute inset-x-4 top-4 flex flex-col items-end gap-2" aria-live="polite">
          {spot ? (
            <div className="page-in max-w-xs rounded-2xl bg-paper/95 p-4 shadow-lg backdrop-blur">
              <p className="font-[620]">{spot.label}</p>
              <p className="mt-1 text-[0.9rem] text-graphite-soft">{spot.detail}</p>
            </div>
          ) : (
            <p className="t-mono rounded-full bg-paper/80 px-3 py-1.5 text-graphite-soft backdrop-blur">Select a number to learn more</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
