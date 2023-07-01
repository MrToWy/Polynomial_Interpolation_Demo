import {Szene} from "../../js/classes/Szene";
import {getRungePoints, interpolate} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_1, DRAW_STEP_SIZE, POINT_SIZE} from "../../js/constants";
import {Group} from "three";
import {Point} from "../../js/classes/Point";
import {Linie} from "../../js/classes/Linie";

export class LinearInterpolationScene extends Szene{

  constructor(domElementId) {
    super(domElementId);
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


    // draw actual runge curve
    this.add(new Linie().setPoints(getRungePoints(500)).setColor(COLOR_1));

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

