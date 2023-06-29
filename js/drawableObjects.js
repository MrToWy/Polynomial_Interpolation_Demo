import {Group} from "three";
import {Point} from "./classes/Point";



export function getPoints(pointsArray, pointSize) {
  const group = new Group();
  for (const point of pointsArray) {
    group.add(new Point(point).setRadius(pointSize));
  }
  return group;
}




