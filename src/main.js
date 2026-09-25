import "./style.css";
import * as THREE from 'three/webgpu'

import {
  Color,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  Timer,
} from "three";
import { WebGPURenderer } from "three/webgpu";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createObject } from "./object/object.js";
import ring from "./ring/ring.js";
import { createRingIntroAnimation } from "./intro/ringIntro.js";
import { bloom } from 'three/addons/tsl/display/BloomNode.js'
import { float, mrt, output, pass } from 'three/tsl'
import { createPostProcGui } from "./effect/postProcGui.js";
import { createPillarsBackground } from "./background/back.js";
import createPillarsGui from "./background/backGui.js";
import { placeRingsAround } from "./ring/ringPlacement.js";

const canvas = document.querySelector("#webgpu-canvas");
const scene = new Scene();
scene.background = new Color(0x0b101c);

const camera = new PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(3.4, 2.4, 4.8);

const renderer = new WebGPURenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(
  new DirectionalLight(0xffe6c5, 6).translateX(-3).translateY(5).translateZ(4),
);
scene.fog = new THREE.FogExp2(0x0b101c, 0.2);

const bloomSettings = {
  strength: 1.5,
  radius: 0.4,
  threshold: 0,
  resolutionScale: 1,
};

function updateBloom() {
  bloomPass.strength.value = bloomSettings.strength;
  bloomPass.radius.value = bloomSettings.radius;
  bloomPass.threshold.value = bloomSettings.threshold;
}

//POST PROC
const renderPipeline = new THREE.RenderPipeline(renderer)
const scenePass = pass(scene, camera)

scenePass.setMRT(mrt({
  output: output, 
  bloomIntensity: float(0)
}))

const sceneOutput = scenePass.getTextureNode('output')
const bloomIntensity = scenePass.getTextureNode('bloomIntensity').r


// Bloom pass
const bloomPass = bloom(
  sceneOutput.mul(bloomIntensity),
  bloomSettings.strength,
  bloomSettings.radius,
  bloomSettings.threshold
);
const bloomOutput = sceneOutput.add(bloomPass)

renderPipeline.outputNode = bloomOutput

//BACK 

const pillars = createPillarsBackground();
scene.add(pillars.mesh);
createPillarsGui(pillars); 


//IT
const [{ object, update: updateObject, setProgress }] = await Promise.all([
  createObject(),
  renderer.init(),
]);
scene.add(object);

//RING
const ringObj = ring();
scene.add(ringObj.mesh);
const ringIntro = createRingIntroAnimation(ringObj, ringObj.settings);

//RINGS DUPLIQUÉS
const extraRings = placeRingsAround(ringObj, 50, {
  minRadius: 1,
  maxRadius: 14,
  scaleRange: [0.15, 0.4],
  heightRange: [-1, 1],
});
extraRings.forEach((r) => scene.add(r.mesh));


createPostProcGui(bloomSettings, updateBloom, {
  uBloomBase: ringObj.uBloomBase,
  uBloomMultiplier: ringObj.uBloomMultiplier,
  uBloomMax: ringObj.uBloomMax,
});

let ringIntroDone = false;

//SOURIS CONTROL
window.addEventListener("mousemove", (event) => {
  const xNorm = event.clientX / window.innerWidth;

  setProgress(1 - xNorm);

  // Amplitude signée : -1 à gauche // 0 au centre // +1 à droite
  const signed = (xNorm - 0.5) * 2;
  ringObj.setAnimAmplitude(signed);
});

renderer.setAnimationLoop(animate);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const timer = new Timer();

function animate() {
  timer.update();
  const delta = timer.getDelta();
  updateObject(delta);

  if (!ringIntroDone) {
    ringIntroDone = ringIntro.update();
  }

  controls.update();
  // renderer.render(scene, camera);
  renderPipeline.render()

}

window.addEventListener("resize", resize);
