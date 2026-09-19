"use client";

import { useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Finish, ModelId } from "@/lib/catalogue";
import { FRAMES } from "./geometry";
import { ProductModel } from "./product-model";
import { StudioLights } from "./studio-lights";

/** Camera angles used for the rendered product shots. */
export const ANGLES = [
  { yaw: 0.55, pitch: 0.32, zoom: 1.3 },
  { yaw: 2.3, pitch: 0.16, zoom: 1.3 },
  { yaw: 0.35, pitch: 0.82, zoom: 1.05 },
] as const;

function Rig({ yaw, pitch, zoom, distance }: { yaw: number; pitch: number; zoom: number; distance: number }) {
  const { camera } = useThree();
  useEffect(() => {
    const d = distance * zoom;
    camera.position.set(Math.sin(yaw) * Math.cos(pitch) * d, Math.sin(pitch) * d, Math.cos(yaw) * Math.cos(pitch) * d);
    camera.lookAt(0, 0, 0);
  }, [camera, yaw, pitch, zoom, distance]);
  return null;
}

/** Marks the page ready once the environment map and shadows have settled. */
function Ready() {
  const [frames, setFrames] = useState(0);
  useFrame(() => {
    if (frames < 30) setFrames((f) => f + 1);
    else (window as Window & { __renderReady?: boolean }).__renderReady = true;
  });
  return null;
}

/**
 * STUDIO — renders one product, one finish, one angle on a transparent
 * background. scripts/render-products.mjs photographs this page to make
 * every product image on the site: the "product photography" is the model.
 */
export function StudioScene({ model, finish, angle }: { model: ModelId; finish: Finish; angle: number }) {
  const frame = FRAMES[model];
  const a = ANGLES[angle] ?? ANGLES[0];
  return (
    <Canvas
      dpr={2}
      camera={{ fov: 26, position: [0, 0, frame.distance] }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      style={{ position: "absolute", inset: 0, background: "transparent" }}
    >
      <Rig yaw={a.yaw} pitch={a.pitch} zoom={a.zoom} distance={frame.distance} />
      <StudioLights floor={frame.floor - frame.y} shadow={0.5} />
      <ProductModel model={model} finish={finish} animate={false} />
      <Ready />
    </Canvas>
  );
}
