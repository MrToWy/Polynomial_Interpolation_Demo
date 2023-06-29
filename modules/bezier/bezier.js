import "regenerator-runtime/runtime";
import {Raycaster, Scene, Vector2, Vector3} from "three";
import {getBernsteinPolynomes} from "../../js/interpolation";
import {Axis} from "../../js/classes/Axis";
import {Point} from "../../js/classes/Point";
import {Polynom} from "../../js/classes/Polynom";
import {TransformControl} from "../../js/classes/TransformControl";
import {Camera} from "../../js/classes/Camera";
import {Renderer} from "../../js/classes/Renderer";

const height = window.innerHeight;
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

document.getElementById("canvasLeft").appendChild(rendererLeft.domElement);
document.getElementById("canvasRight").appendChild(rendererRight.domElement);
window.addEventListener( 'click', onDocumentMouseDown, false );

let transformControl = new TransformControl(cameraLeft, rendererLeft, () => rendererLeft.render(sceneLeft,cameraLeft));
sceneLeft.add(transformControl);


function render() {
  sceneLeft.clear();
  sceneRight.clear();
  renderLeft();
  renderRight();
}

function renderLeft() {
  let point = new Point(new Vector3(0,0,0)).setRadius(pointSize);
  sceneLeft.add(point);

  sceneLeft.add(new Axis().setAxisSize(xAxisSize, yAxisSize));

  rendererLeft.render(sceneLeft, cameraLeft);
}

function renderRight() {
  xAxisSize = 1;
  yAxisSize = 1;

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

function onDocumentMouseDown( e ) {
  e.preventDefault();

  pointer.x = (e.clientX / width) * 2 - 1;
  pointer.y = -(e.clientY / height) * 2 + 1;

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


render();

