import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getAxis, getPoint} from "../../js/drawableObjects";
import {Vector3} from "three";
import {getBernsteinPolynomes, getPolynom} from "../../js/interpolation";


const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2;

let xAxisSize = 1;
let yAxisSize = 1;
const pointSize = 0.02;
const interpolationStepSize = 0.01;

const hermiteColor0 = 0xff0000;
const hermiteColor1 = 0x00ff00;
const hermiteColor2 = 0x0000ff;
const hermiteColor3 = 0xff00ff;

const aspectRatio = 1; // window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

document.getElementById("canvas").appendChild(renderer.domElement);
document.addEventListener( 'mousedown', onDocumentMouseDown, false );


function onDocumentMouseDown( e ) {
  e.preventDefault();

  pointer.x = (e.clientX / window.innerWidth/2) * 2 - 1;
  pointer.y = -(e.clientY / window.innerWidth/2) * 2 + 1;
  console.log(pointer.x, pointer.y);

  raycaster.setFromCamera(pointer, camera);

  // calculate clicked objects
  const intersects = raycaster.intersectObjects(scene.children);
  console.log(intersects.length);

  for (const intersect of intersects) {
    console.log(intersect);
  }

  //TODO: Objekte verschieben https://codesandbox.io/s/basic-threejs-example-with-re-use-dsrvn
}

function render() {
  scene.clear();

  xAxisSize = 1;
  yAxisSize = 1;
  const aspectRatio = 1; // window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 500);
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);

  renderer.setSize(window.innerWidth/2, window.innerWidth/2); // leave this quadratic, else linewidth will be weird
  renderer.setClearColor("#141C24");

  scene.add(getAxis(xAxisSize, yAxisSize));

  for (const bernsteinLine of getBernsteinLines()) {
    scene.add(bernsteinLine);
  }

  renderer.render(scene, camera);
  renderer.setSize(window.innerWidth/2, window.innerWidth/2); // leave this quadratic, else linewidth will be weird
  renderer.setClearColor("#141C24");

  scene.add(getAxis(xAxisSize, yAxisSize));
  scene.add(getPoint(new Vector3(2,0,0),0.5));

  renderer.render(scene, camera);
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


