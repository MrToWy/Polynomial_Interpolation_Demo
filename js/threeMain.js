import "regenerator-runtime/runtime";
import * as THREE from "three";
import { getAxis, getLine } from "./drawableObjects";

const scene = new THREE.Scene();

const aspectRatio = 1; // window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerHeight, window.innerHeight); // leave this quadratic, else linewidth will be weird
renderer.setClearColor("#141C24");
document.body.appendChild(renderer.domElement);

scene.add(getAxis());

let points = [
  0,1,0,
  2,5,0,
  3,6,0,
  9,3,0
];

scene.add(getLine(points));

renderer.render(scene, camera);
