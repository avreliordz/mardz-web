export type BlobDiscreteState = 0 | 1 | 2 | 3;

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
  initialState?: BlobDiscreteState;
  onStateChange?: (state: number) => void;
  /** Icosahedron subdivision detail (default 5 for broad browser support) */
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
