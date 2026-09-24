import { Box3, Vector3 } from 'three'

export function centerAndScaleModel(scene, targetSize = 2) {
  const bounds = new Box3().setFromObject(scene)
  const center = bounds.getCenter(new Vector3())
  const size = bounds.getSize(new Vector3())
  const largestDimension = Math.max(size.x, size.y, size.z)

  scene.position.sub(center)
  if (largestDimension > 0) {
    scene.scale.setScalar(targetSize / largestDimension)
  }
}
