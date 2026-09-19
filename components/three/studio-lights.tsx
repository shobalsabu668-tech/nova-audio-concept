"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

/**
 * A studio in code: softboxes as Lightformers baked into an environment map
 * once (frames={1}), a key light, and a contact shadow. No HDR download.
 */
export function StudioLights({ floor, shadow = 0.42 }: { floor: number; shadow?: number }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#cfd8ff" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 2]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 1]} scale={[3, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[5, 1, -1]} scale={[3, 6, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#9fb6ff" position={[0, -3, 4]} scale={[6, 1, 1]} />
      </Environment>
      <ContactShadows position={[0, floor - 0.005, 0]} opacity={shadow} scale={5} blur={2.6} far={1.8} resolution={512} color="#1b1c1f" />
    </>
  );
}
