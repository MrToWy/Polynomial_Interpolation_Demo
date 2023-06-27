import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getAxis, getPoints, getPolynom, getRungePoints, interpolate} from "./drawableObjects";

const startTime = Date();

const scene = new THREE.Scene();
const xAxisSize = 5;
const yAxisSize = 2;
const pointSize = 0.1;
const interpolationStepSize = 0.01;

const aspectRatio = 1; // window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
camera.position.set(0, 0, 14);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerHeight, window.innerHeight); // leave this quadratic, else linewidth will be weird
renderer.setClearColor("#141C24");
document.body.appendChild(renderer.domElement);

scene.add(getAxis(xAxisSize, yAxisSize));

let points = getRungePoints(21);
let polynomArray = interpolate(points);
scene.add(getPolynom(interpolationStepSize, xAxisSize, polynomArray));
scene.add(getPoints(points, pointSize));

renderer.render(scene, camera);

const endTime = Date();
const deltaTime = endTime - startTime;
console.log("Runtime: ", deltaTime)
