import {Vector3} from "three";
import {Linie} from "./Linie";

export class AbleitungsVector extends Linie{
  constructor(x, y, ySteigung) {
    super();
    this.setPoints([new Vector3(), new Vector3(x, ySteigung)])
    this.setColor(0xff0000);
    this.translateX(x);
    this.translateY(y);
  }
}
