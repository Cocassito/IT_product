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
  min,
  time,
  mx_noise_float
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


  const maxAmplitude = 3.0; 

  const amplitudeTime = mx_noise_float(time.mul(0.5)).mul(maxAmplitude);

  //const noise = mx_noise_float(positionLocal.x.mul(2).add(time.mul(0.1)), 1);
  const noise = mx_noise_float(uv().x.mul(10).add(time.mul(0.1)), amplitudeTime);
  //const displacedY = positionLocal.y.add(wave);
  const displacedY = positionLocal.y.add(noise);
  material.positionNode = vec3(positionLocal.x, displacedY, positionLocal.z);
  

  
  //D2GRAD2
  material.colorNode = Fn(() => {
  const factor = smoothstep(uThreshold.sub(0.4), uThreshold.add(0.05), displacedY);
  const finalColor = mix(uColorLow, uColorHigh, factor);


  ///FONDU START/END
  const fadeStart = smoothstep(0.05, 0.15, uv().x);
  const fadeEnd = smoothstep(1, 0.9, uv().x);
  const edgeFade = min(fadeStart, fadeEnd);

  //FONDU INTER
  const radialDist = length(positionLocal.xz);
  const radialFade = radialDist.sub(uInnerRadius).div(uSoftness.max(0.0001)).clamp(0, 1);

  const finalAlpha = uOpacity.mul(radialFade).mul(edgeFade);

  return vec4(finalColor, finalAlpha);
})();

  function updateMaterial(s = settings) {
    uInnerRadius.value = s.innerRadius;
    uSoftness.value = s.edgeSoftness;
    uOpacity.value = s.opacity;
    uColorLow.value.set(s.colorLow);
    uColorHigh.value.set(s.colorHigh);
    uThreshold.value = s.threshold;
  }

  return { material, updateMaterial };
}
