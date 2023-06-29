import {CircleGeometry, Mesh, MeshBasicMaterial} from "three";

export class Point extends Mesh{
  constructor(positionVector) {
    super();
    this.positionVector = positionVector;

    this.material = new MeshBasicMaterial({ color: 0xffff00 });
    this.geometry = new CircleGeometry(1, 64);

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
