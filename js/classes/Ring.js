import {RingGeometry, Mesh, MeshBasicMaterial, Vector3} from "three";

export class Ring extends Mesh{
  constructor(positionVector = new Vector3()) {
    super();
    this.positionVector = positionVector;

    this.material = new MeshBasicMaterial({ color: 0xffff00 });
    this.geometry = new RingGeometry(0.02, 0.04);

    this.translateX(positionVector.x);
    this.translateY(positionVector.y);
    this.translateY(positionVector.z);
  }

  setPosition(positionVector){
    // move back to origin
    this.translateX(-this.positionVector.x)
    this.translateY(-this.positionVector.y)

    this.positionVector = positionVector;

    // move to desired position
    this.translateX(positionVector.x)
    this.translateY(positionVector.y)
    return this;
  }

  setColor(color){
    this.material = new MeshBasicMaterial({color: color});
    return this;
  }

  setRadius(inner, outer){
    this.geometry = new RingGeometry(inner, outer);
    return this;
  }
}
