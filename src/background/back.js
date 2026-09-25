import * as THREE from "three/webgpu";
import {
  instanceIndex,
  positionLocal,
  time,
  uniform,
  vec3,
  vec2,
  color,
  mix,
  sin,
  fract,
  varying,
  clamp

} from "three/tsl";

export function createPillarsBackground(settings = {}) {
  const defaults = {
    gridSize: 200,
    spacing: 0.1,
    pillarWidth: 0.5,
    baseHeight: 0.2,
    amplitude: 0.6,
    speed: 0.1,
    speedVariance: 0.5,
    colorLow: "#0b101c",
    colorHigh: "#3d6fb0",
    yOffset: -2,
    introSpread: 0.8,
  };
  const s = { ...defaults, ...settings };

  const uAmplitude = uniform(s.amplitude);
  const uSpeed = uniform(s.speed);
  const uSpeedVariance = uniform(s.speedVariance);
  const uBaseHeight = uniform(s.baseHeight);
  const uColorLow = uniform(color(s.colorLow));
  const uColorHigh = uniform(color(s.colorHigh));
  const uIntroProgress = uniform(1);
  const uIntroSpread = uniform(s.introSpread);

  const size = s.gridSize;
  const count = size * size;
  const maxDist = Math.sqrt(2) * ((size - 1) / 2) || 1;

  const hash = (x) => fract(sin(x.mul(12.9898)).mul(43758.5453123));

  const material = new THREE.MeshStandardNodeMaterial({ roughness: 0.5 });

  const index = instanceIndex.toFloat();
  const column = index.mod(size);
  const row = index.div(size).floor();

  const centeredColumn = column.sub((size - 1) / 2);
  const centeredRow = row.sub((size - 1) / 2);

  const x = centeredColumn.mul(s.spacing);
  const z = centeredRow.mul(s.spacing);

  const seedPhase = hash(index).mul(6);
  const seedSpeed = hash(index.add(730));

  const individualSpeed = uSpeed.add(seedSpeed.mul(uSpeedVariance));
  const osc = time.mul(individualSpeed).add(seedPhase).sin();

  const normDist = vec2(centeredColumn, centeredRow).length().div(maxDist);

  const localProgress = clamp(
    uIntroProgress.mul(uIntroSpread.add(1)).sub(normDist.mul(uIntroSpread)),
    0,
    1,
  );

  const height = osc
    .add(1)
    .mul(0.5)
    .mul(uAmplitude)
    .add(uBaseHeight)
    .mul(localProgress);

  material.positionNode = positionLocal
    .mul(vec3(s.pillarWidth, height, s.pillarWidth))
    .add(vec3(x, 0, z));

  material.colorNode = mix(uColorLow, uColorHigh, varying(osc.add(1).mul(0.5)));

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  geometry.translate(0, 0.5, 0);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.count = count;
  mesh.frustumCulled = false;
  mesh.position.y = s.yOffset;

  function update(next = {}) {
    if (next.amplitude !== undefined) uAmplitude.value = next.amplitude;
    if (next.speed !== undefined) uSpeed.value = next.speed;
    if (next.speedVariance !== undefined)
      uSpeedVariance.value = next.speedVariance;
    if (next.baseHeight !== undefined) uBaseHeight.value = next.baseHeight;
    if (next.colorLow) uColorLow.value.set(next.colorLow);
    if (next.colorHigh) uColorHigh.value.set(next.colorHigh);
    if (next.introSpread !== undefined) uIntroSpread.value = next.introSpread;
    if (next.introProgress !== undefined) {
      uIntroProgress.value = Math.min(Math.max(next.introProgress, 0), 1);
    }
  }

  return { mesh, settings: s, update };
}
