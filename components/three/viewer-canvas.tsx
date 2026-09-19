"use client";

import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Finish, ModelId } from "@/lib/catalogue";
import type { Hotspot } from "@/lib/hotspots";
import { FRAMES } from "./geometry";
import { ProductModel } from "./product-model";
import { StudioLights } from "./studio-lights";

export type ViewerControl = {
  /** Target yaw in radians; the model eases towards it. */
  yaw: number;
  /** True once the user has touched the controls: stops the idle turn. */
  touched: boolean;
};

function Turntable({ control, still, children }: { control: React.RefObject<ViewerControl>; still: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const g = group.current;
    const c = control.current;
    if (!g || !c) return;
    if (!c.touched && !still) c.yaw += delta * 0.22;
    const k = still ? 1 : 1 - Math.exp(-8 * Math.min(delta, 0.05));
    g.rotation.y += (c.yaw - g.rotation.y) * k;
  });
  return <group ref={group}>{children}</group>;
}

function Ready({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const fired = useRef(false);
  useFrame(() => {
    frames.current++;
    if (!fired.current && frames.current > 4) {
      fired.current = true;
      onReady();
    }
  });
  return null;
}

type Props = {
  model: ModelId;
  finish: Finish;
  control: React.RefObject<ViewerControl>;
  paused: boolean;
  still: boolean;
  hotspots?: Hotspot[];
  active?: string | null;
  onHotspot?: (id: string) => void;
  onReady: () => void;
  dpr: [number, number];
};

/**
 * The live canvas: the product on a turntable, lit by the code-built studio.
 * Rendering stops entirely while the viewer is off-screen.
 */
export default function ViewerCanvas({ model, finish, control, paused, still, hotspots = [], active, onHotspot, onReady, dpr }: Props) {
  const frame = FRAMES[model];
  const body = useRef<THREE.Mesh>(null);

  return (
    <Canvas
      dpr={dpr}
      frameloop={paused ? "never" : "always"}
      camera={{ fov: 26, position: [0, Math.sin(0.28) * frame.distance * 1.3, Math.cos(0.28) * frame.distance * 1.3] }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <StudioLights floor={frame.floor - frame.y} />
      <Turntable control={control} still={still}>
        <ProductModel model={model} finish={finish} bodyRef={body}>
          {hotspots.map((h, i) => (
            <Html key={h.id} position={h.position} center occlude={[body as React.RefObject<THREE.Object3D>]} zIndexRange={[20, 0]}>
              <button
                type="button"
                onClick={() => onHotspot?.(h.id)}
                aria-pressed={active === h.id}
                aria-label={h.label}
                className="grid size-8 place-items-center rounded-full border border-white/70 bg-graphite/80 text-[0.75rem] font-[650] text-white shadow-lg backdrop-blur transition-transform hover:scale-110 aria-pressed:bg-ion-deep"
              >
                {i + 1}
              </button>
            </Html>
          ))}
        </ProductModel>
      </Turntable>
      <Ready onReady={onReady} />
    </Canvas>
  );
}
