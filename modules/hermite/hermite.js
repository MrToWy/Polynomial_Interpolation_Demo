import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getAbleitungsVec, getPoint} from "../../js/drawableObjects";
import {getHermitePolynomes, getPolynom, interpolate} from "../../js/interpolation";
import {Vector3} from "three";
import {Axis} from "../../js/classes/Axis";

let xAxisSize = 1;
let yAxisSize = 1;
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
  let punkt0 = new Vector3(0,0.1,0);
  let punkt1 = new Vector3(1,0.9,0);
  let ableitung0 = new Vector3(punkt0.x, -0.3,0);
  let ableitung1 = new Vector3(punkt1.x,-0.6,0);
  ableitung0.isAbleitung = true;
  ableitung1.isAbleitung = true;

  let points = [punkt0,ableitung0,punkt1,ableitung1];

  renderLeft(points);
  renderRight(points);
}

function renderLeft(points) {
  sceneLeft.clear();

  const aspectRatio = 1; // window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);

  rendererLeft.setSize(window.innerWidth/2, window.innerWidth/2); // leave this quadratic, else linewidth will be weird
  rendererLeft.setClearColor("#922792");

  sceneLeft.add(new Axis().setAxisSize(xAxisSize, yAxisSize));

  let polynomArray = interpolate(points);

  sceneLeft.add(getPolynom(interpolationStepSize, xAxisSize, polynomArray, false,0xff0000, points[0].x, points[2].x));

  sceneLeft.add(getPoint(points[0], pointSize, hermiteColor0));
  sceneLeft.add(getAbleitungsVec(points[0],points[1]));
  sceneLeft.add(getPoint(points[2], pointSize, hermiteColor1));
  sceneLeft.add(getAbleitungsVec(points[2],points[3]));

  //sceneLeft.add(getColorLine([new Vector3(0,0,0),new Vector3(1,1,0)]));
  rendererLeft.render(sceneLeft, camera);
}

function renderRight(points){
  sceneRight.clear();

  xAxisSize = 1;
  yAxisSize = 1;
  const aspectRatio = 1; // window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);

  rendererRight.setSize(window.innerWidth/2, window.innerWidth/2); // leave this quadratic, else linewidth will be weird
  rendererRight.setClearColor("#141C24");

  sceneRight.add(new Axis().setAxisSize(xAxisSize, yAxisSize));

  let polynomMatrix = getHermitePolynomes(points);

  sceneRight.add(getPolynom(interpolationStepSize, xAxisSize, polynomMatrix[0], false,0xff0000));
  sceneRight.add(getPolynom(interpolationStepSize, xAxisSize, polynomMatrix[1], false,0x00ff00));
  sceneRight.add(getPolynom(interpolationStepSize, xAxisSize, polynomMatrix[2], false,0x0000ff));
  sceneRight.add(getPolynom(interpolationStepSize, xAxisSize, polynomMatrix[3], false,0xff00ff));


  rendererRight.render(sceneRight, camera);
}

render();

