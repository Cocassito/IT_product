import { Group, AnimationMixer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { centerAndScaleModel } from "./centerAndScaleModel.js";
import { createIntroAnimation } from "../intro/introAnimation.js";
import { createObjectGui } from "./objectGui.js";
import { applyHighlight } from "../effect/fresnel.js";

const modelUrl = new URL("../assets/model/Prototype_IT3.glb", import.meta.url);

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
  const { scene, animations } = await new GLTFLoader().loadAsync(modelUrl.href);
  centerAndScaleModel(scene);
  applyHighlight(scene);

  const object = new Group();
  object.add(scene);

  const settings = { ...DEFAULT_SETTINGS };
  const { update: introUpdate, restart } = createIntroAnimation(
    object,
    settings,
  );
  createObjectGui(settings, restart);

  const mixer = new AnimationMixer(scene);
  const clip = animations[0];
  const action = mixer.clipAction(clip);
  action.play();
  action.paused = true; 

  function setProgress(t) {
    action.time = t * clip.duration;
    mixer.update(0);
  }

  function update(delta) {
    introUpdate(delta);
  }

  return { object, update, setProgress };
}
