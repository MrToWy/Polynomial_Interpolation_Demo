import {Szene} from "./Szene";
import {Vector3} from "three";
import {Linie} from "./Linie";
import {GREY} from "../constants";

export class AnimatedScene extends Szene{
  constructor(domElementId) {
    super(domElementId);

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

  addMovingLineToAxis(currentT, sceneObject){
    let startOfWhiteLine = new Vector3(currentT, -0.3);
    let endOfWhiteLine = new Vector3(currentT, 1.2);
    sceneObject.add(new Linie().setPoints([startOfWhiteLine, endOfWhiteLine]).setColor(GREY))
  }
}
