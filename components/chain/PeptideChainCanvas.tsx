"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Html } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import Link from "next/link";
import { peptides, categoryColors } from "@/lib/peptides";
import { buildChainCurve, frameAt, CHAIN_LENGTH } from "./chainPath";

const BG = "#06070a";
const GLASS_COLOR = "#3fd9c7";
const PARTICLE_COLOR = "#e8b45a";

// Reproducible per-index "randomness" so sizes/particle placement stay
// stable across renders without needing a seeded RNG dependency.
function hashRand(seed: number) {
  const x = Math.sin(seed * 999.7) * 43758.5453;
  return x - Math.floor(x);
}

// Procedural reflection probe (no HDRI download) — glass needs *something*
// in the environment to reflect, or transmission just looks flat/grey.
function ChainEnvironment() {
  return (
    <Environment resolution={64} frames={1}>
      <Lightformer
        form="rect"
        intensity={4}
        color="#bfffe9"
        position={[0, 3, 4]}
        scale={[8, 8, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2}
        color={PARTICLE_COLOR}
        position={[-6, -2, -3]}
        scale={[5, 5, 1]}
      />
      <Lightformer
        form="ring"
        intensity={3}
        color="#ffffff"
        position={[0, 0, 8]}
        scale={[5, 5, 1]}
      />
    </Environment>
  );
}

// The chain "backbone" itself: a glass sphere at every peptide's position
// on the curve, connected to its neighbour by a glass rod — a ball-and-
// stick molecular model, matching the generated product artwork.
function GlassChain({ activeIndex }: { activeIndex: number }) {
  const curve = useMemo(() => buildChainCurve(), []);

  const points = useMemo(
    () =>
      Array.from({ length: CHAIN_LENGTH }, (_, i) =>
        curve.getPointAt(i / (CHAIN_LENGTH - 1))
      ),
    [curve]
  );

  const rodGeometry = useMemo(
    () => new THREE.CylinderGeometry(1, 1, 1, 10, 1, true).rotateX(Math.PI / 2),
    []
  );
  const rodRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const mid = a.clone().lerp(b, 0.5);
      dummy.position.copy(mid);
      dummy.lookAt(b);
      dummy.scale.set(0.075, 0.075, a.distanceTo(b));
      dummy.updateMatrix();
      rodRef.current?.setMatrixAt(i, dummy.matrix);
    }
    if (rodRef.current) rodRef.current.instanceMatrix.needsUpdate = true;
  }, [points]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current?.children.forEach((child, i) => {
      child.scale.setScalar(1 + Math.sin(t * 1.4 + i * 1.3) * 0.04);
    });
  });

  return (
    <group>
      <instancedMesh ref={rodRef} args={[rodGeometry, undefined, points.length - 1]}>
        <meshPhysicalMaterial
          color={GLASS_COLOR}
          transmission={0.9}
          thickness={0.6}
          roughness={0.15}
          ior={1.35}
          clearcoat={1}
        />
      </instancedMesh>

      <group ref={groupRef}>
        {points.map((p, i) => {
          const radius = 0.32 + hashRand(i) * 0.22;
          const peptide = peptides[i];
          const accent = categoryColors[peptide.category];
          const showLabel = i >= activeIndex - 2 && i <= activeIndex + 5;

          return (
            <group key={i} position={p}>
              <mesh>
                <sphereGeometry args={[radius, 24, 24]} />
                <meshPhysicalMaterial
                  color={GLASS_COLOR}
                  emissive={accent}
                  emissiveIntensity={0.35}
                  transmission={0.92}
                  thickness={1.1}
                  roughness={0.08}
                  ior={1.4}
                  clearcoat={1}
                  iridescence={0.35}
                  iridescenceIOR={1.3}
                />
              </mesh>

              {showLabel && (
                <Html center zIndexRange={[10, 0]} occlude={false}>
                  <Link
                    href={`/peptide/${peptide.slug}`}
                    className="chain-node-box"
                    style={{ "--node-color": accent } as CSSProperties}
                  >
                    <span className="chain-node-box-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="chain-node-box-name">{peptide.name}</span>
                  </Link>
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}

// A loose cloud of small golden droplets drifting near the chain — pure
// atmosphere, echoing the floating particles in the reference artwork.
const PARTICLE_COUNT = 70;

function GoldParticles() {
  const curve = useMemo(() => buildChainCurve(), []);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const seeds = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const t = hashRand(i * 3 + 1);
        const { point, normal, binormal } = frameAt(curve, t);
        const angle = hashRand(i * 7 + 2) * Math.PI * 2;
        const dist = 0.6 + hashRand(i * 11 + 3) * 1.6;
        const base = point
          .clone()
          .addScaledVector(normal, Math.cos(angle) * dist)
          .addScaledVector(binormal, Math.sin(angle) * dist);
        return {
          base,
          phase: hashRand(i * 13 + 4) * Math.PI * 2,
          scale: 0.03 + hashRand(i * 17 + 5) * 0.07,
        };
      }),
    [curve]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    seeds.forEach((s, i) => {
      dummy.position.copy(s.base);
      dummy.position.y += Math.sin(t * 0.5 + s.phase) * 0.25;
      dummy.position.x += Math.cos(t * 0.35 + s.phase) * 0.15;
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={PARTICLE_COLOR} toneMapped={false} />
    </instancedMesh>
  );
}

function CameraRig({ progressRef }: { progressRef: { current: number } }) {
  const curve = useMemo(() => buildChainCurve(), []);
  const smoothed = useRef(0);

  useFrame(({ camera }) => {
    // GSAP scrub already smooths progressRef; ease our own copy a little
    // more so direction changes don't snap.
    smoothed.current += (progressRef.current - smoothed.current) * 0.08;
    const p = THREE.MathUtils.clamp(smoothed.current, 0, 1) * 0.92;

    // The camera's offset is anchored to the SAME point it's currently
    // "at" (p), and the look-at target is a real point further along the
    // arc-length-parametrized curve (p + lookAhead) rather than a linear
    // extrapolation along the tangent — this path winds tightly enough
    // that a straight-line guess diverges from where it actually goes
    // within just a couple of units.
    const { point, normal, binormal } = frameAt(curve, p);
    const aheadPoint = curve.getPointAt(Math.min(p + 0.09, 1));

    camera.position
      .copy(point)
      .addScaledVector(normal, 1.8)
      .addScaledVector(binormal, 1.0);
    camera.up.set(0, 1, 0);
    camera.lookAt(aheadPoint);
  });

  return null;
}

// Cinematic finishing pass — bloom for the glass highlights, faint
// chromatic aberration + grain + vignette so it reads less like a flat
// WebGL demo and closer to the rendered product stills. Depth of field
// was tried here too but it's the heaviest, most GPU/driver-sensitive
// effect in the stack and isn't worth the risk of a blank scene on a
// machine that doesn't like it — bloom alone already carries most of
// the "photographed" feel.
function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.7}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration offset={[0.0006, 0.0009]} radialModulation={false} modulationOffset={0} />
      <Noise opacity={0.035} />
      <Vignette eskil={false} offset={0.15} darkness={0.9} />
    </EffectComposer>
  );
}

export default function PeptideChainCanvas({
  progressRef,
  activeIndex,
}: {
  progressRef: { current: number };
  activeIndex: number;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      camera={{ fov: 68, near: 0.1, far: 100, position: [0, 0, 6] }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog(new THREE.Color(BG), 9, 26);
        scene.background = new THREE.Color(BG);
      }}
    >
      <ambientLight intensity={0.5} color="#3a8f6d" />
      <pointLight position={[0, 2, 6]} intensity={25} color="#bfffe9" />
      <ChainEnvironment />
      <GlassChain activeIndex={activeIndex} />
      <GoldParticles />
      <CameraRig progressRef={progressRef} />
      <PostFX />
    </Canvas>
  );
}
