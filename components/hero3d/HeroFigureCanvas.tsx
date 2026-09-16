"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { basePath } from "@/lib/basePath";

const MODEL_URL = `${basePath}/models/glass-figure.glb`;

// Swaps the baked anatomical texture (red arteries, pink muscle, pale
// tendon) from a flat color map onto a glass material — the same map
// doubles as the emissive map, so the anatomy itself is what glows,
// while transmission gives the "see-through" quality that makes it read
// as glass rather than a lit statue.
function Figure({ progressRef }: { progressRef: { current: number } }) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const smoothed = useRef(0);

  const figure = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const prior = mesh.material as THREE.MeshStandardMaterial | undefined;
      const map = prior?.map ?? null;
      mesh.material = new THREE.MeshPhysicalMaterial({
        map,
        emissiveMap: map,
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 1.3,
        transmission: 0.7,
        thickness: 0.7,
        roughness: 0.25,
        ior: 1.35,
        clearcoat: 0.4,
      });
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    clone.position.sub(center);
    const targetHeight = 3.4;
    const scale = size.y > 0 ? targetHeight / size.y : 1;
    clone.scale.setScalar(scale);
    return clone;
  }, [scene]);

  useFrame(() => {
    smoothed.current += (progressRef.current - smoothed.current) * 0.08;
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.5 + smoothed.current * Math.PI * 1.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      <primitive object={figure} />
    </group>
  );
}

// Procedural reflection probe so the transmission material has something
// to refract — plain white/red lightformers rather than an HDRI download.
function FigureEnvironment() {
  return (
    <Environment resolution={64} frames={1}>
      <Lightformer form="rect" intensity={3} color="#dff5ff" position={[0, 2, 4]} scale={[6, 6, 1]} />
      <Lightformer form="rect" intensity={2} color="#ff6a5c" position={[-4, -1, -2]} scale={[4, 4, 1]} />
      <Lightformer form="ring" intensity={2.5} color="#ffffff" position={[0, 0, 6]} scale={[4, 4, 1]} />
    </Environment>
  );
}

export default function HeroFigureCanvas({
  progressRef,
}: {
  progressRef: { current: number };
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 32, near: 0.1, far: 50, position: [0, 0.1, 8] }}
    >
      <ambientLight intensity={0.35} color="#3a8f6d" />
      <pointLight position={[2, 3, 5]} intensity={25} color="#ffffff" />
      <FigureEnvironment />
      <Figure progressRef={progressRef} />
      <EffectComposer multisampling={4}>
        <Bloom intensity={0.85} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
