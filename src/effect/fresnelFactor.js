import { positionWorld, normalWorld, cameraPosition, normalize, float, dot, pow, clamp } from 'three/tsl'

export function createFresnelFactor(power = 2.0) {
  const viewDir = normalize(cameraPosition.sub(positionWorld))
  const rim = float(1.0).sub(dot(normalWorld, viewDir)).clamp(0.0, 1.0)
  return pow(rim, power)
}
