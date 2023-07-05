import {Szene} from "./Szene";
import {Vector3} from "three";
import {Linie} from "./Linie";
import {ANIMATION_SPEED, GREY} from "../constants";


export class AnimatedScene extends Szene{
  constructor(domElementId) {
    super(domElementId);

    this.currentT = 0.25;
    this.pause = true;

    document.getElementById("slider")?.addEventListener('input', (e) => {
      this.currentT = e.target.value / 100;
      this.render();
    });
  }

  togglePause(e, sceneObject) {
    sceneObject.pause = !sceneObject.pause;
    if(sceneObject.pause){
      e.target.innerHTML = "►";
    } else {
      e.target.innerHTML = "⏸";
      sceneObject.animate(sceneObject);
    }
  }


  getMovingLine(){
    let startOfWhiteLine = new Vector3(this.currentT, -0.3);
    let endOfWhiteLine = new Vector3(this.currentT, 1.2);
    return new Linie().setPoints([startOfWhiteLine, endOfWhiteLine]).setColor(GREY);
  }

  animate(sceneObject, runBetweenClearAndRender = null){
    if(sceneObject.pause) return;

    this.currentT += ANIMATION_SPEED;
    if(this.currentT > 1) {
      this.currentT = 0;

      this.pause = true;
      document.getElementById("pause").innerHTML = "►"
    }

    document.getElementById("slider").value = this.currentT * 100;


    this.clear();

    runBetweenClearAndRender?.();

    sceneObject.render();

    requestAnimationFrame(() => sceneObject.animate(sceneObject));
    return sceneObject;
  }
}
