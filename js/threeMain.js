import 'regenerator-runtime/runtime'
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';



const scene = new THREE.Scene();

const aspectRatio = 1 // window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera( 45, aspectRatio, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerHeight, window.innerHeight ); // leave this quadratic, else linewidth will be weird
renderer.setClearColor("#141C24")
document.body.appendChild( renderer.domElement );

scene.add( getAxis(1., 0., 0xFFFFFF) ); // x-axis
scene.add( getAxis(0., 1., 0xFFFFFF) ); // y-axis


renderer.render( scene, camera );


function getAxis(x = 0., y = 1., color = 0xffff00, size = 25){
  const dir = new THREE.Vector3( x, y, 0 );
  dir.normalize();

  const origin = new THREE.Vector3( 0, 0, 0 );
  let arrow = new THREE.ArrowHelper( dir, origin, size, color, 0.75, 0.5 );

  let mat = new LineMaterial()
  mat.linewidth = 0.009
  mat.color.set(color)
  mat.vertexColors = false

  let geometry = new LineGeometry()
  let points = [];
  points.push(origin.x)
  points.push(origin.y)
  points.push(0.)

  points.push(x * size)
  points.push(y * size)
  points.push(0.)
  geometry.setPositions(points)

  let line2 = new Line2()
  line2.material = mat
  line2.geometry = geometry
  line2.computeLineDistances();
  line2.scale.set( 1, 1, 1 );

  // move center to (0,0)
  line2.translateX(-size/2)

  return line2;
}
