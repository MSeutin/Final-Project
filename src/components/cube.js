import * as THREE from 'three';

function createCube(){
    // create a geometry
    const geometry = new THREE.BoxGeometry(2,2,2);
    // create a material
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    // create a mesh
    const cube = new THREE.Mesh(geometry, material);
    // return cube
    return cube;
}

export default createCube;