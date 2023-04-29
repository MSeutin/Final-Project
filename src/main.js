import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// LOCAL IMPORTS
import ThirdPersonCamera from './components/thirdPersonCamera';

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
    player.scale.set(2, 2, 2);
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
const background = new THREE.TextureLoader().load('images/stars.jpg');
scene.background = background;
// add ground 
let grassTex = new THREE.TextureLoader().load( 'images/bump.jpg' );
let groundTexture = new THREE.MeshStandardMaterial({map: grassTex}); 

const groundGeometry = new THREE.PlaneGeometry(300, 300);

const ground = new THREE.Mesh(groundGeometry, groundTexture);
ground.position.y = -2;
ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
ground.doubleSided = true;
ground.receiveShadow = true;
scene.add(ground);

function movePlayerForward(playerPosition) {
    playerPosition.z -= 1; // move the player forward by decreasing the z-coordinate
    player.position.copy(playerPosition); // update the player's position
}

let moveForward = false;

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    let keyCode = event.which;
    console.log(keyCode);
    // 75 is letter k for forward
    if (keyCode == 38 || keyCode == 75) {
        // forward
        player.position.z -= 1;
        
        // update the velocity instead of just position
    } else if(keyCode == 13){  
        // player needs to hit enter to move forward and start the game
        moveForward = true;

    } else if (keyCode == 40 || keyCode == 74) {
        // backward
        player.position.z += 0.2;   
    } else if (keyCode == 37 || keyCode == 72) {
        // left
        // player.position.x -= 1; 
        player.rotation.y += Math.PI/50;  
    } else if (keyCode == 39 || keyCode == 76) {
        // right
        player.rotation.y -= Math.PI/50; 
        player.position.z -= 0.1; 

    } else if (keyCode == 32) {
        // spacebar to recenter
        location.reload();
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
//       RENDER
///////////////////////////
function animate(){
    requestAnimationFrame(animate);
    if (moveForward) {
        player.position.z -= 0.1; // Move player forward
    }
    
    // player.position.z -= 0.1;
    playerTarget.Position.copy(player.position);
    playerTarget.Rotation.copy(player.quaternion); 
    thirdPersonCamera.Update();
    renderer.render(scene, camera);
}

animate();