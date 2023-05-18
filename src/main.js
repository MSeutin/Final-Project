import * as THREE from 'three';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// LOCAL IMPORTS
import ThirdPersonCamera from './components/thirdPersonCamera';
import initGround from './components/ground';

// VARIABLES
let player;

///////////////////////////
//         SCENE
///////////////////////////
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x87CEEB );

// Define a target object that represents the player
const playerTarget = {
  Position: new THREE.Vector3(0, 0, 0),
  Rotation: new THREE.Quaternion()
};

///////////////////////////
//        CAMERA
///////////////////////////
const fov = 75; // field of view
const aspect = window.innerWidth / window.innerHeight;
const near = 1; // near clipping plane
const far = 100; // far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// Create the third-person camera and pass in the target object
let thirdPersonCamera = new ThirdPersonCamera({ camera: camera, target: playerTarget });

///////////////////////////
//       RENDERER
///////////////////////////
const renderer = new THREE.WebGLRenderer({ antialias: true });
// const shadowMap = new THREE.WebGLShadowMap(renderer);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // or any other type of shadow map
renderer.shadowMap.autoUpdate = true;
renderer.shadowMap.needsUpdate = true;

renderer.setSize(window.innerWidth, window.innerHeight);
// add renderer to HTML document. This is a <canvas> element 
document.body.appendChild( renderer.domElement );

// MODEL WITH ANIMATIONS
const loader = new GLTFLoader();
loader.load('models/car.glb', function (gltf) {
  player = gltf.scene;  // sword 3D object is loaded
  player.scale.set(3, 3, 3);
  player.rotation.y = Math.PI; //-90 degrees around the x-axis

  player.traverse(function (node){  // traverse through the model elements
      if(node.isMesh){  // check if it is a mesh
          node.castShadow = true;
      }
  });
  scene.add(player);
});

///////////////////////////
//       GROUND
///////////////////////////
// add background
initGround(scene);

// const ground2 = ground;
// const ground3 = ground;


function movePlayerForward(playerPosition) {
  playerPosition.z -= 1; // move the player forward by decreasing the z-coordinate
  player.position.copy(playerPosition); // update the player's position
}

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  let keyCode = event.which;
  console.log(keyCode);
  // 75 is letter k for forward
  switch (keyCode) {
    case 38: case 75: // forward
      player.position.z -= 0.4;
      break;
      
    case 40: case 74: // backward
      player.position.z += 0.1;
      break;
      
    case 37: case 72: // left
      // player.position.x -= 1;
      player.rotation.y += Math.PI/55;
      break;
      
    case 39: case 76: // right
      player.rotation.y -= Math.PI/55;
      player.position.z -= 0.1;
      break;
      
    case 32: // spacebar to recenter
      location.reload();
      break;
      
    default:
      break;
  }
  playerTarget.Position.copy(player.position);
  playerTarget.Rotation.copy(player.quaternion); 
}

///////////////////////////
//      LIGHT
///////////////////////////
const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight( 0xF7F9F9  ); // soft white light
ambientLight.castShadow = true;
scene.add( ambientLight );

///////////////////////////
//      CONTROLS
///////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

///////////////////////////
//      TEXT
///////////////////////////
const fontLoader = new FontLoader();
fontLoader.load(
  'node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json',
  (droidFont) => {
    const textGeometry = new TextGeometry('Anu', {
      height: 4,
      size: 10,
      font: droidFont,
    });
    const textMaterial = new THREE.MeshNormalMaterial();
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.x = -19;
    textMesh.position.y = 2;
  }
)

///////////////////////////
//       RENDER
///////////////////////////
function animate(){
  requestAnimationFrame(animate);
  player.position.z -= 0.1;
  playerTarget.Position.copy(player.position);
  playerTarget.Rotation.copy(player.quaternion); 
  thirdPersonCamera.Update();
  renderer.render(scene, camera);
}

animate();