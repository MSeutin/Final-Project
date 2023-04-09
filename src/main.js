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
const soldierTarget = {
    Position: new THREE.Vector3(0, 0, 0),
    Rotation: new THREE.Quaternion()
};

// Create the third-person camera and pass in the target object
let thirdPersonCamera = new ThirdPersonCamera({ camera: camera, target: soldierTarget });

// let thirdPersonCamera = new ThirdPersonCamera({camera: camera});


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
loader.load('models/car.glb', function (gltf) {
    soldier = gltf.scene;  // sword 3D object is loaded
    soldier.scale.set(2, 2, 2);
    soldier.rotation.y = Math.PI; //-90 degrees around the x-axis
    soldier.traverse(function (node){  // traverse through the model elements
        if(node.isMesh){  // check if it is a mesh
            node.castShadow = true;
        }
    });
    scene.add(soldier);
});

///////////////////////////
//       GROUND
///////////////////////////
// add ground 
let grassTex = new THREE.TextureLoader().load( 'images/bump.jpg' );
grassTex.wrapS = THREE.RepeatWrapping; 
grassTex.wrapT = THREE.RepeatWrapping; 
grassTex.repeat.x = 256; 
grassTex.repeat.y = 256; 
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
    if (keyCode == 38) {
        // forward
        soldier.position.z += 1;
        soldierTarget.Position.copy(soldier.position);
        soldierTarget.Rotation.copy(soldier.quaternion);    
        thirdPersonCamera.Update();
    } else if (keyCode == 40) {
        // backward
        soldier.position.z -= 1;
        soldierTarget.Position.copy(soldier.position);
        soldierTarget.Rotation.copy(soldier.quaternion);    
        thirdPersonCamera.Update();
    } else if (keyCode == 37) {
        // left
        soldier.position.x -= 1;
        soldierTarget.Position.copy(soldier.position);
        soldierTarget.Rotation.copy(soldier.quaternion);    
        thirdPersonCamera.Update();
    } else if (keyCode == 39) {
        // right
        soldier.position.x += 1;
        soldierTarget.Position.copy(soldier.position);
        soldierTarget.Rotation.copy(soldier.quaternion);    
        thirdPersonCamera.Update();
    } else if (keyCode == 32) {
        // spacebar to recenter
        soldier.position.x = 0.0;
        soldier.position.y = 0.0;
        soldierTarget.Position.copy(soldier.position);
        soldierTarget.Rotation.copy(soldier.quaternion);
        thirdPersonCamera.Update();
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