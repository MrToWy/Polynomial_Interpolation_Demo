import {Szene} from "../../js/classes/Szene";
import {interpolate} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_0, COLOR_1, DRAW_STEP_SIZE, POINT_SIZE, X_AXIS_SIZE} from "../../js/constants";
import {Point} from "../../js/classes/Point";
import {AbleitungsVector} from "../../js/classes/AbleitungsVector";
import {ColorLine} from "../../js/classes/ColorLine";
import {Vector3} from "three";

export class HermiteScene extends Szene{
  constructor(domElementId, points) {
    super(domElementId);
    this.points = points;
  }

  render() {
    let polynomArray = interpolate(this.points);

    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomArray).setShowNegativeAxis(false).setColor(0xff0000).setBoundarys(this.points[0].x, this.points[2].x));

    this.add(new Point(this.points[0]).setRadius(POINT_SIZE).setColor(COLOR_0));
    this.add(new AbleitungsVector(this.points[0], this.points[1]));
    this.add(new Point(this.points[2]).setRadius(POINT_SIZE).setColor(COLOR_1));
    this.add(new AbleitungsVector(this.points[2], this.points[3]));

    this.add(new ColorLine([new Vector3(0,0,0),new Vector3(1,1,0)], [1,0,0,0,1,0]).translateX(-1));

    return super.render();
  }

}
