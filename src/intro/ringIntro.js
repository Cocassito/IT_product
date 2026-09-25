import * as THREE from "three/webgpu";


export function createRingIntroAnimation(ring, settings) {
  const introSettings = {
    duration: 1.4,
    startScale: 0,
    overshoot: 1.15,
    spinTurns: 0.6,
    amplitudeBurst: 5,
  };

  const targetScale = settings.scale;
  const targetOpacity = settings.opacity;
  let startTime = performance.now();

  function restart() {
    startTime = performance.now();
  }

  function easeBackOut(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function update() {
    const elapsed = (performance.now() - startTime) / 1000;
    const progress = Math.min(elapsed / introSettings.duration, 1);

    const scaleEase = easeBackOut(progress);
    const scale = THREE.MathUtils
      ? THREE.MathUtils.lerp(
          introSettings.startScale,
          targetScale * introSettings.overshoot,
          scaleEase,
        )
      : introSettings.startScale +
        (targetScale * introSettings.overshoot - introSettings.startScale) *
          scaleEase;

    const settleT = Math.min(progress * 1.3, 1);
    const finalScale = scale * (1 - settleT) + targetScale * settleT;
    ring.mesh.scale.setScalar(Math.max(finalScale, 0));

    const opacityT = Math.min(progress / 0.6, 1);
    settings.opacity = targetOpacity * (1 - Math.pow(1 - opacityT, 3));

    ring.mesh.rotation.y =
      settings.rotationY +
      introSettings.spinTurns * Math.PI * 2 * (1 - progress);

    const burst =
      Math.sin(Math.PI * Math.min(progress / 0.8, 1)) *
      introSettings.amplitudeBurst;
    ring.setAnimAmplitude(burst * (1 - progress));

    ring.updateMaterial(settings);

    return progress >= 1;
  }

  return { update, restart };
}
