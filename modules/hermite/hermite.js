import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getAxis, getLine, getPoint} from "../../js/drawableObjects";
import {getBernsteinPolynomes, getHermitePolynom, getPolynom} from "../../js/interpolation";
import {Vector3} from "three";

const xAxisSize = 1;
const yAxisSize = 1;
const pointSize = 0.02;
const interpolationStepSize = 0.01;

const bernsteinColor0 = 0xff0000;
const bernsteinColor1 = 0x00ff00;
const bernsteinColor2 = 0x0000ff;
const bernsteinColor3 = 0xff00ff;

const sceneRight = new THREE.Scene();
const sceneLeft = new THREE.Scene();
const rendererRight = new THREE.WebGLRenderer();
const rendererLeft = new THREE.WebGLRenderer();
document.getElementById("canvasRight").appendChild(rendererRight.domElement);
document.getElementById("canvasLeft").appendChild(rendererLeft.domElement);

function render() {
  renderLeft();
  renderRight();
}

function renderLeft() {
  sceneLeft.clear();

  const aspectRatio = 1; // window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);

  rendererLeft.setSize(window.innerWidth/2, window.innerWidth/2); // leave this quadratic, else linewidth will be weird
  rendererLeft.setClearColor("#922792");

  sceneLeft.add(getAxis(xAxisSize, yAxisSize));

  let punkt0 = new Vector3(0.1,0.1,0);
  let punkt1 = new Vector3(0.3,0.8,0);
  let punkt2 = new Vector3(0.7,0.8,0);
  let punkt3 = new Vector3(0.9,0.1,0);

  let points = [punkt0,punkt1,punkt2,punkt3];

  sceneLeft.add(getLine(points));

  sceneLeft.add(getPoint(punkt0, pointSize, bernsteinColor0));
  sceneLeft.add(getPoint(punkt1, pointSize, bernsteinColor1));
  sceneLeft.add(getPoint(punkt2, pointSize, bernsteinColor2));
  sceneLeft.add(getPoint(punkt3, pointSize, bernsteinColor3));

  sceneLeft.add(getHermitePolynom(interpolationStepSize, xAxisSize, points, false));

  rendererLeft.render(sceneLeft, camera);
}

function renderRight(){
  sceneRight.clear();

  const aspectRatio = 1; // window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);

  rendererRight.setSize(window.innerWidth/2, window.innerWidth/2); // leave this quadratic, else linewidth will be weird
  rendererRight.setClearColor("#141C24");

  sceneRight.add(getAxis(xAxisSize, yAxisSize));

  for (const bernsteinLine of getBernsteinLines()) {
    sceneRight.add(bernsteinLine);
  }

  rendererRight.render(sceneRight, camera);
}

function getBernsteinLines() {
  let bernsteinPolynomes = getBernsteinPolynomes();
  let bernsteinLines = [];

  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[0],false, bernsteinColor0));
  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[1], false, bernsteinColor1));
  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[2], false, bernsteinColor2));
  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[3], false, bernsteinColor3));

  return bernsteinLines;
}

render();

