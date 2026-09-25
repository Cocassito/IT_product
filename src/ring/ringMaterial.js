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
  uv,
  min,
  abs,
  sign,
  sqrt,
  time,
  mx_noise_float,
} from "three/tsl";

export function ringMaterial(settings) {
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    side: THREE.DoubleSide,
  });

  //UNI
  const uInnerRadius = uniform(settings.innerRadius);
  const uSoftness = uniform(settings.edgeSoftness);
  const uOpacity = uniform(settings.opacity);
  const uColorNegative = uniform(color(settings.colorLow));
  const uColorFlat = uniform(color(settings.colorHigh));
  const uColorPositive = uniform(color(settings.colorPositive));

  const uAnimAmplitude = uniform(0);
  const uSkew = uniform(settings.skew);
  const uSmoothAbs = uniform(settings.smoothAbs);
  const uAmplitudeBoost = uniform(settings.amplitudeBoost);
  const uColorBlend = uniform(settings.colorBlend);

  const maxAmplitude = 3.0;

  const amplitudeAbs = abs(uAnimAmplitude);
  const amplitudeTime = mx_noise_float(time.mul(0.5))
    .mul(maxAmplitude)
    .mul(amplitudeAbs);

  const noise = mx_noise_float(
    uv().x.mul(10).add(time.mul(0.1)),
    amplitudeTime,
  );

  //Smooth les arrondies (les pics de mes sommets), avec juste abs(noise) ça ferait des pics en V
  const smoothAbsNoise = sqrt(
    noise.mul(noise).add(uSmoothAbs.mul(uSmoothAbs)),
  ).sub(uSmoothAbs);
  const rectified = smoothAbsNoise.mul(sign(uAnimAmplitude));

  // PERMET DE gérer la quantité de noise
  const skewAmount = amplitudeAbs.mul(uSkew).clamp(0, 0.85);
  const skewedNoise = mix(noise, rectified, skewAmount);

  //VALEUR SIGN22, en mode c'est la valeur pour gérer couleur et amplitude négatif ou positif, en gros ça m'envoie une direction
  const displacedNoise = skewedNoise.mul(uAmplitudeBoost);

  const displacedY = positionLocal.y.add(displacedNoise);
  material.positionNode = vec3(positionLocal.x, displacedY, positionLocal.z);

  //DEGRAD2 EN FONCTION DES SOMMETS
  material.colorNode = Fn(() => {
    const blendWidth = uColorBlend.max(0.001);

    const redAmount = smoothstep(0, blendWidth.negate(), displacedNoise);
    const greenAmount = smoothstep(0, blendWidth, displacedNoise);

    const finalColor = mix(
      mix(uColorFlat, uColorNegative, redAmount),
      uColorPositive,
      greenAmount,
    );

    ///FONDU START/END
    const fadeStart = smoothstep(0.05, 0.15, uv().x);
    const fadeEnd = smoothstep(1, 0.9, uv().x);
    const edgeFade = min(fadeStart, fadeEnd);

    //FONDU INTER
    const radialDist = length(positionLocal.xz);
    const radialFade = radialDist
      .sub(uInnerRadius)
      .div(uSoftness.max(0.0001))
      .clamp(0, 1);

    const finalAlpha = uOpacity.mul(radialFade).mul(edgeFade);

    return vec4(finalColor, finalAlpha);
  })();

  function updateMaterial(s = settings) {
    uInnerRadius.value = s.innerRadius;
    uSoftness.value = s.edgeSoftness;
    uOpacity.value = s.opacity;
    uColorNegative.value.set(s.colorLow);
    uColorFlat.value.set(s.colorHigh);
    uColorPositive.value.set(s.colorPositive);
    uSkew.value = s.skew;
    uSmoothAbs.value = s.smoothAbs;
    uAmplitudeBoost.value = s.amplitudeBoost;
    uColorBlend.value = s.colorBlend;
  }

  function setAnimAmplitude(v) {
    uAnimAmplitude.value = v;
  }

  return { material, updateMaterial, setAnimAmplitude };
}
