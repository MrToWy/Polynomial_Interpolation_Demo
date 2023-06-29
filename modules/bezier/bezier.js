import "regenerator-runtime/runtime";
import {Raycaster, Scene, Vector2, Vector3} from "three";
import {getBernsteinPolynomes} from "../../js/interpolation";
import {Axis} from "../../js/classes/Axis";
import {Point} from "../../js/classes/Point";
import {Polynom} from "../../js/classes/Polynom";
import {TransformControl} from "../../js/classes/TransformControl";
import {Camera} from "../../js/classes/Camera";
import {Renderer} from "../../js/classes/Renderer";
import {calculateOffset} from "../../js/helpers"
import {Linie} from "../../js/classes/Linie";

const height = window.innerHeight*0.95;
const width = window.innerWidth/2;

const sceneLeft = new Scene();
const sceneRight = new Scene();
const rendererLeft = new Renderer(width, height);
const rendererRight = new Renderer(width, height);
const raycaster = new Raycaster();
const pointer = new Vector2;

const cameraLeft = new Camera(width, height);
const cameraRight = new Camera(width, height);

let xAxisSize = 1;
let yAxisSize = 1;
const pointSize = 0.04;
const interpolationStepSize = 0.01;

const hermiteColor0 = 0xff0000;
const hermiteColor1 = 0x00ff00;
const hermiteColor2 = 0x0000ff;
const hermiteColor3 = 0xff00ff;

let point0 = new Point(new Vector3(0.1,0.1,0)).setRadius(pointSize);
let point1 = new Point(new Vector3(0.2,0.9,0)).setRadius(pointSize);
let point2 = new Point(new Vector3(0.8,0.9,0)).setRadius(pointSize);
let point3 = new Point(new Vector3(0.9,0.1,0)).setRadius(pointSize);

let curve;

document.getElementById("canvasLeft").appendChild(rendererLeft.domElement);
document.getElementById("canvasRight").appendChild(rendererRight.domElement);
window.addEventListener( 'click', onDocumentMouseDown, false );
document.getElementById("pause").addEventListener('click',e => togglePause(e));

let currentT = 1;
let pause = true;
const animationsSpeed = 0.003;

let transformControl = new TransformControl(cameraLeft, rendererLeft, () => renderCasteljauCurve());
sceneLeft.add(transformControl);


function render() {
  renderLeft();
  renderRight();
}

function renderLeft() {
  sceneLeft.clear();

  cameraLeft.translateX(1).translateY(0.5).setLookAt(1,0.5,0);

  sceneLeft.add(point0);
  sceneLeft.add(point1);
  sceneLeft.add(point2);
  sceneLeft.add(point3);

  sceneLeft.add(new Axis().setAxisSize(2*xAxisSize, yAxisSize));

  renderCasteljauCurve();

  rendererLeft.render(sceneLeft, cameraLeft);
}

function renderRight() {
  sceneRight.clear();
  sceneRight.add(new Axis().setAxisSize(xAxisSize, yAxisSize));

  for (const bernsteinLine of getBernsteinLines()) {
    sceneRight.add(bernsteinLine);
  }
  rendererRight.render(sceneRight, cameraRight);
}

function getBernsteinLines() {
  let bernsteinPolynomes = getBernsteinPolynomes();
  let bernsteinLines = [];

  bernsteinLines.push(new Polynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[0]).setShowNegativeAxis(false).setColor(hermiteColor0));
  bernsteinLines.push(new Polynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[1]).setShowNegativeAxis(false).setColor(hermiteColor1));
  bernsteinLines.push(new Polynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[2]).setShowNegativeAxis(false).setColor(hermiteColor2));
  bernsteinLines.push(new Polynom(interpolationStepSize,xAxisSize,bernsteinPolynomes[3]).setShowNegativeAxis(false).setColor(hermiteColor3));

  return bernsteinLines;
}

function deCasteljau(t){
  let a = lerpVector(point0.position, point1.position, t);
  let b = lerpVector(point1.position, point2.position, t);
  let c = lerpVector(point2.position, point3.position, t);
  let d = lerpVector(a, b, t);
  let e = lerpVector(b, c, t);
  let p = lerpVector(d, e, t);

  return [a,b,c,d,e,p];
}

function drawDeCasteljau(counter) {
  let stepSize = 0.01;
  let curve = [];
  for (let t = 0; t <= counter; t+= stepSize) {
    let result = deCasteljau(1 - t);
    curve.push(result[5]);
  }
  return new Linie().setPoints(curve);
}

function lerp(a, b, t) {
  return a * t + (1. - t) * b;
}

function lerpVector(vecA, vecB, t) {
  let aX = lerp(vecA.x, vecB.x, t);
  let aY = lerp(vecA.y, vecB.y, t);

  return new Vector3(aX, aY, 0);
}

function onDocumentMouseDown( e ) {
  e.preventDefault();

  const offset = calculateOffset(document.getElementById("canvasLeft")); //or some other element

  let posX = e.clientX+offset.x;
  let posY = e.clientY+offset.y;
  pointer.x = (posX / width) * 2 - 1;
  pointer.y = -(posY / height) * 2 + 1;

  raycaster.setFromCamera(pointer, cameraLeft);

  // calculate clicked objects
  const intersects = raycaster.intersectObjects(sceneLeft.children).filter(obj => {
    return obj.object instanceof Point;
  });

  if(intersects.length === 0){
    transformControl.detach();
    rendererLeft.render(sceneLeft, cameraLeft);
  }

  for (const intersect of intersects) {
    transformControl.attach(intersect.object);
    sceneLeft.add(transformControl)
    rendererLeft.render(sceneLeft, cameraLeft);
  }
}

function togglePause(e) {
  pause = !pause;
  if(pause){
    e.target.innerHTML = "Play";
  } else {
    e.target.innerHTML = "Pause";
    animate(currentT);
  }
}

function animate() {
  if(pause) return;

  currentT += animationsSpeed;

  if(currentT > 1) currentT = 0;

  renderCasteljauCurve();

  requestAnimationFrame(animate);
}

function renderCasteljauCurve() {
  sceneLeft.remove(curve);
  curve = drawDeCasteljau(currentT);
  sceneLeft.add(curve);
  rendererLeft.render(sceneLeft, cameraLeft);
}


render();
animate(currentT);

