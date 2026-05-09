export interface BlobStateTargets {
  noiseFreq: number;
  noiseAmp: number;
  speed: number;
  roughness: number;
  scale: number;
  emissiveMax: number;
}

export interface MetallicBlobProps {
  className?: string;
  /** Initial icosahedron subdivision; tap cycles detail between 4 and 7 (more mesh triangles). */
  icosahedronDetail?: number;
}

export const BLOB_UNIFORM_KEYS = [
  "uTime",
  "uNoiseFreq",
  "uNoiseAmp",
  "uHoverStrength",
  "uNoisePhase",
] as const;

export type BlobUniformKey = (typeof BLOB_UNIFORM_KEYS)[number];
