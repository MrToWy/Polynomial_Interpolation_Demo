import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

export class Linie extends Line2{
  constructor() {
    super();
    this.geometry = new LineGeometry();
    this.material = new LineMaterial();
    this.material.linewidth = 0.0025;
    this.material.color.set(0xeeeeee);

    this.scale.set(1, 1, 1);
  }

  setColor(color){
    this.material.color.set(color);
    return this;
  }

  setLineWidth(width){
    this.material.linewidth = width;
    return this;
  }

  setPoints(points){
    this.geometry.setPositions(concatVector3Array(points));
    this.computeLineDistances();
    return this;
  }

  move(x, y){
    this.translateX(x);
    this.translateY(y);

    return this;
  }
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
