import ring from "./ring.js";

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function getRingFootprint(settings) {
  return (settings.radiusTop ?? 5) * settings.scale;
}

/**
 * @param {object} mainRing - l'objet retourné par ring() pour le ring principal
 * @param {number} count - nombre de rings à générer
 * @param {object} options
 * @param {number} options.minRadius - distance minimale du centre
 * @param {number} options.maxRadius - distance maximale du centre
 * @param {[number, number]} options.scaleRange - plage de scale aléatoire
 * @param {[number, number]} options.heightRange - plage de positionY aléatoire
 * @param {number} options.maxAttempts - tentatives max par ring avant abandon
 * @param {number} options.margin - marge de sécurité entre deux footprints
 * @returns {Array} liste des objets ring créés
 */
export function placeRingsAround(mainRing, count, options = {}) {
  const {
    minRadius = getRingFootprint(mainRing.settings) + 1,
    maxRadius = minRadius + 10,
    scaleRange = [0.15, 0.5],
    heightRange = [-1, 1],
    maxAttempts = 30,
    margin = 0.3,
  } = options;

  const placed = [
    { x: 0, z: 0, footprint: getRingFootprint(mainRing.settings) },
  ];

  const rings = [];

  for (let i = 0; i < count; i++) {
    const scale = randomRange(scaleRange[0], scaleRange[1]);
    const footprint = 5 * scale;

    const position = findFreePosition({
      placed,
      footprint,
      minRadius,
      maxRadius,
      margin,
      maxAttempts,
    });

    if (!position) continue; 

    placed.push({ x: position.x, z: position.z, footprint });

    const r = ring(
      {
        positionX: position.x,
        positionY: randomRange(heightRange[0], heightRange[1]),
        positionZ: position.z,
        rotationX: randomRange(0, Math.PI * 2),
        rotationY: randomRange(0, Math.PI * 2),
        rotationZ: randomRange(0, Math.PI * 2),
        scale,
      },
      { withGui: false },
    );

    rings.push(r);
  }

  return rings;
}

function findFreePosition({ placed, footprint, minRadius, maxRadius, margin, maxAttempts }) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const angle = randomRange(0, Math.PI * 2);
    const radius = randomRange(minRadius, maxRadius);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const overlaps = placed.some((p) => {
      const dist = Math.hypot(p.x - x, p.z - z);
      return dist < p.footprint + footprint + margin;
    });

    if (!overlaps) return { x, z };
  }

  return null;
}