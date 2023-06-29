import "regenerator-runtime/runtime";
import * as THREE from "three";
import {Vector3} from "three";
import {getBernsteinPolynomes} from "../../js/interpolation";
import {Axis} from "../../js/classes/Axis";
import {Point} from "../../js/classes/Point";
import {Polynom} from "../../js/classes/Polynom";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2;

const height = window.innerHeight;
const width = window.innerWidth;

const aspectRatio = width / height; // width / height
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);

let xAxisSize = 1;
let yAxisSize = 1;
const pointSize = 0.04;
const interpolationStepSize = 0.01;

const hermiteColor0 = 0xff0000;
const hermiteColor1 = 0x00ff00;
const hermiteColor2 = 0x0000ff;
const hermiteColor3 = 0xff00ff;

document.getElementById("canvas").appendChild(renderer.domElement);
window.addEventListener( 'click', onDocumentMouseDown, false );


let control = new TransformControls(camera, renderer.domElement);
control.addEventListener('change', () => renderer.render(scene,camera));
control.showZ = false;
scene.add(control);


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
    control.detach();
    renderer.render(scene, camera);
  }

  for (const intersect of intersects) {
    control.attach(intersect.object);
    scene.add(control)
    renderer.render(scene, camera);
  }
}

function render() {
  scene.clear();

  xAxisSize = 1;
  yAxisSize = 1;

  renderer.setPixelRatio(Math.min(Math.max(1, window.devicePixelRatio),2));
  renderer.setSize(width, height); // leave this quadratic, else linewidth will be weird
  renderer.setClearColor("#141C24");

  scene.add(new Axis().setAxisSize(xAxisSize, yAxisSize));

  for (const bernsteinLine of getBernsteinLines()) {
    scene.add(bernsteinLine);
  }

  let point = new Point(new Vector3(-1,0,0)).setRadius(pointSize);
  //control.attach(point)

  //control.attach(point);
  //scene.add(control);

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


