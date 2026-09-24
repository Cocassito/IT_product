import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { centerAndScaleModel } from "./centerAndScaleModel.js";
import { applyHighlight } from "../effect/applyHighlight.js";
import { createIntroAnimation } from "../intro/introAnimation.js";
import { createObjectGui } from "./objectGui.js";

const modelUrl = new URL("../assets/model/Prototype_IT.glb", import.meta.url);

const DEFAULT_SETTINGS = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotationX: 0,
  rotationY: -0.96,
  rotationZ: 0.18,
  introDuration: 1.6,
  startHeight: -2.8,
  spinTurns: 1,
};

export async function createObject() {
  const { scene } = await new GLTFLoader().loadAsync(modelUrl.href);
  centerAndScaleModel(scene);
  applyHighlight(scene);

  const object = new Group();
  object.add(scene);

  const settings = { ...DEFAULT_SETTINGS };
  const { update, restart } = createIntroAnimation(object, settings);
  createObjectGui(settings, restart);

  return { object, update };
}
