import * as THREE from "three/webgpu";
import { createRingGui } from "./ringGui.js";
import { ringMaterial } from "./ringMaterial.js";

export default function ring() {
  const settings = {
    radiusTop: 5,
    radiusBottom: 5,
    height: 0.1,
    radialSegments: 200,
    positionX: 0,
    positionY: 0.5,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scale: 0.6,
    colorLow: "#ff1b1b",
    colorHigh: "#00f7ff",
    threshold: 0,
    waveFreq: 4,
    waveAmp: 0.2,
    opacity: 1,
    wireframe: false,
    innerRadius: 4.9,
    edgeSoftness: 0,
  };

  const { material, updateMaterial } = ringMaterial(settings);
  const cylinder = new THREE.Mesh(createGeometry(settings), material);

  function update() {
    cylinder.position.set(
      settings.positionX,
      settings.positionY,
      settings.positionZ,
    );
    cylinder.rotation.set(
      settings.rotationX,
      settings.rotationY,
      settings.rotationZ,
    );
    cylinder.scale.setScalar(settings.scale);

    updateMaterial(settings);
  }

  function updateGeometry() {
    cylinder.geometry.dispose();
    cylinder.geometry = createGeometry(settings);
  }

  createRingGui(settings, update, updateGeometry);
  update();

  return cylinder;
}

function createGeometry(settings) {
  return new THREE.CylinderGeometry(
    settings.radiusTop,
    settings.radiusBottom,
    settings.height,
    settings.radialSegments,
    32,
    true,
  );
}
