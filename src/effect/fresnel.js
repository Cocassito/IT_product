import { MeshStandardNodeMaterial } from 'three/webgpu'
import { color, uniform, sin, time, float, dot, positionViewDirection, normalView } from 'three/tsl'

export function createFresnelFactor(power = 2.0) {
  return dot(positionViewDirection, normalView).oneMinus().pow(power)
}

export function applyHighlight(scene, { rimColor = 0x5ac8ff, rimIntensity = 1.4 } = {}) {
  const intensity = uniform(rimIntensity)
  const pulse = float(1.7).add(sin(time.mul(1.5)).mul(0.3))
  const highlightNode = color(rimColor).mul(createFresnelFactor(10.0)).mul(intensity).mul(pulse)

  scene.traverse((child) => {
    if (!child.isMesh) return

    const previous = child.material
    const material = new MeshStandardNodeMaterial()
    if (previous.color) material.color.copy(previous.color)
    if (previous.map) material.map = previous.map
    material.roughness = previous.roughness ?? 0.6
    material.metalness = previous.metalness ?? 0.1
    material.emissiveNode = highlightNode

    child.material = material
  })

  return { rimIntensity: intensity }
}