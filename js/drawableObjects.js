import {Line2} from "three/examples/jsm/lines/Line2.js";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial.js";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry.js";
import {CircleGeometry, Group, Matrix4, Mesh, MeshBasicMaterial, Vector3, Vector4} from "three";

export function getAxis(color = 0xffffff, size = 25) {
  let origin = new Vector3(0, 0, 0);
  let endOfXAxis = new Vector3(size, 0, 0);
  let endOfYAxis = new Vector3(0, size, 0);

  let points = [endOfXAxis, origin, endOfYAxis];

  return getLine(points, color);
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

export function getLine(points, color = 0xffff00) {
  let geometry = new LineGeometry();
  geometry.setPositions(concatVector3Array(points));

  let mat = new LineMaterial();
  mat.linewidth = 0.009;
  mat.color.set(color);

  let line2 = new Line2();
  line2.material = mat;
  line2.geometry = geometry;
  line2.computeLineDistances();
  line2.scale.set(1, 1, 1);

  return line2;
}

export function interpolate(points) {
  if(points.length !== 4) throw new Error("Nur 4 Punkte möglich.");

  let matrix = new Matrix4();
  let x0 = points[0].x;
  let x1 = points[1].x;
  let x2 = points[2].x;
  let x3 = points[3].x;
  let y0 = points[0].y;
  let y1 = points[1].y;
  let y2 = points[2].y;
  let y3 = points[3].y;
  matrix.set(
    1, x0, Math.pow(x0,2), Math.pow(x0,3),
    1, x1, Math.pow(x1,2), Math.pow(x1,3),
    1, x2, Math.pow(x2,2), Math.pow(x2,3),
    1, x3, Math.pow(x3,2), Math.pow(x3,3),
  )

  let vector = new Vector4(y0,y1,y2,y3);
  let inverse = matrix.invert();

  return vector.applyMatrix4(inverse);
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

export function getPoints(pointsArray) {
  const group = new Group();
  for (const point of pointsArray) {
    group.add(getPoint(point));
  }
  return group;
}
