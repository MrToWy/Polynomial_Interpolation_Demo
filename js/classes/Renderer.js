import {WebGLRenderer} from "three";

export class Renderer extends WebGLRenderer{

  constructor(width, height) {
    super();

    this.setSize(width, height);
    this.setClearColor('#141C24');
  }

}
