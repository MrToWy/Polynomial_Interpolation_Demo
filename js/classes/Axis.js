import {Vector3} from "three";
import {Linie} from "./Linie";
import {WHITE} from "../constants";

export class Axis extends Linie{
  constructor() {
    super();
    this.origin = new Vector3(0, 0, 0);
    this.endOfXAxis = new Vector3(5, 0, 0);
    this.endOfYAxis = new Vector3(0, 5, 0);

    this.points = [this.endOfXAxis, this.origin, this.endOfYAxis];

    this.setColor(WHITE).setLineWidth(0.0025).setPoints(this.points);
  }

  setXAxisSize(size){
    this.endOfXAxis = new Vector3(size, 0, 0);
    this.setPoints([this.endOfXAxis, this.origin, this.endOfYAxis]);
    return this;
  }

  setYAxisSize(size){
    this.endOfYAxis = new Vector3(0, size, 0);
    this.setPoints([this.endOfXAxis, this.origin, this.endOfYAxis]);
    return this;
  }

  setAxisSize(xSize, ySize){
    this.setXAxisSize(xSize);
    this.setYAxisSize(ySize);
    return this;
  }

  setColor(color){
    super.setColor(color);
    return this;
  }

  setLineWidth(width) {
    super.setLineWidth(width);
    return this;
  }
}
