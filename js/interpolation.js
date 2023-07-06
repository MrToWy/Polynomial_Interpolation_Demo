import * as mathjs from "mathjs";
import {Vector3} from "three";

export function interpolate(points) {
  if (points.length <= 0) throw new Error("Bitte Punkte übergeben.");

  const [matrix, , vectorY] = getMatrixform(points);

  let inverse = mathjs.inv(matrix);

  return mathjs.multiply(inverse, vectorY);
}

export function interpolateX(points) {
  if (points.length <= 0) throw new Error("Bitte Punkte übergeben.");

  const [matrix, vectorX] = getMatrixform(points);

  let inverse = mathjs.inv(matrix);

  return mathjs.multiply(inverse, vectorX);
}

export function deCasteljau(t, point0, point1, point2, point3){
  let a = lerpVector(point0.position, point1.position, t);
  let b = lerpVector(point1.position, point2.position, t);
  let c = lerpVector(point2.position, point3.position, t);
  let d = lerpVector(a, b, t);
  let e = lerpVector(b, c, t);
  let p = lerpVector(d, e, t);

  return [a,b,c,d,e,p];
}

export function lerp(a, b, t) {
  return a * (1. - t) + t * b;
}

export function lerpVector(vecA, vecB, t) {
  let aX = lerp(vecA.x, vecB.x, t);
  let aY = lerp(vecA.y, vecB.y, t);

  return new Vector3(aX, aY, 0);
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

export function calcY(x, polynomArray) {
  let result = 0;

  for (let n = 0; n < polynomArray.length; n++) {
    result += polynomArray[n] * Math.pow(x, n);
  }

  return result;
}

export function calcYAbleitung(x, polynomArray){

  let grad = polynomArray.length - 1;
  let result = 0;

  for (let i = 0; i < grad; i++) {
    result += (grad-i) * polynomArray[grad-i] * Math.pow(x, grad - i - 1)
  }

  return result;
}

export function calcYZweiteAbleitung(x, polynomArray){

  let grad = polynomArray.length - 1;
  let result = 0;

  for (let i = 0; i < grad-1; i++) {
    result += (grad-1-i) * (grad-i) * polynomArray[grad-i] * Math.pow(x, grad - i - 2)
  }

  return result;
}

export function calcTangente(x, y, ySteigung) {
  // y = ySteigung * x + b
  let b = y - x * ySteigung;
  return [b, ySteigung];

}

export function getBernsteinPolynomes() {
  let bernsteinPolynom0 = [1,-3,3,-1];
  let bernsteinPolynom1 = [0,3,-6,3];
  let bernsteinPolynom2 = [0,0,3,-3];
  let bernsteinPolynom3 = [0,0,0,1];

  return [bernsteinPolynom0,bernsteinPolynom1,bernsteinPolynom2,bernsteinPolynom3];
}

export function getMatrixform(points) {
  let matrix = [];
  let vectorY = [];
  let vectorX = [];

  let degree = points.length - 1;

  for (const point of points) {
    let rowArray = [];

    for (let i = 0; i <= degree; i++) {
      if(point.isAbleitung){
        let result = i === 0 ? 0 : i*Math.pow(point.x,i-1);
        rowArray.push(result);
      } else {
        rowArray.push(Math.pow(point.x, i));
      }
    }
    matrix.push(rowArray);
    vectorX.push(point.x);
    vectorY.push(point.y);
  }

  return [matrix, vectorX, vectorY];
}

export function getHermitePolynomes(points) {
  const [matrix, _] = getMatrixform(points);

  let inverse = mathjs.inv(matrix);
  let trans = mathjs.transpose(inverse);

  return trans;
}

export function normalizeVec3(vec){
  let normalizedVec = new Vector3();
  let length = vec.length();
  normalizedVec.x = vec.x / length;
  normalizedVec.y = vec.y / length;
  normalizedVec.z = vec.z / length;

  return normalizedVec;
}
