import {RingGeometry, Mesh, MeshBasicMaterial} from "three";

export class Ring extends Mesh{
  constructor(positionVector) {
    super();
    this.positionVector = positionVector;

    this.material = new MeshBasicMaterial({ color: 0xffff00 });
    this.geometry = new RingGeometry(0.02, 0.04);

    this.translateX(positionVector.x);
    this.translateY(positionVector.y);
    this.translateY(positionVector.z);
  }

  setColor(color){
    this.material = new MeshBasicMaterial({color: color});
    return this;
  }
}
