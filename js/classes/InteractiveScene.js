import {AnimatedScene} from "./AnimatedScene";
import {calculateOffset} from "../helpers";
import {Raycaster, Vector2} from "three";
import {WINDOW_HEIGHT, WINDOW_WIDTH} from "../constants";
import {Point} from "./Point";
import {TransformControl} from "./TransformControl";

export class InteractiveScene extends AnimatedScene{
  constructor(domElementId, redrawWhileDraggingTransformControl) {
    super(domElementId);
    this.step = 1;

    this.transformControl = new TransformControl(this.camera, this.renderer, () => {

      redrawWhileDraggingTransformControl?.(this)

      this.renderer.render(this, this.camera);
    });
  }

  getCollidingObjects(e, sceneObject){
    const offset = calculateOffset(document.getElementById(sceneObject.domElementId)); //or some other element

    let posX = e.clientX+offset.x;
    let posY = e.clientY+offset.y;
    let pointer = new Vector2((posX / WINDOW_WIDTH) * 2 - 1, -(posY / WINDOW_HEIGHT) * 2 + 1)
    let raycaster = new Raycaster();
    raycaster.setFromCamera(pointer, sceneObject.camera);

    // calculate clicked objects
    return raycaster.intersectObjects(sceneObject.children).filter(obj => {
      return obj.object instanceof Point;
    });
  }

  onDocumentMouseMove( e, sceneObject ) {
    e.preventDefault();

    let intersects = sceneObject.getCollidingObjects(e, sceneObject);

    document.getElementById(this.domElementId).style.cursor = intersects.length === 0 ? "auto" : "pointer";
  }

  onDocumentMouseDown( e, sceneObject ) {
    e.preventDefault();

    let intersects = sceneObject.getCollidingObjects(e, sceneObject);

    if(intersects.length === 0){
      sceneObject.transformControl.detach();
      sceneObject.render();
    }

    for (const intersect of intersects) {
      console.log(sceneObject.transformControl, intersect.object)
      sceneObject.transformControl.attach(intersect.object);
      sceneObject.add(sceneObject.transformControl)
      sceneObject.render();
    }
  }
}
