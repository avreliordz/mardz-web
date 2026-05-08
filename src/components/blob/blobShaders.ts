/**
 * 3D simplex noise (Ashima / Ian McEwan glsl-noise pattern).
 * No literal colors — shading stays in MeshStandardMaterial.
 */
export const BLOB_NOISE3D_GLSL = /* glsl */ `
vec3 mod289_3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289_4(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289_4(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289_3(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const BLOB_VERTEX_UNIFORMS_GLSL = /* glsl */ `
uniform float uNoisePhase;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uHoverStrength;
uniform float uClickKick;
`;

/** Injected after #include <begin_vertex> — soft, fluid displacement (low jag, round silhouette) */
export const BLOB_VERTEX_DISPLACE_SNIPPET = /* glsl */ `
  vec3 dir = normalize(transformed);
  float h = 1.0 + uHoverStrength * 0.42;
  float t = uNoisePhase * 1.04;
  float drift = uNoisePhase * 0.33;
  float f = uNoiseFreq * 0.82;
  float n1 = snoise(dir * f + vec3(t * 0.9 + drift * 0.35, t * 0.88 - drift * 0.28, t * 0.95 + drift * 0.2));
  float n2 = snoise(dir * f * 1.55 + vec3(t * 1.05 + drift * 0.22, t * 1.12, t * 0.98 - drift * 0.31)) * 0.52;
  float blend = clamp(n1 * 0.8 + n2 * 0.2, -1.0, 1.0);
  float shaped = sign(blend) * pow(abs(blend), 0.72);
  float roundBias = 1.0 - length(transformed) * 0.028;
  roundBias = clamp(roundBias, 0.88, 1.0);
  float tapMul = 1.0 + uClickKick * 2.55;
  float disp = shaped * uNoiseAmp * h * roundBias * 0.95 * tapMul;
  transformed += dir * disp;
  float ring = sin(uNoisePhase * 16.0 - length(transformed) * 11.0) * uClickKick * 0.22;
  transformed += dir * ring;
`;

export function appendBlobNoiseAndDisplace(vertexShader: string): string {
  const withNoise = BLOB_NOISE3D_GLSL + BLOB_VERTEX_UNIFORMS_GLSL + vertexShader;
  return withNoise.replace(
    "#include <begin_vertex>",
    `#include <begin_vertex>\n${BLOB_VERTEX_DISPLACE_SNIPPET}\n`,
  );
}

/** High-frequency grain + slow gradient wash on final lit color (runs after IBL, before tonemapping). */
export function appendBlobSurfaceGrain(fragmentShader: string): string {
  return fragmentShader.replace(
    "#include <opaque_fragment>",
    `
    {
      vec3 nSurf = normalize(normal);
      float t = uNoisePhase;

      float wash1 = sin(dot(nSurf, vec3(0.71, 0.52, 0.47)) * 4.6 + t * 0.42);
      float wash2 = sin(dot(nSurf, vec3(-0.55, 0.78, 0.30)) * 3.9 - t * 0.33);
      float wash3 = cos(dot(nSurf, vec3(0.12, -0.66, 0.74)) * 5.1 + t * 0.48);
      float wash = (wash1 * 0.4 + wash2 * 0.38 + wash3 * 0.22) * 0.5 + 0.5;
      outgoingLight *= mix(0.87, 1.13, wash);

      vec3 gn = nSurf * 2.2 + normalize(vViewPosition) * 1.85;
      vec2 h = gn.xy * 27.0 + gn.zy * 18.5 + vec2(t * 1.55, -t * 1.18);
      float g1 = fract(sin(dot(h, vec2(12.9898, 78.233)) + t * 2.85) * 43758.5453);
      float g2 = fract(sin(dot(h.yx * 1.72 + vec2(t * 0.65, -t * 0.42), vec2(39.346, 11.234)) + t * 2.05) * 23421.0);
      float g3 = fract(sin(dot(h * 1.37 + t * 0.28, vec2(19.1, 47.7)) + t * 3.1) * 19102.7);
      float grain = g1 * 0.48 + g2 * 0.34 + g3 * 0.18;
      outgoingLight *= mix(0.84, 1.16, grain);
    }
    #include <opaque_fragment>`,
  );
}
