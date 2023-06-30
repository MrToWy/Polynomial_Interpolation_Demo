import {Szene} from "../../js/classes/Szene";
import {Axis} from "../../js/classes/Axis";
import {getRungePoints, interpolate} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {DRAW_STEP_SIZE, POINT_SIZE} from "../../js/constants";
import {Group} from "three";
import {Point} from "../../js/classes/Point";

export class LinearInterpolationScene extends Szene{

  constructor() {
    super("canvas");
    this.changeAxisSize(5, 5);

    this.rungePointCount = 6;

    document.getElementById("small").addEventListener("click", () => this.setPointCount(6));
    document.getElementById("medium").addEventListener("click", () => this.setPointCount(11));
    document.getElementById("large").addEventListener("click", () => this.setPointCount(18));
  }

  render() {
    this.clear();
    this.addAxis();

    let points = getRungePoints(this.rungePointCount);
    let polynomArray = interpolate(points);
    this.add(new Polynom(DRAW_STEP_SIZE, this.xAxisSize, polynomArray));
    this.add(this.getPoints(points, POINT_SIZE));

    super.render();
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

