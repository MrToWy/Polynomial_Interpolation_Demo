import {getRungePoints, interpolate} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_0, COLOR_1, COLOR_2, COLOR_3, DRAW_STEP_SIZE, POINT_SIZE} from "../../js/constants";
import {Vector3} from "three";
import {Point} from "../../js/classes/Point";
import {Linie} from "../../js/classes/Linie";
import {InteractiveScene} from "../../js/classes/InteractiveScene";

let points = [
  new Vector3(),
  new Vector3(1,1.12),
  new Vector3(4.7,2.32),
  new Vector3(-3.1,-1.32),
];
let point0 = new Point(points[0]).setRadius(POINT_SIZE).setColor(COLOR_0);
let point1 = new Point(points[1]).setRadius(POINT_SIZE).setColor(COLOR_1);
let point2 = new Point(points[2]).setRadius(POINT_SIZE).setColor(COLOR_2);
let point3 = new Point(points[3]).setRadius(POINT_SIZE).setColor(COLOR_3);

let sceneObjects = [];


export class LinearInterpolationScene extends InteractiveScene{

  constructor(domElementId) {
    super(domElementId, (sceneObject) => {
      sceneObject.removeAllObjects();
      sceneObject.addAxis();

      sceneObject.addRungeScene();
      sceneObject.addInterpolationLine();
      sceneObject.addAllObjects();
    });

    this.camera.setZposition(14);
    this.changeAxisSize(5, 5);

    this.rungePointCount = 6;

    document.getElementById("small").addEventListener("click", () => this.setPointCount(6));
    document.getElementById("medium").addEventListener("click", () => this.setPointCount(11));
    document.getElementById("large").addEventListener("click", () => this.setPointCount(18));
  }

  render() {
    this.removeAllObjects();
    this.clear();
    this.addAxis();

    this.addRungeScene();
    this.addInterpolationPoints();
    this.addInterpolationLine();
    this.addAllObjects();

    return super.render();
  }

  removeAllObjects(){
    if(sceneObjects && sceneObjects.length > 0) {
      for (const curve of sceneObjects) {
        this.remove(curve);
      }
    }
    sceneObjects = [];
  }

  addAllObjects(){
    if(sceneObjects && sceneObjects.length > 0) {
      for (const curve of sceneObjects) {
        this.add(curve);
      }
    }
  }

  addInterpolationPoints(){
    if(this.step >= 5) return;

    this.addElements([point0, point1, point2, point3, this.transformControl]);
  }

  addInterpolationLine(){
    if(this.step >= 5) return;

    let polynomArray = interpolate([point0.position, point1.position, point2.position, point3.position]);
    sceneObjects.push(new Polynom(DRAW_STEP_SIZE, this.xAxisSize, polynomArray));
  }

  addRungeScene(){
    if(this.step < 5) return;

    let points = getRungePoints(this.rungePointCount);
    let polynomArray = interpolate(points);
    sceneObjects.push(new Polynom(DRAW_STEP_SIZE, this.xAxisSize, polynomArray));
    for (const point of this.getPoints(points, POINT_SIZE)) {
      sceneObjects.push(point)
    }


    // draw actual runge curve
    sceneObjects.push(new Linie().setPoints(getRungePoints(500)).setColor(COLOR_1));
  }

  setPointCount(count){
    this.rungePointCount = count;
    this.render()
  }

  getPoints(pointsArray, pointSize) {
    const points = [];
    for (const point of pointsArray) {
      points.push(new Point(point).setRadius(pointSize));
    }
    return points;
  }
}

