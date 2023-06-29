import {Vector3} from "three";
import {Linie} from "./Linie";
import {calcY} from "../interpolation";

export class Polynom extends Linie{
  constructor(stepSize, xAxisSize, polynomArray) {
    super();

    this.showNegativeAxis = true;
    this.leftBoundary = null;
    this.rightBoundary = null;
    this.stepSize = stepSize;
    this.xAxisSize = xAxisSize;
    this.polynomArray = polynomArray;

    this.setColor(0xff0000);
    this.updateObject();
  }

  updateObject(){
    this.points = getPoints(this.showNegativeAxis, this.xAxisSize, this.stepSize, this.leftBoundary, this.rightBoundary, this.polynomArray);
    this.setPoints(this.points);
  }

  setShowNegativeAxis(enabled){
    this.showNegativeAxis = enabled;
    this.updateObject();
    return this;
  }

  setLeftBoundary(leftBoundary){
    this.leftBoundary = leftBoundary;
    this.updateObject();
    return this;
  }

  setRightBoundary(rightBoundary){
    this.rightBoundary = rightBoundary;
    this.updateObject();
    return this;
  }

  setBoundarys(leftBoundary, rightBoundary){
    this.setLeftBoundary(leftBoundary);
    this.setRightBoundary(rightBoundary);
    return this;
  }
}

function getPoints(showNegativeAxis, xAxisSize, stepSize, leftBoundaryX, rightBoundaryX, polynomArray){
  let points = [];
  let startPoint = showNegativeAxis ? -xAxisSize : 0;

  for (let x = startPoint; x < xAxisSize; x += stepSize) {
    if(leftBoundaryX !== null && leftBoundaryX > x) continue;
    if(rightBoundaryX !== null && rightBoundaryX < x) continue;
    points.push(new Vector3(x, calcY(x, polynomArray), 0));
  }
  return points;
}
