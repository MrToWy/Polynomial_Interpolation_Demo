
import {Linie} from "./Linie";
import {calcY, calcYAbleitung, calcYZweiteAbleitung} from "../interpolation";
import {Vector3} from "three";
import {WHITE} from "../constants";

export class AbleitungsVector extends Linie{
  constructor(currentT, polynomArray) {
    super();

    this.setColor(WHITE);

    let vecs = getAbleitungsVecs(currentT, polynomArray)
    this.setPoints(vecs)
  }
}

export function getAbleitungsVecs(currentT, polynomArray){
  let y = calcY(currentT, polynomArray);
  let ySteigung = calcYAbleitung(currentT, polynomArray);
  // noinspection UnnecessaryLocalVariableJS
  let y2Steigung = calcYZweiteAbleitung(currentT, polynomArray)

  let laenge = y2Steigung;
  let winkel = Math.atan(ySteigung);

  let xVec = Math.cos(winkel)*laenge;
  let yVec = Math.sin(winkel)*laenge;

  let vec = new Vector3(xVec,yVec);
  let startVec = new Vector3(currentT,y);
  let endVec = new Vector3(vec.x + currentT, vec.y+y);

  return [startVec, endVec]
}
