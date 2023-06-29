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

export function getColorLine(points, colors, lineWidth = 0.0025){
  const geometry = new LineGeometry();
  geometry.setPositions(concatVector3Array(points));
  geometry.setColors([1,0,0,0,1,0]);

  let mat = new LineMaterial();
  mat.linewidth = lineWidth;
  mat.vertexColors = true;

  let line2 = new Line2();
  line2.material = mat;
  line2.geometry = geometry;
  line2.computeLineDistances();
  line2.scale.set(1, 1, 1);
  line2.translateX(-1.5);

  return line2;
}

export function getAbleitungsVec(point, ableitung, color = 0xff0000) {
  let endPoint = new Vector3(point.x+1,point.y+ableitung.y,0);
  return new Linie().setColor(color).setPoints([point,endPoint]);
}
