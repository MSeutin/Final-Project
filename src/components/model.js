import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function loadModel(scene) {
  const loader = new GLTFLoader();
  loader.load('../models/car.glb', function (gltf) {
    const player = gltf.scene;
    player.scale.set(2, 2, 2);
    player.rotation.y = Math.PI; //-90 degrees around the x-axis

    player.traverse(function (node){  // traverse through the model elements
      if(node.isMesh){  // check if it is a mesh
        node.castShadow = true;
      }
    });

    scene.add(player);
    return player;
  });
}