import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import {CircleGeometry, Group, Mesh, MeshBasicMaterial, Vector3} from "three";
import * as mathjs from "mathjs";

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

export function interpolate(points) {
  if (points.length <= 0) throw new Error("Bitte Punkte übergeben.");

  let matrix = [];
  let vector = [];

  let degree = points.length - 1;

  for (const point of points) {
    let rowArray = [];

    for (let n = 0; n <= degree; n++) {
      rowArray.push(Math.pow(point.x, n));
    }
    matrix.push(rowArray);
    vector.push(point.y);
  }

  let inverse = mathjs.inv(matrix);

  return mathjs.multiply(inverse, vector);
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

function calcY(x, polynomArray) {
  let result = 0;

  for (let n = 0; n < polynomArray.length; n++) {
    result += polynomArray[n] * Math.pow(x, n);
  }

  return result;
}

export function getPolynom(stepSize, xAxisSize, polynomArray) {
  let points = [];
  for (let x = -xAxisSize; x < xAxisSize; x += stepSize) {
    points.push(new Vector3(x, calcY(x, polynomArray), 0));
  }
  return getLine(points, 0xff0000);
}

export function getRungePoints(pointCount) {
  const points = [];

    const degree = pointCount - 1;
    const leftBoundary = -5;
    const rightBoundary = 5;
    const distance = (leftBoundary - rightBoundary) * -1;
    const stepSize = distance / degree;

    for (let i = 0; i < pointCount; i++) {
      const x = leftBoundary + i * stepSize;
      const y = 1. / (1. + Math.pow(x, 2.))
      points.push(new Vector3(x, y, 0));
    }

    points.push();
    return points;
}
