import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

const debugEnabled = window.location.hash === '#debug'
let debugGUI

export function addDebugFolder(name) {
  if (!debugEnabled) {
    return null
  }

  debugGUI ??= new GUI({ title: 'Debug' })
  return debugGUI.addFolder(name)
}