import "./style.css";
import { Color, DirectionalLight, PerspectiveCamera, Scene } from "three";
import { WebGPURenderer } from "three/webgpu";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createObject } from "./object/object.js";
import ring from "./ring/ring.js";

const canvas = document.querySelector("#webgpu-canvas");
const scene = new Scene();
scene.background = new Color(0x0b101c);

/////CAMERA
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
// controls.minDistance = 3
// controls.maxDistance = 7
// controls.target.set(0, 1, 0)

/////LIGHT/////
scene.add(
  new DirectionalLight(0xffe6c5, 4).translateX(-3).translateY(5).translateZ(4),
);

//////IT///////
const [{ object, update: updateObject }] = await Promise.all([
  createObject(),
  renderer.init(),
]);
scene.add(object);
scene.add(ring());
renderer.setAnimationLoop(animate);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  updateObject();
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", resize);
