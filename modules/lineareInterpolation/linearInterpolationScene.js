import {Szene} from "../../js/classes/Szene";
import {getRungePoints, interpolate} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_1, DRAW_STEP_SIZE, POINT_SIZE} from "../../js/constants";
import {Group, Vector3} from "three";
import {Point} from "../../js/classes/Point";
import {Linie} from "../../js/classes/Linie";
import {AnimatedScene} from "../../js/classes/AnimatedScene";
import {TransformControl} from "../../js/classes/TransformControl";

export class LinearInterpolationScene extends AnimatedScene{

  constructor(domElementId) {
    super(domElementId);
    this.camera.setZposition(14);
    this.changeAxisSize(5, 5);
    this.step = 1;

    this.rungePointCount = 6;

    document.getElementById("small").addEventListener("click", () => this.setPointCount(6));
    document.getElementById("medium").addEventListener("click", () => this.setPointCount(11));
    document.getElementById("large").addEventListener("click", () => this.setPointCount(18));
  }

  render() {
    this.clear();
    this.addAxis();

    this.addRungeScene();
    this.addInterpolationScene();

    return super.render();
  }

  addInterpolationScene(){
    if(this.step >= 5) return;

    let points = [
      new Vector3(),
      new Vector3(1,1.12),
      new Vector3(4.7,2.32),
      new Vector3(-3.1,-1.32),
    ];
    let polynomArray = interpolate(points);
    this.add(new Polynom(DRAW_STEP_SIZE, this.xAxisSize, polynomArray));
    this.add(this.getPoints(points, POINT_SIZE*2));
  }

  addRungeScene(){
    if(this.step < 5) return;

    let points = getRungePoints(this.rungePointCount);
    let polynomArray = interpolate(points);
    this.add(new Polynom(DRAW_STEP_SIZE, this.xAxisSize, polynomArray));
    this.add(this.getPoints(points, POINT_SIZE));


    // draw actual runge curve
    this.add(new Linie().setPoints(getRungePoints(500)).setColor(COLOR_1));
  }

  setPointCount(count){
    this.rungePointCount = count;
    this.render()
  }

  getPoints(pointsArray, pointSize) {
    const group = new Group();
    for (const point of pointsArray) {
      group.add(new Point(point).setRadius(pointSize));
    }
    return group;
  }
}

