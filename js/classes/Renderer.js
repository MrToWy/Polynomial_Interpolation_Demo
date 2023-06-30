import {WebGLRenderer} from "three";
import {CLEAR_COLOR} from "../constants";

export class Renderer extends WebGLRenderer{

  constructor(width, height) {
    super();

    this.setSize(width, height);
    this.setClearColor(CLEAR_COLOR);
  }

}
