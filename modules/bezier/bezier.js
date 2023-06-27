import "regenerator-runtime/runtime";
import * as THREE from "three";
import {getAxis, getPoint} from "../../js/drawableObjects";
import {Vector3} from "three";


const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2;

const xAxisSize = 1;
const yAxisSize = 1;

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
  renderer.setSize(window.innerWidth/2, window.innerWidth/2); // leave this quadratic, else linewidth will be weird
  renderer.setClearColor("#141C24");

  scene.add(getAxis(xAxisSize, yAxisSize));
  scene.add(getPoint(new Vector3(2,0,0),0.5));

  renderer.render(scene, camera);
}

render();


