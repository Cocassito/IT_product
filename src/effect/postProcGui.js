import { addDebugFolder } from "../debug";

export function createPostProcGui(settings, update, ringBloomUniforms) {
  const bloomFolder = addDebugFolder("Bloom");
  if (!bloomFolder) return;

  bloomFolder
    .add(settings, "strength", 0, 5, 0.01)
    .name("Strength")
    .onChange(update);
  bloomFolder
  .add(settings, "radius", 0, 1, 0.001)
  .name("Radius")
  .onChange(update);
  bloomFolder
    .add(settings, "threshold", 0, 2, 0.01)
    .name("Threshold")
    .onChange(update);
  bloomFolder
    .add(settings, "resolutionScale", 0.25, 1, 0.05)
    .name("Resolution")
    .onChange(update);

  if (
    ringBloomUniforms?.uBloomBase &&
    ringBloomUniforms?.uBloomMultiplier &&
    ringBloomUniforms?.uBloomMax
  ) {
    const { uBloomBase, uBloomMultiplier, uBloomMax } = ringBloomUniforms;
    bloomFolder.add(uBloomBase, "value", 0, 3, 0.01).name("Bloom Base");
    bloomFolder
      .add(uBloomMultiplier, "value", 0, 5, 0.01)
      .name("Bloom x Amplitude");
    bloomFolder.add(uBloomMax, "value", 0, 10, 0.1).name("Bloom Max");
  } else {
    console.warn(
      "Bloom uniforms manquants sur ringObj, GUI bloom ring désactivé",
      ringBloomUniforms,
    );
  }

  bloomFolder.open();
}
