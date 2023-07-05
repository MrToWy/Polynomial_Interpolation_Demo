import {InteractiveScene} from "../../js/classes/InteractiveScene";
import {Point} from "../../js/classes/Point";
import {Vector3} from "three";

let p = new Point(new Vector3())

export class Simple extends InteractiveScene{
  constructor(domElementId) {


    super(domElementId, (sceneObject) => {


    });
  }

  render() {
    this.clear();
    this.addElements([p, this.transformControl])
    return super.render();
  }
}
