import { addDebugFolder } from "../debug";

export function createObjectGui(settings, restart) {
  const objectFolder = addDebugFolder("Object");
  if (!objectFolder) return;

  const positionFolder = objectFolder.addFolder("Position");
  positionFolder.add(settings, "positionX", -5, 5, 0.1).name("X");
  positionFolder.add(settings, "positionY", -5, 5, 0.1).name("Y");
  positionFolder.add(settings, "positionZ", -5, 5, 0.1).name("Z");

  const rotationFolder = objectFolder.addFolder("Rotation");
  rotationFolder.add(settings, "rotationX", -Math.PI, Math.PI, 0.01).name("X");
  rotationFolder.add(settings, "rotationY", -Math.PI, Math.PI, 0.01).name("Y");
  rotationFolder.add(settings, "rotationZ", -Math.PI, Math.PI, 0.01).name("Z");

  const introFolder = objectFolder.addFolder("Intro");
  introFolder.add(settings, "introDuration", 0.1, 10, 0.1).name("Duration");
  introFolder.add(settings, "startHeight", -10, 0, 0.1).name("Start height");
  introFolder.add(settings, "spinTurns", 0, 10, 0.1).name("Spin turns");
  introFolder.add({ restart }, "restart");

  positionFolder.open();
  rotationFolder.open();
  introFolder.open();
  objectFolder.open();
}
