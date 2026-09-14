import * as THREE from "three";
import { peptides } from "@/lib/peptides";

export const CHAIN_LENGTH = peptides.length;

// One waypoint per peptide, travelling mainly left-to-right (x) with only
// a gentle drift in height/depth — a side-on tracking shot rather than a
// tunnel flying away from the camera. A straight-ahead flythrough crowds
// every node toward the same vanishing point on screen; spreading the
// path across x instead gives each one its own, evenly spaced slot.
// Kept deliberately low-frequency/low-curvature: the double helix
// twisting tightly around this line already reads as intricate — if the
// CENTERLINE itself also whips around sharply, no simple tracking camera
// can keep up, since "forward" changes faster than any fixed look-ahead
// distance can track.
const SPAN_X = 42;

function buildWaypoints(): THREE.Vector3[] {
  return peptides.map((_, i) => {
    const t = i / (CHAIN_LENGTH - 1);
    const x = (t - 0.5) * SPAN_X;
    const y = Math.sin(t * Math.PI * 3.2) * 1.6;
    const z = Math.cos(t * Math.PI * 2.4) * 2.2;
    return new THREE.Vector3(x, y, z);
  });
}

export function buildChainCurve(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(buildWaypoints(), false, "catmullrom", 0.35);
}

// A stable (non-flipping) frame along the curve: normal/binormal derived
// from the tangent and world-up, rather than true Frenet frames which can
// twist unpredictably through inflection points. Shared by the camera rig
// and the digital-helix geometry so both agree on "which way is around".
export function frameAt(curve: THREE.CatmullRomCurve3, t: number) {
  const clamped = THREE.MathUtils.clamp(t, 0, 1);
  const point = curve.getPointAt(clamped);
  const tangent = curve.getTangentAt(clamped).normalize();

  const worldUp = new THREE.Vector3(0, 1, 0);
  const normal = new THREE.Vector3().crossVectors(worldUp, tangent);
  if (normal.lengthSq() < 1e-4) normal.set(1, 0, 0);
  normal.normalize();
  const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

  return { point, tangent, normal, binormal };
}

// How many full turns the double helix makes over the whole backbone, and
// how far each strand sits from the centerline. Two strands 180° apart
// (phase 0 and Math.PI) trace the same twist, so the ladder rungs (one per
// peptide) always land directly opposite each other.
export const HELIX_TURNS = 6;
export const HELIX_RADIUS = 0.55;

export function helixPointAt(
  curve: THREE.CatmullRomCurve3,
  t: number,
  phase: number,
  target = new THREE.Vector3()
) {
  const { point, normal, binormal } = frameAt(curve, t);
  const angle = t * HELIX_TURNS * Math.PI * 2 + phase;
  return target
    .copy(point)
    .addScaledVector(normal, Math.cos(angle) * HELIX_RADIUS)
    .addScaledVector(binormal, Math.sin(angle) * HELIX_RADIUS);
}

// A THREE.Curve wrapper around helixPointAt so it can feed TubeGeometry
// directly — TubeGeometry just needs any Curve subclass with getPoint(t).
export class HelixStrandCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private base: THREE.CatmullRomCurve3,
    private phase: number
  ) {
    super();
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    return helixPointAt(this.base, t, this.phase, target);
  }
}
