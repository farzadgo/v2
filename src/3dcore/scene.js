import { Sky } from 'three/examples/jsm/objects/Sky';

import { Scene, Color, AmbientLight, HemisphereLight, DirectionalLight, Vector3, MathUtils } from 'three';

export const scene = new Scene();
scene.background = new Color('#494949');


// ------ LIGHTS ------

const ambientlight = new AmbientLight(0xFFFFFF, 0.8)
scene.add(ambientlight)

const hemlight = new HemisphereLight(0xFFFFFF, 0x444444, 1)
hemlight.position.set(- 2, 2, 2)
scene.add(hemlight)

const directionalLight = new DirectionalLight(0xFFFFFF, 0.3)
directionalLight.position.set(- 5, 25, - 1)
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.01
directionalLight.shadow.camera.far = 500
directionalLight.shadow.camera.right = 30
directionalLight.shadow.camera.left = - 30
directionalLight.shadow.camera.top	= 30
directionalLight.shadow.camera.bottom = - 30
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.radius = 4
directionalLight.shadow.bias = - 0.00006
scene.add(directionalLight)


// ------ SKY SHADER ------

const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const uniforms = sky.material.uniforms;
uniforms['turbidity'].value = 4.5;
uniforms['rayleigh'].value = 1.66;
uniforms['mieCoefficient'].value = 0.076;
uniforms['mieDirectionalG'].value = 0.223;

const sun = new Vector3();
const phi = MathUtils.degToRad(87.6);   // elevation
const theta = MathUtils.degToRad(180);  // azimuth
sun.setFromSphericalCoords(1, phi, theta);
uniforms['sunPosition'].value.copy(sun);