import "regenerator-runtime/runtime";
import * as THREE from "three";


const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
document.getElementById("canvas").appendChild(renderer.domElement);

function render() {
  const aspectRatio = 1; // window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0, 0);

  renderer.setSize(window.innerWidth/2, window.innerWidth/2); // leave this quadratic, else linewidth will be weird
  renderer.setClearColor("#141C24");



  renderer.render(scene, camera);
}
