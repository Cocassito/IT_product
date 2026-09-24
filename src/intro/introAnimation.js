export function createIntroAnimation(object, settings) {
  let startTime = performance.now()

  function restart() {
    startTime = performance.now()
  }

  function update() {
    const elapsed = (performance.now() - startTime) / 1000
    const progress = Math.min(elapsed / settings.introDuration, 1)
    const eased = 1 - (1 - progress) ** 3

    object.position.set(
      settings.positionX,
      settings.positionY + settings.startHeight * (1 - eased),
      settings.positionZ,
    )
    object.rotation.set(
      settings.rotationX,
      settings.rotationY + settings.spinTurns * Math.PI * 2 * (1 - eased),
      settings.rotationZ,
    )
  }

  return { update, restart }
}
