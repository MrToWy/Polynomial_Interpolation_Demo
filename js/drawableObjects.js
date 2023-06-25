import * as THREE from "three";
import {LineMaterial} from "three/addons/lines/LineMaterial";
import {LineGeometry} from "three/addons/lines/LineGeometry";
import {Line2} from "three/addons/lines/Line2";
import {CircleGeometry, Mesh, MeshBasicMaterial} from "three";

export function getAxis(x = 0., y = 1., color = 0xffff00, size = 25){
  const dir = new THREE.Vector3( x, y, 0 );
  dir.normalize();

  const origin = new THREE.Vector3( 0, 0, 0 );

  let mat = new LineMaterial();
  mat.linewidth = 0.009;
  mat.color.set(color);
  mat.vertexColors = false;

  let geometry = new LineGeometry();
  let points = [];
  points.push(origin.x);
  points.push(origin.y);
  points.push(0.);

  points.push(x * size);
  points.push(y * size);
  points.push(0.);
  geometry.setPositions(points);

  let line2 = new Line2();
  line2.material = mat;
  line2.geometry = geometry;
  line2.computeLineDistances();
  line2.scale.set( 1, 1, 1 );

  return line2;
}

export function getPoint(x,y,radius = 1., color = 0xffff00) {
  let geo = new CircleGeometry(radius, 256);
  let mat = new MeshBasicMaterial({color: color});
  let point = new Mesh(geo, mat);

  point.translateX(x);
  point.translateY(y);

  return point;
}
