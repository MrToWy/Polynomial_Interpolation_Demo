import {TransformControls} from "three/examples/jsm/controls/TransformControls";

export class TransformControl extends TransformControls{
  constructor(camera, renderer, renderCallbackFunction) {
    super(camera, renderer.domElement);

    this.addEventListener('change', renderCallbackFunction);
    this.showZ = false;
  }
}
