import * as mathjs from "mathjs";
import {Vector3} from "three";
import {Linie} from "./drawableObjects";

export function interpolate(points) {
  if (points.length <= 0) throw new Error("Bitte Punkte übergeben.");

  const [matrix, vector] = getMatrixform(points);

  let inverse = mathjs.inv(matrix);
  //console.log(mathjs.multiply(inverse, vector)); //TODO:delete

  return mathjs.multiply(inverse, vector);
}

export function getPolynom(stepSize, xAxisSize, polynomArray, showNegativeAxis = true, color = 0xff0000, leftBoundaryX = null, rightBoundaryX= null) {
  let points = [];
  let startPoint = showNegativeAxis ? -xAxisSize : 0;

  for (let x = startPoint; x < xAxisSize; x += stepSize) {
    if(leftBoundaryX !== null && leftBoundaryX > x) continue;
    if(rightBoundaryX !== null && rightBoundaryX < x) continue;
    points.push(new Vector3(x, calcY(x, polynomArray), 0));
  }
  return new Linie(points).setColor(color);
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

export function getBernsteinPolynomes() {
  let bernsteinPolynom0 = [1,-3,3,-1];
  let bernsteinPolynom1 = [0,3,-6,3];
  let bernsteinPolynom2 = [0,0,3,-3];
  let bernsteinPolynom3 = [0,0,0,1];

  return [bernsteinPolynom0,bernsteinPolynom1,bernsteinPolynom2,bernsteinPolynom3];
}

export function getMatrixform(points) {
  let matrix = [];
  let vector = [];

  let degree = points.length - 1;

  for (const point of points) {
    let rowArray = [];

    for (let i = 0; i <= degree; i++) {
      if(point.isAbleitung){
        let result = i === 0 ? 0 : i*Math.pow(point.x,i-1);
        //console.log("Ableitung: ",result, "Punkt: ", point.x, "i: ", i, ); //TODO:delete
        rowArray.push(result);
      } else {
        //console.log("Funktion: ", Math.pow(point.x, i)) //TODO:delete
        rowArray.push(Math.pow(point.x, i));
      }
    }
    matrix.push(rowArray);
    vector.push(point.y);
  }
  return [matrix, vector];
}

export function getHermitePolynomes(points) {
  const [matrix, _] = getMatrixform(points);

  let inverse = mathjs.inv(matrix);
  let trans = mathjs.transpose(inverse);
  console.log(trans); //TODO:delete

  return trans;
}
