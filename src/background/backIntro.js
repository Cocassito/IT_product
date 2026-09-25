export function createPillarsIntroAnimation(pillars, settings = {}) {
  const {
    duration = 3,    
    delay = 0,       
    spread = 0.8,    
  } = settings;

  if (spread !== undefined) {
    pillars.update({ introSpread: spread });
  }

  pillars.update({ introProgress: 0 });

  const startTime = performance.now() + delay * 1000;
  let done = false;

  function update() {
    if (done) return true;

    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    if (elapsed < 0) return false;

    const t = Math.min(elapsed / duration, 1);
    pillars.update({ introProgress: t });

    if (t >= 1) {
      done = true;
    }

    return done;
  }

  return { update };
}

export default createPillarsIntroAnimation;