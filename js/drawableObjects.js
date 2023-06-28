import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import {CircleGeometry, Color, Group, Mesh, MeshBasicMaterial, Vector3} from "three";

export function getAxis(xAxisSize = 5, yAxisSize = 5, color = 0xffffff, lineWidth = 0.0025) {
  let origin = new Vector3(0, 0, 0);
  let endOfXAxis = new Vector3(xAxisSize, 0, 0);
  let endOfYAxis = new Vector3(0, yAxisSize, 0);

  let points = [endOfXAxis, origin, endOfYAxis];

  return getLine(points, color, lineWidth);
}

export function getPoint(positionVector, radius = 1, color = 0xffff00) {
  let geo = new CircleGeometry(radius, 256);
  let mat = new MeshBasicMaterial({ color: color });
  let point = new Mesh(geo, mat);

  point.translateX(positionVector.x);
  point.translateY(positionVector.y);
  point.translateY(positionVector.z);

  return point;
}

export function getLine(points, color = 0xffff00, lineWidth = 0.0065) {
  let geometry = new LineGeometry();
  geometry.setPositions(concatVector3Array(points));

  let mat = new LineMaterial();
  mat.linewidth = lineWidth;
  mat.color.set(color);

  let line2 = new Line2();
  line2.material = mat;
  line2.geometry = geometry;
  line2.computeLineDistances();
  line2.scale.set(1, 1, 1);

  return line2;
}

function concatVector3Array(array) {
  let flatArray = [];
  for (let i = 0; i < array.length; i++) {
    flatArray.push(array[i].x);
    flatArray.push(array[i].y);
    flatArray.push(array[i].z);
  }
  return flatArray;
}

export function getPoints(pointsArray, pointSize) {
  const group = new Group();
  for (const point of pointsArray) {
    group.add(getPoint(point, pointSize));
  }
  return group;
}

export function getColorLine(points, lineWidth = 0.0025){
  const geometry = new LineGeometry();
  geometry.setPositions(concatVector3Array(points));
  geometry.setColors([1,0,0,0,1,0]);

  let mat = new LineMaterial();
  mat.linewidth = lineWidth;
  mat.vertexColors = true;

  let line2 = new Line2();
  line2.material = mat;
  line2.geometry = geometry;
  line2.computeLineDistances();
  line2.scale.set(1, 1, 1);

  return line2;
}
