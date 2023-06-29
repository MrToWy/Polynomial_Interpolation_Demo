import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getHermitePolynomes, interpolate} from "../../js/interpolation";
import {Vector3} from "three";
import {Axis} from "../../js/classes/Axis";
import {Point} from "../../js/classes/Point";
import {ColorLine} from "../../js/classes/ColorLine";
import {AbleitungsVector} from "../../js/classes/AbleitungsVector";
import {Polynom} from "../../js/classes/Polynom";
import {Camera} from "../../js/classes/Camera";

let xAxisSize = 1;
let yAxisSize = 1;
const pointSize = 0.02;
const interpolationStepSize = 0.01;

const height = window.innerHeight;
const width = window.innerWidth/2;

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

  const camera = new Camera(width, height);

  rendererLeft.setSize(width, height); // leave this quadratic, else linewidth will be weird
  rendererLeft.setClearColor("#922792");

  sceneLeft.add(new Axis().setAxisSize(xAxisSize, yAxisSize));

  let polynomArray = interpolate(points);

  sceneLeft.add(new Polynom(interpolationStepSize, xAxisSize, polynomArray).setShowNegativeAxis(false).setColor(0xff0000).setBoundarys(points[0].x, points[2].x));

  sceneLeft.add(new Point(points[0]).setRadius(pointSize).setColor(hermiteColor0));
  sceneLeft.add(new AbleitungsVector(points[0], points[1]));
  sceneLeft.add(new Point(points[2]).setRadius(pointSize).setColor(hermiteColor1));
  sceneLeft.add(new AbleitungsVector(points[2], points[3]));


  sceneLeft.add(new ColorLine([new Vector3(0,0,0),new Vector3(1,1,0)], [1,0,0,0,1,0]).translateX(-1));
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

  sceneRight.add(new Polynom(interpolationStepSize, xAxisSize, polynomMatrix[0]).setShowNegativeAxis(false).setColor(0xff0000));
  sceneRight.add(new Polynom(interpolationStepSize, xAxisSize, polynomMatrix[1]).setShowNegativeAxis(false).setColor(0x00ff00));
  sceneRight.add(new Polynom(interpolationStepSize, xAxisSize, polynomMatrix[2]).setShowNegativeAxis(false).setColor(0x0000ff));
  sceneRight.add(new Polynom(interpolationStepSize, xAxisSize, polynomMatrix[3]).setShowNegativeAxis(false).setColor(0xff00ff));

  rendererRight.render(sceneRight, camera);
}

render();

