import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// LOCAL IMPORTS

// VARIABLES
let soldier;
let hemiLight;


///////////////////////////
//         SCENE
///////////////////////////
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xcccccc );

///////////////////////////
//        CAMERA
///////////////////////////
const fov = 75; // field of view
const aspect = window.innerWidth / window.innerHeight;
const near = 1; // near clipping plane
const far = 100; // far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// object are created at ( 0, 0, 0 ), move camera back to view scene
camera.position.z = 5;
camera.position.y = 2;


///////////////////////////
//       RENDERER
///////////////////////////
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
// add renderer to HTML document. This is a <canvas> element 
document.body.appendChild( renderer.domElement );

///////////////////////////
//      CUBE
///////////////////////////
// const geometry = new THREE.BoxGeometry(1,1,1);
// const material = new THREE.MeshBasicMaterial({ color: 'crimson' });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// MODEL WITH ANIMATIONS
const loader = new GLTFLoader();
loader.load('models/avenger.glb', function (gltf) {
    soldier = gltf.scene;  // sword 3D object is loaded
    soldier.scale.set(1, 1, 1);
    soldier.rotation.y = Math.PI; //-90 degrees around the xaxis
    soldier.castShadow = true;
    scene.add(soldier);
});


///////////////////////////
//       GROUND
///////////////////////////
//add ground 
let grassTex = new THREE.TextureLoader().load( 'images/bump.jpg' );
grassTex.wrapS = THREE.RepeatWrapping; 
grassTex.wrapT = THREE.RepeatWrapping; 
grassTex.repeat.x = 256; 
grassTex.repeat.y = 256; 
let groundTexture = new THREE.MeshStandardMaterial({map:grassTex}); 

const groundGeometry = new THREE.PlaneGeometry(400,400);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const ground = new THREE.Mesh(groundGeometry, groundTexture);
ground.position.y = -10;
ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
ground.doubleSided = true;
ground.receiveShadow = true;
scene.add(ground);

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    let keyCode = event.which;
    console.log(keyCode);
    if (keyCode == 38) {
        // forward
        soldier.position.z -= 1;
    } else if (keyCode == 40) {
        // backward
        soldier.position.z += 1;
    } else if (keyCode == 37) {
        // left
        soldier.position.x -= 1;
    } else if (keyCode == 39) {
        // right
        soldier.position.x += 1;
    } else if (keyCode == 32) {
        // spacebar to recenter
        soldier.position.x = 0.0;
        soldier.position.y = 0.0;
    }
}



///////////////////////////
//      LIGHT
///////////////////////////
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 15, 10);
light.castShadow = true;
scene.add(light);
const ambientLight = new THREE.AmbientLight( 0xcccccc ); // soft white light
scene.add( ambientLight );


hemiLight = new THREE.HemisphereLight( "orange", 0x080820, 4);
scene.add( hemiLight );


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
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();