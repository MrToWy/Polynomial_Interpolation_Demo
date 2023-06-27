import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getAxis, getPoints, getPolynom, getRungePoints, interpolate} from "./drawableObjects";

const startTime = Date();

let rungePointCount = 21;

document.getElementById("small").addEventListener("click", () => setPointCount(3))
document.getElementById("medium").addEventListener("click", () => setPointCount(13))
document.getElementById("large").addEventListener("click", () => setPointCount(30))

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

document.getElementById("canvas").appendChild(renderer.domElement);


function render(){
  scene.clear();
  const xAxisSize = 5;
  const yAxisSize = 5;
  const pointSize = 0.07;
  const interpolationStepSize = 0.01;

  const aspectRatio = 1; // window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0, 0);

  renderer.setSize(window.innerHeight, window.innerHeight); // leave this quadratic, else linewidth will be weird
  renderer.setClearColor("#141C24");


  scene.add(getAxis(-xAxisSize, -yAxisSize, 0x999999));
  scene.add(getAxis(xAxisSize, yAxisSize));

  let points = getRungePoints(rungePointCount);
  let polynomArray = interpolate(points);
  scene.add(getPolynom(interpolationStepSize, xAxisSize, polynomArray));
  scene.add(getPoints(points, pointSize));

  renderer.render(scene, camera);

  const endTime = Date();
  const deltaTime = endTime - startTime;
  console.log("Runtime: ", deltaTime)
}

export function setPointCount(count){
  rungePointCount = count;
  render()
}
