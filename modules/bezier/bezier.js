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
import {
  ANIMATION_SPEED,
  COLOR_0,
  COLOR_1,
  COLOR_2,
  COLOR_3, DRAW_STEP_SIZE, POINT_SIZE,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  X_AXIS_SIZE,
  Y_AXIS_SIZE
} from "../../js/constants";


const sceneLeft = new Scene();
const sceneRight = new Scene();
const rendererLeft = new Renderer(WINDOW_WIDTH, WINDOW_HEIGHT);
const rendererRight = new Renderer(WINDOW_WIDTH, WINDOW_HEIGHT);
const raycaster = new Raycaster();
const pointer = new Vector2;

const cameraLeft = new Camera(WINDOW_WIDTH, WINDOW_HEIGHT);
const cameraRight = new Camera(WINDOW_WIDTH, WINDOW_HEIGHT);

let point0 = new Point(new Vector3(0.1,0.1,0)).setRadius(POINT_SIZE);
let point1 = new Point(new Vector3(0.2,0.9,0)).setRadius(POINT_SIZE);
let point2 = new Point(new Vector3(0.8,0.9,0)).setRadius(POINT_SIZE);
let point3 = new Point(new Vector3(0.9,0.1,0)).setRadius(POINT_SIZE);

let linie0 = new Linie().setPoints([point0.position,point1.position]);
let linie1 = new Linie().setPoints([point1.position,point2.position]);
let linie2 = new Linie().setPoints([point2.position,point3.position]);

let curves = [];

let currentT = 0.5;
let pause = true;

let transformControl = new TransformControl(cameraLeft, rendererLeft, () => {
  renderCasteljauCurve();
  renderCasteljauLines();
});
sceneLeft.add(transformControl);

document.getElementById("canvasLeft").appendChild(rendererLeft.domElement);
document.getElementById("canvasRight").appendChild(rendererRight.domElement);
window.addEventListener( 'click', onDocumentMouseDown, false );
document.getElementById("pause").addEventListener('click',e => togglePause(e));


function render() {
  renderLeft();
  renderRight();
}

window.addEventListener( 'resize', onWindowResize, false );


function onWindowResize(){

  cameraLeft.aspect = (window.innerWidth/2) / (window.innerHeight*0.95);
  cameraLeft.updateProjectionMatrix();

  cameraRight.aspect = (window.innerWidth/2) / (window.innerHeight*0.95);
  cameraRight.updateProjectionMatrix();

  rendererRight.setSize( window.innerWidth/2, (window.innerHeight*0.95) );
  rendererLeft.setSize( window.innerWidth/2, (window.innerHeight*0.95) );

}

function renderLeft() {
  sceneLeft.clear();

  cameraLeft.translateX(1).translateY(0.5).setLookAt(1,0.5,0);

  sceneLeft.add(point0);
  sceneLeft.add(point1);
  sceneLeft.add(point2);
  sceneLeft.add(point3);

  sceneLeft.add(linie0);
  sceneLeft.add(linie1);
  sceneLeft.add(linie2);

  renderCasteljauCurve();

  rendererLeft.render(sceneLeft, cameraLeft);
}

function renderRight() {
  sceneRight.clear();
  sceneRight.add(new Axis().setAxisSize(X_AXIS_SIZE, Y_AXIS_SIZE));

  for (const bernsteinLine of getBernsteinLines()) {
    sceneRight.add(bernsteinLine);
  }
  rendererRight.render(sceneRight, cameraRight);
}

function getBernsteinLines() {
  let bernsteinPolynomes = getBernsteinPolynomes();
  let bernsteinLines = [];

  bernsteinLines.push(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[0]).setShowNegativeAxis(false).setColor(COLOR_0));
  bernsteinLines.push(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[1]).setShowNegativeAxis(false).setColor(COLOR_1));
  bernsteinLines.push(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[2]).setShowNegativeAxis(false).setColor(COLOR_2));
  bernsteinLines.push(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[3]).setShowNegativeAxis(false).setColor(COLOR_3));

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
  let lines = [];
  for (let t = 0; t <= counter; t+= stepSize) {
    let result = deCasteljau(1 - t);
    curve.push(result[5]);
  }

  let casteljauPoints = deCasteljau(1- counter);
  lines.push(new Linie().setPoints([casteljauPoints[0], casteljauPoints[1]]).setColor(0x0000ff));
  lines.push(new Linie().setPoints([casteljauPoints[1], casteljauPoints[2]]).setColor(0x0000ff));
  lines.push(new Linie().setPoints([casteljauPoints[3], casteljauPoints[4]]).setColor(0xff0000));

  lines.push(new Linie().setPoints(curve));
  return lines;
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
  pointer.x = (posX / WINDOW_WIDTH) * 2 - 1;
  pointer.y = -(posY / WINDOW_HEIGHT) * 2 + 1;

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

  currentT += ANIMATION_SPEED;

  if(currentT > 1) currentT = 0;

  renderCasteljauCurve();

  requestAnimationFrame(animate);
}

function renderCasteljauCurve() {
  if(curves && curves.length > 0)
  for (const curve of curves) {
    sceneLeft.remove(curve);
  }
  curves = drawDeCasteljau(currentT);

  for (const curve of curves) {
    sceneLeft.add(curve);
  }
  rendererLeft.render(sceneLeft, cameraLeft);
}

function renderCasteljauLines() {
  sceneLeft.remove(linie0);
  sceneLeft.remove(linie1);
  sceneLeft.remove(linie2);
  linie0 = new Linie().setPoints([point0.position,point1.position]);
  linie1 = new Linie().setPoints([point1.position,point2.position]);
  linie2 = new Linie().setPoints([point2.position,point3.position]);
  sceneLeft.add(linie0);
  sceneLeft.add(linie1);
  sceneLeft.add(linie2);
  rendererLeft.render(sceneLeft, cameraLeft);
}

render();
animate(currentT);

