import * as THREE from "three";
import createCube from "./components/cube";

// Some Variables from HTML
const start = document.querySelector(".start");

// Event Listeners

// -------------------------
//          SETUP
// -------------------------

// create a scene
const scene = new THREE.Scene();

// set the background color
scene.background = new THREE.Color("skyblue");

// Create a camera
const fov = 75; // AKA Field of View
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// every object is initially created at ( 0, 0, 0 )
// move the camera back so we can view the scene
camera.position.set(0, 0, 10);

// -------------------------
//      CREATE OBJECTS
// -------------------------

const cube = createCube();
scene.add(cube);

const cube2 = createCube();
cube2.material.color.setHex(0xff0000);
cube2.position.set(10, 0, 0);
scene.add(cube2);

// -------------------------
//         RENDER
// -------------------------
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let isAnimating = false;
let animationId;

// animate or render loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube2.rotation.x += 0.01;
  cube2.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function toggleAnimation() {
  isAnimating = !isAnimating; // toggle the boolean value
  if (isAnimating) {
    animate();
    start.textContent = "Stop Game"; // change the button label to "Stop"
    start.classList.add("btn-danger"); // add the class "btn-danger" to the button
  } else {
    window.location.reload(); // reload the page
  }
}

start.addEventListener("click", () => {
  toggleAnimation();
});
