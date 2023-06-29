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

const scene = new Scene();
const renderer = new Renderer(width, height);
const raycaster = new Raycaster();
const pointer = new Vector2;

const camera = new Camera(width, height);

let xAxisSize = 1;
let yAxisSize = 1;
const pointSize = 0.04;
const interpolationStepSize = 0.01;

const hermiteColor0 = 0xff0000;
const hermiteColor1 = 0x00ff00;
const hermiteColor2 = 0x0000ff;
const hermiteColor3 = 0xff00ff;

document.getElementById("canvasLeft").appendChild(renderer.domElement);
window.addEventListener( 'click', onDocumentMouseDown, false );

let transformControl = new TransformControl(camera, renderer, () => renderer.render(scene,camera));
scene.add(transformControl);


function onDocumentMouseDown( e ) {
  e.preventDefault();

  pointer.x = (e.clientX / width) * 2 - 1;
  pointer.y = -(e.clientY / height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  // calculate clicked objects
  const intersects = raycaster.intersectObjects(scene.children).filter(obj => {
    return obj.object instanceof Point;
  });

  if(intersects.length === 0){
    transformControl.detach();
    renderer.render(scene, camera);
  }

  for (const intersect of intersects) {
    transformControl.attach(intersect.object);
    scene.add(transformControl)
    renderer.render(scene, camera);
  }
}

function render() {
  scene.clear();

  xAxisSize = 1;
  yAxisSize = 1;

  scene.add(new Axis().setAxisSize(xAxisSize, yAxisSize));

  for (const bernsteinLine of getBernsteinLines()) {
    scene.add(bernsteinLine);
  }

  let point = new Point(new Vector3(-1,0,0)).setRadius(pointSize);

  scene.add(new Axis().setAxisSize(xAxisSize, yAxisSize).translateX(-1));


  scene.add(point);

  renderer.render(scene, camera);
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

render();


