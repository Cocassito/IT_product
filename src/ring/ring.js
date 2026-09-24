import * as THREE from "three/webgpu";
import { Fn, If, Discard, positionLocal, length, uniform, vec4, color } from "three/tsl";
import { createRingGui } from "./ringGui.js";

export default function ring() {
  const settings = {
    radiusTop: 5,
    radiusBottom: 5,
    height: 0.1,
    radialSegments: 65,
    positionX: 0,
    positionY: 0.5,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scale: 0.6,
    color: "#00f7ff",
    opacity: 1,
    wireframe: false,
    innerRadius: 4.9        ,     
    edgeSoftness: 0,  
  };

  const material = new THREE.MeshBasicMaterial({
    color: settings.color,
    transparent: true,
  });

  const uInnerRadius = uniform(settings.innerRadius);
  const uSoftness = uniform(settings.edgeSoftness);
  const uColor = uniform(color(settings.color));
  const uOpacity = uniform(settings.opacity);

  const radialDist = length(positionLocal.xz);

  material.colorNode = Fn(() => {
    If(radialDist.lessThan(uInnerRadius), () => {
      Discard();
    });

    const fade = radialDist.sub(uInnerRadius).div(uSoftness.max(0.0001)).clamp(0, 1);
    return vec4(uColor, uOpacity.mul(fade));
  })();

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
    material.wireframe = settings.wireframe;

    uColor.value.set(settings.color);
    uOpacity.value = settings.opacity;
    uInnerRadius.value = settings.innerRadius;
    uSoftness.value = settings.edgeSoftness;
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
    1,
  );
}