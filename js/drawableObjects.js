import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import {CircleGeometry, Mesh, MeshBasicMaterial} from "three";

export function getAxis( color = 0xFFFFFF, size = 25){
  let points = [
    size, 0, 0,
    0, 0, 0,
    0, size, 0
  ];

  return getLine(points, color);
}

export function getPoint(x,y,radius = 1., color = 0xffff00) {
  let geo = new CircleGeometry(radius, 256);
  let mat = new MeshBasicMaterial({color: color});
  let point = new Mesh(geo, mat);

  point.translateX(x);
  point.translateY(y);

  return point;
}

export function getLine(points, color = 0xffff00) {
  let geometry = new LineGeometry();
  geometry.setPositions(points);

  let mat = new LineMaterial();
  mat.linewidth = 0.009;
  mat.color.set(color);

  let line2 = new Line2();
  line2.material = mat;
  line2.geometry = geometry;
  line2.computeLineDistances();
  line2.scale.set( 1, 1, 1 );

  return line2;
}
