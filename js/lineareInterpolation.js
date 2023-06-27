import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getAxis, getLine, getPoints} from "./drawableObjects";
import * as mathjs from "mathjs";
import {Vector3} from "three";

const startTime = Date();

let rungePointCount = 21;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
document.getElementById("canvas").appendChild(renderer.domElement);

document.getElementById("small").addEventListener("click", () => setPointCount(6));
document.getElementById("medium").addEventListener("click", () => setPointCount(11));
document.getElementById("large").addEventListener("click", () => setPointCount(18));


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

export function interpolate(points) {
  if (points.length <= 0) throw new Error("Bitte Punkte übergeben.");

  let matrix = [];
  let vector = [];

  let degree = points.length - 1;

  for (const point of points) {
    let rowArray = [];

    for (let n = 0; n <= degree; n++) {
      rowArray.push(Math.pow(point.x, n));
    }
    matrix.push(rowArray);
    vector.push(point.y);
  }

  let inverse = mathjs.inv(matrix);

  return mathjs.multiply(inverse, vector);
}

export function getPolynom(stepSize, xAxisSize, polynomArray) {
  let points = [];
  for (let x = -xAxisSize; x < xAxisSize; x += stepSize) {
    points.push(new Vector3(x, calcY(x, polynomArray), 0));
  }
  return getLine(points, 0xff0000);
}

export function getRungePoints(pointCount) {
  const points = [];

  const degree = pointCount - 1;
  const leftBoundary = -5;
  const rightBoundary = 5;
  const distance = (leftBoundary - rightBoundary) * -1;
  const stepSize = distance / degree;

  for (let i = 0; i < pointCount; i++) {
    const x = leftBoundary + i * stepSize;
    const y = 1. / (1. + Math.pow(x, 2.))
    points.push(new Vector3(x, y, 0));
  }

  points.push();
  return points;
}

function calcY(x, polynomArray) {
  let result = 0;

  for (let n = 0; n < polynomArray.length; n++) {
    result += polynomArray[n] * Math.pow(x, n);
  }

  return result;
}
