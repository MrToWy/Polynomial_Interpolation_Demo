import 'regenerator-runtime/runtime'
import * as THREE from 'three';
import {getAxis, getPoint} from './drawableObjects';


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
scene.add( getPoint(10.,10., 10));


renderer.render( scene, camera );
