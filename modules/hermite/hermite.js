import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getAxis} from "../../js/drawableObjects";
import {getPolynom} from "../../js/interpolation";

const xAxisSize = 1;
const yAxisSize = 1;
const pointSize = 0.07;
const interpolationStepSize = 0.01;

const bernsteinColor0 = 0xff0000;
const bernsteinColor1 = 0x00ff00;
const bernsteinColor2 = 0x0000ff;
const bernsteinColor3 = 0xff00ff;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
document.getElementById("canvasRight").appendChild(renderer.domElement);

function render(){
  scene.clear();

  const aspectRatio = 1; // window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);

  renderer.setSize(window.innerHeight, window.innerHeight); // leave this quadratic, else linewidth will be weird
  renderer.setClearColor("#141C24");

  scene.add(getAxis(xAxisSize, yAxisSize));

  for (const bernsteinLine of getBernsteinLines()) {
    scene.add(bernsteinLine);
  }

  renderer.render(scene, camera);
}

function getBernsteinLines() {
  let bernsteinLines = [];
  let bernsteinPolynom0 = [1,-3,3,-1];
  let bernsteinPolynom1 = [0,3,-6,3];
  let bernsteinPolynom2 = [0,0,3,-3];
  let bernsteinPolynom3 = [0,0,0,1];

  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynom0,false, bernsteinColor0));
  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynom1, false, bernsteinColor1));
  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynom2, false, bernsteinColor2));
  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynom3, false, bernsteinColor3));

  return bernsteinLines;
}

render();
