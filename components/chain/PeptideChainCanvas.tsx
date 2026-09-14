"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import Link from "next/link";
import { peptides, categoryColors } from "@/lib/peptides";
import {
  buildChainCurve,
  frameAt,
  helixPointAt,
  HelixStrandCurve,
  CHAIN_LENGTH,
} from "./chainPath";

const BG = "#06070a";
const STRAND_A_COLOR = "#79ffc7";
const STRAND_B_COLOR = "#6fb8ff";
const PARTICLE_COLOR = "#e8b45a";

// Reproducible per-index "randomness" so sizes/particle placement stay
// stable across renders without needing a seeded RNG dependency.
function hashRand(seed: number) {
  const x = Math.sin(seed * 999.7) * 43758.5453;
  return x - Math.floor(x);
}

// The two intertwined backbone strands of the double helix, rendered as
// glowing tubes wound around the shared centerline curve. Pure emissive
// (untone-mapped) material so bloom does the "neon" work — no physically
// based transmission, which is what made the old ball-and-stick chain so
// expensive to render.
function DnaStrands({ lite }: { lite: boolean }) {
  const curve = useMemo(() => buildChainCurve(), []);
  const segments = lite ? 160 : 320;
  const radialSegments = lite ? 5 : 8;

  const geomA = useMemo(
    () =>
      new THREE.TubeGeometry(
        new HelixStrandCurve(curve, 0),
        segments,
        0.045,
        radialSegments,
        false
      ),
    [curve, segments, radialSegments]
  );
  const geomB = useMemo(
    () =>
      new THREE.TubeGeometry(
        new HelixStrandCurve(curve, Math.PI),
        segments,
        0.045,
        radialSegments,
        false
      ),
    [curve, segments, radialSegments]
  );

  return (
    <>
      <mesh geometry={geomA}>
        <meshBasicMaterial color={STRAND_A_COLOR} toneMapped={false} />
      </mesh>
      <mesh geometry={geomB}>
        <meshBasicMaterial color={STRAND_B_COLOR} toneMapped={false} />
      </mesh>
    </>
  );
}

// One rung per peptide, bridging the two strands — the "base pair" bars of
// the ladder, tinted per research category so browsing the catalog and
// scanning the strand read as the same taxonomy.
function DnaRungs() {
  const curve = useMemo(() => buildChainCurve(), []);
  const rodGeometry = useMemo(
    () => new THREE.CylinderGeometry(1, 1, 1, 6, 1, true).rotateX(Math.PI / 2),
    []
  );
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const rungs = useMemo(
    () =>
      Array.from({ length: CHAIN_LENGTH }, (_, i) => {
        const t = i / (CHAIN_LENGTH - 1);
        const a = helixPointAt(curve, t, 0);
        const b = helixPointAt(curve, t, Math.PI);
        return { a, b, mid: a.clone().lerp(b, 0.5) };
      }),
    [curve]
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    rungs.forEach((n, i) => {
      dummy.position.copy(n.mid);
      dummy.lookAt(n.b);
      dummy.scale.set(0.045, 0.045, n.a.distanceTo(n.b));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.set(categoryColors[peptides[i].category]);
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [rungs]);

  return (
    <instancedMesh ref={meshRef} args={[rodGeometry, undefined, rungs.length]}>
      <meshBasicMaterial vertexColors toneMapped={false} />
    </instancedMesh>
  );
}

// A softly pulsing node marker at each rung's midpoint, plus the clickable
// product label once the scroll position brings it into range.
function DnaNodes({ activeIndex }: { activeIndex: number }) {
  const curve = useMemo(() => buildChainCurve(), []);
  const points = useMemo(
    () =>
      Array.from({ length: CHAIN_LENGTH }, (_, i) => {
        const t = i / (CHAIN_LENGTH - 1);
        const a = helixPointAt(curve, t, 0);
        const b = helixPointAt(curve, t, Math.PI);
        return a.lerp(b, 0.5);
      }),
    [curve]
  );

  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const color = new THREE.Color();
    points.forEach((_, i) => {
      color.set(categoryColors[peptides[i].category]);
      mesh.setColorAt(i, color);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [points]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    points.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.scale.setScalar(0.12 * (1 + Math.sin(t * 1.4 + i * 1.3) * 0.18));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, points.length]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial vertexColors toneMapped={false} />
      </instancedMesh>

      {points.map((p, i) => {
        const peptide = peptides[i];
        const accent = categoryColors[peptide.category];
        const showLabel = i >= activeIndex - 2 && i <= activeIndex + 5;
        if (!showLabel) return null;

        return (
          <Html key={i} position={p} center zIndexRange={[10, 0]} occlude={false}>
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
        );
      })}
    </>
  );
}

// A loose cloud of small golden droplets drifting near the chain — pure
// atmosphere, echoing the floating particles in the reference artwork.
function GoldParticles({ lite }: { lite: boolean }) {
  const particleCount = lite ? 30 : 70;
  const curve = useMemo(() => buildChainCurve(), []);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const seeds = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => {
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
    [curve, particleCount]
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
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
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
      .addScaledVector(normal, 1.1)
      .addScaledVector(binormal, 0.5);
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
// On phones each extra full-screen pass has a real cost, so `lite` keeps
// only bloom (the effect that most defines the glass look) plus the
// vignette, and drops the chromatic aberration / grain passes entirely.
function PostFX({ lite }: { lite: boolean }) {
  return (
    <EffectComposer multisampling={lite ? 0 : 4}>
      <Bloom
        intensity={0.7}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.9}
        mipmapBlur={!lite}
      />
      {!lite && (
        <ChromaticAberration offset={[0.0006, 0.0009]} radialModulation={false} modulationOffset={0} />
      )}
      {!lite && <Noise opacity={0.035} />}
      <Vignette eskil={false} offset={0.15} darkness={0.9} />
    </EffectComposer>
  );
}

export default function PeptideChainCanvas({
  progressRef,
  activeIndex,
  lite,
}: {
  progressRef: { current: number };
  activeIndex: number;
  lite: boolean;
}) {
  return (
    <Canvas
      dpr={lite ? 1 : [1, 1.5]}
      gl={{ antialias: !lite, alpha: false }}
      camera={{ fov: 68, near: 0.1, far: 100, position: [0, 0, 6] }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog(new THREE.Color(BG), 9, 26);
        scene.background = new THREE.Color(BG);
      }}
    >
      <DnaStrands lite={lite} />
      <DnaRungs />
      <DnaNodes activeIndex={activeIndex} />
      <GoldParticles lite={lite} />
      <CameraRig progressRef={progressRef} />
      <PostFX lite={lite} />
    </Canvas>
  );
}
