import * as THREE from "three/webgpu";
import {
  Fn,
  positionLocal,
  length,
  uniform,
  vec3,
  vec4,
  color,
  mix,
  smoothstep,
  sin,
  uv,
} from "three/tsl";

export function ringMaterial(settings) {
  const material = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide });

  //UNI
  const uInnerRadius = uniform(settings.innerRadius);
  const uSoftness = uniform(settings.edgeSoftness);
  const uOpacity = uniform(settings.opacity);
  const uColorLow = uniform(color(settings.colorLow));
  const uColorHigh = uniform(color(settings.colorHigh));
  const uThreshold = uniform(settings.threshold);
  const uWaveFreq = uniform(settings.waveFreq);
  const uWaveAmp = uniform(settings.waveAmp);

  //TENDANCE
  const wave = sin(
    uv()
      .x.mul(Math.PI * 2)
      .mul(uWaveFreq),
  ).mul(uWaveAmp);
  const displacedY = positionLocal.y.add(wave);
  material.positionNode = vec3(positionLocal.x, displacedY, positionLocal.z);

  
  //D2GRAD2
  material.colorNode = Fn(() => {
    const factor = smoothstep(
      uThreshold.sub(0.4),
      uThreshold.add(0.05),
      displacedY,
    );
    const finalColor = mix(uColorLow, uColorHigh, factor);
    
    //MASK
    const radialDist = length(positionLocal.xz);
    const fade = radialDist
      .sub(uInnerRadius)
      .div(uSoftness.max(0.0001))
      .clamp(0, 1);
    return vec4(finalColor, uOpacity.mul(fade));
  })();

  function updateMaterial(s = settings) {
    uInnerRadius.value = s.innerRadius;
    uSoftness.value = s.edgeSoftness;
    uOpacity.value = s.opacity;
    uColorLow.value.set(s.colorLow);
    uColorHigh.value.set(s.colorHigh);
    uThreshold.value = s.threshold;
    uWaveFreq.value = s.waveFreq;
    uWaveAmp.value = s.waveAmp;
  }

  return { material, updateMaterial };
}
