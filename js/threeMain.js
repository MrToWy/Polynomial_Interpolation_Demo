import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getAxis, getLine, getPoints, interpolate} from "./drawableObjects";
import { Vector3 } from "three";

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

let point1 = new Vector3(10, 0, 0);
let point2 = new Vector3(14, 4, 0);
let point3 = new Vector3(16, 8, 0);
let point4 = new Vector3(18, 9, 0);

let points = [point1, point2, point3, point4];
scene.add(getPoints(points));

scene.add(getLine(points));
interpolate(points);

renderer.render(scene, camera);
