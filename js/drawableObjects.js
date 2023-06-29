import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import {Group, Vector3} from "three";
import {Linie} from "./classes/Linie";
import {Point} from "./classes/Point";



export function getPoints(pointsArray, pointSize) {
  const group = new Group();
  for (const point of pointsArray) {
    group.add(new Point(point).setRadius(pointSize));
  }
  return group;
}



export function getAbleitungsVec(point, ableitung, color = 0xff0000) {
  let endPoint = new Vector3(point.x+1,point.y+ableitung.y,0);
  return new Linie().setColor(color).setPoints([point,endPoint]);
}
