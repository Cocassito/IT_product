import { addDebugFolder } from "../debug";

export function createRingGui(settings, update, updateGeometry) {
  const ringFolder = addDebugFolder("Ring");
  if (!ringFolder) return;

  const geometryFolder = ringFolder.addFolder("Geometry");
  geometryFolder
    .add(settings, "radiusTop", 0.1, 10, 0.1)
    .name("Top radius")
    .onChange(updateGeometry);
  geometryFolder
    .add(settings, "radiusBottom", 0.1, 10, 0.1)
    .name("Bottom radius")
    .onChange(updateGeometry);
  geometryFolder.add(settings, "height", 0.1, 5, 0.1).onChange(updateGeometry);
  geometryFolder
    .add(settings, "radialSegments", 3, 500, 1)
    .name("Segments")
    .onChange(updateGeometry);

  const positionFolder = ringFolder.addFolder("Position");
  positionFolder
    .add(settings, "positionX", -10, 10, 0.1)
    .name("X")
    .onChange(update);
  positionFolder
    .add(settings, "positionY", -10, 10, 0.1)
    .name("Y")
    .onChange(update);
  positionFolder
    .add(settings, "positionZ", -10, 10, 0.1)
    .name("Z")
    .onChange(update);

  const rotationFolder = ringFolder.addFolder("Rotation");
  rotationFolder
    .add(settings, "rotationX", -Math.PI, Math.PI, 0.01)
    .name("X")
    .onChange(update);
  rotationFolder
    .add(settings, "rotationY", -Math.PI, Math.PI, 0.01)
    .name("Y")
    .onChange(update);
  rotationFolder
    .add(settings, "rotationZ", -Math.PI, Math.PI, 0.01)
    .name("Z")
    .onChange(update);

  const materialFolder = ringFolder.addFolder("Material");
  materialFolder.add(settings, "scale", 0.1, 3, 0.1).onChange(update);
  materialFolder.addColor(settings, "colorLow").onChange(update);
  materialFolder.addColor(settings, "colorHigh").onChange(update);
  materialFolder.add(settings, "threshold", -1, 1, 0.01).onChange(update);
  materialFolder.add(settings, "waveFreq", 1, 20, 1).onChange(update);
  materialFolder.add(settings, "waveAmp", 0, 1, 0.01).onChange(update);
  materialFolder.add(settings, "opacity", 0, 1, 0.01).onChange(update);
  materialFolder.add(settings, "innerRadius", 0.1, 10, 0.1).onChange(update);
  materialFolder.add(settings, "edgeSoftness", 0, 10, 0.1).onChange(update);

  geometryFolder.open();
  positionFolder.open();
  materialFolder.open();
  ringFolder.open();
}
