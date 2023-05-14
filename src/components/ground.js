import * as THREE from 'three';

function initGround(scene) {
  const background = new THREE.TextureLoader().load('../images/stars.jpg');
  scene.background = background;

  let grassTex = new THREE.TextureLoader().load( '../images/bump.jpg' );
  let groundTexture = new THREE.MeshStandardMaterial({map: grassTex}); 

  const groundGeometry = new THREE.PlaneGeometry(300, 300);

  const ground = new THREE.Mesh(groundGeometry, groundTexture);
  ground.position.y = -2;
  ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
  ground.doubleSided = true;
  ground.receiveShadow = true;
  scene.add(ground);
}

export default initGround;