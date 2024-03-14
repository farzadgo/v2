import { Vector3, } from 'three';
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

import { camera } from './camera';

const GRAVITY = 30;

export const worldOctree = new Octree();
export const playerCollider = new Capsule(new Vector3(0, 0.35, 0), new Vector3(0, 1, 0), 0.35);
const playerVelocity = new Vector3();
const playerDirection = new Vector3();
  
const keyStates = {};

export const keydownFunc = event => keyStates[event.code] = true;
export const keyupFunc = event => keyStates[event.code] = false;

let playerOnFloor = false;

const playerCollisions = () => {
  const result = worldOctree.capsuleIntersect(playerCollider);
  playerOnFloor = false
  if (result) {
    playerOnFloor = result.normal.y > 0
    if (!playerOnFloor) {
      playerVelocity.addScaledVector( result.normal, - result.normal.dot(playerVelocity))
    }
    playerCollider.translate(result.normal.multiplyScalar(result.depth))
  }
}

export const teleportPlayerIfOob = () => {
  if (camera.position.y <= -25) {
    playerCollider.start.set(0, 0.35, 0)
    playerCollider.end.set(0, 1, 0)
    playerCollider.radius =  0.35
    camera.position.copy(playerCollider.end)
    camera.rotation.set(0, 0, 0)
  }
}

export const updatePlayer = (deltaTime) => {
  let damping = Math.exp(- 4 * deltaTime) - 1
  if (!playerOnFloor) {
    playerVelocity.y -= GRAVITY * deltaTime;
    // small air resistance
    damping *= 0.1;
  }
  playerVelocity.addScaledVector(playerVelocity, damping);
  const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
  playerCollider.translate(deltaPosition);
  playerCollisions();
  camera.position.copy(playerCollider.end);
}

const getForwardVector = () => {
  camera.getWorldDirection(playerDirection)
  playerDirection.y = 0
  playerDirection.normalize()
  return playerDirection
}

const getSideVector = () => {
  camera.getWorldDirection(playerDirection)
  playerDirection.y = 0
  playerDirection.normalize()
  playerDirection.cross(camera.up)
  return playerDirection
}

export const controls = (deltaTime) => {
  // gives a bit of air control
  const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);
  if (keyStates['KeyW']) {
    playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
  }
  if (keyStates['KeyS']) {
    playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
  }
  if (keyStates['KeyA']) {
    playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
  }
  if (keyStates['KeyD']) {
    playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
  }
  if (playerOnFloor) {
    if (keyStates['Space']) {
      playerVelocity.y = 15;
    }
  }
}