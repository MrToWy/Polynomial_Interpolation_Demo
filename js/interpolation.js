import * as mathjs from "mathjs";
import {Vector3} from "three";
import {getLine} from "./drawableObjects";

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

export function getPolynom(stepSize, xAxisSize, polynomArray, showNegativeAxis = true) {
  let points = [];
  let startPoint = showNegativeAxis ? -xAxisSize : 0;

  for (let x = startPoint; x < xAxisSize; x += stepSize) {
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

function calcY(x, polynomArray) {
  let result = 0;

  for (let n = 0; n < polynomArray.length; n++) {
    result += polynomArray[n] * Math.pow(x, n);
  }

  return result;
}
