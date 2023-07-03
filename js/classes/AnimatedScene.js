import {Szene} from "./Szene";
import {Vector3} from "three";
import {Linie} from "./Linie";
import {ANIMATION_SPEED, GREY} from "../constants";


export class AnimatedScene extends Szene{
  constructor(domElementId) {
    super(domElementId);

    this.currentT = 0.5;
    this.pause = true;
  }

  togglePause(e, sceneObject) {
    sceneObject.pause = !sceneObject.pause;
    if(sceneObject.pause){
      e.target.innerHTML = "Play";
    } else {
      e.target.innerHTML = "Pause";
      sceneObject.animate(sceneObject);
    }
  }

  addMovingLineToAxis(){
    let startOfWhiteLine = new Vector3(this.currentT, -0.3);
    let endOfWhiteLine = new Vector3(this.currentT, 1.2);
    this.add(new Linie().setPoints([startOfWhiteLine, endOfWhiteLine]).setColor(GREY))
  }

  animate(sceneObject, runBetweenClearAndRender = null){
    if(sceneObject.pause) return;

    this.currentT += ANIMATION_SPEED;
    if(this.currentT > 1) this.currentT = 0;

    this.clear();

    runBetweenClearAndRender?.();

    sceneObject.render();

    requestAnimationFrame(() => sceneObject.animate(sceneObject));
    return sceneObject;
  }
}
