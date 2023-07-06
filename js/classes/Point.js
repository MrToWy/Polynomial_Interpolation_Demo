import {CircleGeometry, Mesh, MeshBasicMaterial} from "three";
import {POINT_COLOR} from "../constants";

export class Point extends Mesh{
  constructor(positionVector) {
    super();
    this.positionVector = positionVector;

    this.material = new MeshBasicMaterial({ color: POINT_COLOR });
    this.geometry = new CircleGeometry(0.02, 64);
    this.material.depthTest = false;
    this.renderOrder = 1;

    this.translateX(positionVector.x);
    this.translateY(positionVector.y);
    this.translateY(positionVector.z);
  }

  setRadius(radius){
    this.geometry = new CircleGeometry(radius, 64);
    return this;
  }

  setColor(color){
    this.material = new MeshBasicMaterial({color: color});
    return this;
  }
}
