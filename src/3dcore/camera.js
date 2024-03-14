import { PerspectiveCamera } from 'three';
import { scene } from './scene';

let width, height;
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  width = window.innerWidth;
  height = window.innerHeight;
}

export const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);

if (camera) {
  camera.rotation.order = 'YXZ';
}

export const mousemoveFunc = event => {
  if (document.pointerLockElement === document.body) {
    camera.rotation.y -= event.movementX / 500;
    camera.rotation.x -= event.movementY / 500;
  }
}

scene.add(camera);