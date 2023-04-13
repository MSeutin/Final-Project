import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// LOCAL IMPORTS

// VARIABLES
let player;


///////////////////////////
//         SCENE
///////////////////////////
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x87CEEB );

///////////////////////////
//        CAMERA
///////////////////////////

// third person camera
class ThirdPersonCamera{
    constructor(params){ // camera is passed
        this._params = params;
        this._camera = params.camera;
        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
    }
    _CalculateIdealOffset(){
        const idealOffset = new THREE.Vector3(-3, 4, -7);
        idealOffset.applyQuaternion(this._params.target.Rotation);
        idealOffset.add(this._params.target.Position);
        return idealOffset;
    }

    _CalculateIdealLookat(){
        const idealLookat = new THREE.Vector3(0, 2, 10);
        idealLookat.applyQuaternion(this._params.target.Rotation);
        idealLookat.add(this._params.target.Position);
        return idealLookat;
    }

    Update(){
        const idealOffset = this._CalculateIdealOffset(); 
        const idealLookat = this._CalculateIdealLookat();

        this._currentPosition.copy(idealOffset);
        this._currentLookat.copy(idealLookat);
        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookat);
    }
}

const fov = 75; // field of view
const aspect = window.innerWidth / window.innerHeight;
const near = 1; // near clipping plane
const far = 100; // far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// object are created at ( 0, 0, 0 ), move camera back to view scene
camera.position.z = 5;
camera.position.y = 2;

// Define a target object that represents the soldier model
const playerTarget = {
    Position: new THREE.Vector3(0, 0, 0),
    Rotation: new THREE.Quaternion()
};

// Create the third-person camera and pass in the target object
let thirdPersonCamera = new ThirdPersonCamera({ camera: camera, target: playerTarget });

// let thirdPersonCamera = new ThirdPersonCamera({camera: camera});


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
// add ground 
let grassTex = new THREE.TextureLoader().load( 'images/bump.jpg' );
const background = new THREE.TextureLoader().load('images/stars.jpg');
scene.background = background;
let groundTexture = new THREE.MeshStandardMaterial({map: grassTex}); 

const groundGeometry = new THREE.PlaneGeometry(400, 400);
// const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });

const ground = new THREE.Mesh(groundGeometry, groundTexture);
ground.position.y = -2;
ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
ground.doubleSided = true;
ground.receiveShadow = true;
scene.add(ground);


// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    let keyCode = event.which;
    console.log(keyCode);
    if (keyCode == 38 || keyCode == 75) {
        // forward
        player.position.z += 1;
        playerTarget.Position.copy(player.position);
        playerTarget.Rotation.copy(player.quaternion);    
        thirdPersonCamera.Update();
    } else if (keyCode == 40 || keyCode == 74) {
        // backward
        player.position.z -= 1;
        playerTarget.Position.copy(player.position);
        playerTarget.Rotation.copy(player.quaternion);    
        thirdPersonCamera.Update();
    } else if (keyCode == 37 || keyCode == 72) {
        // left
        player.position.x -= 1;
        playerTarget.Position.copy(player.position);
        playerTarget.Rotation.copy(player.quaternion);    
        thirdPersonCamera.Update();
    } else if (keyCode == 39 || keyCode == 76) {
        // right
        player.position.x += 1;
        playerTarget.Position.copy(player.position);
        playerTarget.Rotation.copy(player.quaternion);    
        thirdPersonCamera.Update();
    } else if (keyCode == 32) {
        // spacebar to recenter
        location.reload();
    }
}

///////////////////////////
//      LIGHT
///////////////////////////
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 17, 6);
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
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();