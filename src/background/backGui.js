import { addDebugFolder } from "../debug";


export default function createPillarsGui(pillars) {
  const folder = addDebugFolder("Pillars BG");
  if (!folder) return;
  const s = pillars.settings;

  folder.add(s, "amplitude", 0, 3, 0.01).onChange(() => pillars.update(s));
  folder.add(s, "speed", 0, 5, 0.01).onChange(() => pillars.update(s));
  folder.add(s, "speedVariance", 0, 5, 0.01).onChange(() => pillars.update(s));
  folder.add(s, "baseHeight", 0, 1, 0.01).onChange(() => pillars.update(s));
  folder.addColor(s, "colorLow").onChange(() => pillars.update(s));
  folder.addColor(s, "colorHigh").onChange(() => pillars.update(s));
}