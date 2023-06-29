import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getRungePoints, interpolate} from "../../js/interpolation";
import {Axis} from "../../js/classes/Axis";
import {Group} from "three";
import {Point} from "../../js/classes/Point";
import {Polynom} from "../../js/classes/Polynom";
import {Camera} from "../../js/classes/Camera";

const xAxisSize = 5;
const yAxisSize = 5;
const pointSize = 0.07;
const interpolationStepSize = 0.01;

const startTime = Date();

let rungePointCount = 21;

const height = window.innerHeight;
const width = window.innerWidth/2;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
document.getElementById("canvas").appendChild(renderer.domElement);

document.getElementById("small").addEventListener("click", () => setPointCount(6));
document.getElementById("medium").addEventListener("click", () => setPointCount(11));
document.getElementById("large").addEventListener("click", () => setPointCount(18));


function render(){
  scene.clear();

  const camera = new Camera(width, height).setZposition(14);

  renderer.setSize(window.innerWidth/2, window.innerWidth/2); // leave this quadratic, else linewidth will be weird
  renderer.setClearColor("#141C24");

  scene.add(new Axis().setAxisSize(-xAxisSize, -yAxisSize).setColor(0x999999));
  scene.add(new Axis().setAxisSize(xAxisSize, yAxisSize));

  let points = getRungePoints(rungePointCount);
  let polynomArray = interpolate(points);
  scene.add(new Polynom(interpolationStepSize, xAxisSize, polynomArray));
  scene.add(getPoints(points, pointSize));

  renderer.render(scene, camera);

  const endTime = Date();
  const deltaTime = endTime - startTime;
  console.log("Runtime: ", deltaTime)
}

function setPointCount(count){
  rungePointCount = count;
  render()
}

function getPoints(pointsArray, pointSize) {
  const group = new Group();
  for (const point of pointsArray) {
    group.add(new Point(point).setRadius(pointSize));
  }
  return group;
}
