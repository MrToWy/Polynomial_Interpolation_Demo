import {Scene} from "three";
import {Renderer} from "./Renderer";
import {WINDOW_HEIGHT, WINDOW_WIDTH, X_AXIS_SIZE, Y_AXIS_SIZE} from "../constants";
import {Camera} from "./Camera";
import {Axis} from "./Axis";

export class Szene extends Scene{

  constructor(domElementId) {
    super();

    this.camera = new Camera(WINDOW_WIDTH, WINDOW_HEIGHT).setZposition(14);
    console.log(this.camera)
    this.renderer = new Renderer(WINDOW_WIDTH, WINDOW_HEIGHT);
    document.getElementById(domElementId).appendChild(this.renderer.domElement);

    this.xAxisSize = X_AXIS_SIZE;
    this.yAxisSize = Y_AXIS_SIZE;
  }

  changeAxisSize(x, y){
    this.xAxisSize = x;
    this.yAxisSize = y;

    return this;
  }

  addAxis(){
    const negativeAxis = new Axis().setAxisSize(-this.xAxisSize, -this.yAxisSize).setColor(0x999999);
    const positiveAxis = new Axis().setAxisSize(this.xAxisSize, this.yAxisSize);

    this.addElements([negativeAxis, positiveAxis])

    return this;
  }

  render(){
    this.renderer.render(this, this.camera);
    return this;
  }

  addElements(sceneElements){
    for (const sceneElement of sceneElements) {
      this.add(sceneElement);
    }
    return this;
  }
}
