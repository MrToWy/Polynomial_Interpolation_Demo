import {Szene} from "./Szene";

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
}
