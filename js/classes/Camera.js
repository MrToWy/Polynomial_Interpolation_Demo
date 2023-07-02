import {PerspectiveCamera} from "three";

export class Camera extends PerspectiveCamera{
  constructor(width, height) {
    super(45, width/height, 1, 500);

    this.position.set(0, 0, 4);
    this.lookAt(0, 0, 0);
  }

  setZposition(z){
    this.position.set(0, 0, z);
    return this;
  }

  setLookAt(x, y, z){
    this.lookAt(x, y, z);
    return this;
  }

  move(x, y){
    this.translateX(x);
    this.translateY(y);
    this.lookAt(x, y, 0);
  }
}
