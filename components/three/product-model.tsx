"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Finish, ModelId } from "@/lib/catalogue";
import { buildModel, grilleTexture, GRILLE_REPEAT } from "./geometry";

/** Physically based settings for each finish. */
export const FINISH_MATERIAL: Record<Finish, { color: string; metalness: number; roughness: number }> = {
  graphite: { color: "#4a4d54", metalness: 0.58, roughness: 0.42 },
  bone: { color: "#d8d2c5", metalness: 0.06, roughness: 0.6 },
  ember: { color: "#c4532b", metalness: 0.4, roughness: 0.4 },
  ion: { color: "#3552d6", metalness: 0.62, roughness: 0.34 },
};

type Props = {
  model: ModelId;
  finish: Finish;
  /** Ease between finishes (false = snap, for still renders). */
  animate?: boolean;
  /** Slow idle turn, radians per second (0 = still). */
  spin?: number;
  /** Receives the body mesh (for occlusion of hotspot labels). */
  bodyRef?: React.RefObject<THREE.Mesh | null>;
  children?: React.ReactNode;
};

/**
 * One NØVA product, built from its lathe profile. Finish changes ease the
 * material's colour, metalness and roughness rather than snapping, which
 * reads as "the same object in a different finish".
 */
export function ProductModel({ model, finish, animate = true, spin = 0, bodyRef, children }: Props) {
  const group = useRef<THREE.Group>(null);

  const assets = useMemo(() => {
    const spec = buildModel(model);
    const f = FINISH_MATERIAL[finish];
    const grille = grilleTexture(GRILLE_REPEAT[model]);
    const materials = {
      body: new THREE.MeshStandardMaterial({ color: f.color, metalness: f.metalness, roughness: f.roughness, envMapIntensity: 1.35 }),
      grille: new THREE.MeshStandardMaterial({ color: "#060607", roughness: 0.85, alphaMap: grille, alphaTest: 0.5, side: THREE.DoubleSide }),
      dark: new THREE.MeshStandardMaterial({ color: "#131417", roughness: 0.5, metalness: 0.2 }),
      glow: new THREE.MeshStandardMaterial({ color: "#3d6bff", emissive: "#3d6bff", emissiveIntensity: 2.2, toneMapped: false }),
      light: new THREE.MeshStandardMaterial({ color: "#fff1dc", emissive: "#ffd9a8", emissiveIntensity: 0.9, roughness: 0.3 }),
    };
    return { spec, grille, materials };
    // Finish is applied in useFrame; geometry depends on the model only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  useEffect(
    () => () => {
      assets.spec.parts.forEach((p) => p.geometry.dispose());
      Object.values(assets.materials).forEach((m) => m.dispose());
      assets.grille.dispose();
    },
    [assets],
  );

  const target = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    const f = FINISH_MATERIAL[finish];
    const m = assets.materials.body;
    const k = animate ? 1 - Math.exp(-7 * Math.min(delta, 0.05)) : 1;
    target.set(f.color);
    m.color.lerp(target, k);
    m.metalness += (f.metalness - m.metalness) * k;
    m.roughness += (f.roughness - m.roughness) * k;
    if (group.current && spin) group.current.rotation.y += delta * spin;
  });

  return (
    <group ref={group} position={[0, -assets.spec.frame.y, 0]}>
      {assets.spec.parts.map((p, i) => (
        <mesh
          key={i}
          ref={i === 0 && bodyRef ? (bodyRef as React.Ref<THREE.Mesh>) : undefined}
          geometry={p.geometry}
          material={assets.materials[p.material]}
          position={p.position}
          rotation={p.rotation}
          scale={p.scale}
          castShadow
        />
      ))}
      {children}
    </group>
  );
}
