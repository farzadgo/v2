import { scene } from './scene';
import { worldOctree } from './player';
import { LoadingManager, MeshNormalMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { setModelLoaded, setModelError } from '../../redux/actions';

const modelUrl = 'https://res.cloudinary.com/dd3tumnu6/image/upload/v1664537341/getlost-models/fagosemi-getlost-c_ggxqxl.glb';

export const manager = new LoadingManager();

export const loadModels = () => {
  const loader = new GLTFLoader(manager);

  loader.load(
    modelUrl, 
    gltf => {
      const objects = gltf.scene.children;
      objects.forEach(e => {
        e.material = new MeshNormalMaterial({wireframe: true, })
      })
      scene.add(gltf.scene);
      // if (objects) setModelLoaded(true);
      worldOctree.fromGraphNode(gltf.scene);
      gltf.scene.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material.map) {
            child.material.map.anisotropy = 8
          }
        }
      });
    }
  )

}