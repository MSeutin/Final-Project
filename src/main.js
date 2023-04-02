import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// LOCAL IMPORTS 1 2 3

// CONSTANTS

///////////////////////////
//         SCENE
///////////////////////////
const scene = new THREE.Scene();

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
renderer.setSize(window.innerWidth, window.innerHeight);
// add renderer to HTML document. This is a <canvas> element 
document.body.appendChild( renderer.domElement );

///////////////////////////
//      CUBE
///////////////////////////
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({ color: 'crimson' });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


///////////////////////////
//       GROUND
///////////////////////////
//add ground 
let grassTex = new THREE.TextureLoader().load( 'images/bump.jpg' );
grassTex.wrapS = THREE.RepeatWrapping; 
grassTex.wrapT = THREE.RepeatWrapping; 
grassTex.repeat.x = 256; 
grassTex.repeat.y = 256; 
let groundTexture = new THREE.MeshBasicMaterial({map:grassTex}); 

const groundGeometry = new THREE.PlaneGeometry(400,400);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const ground = new THREE.Mesh(groundGeometry, groundTexture);
ground.position.y = -10;
ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
ground.doubleSided = true;
scene.add(ground);

///////////////////////////
//      LIGHT
///////////////////////////
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

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
