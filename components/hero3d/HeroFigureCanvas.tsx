"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { basePath } from "@/lib/basePath";

const MODEL_URL = `${basePath}/models/glass-figure-v2.glb`;
const GLOW_COLOR = { r: 121, g: 255, b: 199 }; // brand cyan-green

// Reads a texture's decoded image onto a scratch canvas so its pixels
// can be sampled by UV — used to carry the baked anatomical texture's
// brightness (bone/skull and brain were baked paler/brighter than
// muscle) over onto the line geometry, which otherwise has no color
// data of its own.
function readTexturePixels(map: THREE.Texture | null | undefined) {
  const image = map?.image as HTMLImageElement | ImageBitmap | undefined;
  if (!image || !image.width) return null;
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0);
  return { data: ctx.getImageData(0, 0, canvas.width, canvas.height).data, width: canvas.width, height: canvas.height };
}

// Renders the body as a net of glowing fiber-optic lines instead of a
// solid glass surface: every mesh becomes a THREE.LineSegments built
// from its own edges. EdgesGeometry only keeps vertex positions, so a
// position->UV lookup (edge points are copied verbatim from the source
// mesh, so exact-position matching works) recovers per-line brightness
// from the original bake — bone/skull and brain edges glow a little
// more than muscle/skin ones instead of a single flat color.
function useFigureLines(scene: THREE.Group) {
  return useMemo(() => {
    const group = new THREE.Group();

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      const posAttr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
      const uvAttr = mesh.geometry.getAttribute("uv") as THREE.BufferAttribute | undefined;
      const pixels = readTexturePixels((mesh.material as THREE.MeshStandardMaterial)?.map);

      const key = (x: number, y: number, z: number) => `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
      const uvLookup = new Map<string, [number, number]>();
      if (uvAttr) {
        for (let i = 0; i < posAttr.count; i++) {
          uvLookup.set(key(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)), [uvAttr.getX(i), uvAttr.getY(i)]);
        }
      }

      const edges = new THREE.EdgesGeometry(mesh.geometry, 25);
      const edgePos = edges.getAttribute("position") as THREE.BufferAttribute;
      const colors = new Float32Array(edgePos.count * 3);
      for (let i = 0; i < edgePos.count; i++) {
        let intensity = 0.55;
        const uv = uvLookup.get(key(edgePos.getX(i), edgePos.getY(i), edgePos.getZ(i)));
        if (uv && pixels) {
          const px = Math.min(pixels.width - 1, Math.max(0, Math.floor(uv[0] * pixels.width)));
          const py = Math.min(pixels.height - 1, Math.max(0, Math.floor((1 - uv[1]) * pixels.height)));
          const idx = (py * pixels.width + px) * 4;
          const luminance =
            (0.299 * pixels.data[idx] + 0.587 * pixels.data[idx + 1] + 0.114 * pixels.data[idx + 2]) / 255;
          // bone/skull/brain were baked paler (higher luminance) than
          // muscle — push that contrast further so they read brighter.
          intensity = 0.35 + Math.pow(luminance, 1.4) * 0.95;
        }
        colors[i * 3] = (GLOW_COLOR.r / 255) * intensity;
        colors[i * 3 + 1] = (GLOW_COLOR.g / 255) * intensity;
        colors[i * 3 + 2] = (GLOW_COLOR.b / 255) * intensity;
      }
      edges.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      group.add(new THREE.LineSegments(edges, material));
    });

    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    group.position.sub(center);
    const targetHeight = 3.4;
    const scale = size.y > 0 ? targetHeight / size.y : 1;
    group.scale.setScalar(scale);

    const wrapper = new THREE.Group();
    wrapper.add(group);
    return { object: wrapper, height: targetHeight };
  }, [scene]);
}

// A loose cloud of glowing motes drifting around the figure — the
// activetheory.net "shimmering fog" — each point independently orbits a
// slow, randomized sine path so the cloud never looks static, layered
// over (not replacing) the solid glass body.
function AmbientMist({ radius }: { radius: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const COUNT = 380;

  const { geometry, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const seedData = new Float32Array(COUNT * 4); // speed, phase, radiusJitter, heightJitter
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4.2;
      // Wider left/right than front/back so the mist reads as flanking
      // the figure rather than a uniform ring around it.
      const rx = radius * (0.6 + Math.random() * 1.15);
      const rz = radius * (0.3 + Math.random() * 0.5);
      positions[i * 3] = Math.cos(theta) * rx;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * rz;

      const brightness = 0.5 + Math.random() * 0.5;
      colors[i * 3] = (GLOW_COLOR.r / 255) * brightness;
      colors[i * 3 + 1] = (GLOW_COLOR.g / 255) * brightness;
      colors[i * 3 + 2] = (GLOW_COLOR.b / 255) * brightness;

      seedData[i * 4] = 0.15 + Math.random() * 0.35;
      seedData[i * 4 + 1] = Math.random() * Math.PI * 2;
      seedData[i * 4 + 2] = 0.3 + Math.random() * 0.6;
      seedData[i * 4 + 3] = 0.4 + Math.random() * 0.8;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry: geom, seeds: { data: seedData, base: positions.slice() } };
  }, [radius]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;
    const t = clock.getElapsedTime();
    const position = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const speed = seeds.data[i * 4];
      const phase = seeds.data[i * 4 + 1];
      const radiusJitter = seeds.data[i * 4 + 2];
      const heightJitter = seeds.data[i * 4 + 3];
      const bx = seeds.base[i * 3];
      const by = seeds.base[i * 3 + 1];
      const bz = seeds.base[i * 3 + 2];
      const swirl = t * speed + phase;
      position.setXYZ(
        i,
        bx + Math.cos(swirl) * radiusJitter,
        by + Math.sin(swirl * 1.3) * heightJitter,
        bz + Math.sin(swirl) * radiusJitter
      );
    }
    position.needsUpdate = true;
    points.rotation.y = t * 0.03;
  });

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

function Figure({ progressRef }: { progressRef: { current: number } }) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const smoothed = useRef(0);
  const { object: figure, height } = useFigureLines(scene);

  useFrame(() => {
    smoothed.current += (progressRef.current - smoothed.current) * 0.08;
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.5 + smoothed.current * ((200 * Math.PI) / 180);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      <primitive object={figure} />
      <AmbientMist radius={height * 0.4} />
    </group>
  );
}

export default function HeroFigureCanvas({
  progressRef,
}: {
  progressRef: { current: number };
}) {
  return (
    <Canvas
      dpr={1}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 32, near: 0.1, far: 50, position: [0, 0.1, 8] }}
    >
      <Figure progressRef={progressRef} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.13} luminanceThreshold={0.5} luminanceSmoothing={0.25} radius={0.25} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
