import {Vector3} from "three";
import {Linie} from "./Linie";

export class AbleitungsVector extends Linie{
  constructor(point, ableitung) {
    super();
    this.setPoints([point, new Vector3(point.x+1, point.y+ableitung.y, 0)])
    this.setColor(0xff0000);
  }
}
