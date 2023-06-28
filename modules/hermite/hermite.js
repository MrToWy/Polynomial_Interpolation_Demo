import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getAxis, getLine, getPoint} from "../../js/drawableObjects";
import {getBernsteinPolynomes, getHermitePolynom, getPolynom, interpolate} from "../../js/interpolation";
import {Vector3} from "three";

let xAxisSize = 3;
let yAxisSize = 3;
const pointSize = 0.02;
const interpolationStepSize = 0.01;

const hermiteColor0 = 0xff0000;
const hermiteColor1 = 0x00ff00;
const hermiteColor2 = 0x0000ff;
const hermiteColor3 = 0xff00ff;

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
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  rendererLeft.setSize(window.innerWidth/2, window.innerWidth/2); // leave this quadratic, else linewidth will be weird
  rendererLeft.setClearColor("#922792");

  sceneLeft.add(getAxis(xAxisSize, yAxisSize));

  let punkt0 = new Vector3(0.,2,0);
  let punkt1 = new Vector3(0.5,4,0);
  let ableitung0 = new Vector3(punkt0.x, 0.3,0);
  let ableitung1 = new Vector3(punkt1.x,0.4,0);
  ableitung0.isAbleitung = true;
  ableitung1.isAbleitung = true;


  let points = [punkt0,punkt1,ableitung0,ableitung1];

  let polynomArray = interpolate(points);

  sceneLeft.add(getPolynom(interpolationStepSize, xAxisSize, polynomArray, false,0xff0000, punkt0.x, punkt1.x));

  sceneLeft.add(getPoint(punkt0, pointSize, hermiteColor0));
  sceneLeft.add(getPoint(punkt1, pointSize, hermiteColor1));

  rendererLeft.render(sceneLeft, camera);
}

function renderRight(){
  sceneRight.clear();

  xAxisSize = 1;
  yAxisSize = 1;
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

  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[0],false, hermiteColor0));
  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[1], false, hermiteColor1));
  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[2], false, hermiteColor2));
  bernsteinLines.push(getPolynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[3], false, hermiteColor3));

  return bernsteinLines;
}

render();

