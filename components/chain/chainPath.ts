import * as THREE from "three";
import { peptides } from "@/lib/peptides";

export const CHAIN_LENGTH = peptides.length;

// One waypoint per peptide, drifting gently through depth (z) so the
// camera can fly along the whole backbone as the user scrolls through
// the section. Kept deliberately low-frequency/low-curvature: the double
// helix twisting tightly around this line already reads as intricate —
// if the CENTERLINE itself also whips around sharply, no simple chase
// camera can keep up, since "forward" changes faster than any fixed
// look-ahead distance can track.
function buildWaypoints(): THREE.Vector3[] {
  return peptides.map((_, i) => {
    const t = i / (CHAIN_LENGTH - 1);
    const x = Math.sin(t * Math.PI * 1.1) * 5;
    const y = Math.cos(t * Math.PI * 0.8) * 2.5;
    const z = -t * 46;
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
