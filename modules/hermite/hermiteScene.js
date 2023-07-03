import {calcY, calcYAbleitung, interpolate} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_0, COLOR_1, DRAW_STEP_SIZE, POINT_SIZE, X_AXIS_SIZE} from "../../js/constants";
import {Point} from "../../js/classes/Point";
import {AbleitungsVector} from "../../js/classes/AbleitungsVector";
import {ColorLine} from "../../js/classes/ColorLine";
import {Vector3} from "three";
import {Ring} from "../../js/classes/Ring";
import {AnimatedScene} from "../../js/classes/AnimatedScene";
export class HermiteScene extends AnimatedScene{
  constructor(domElementId, points) {
    super(domElementId);
    this.points = points;
    this.polynomArray = interpolate(this.points);
    this.camera.move(0.9, 0.9);
  }

  render() {
    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, this.polynomArray).setShowNegativeAxis(false).setColor(0xff0000).setBoundarys(this.points[0].x, this.points[2].x));

    this.add(new Point(this.points[0]).setRadius(POINT_SIZE).setColor(COLOR_0));
    this.add(new Point(this.points[2]).setRadius(POINT_SIZE).setColor(COLOR_1));

    this.add(new ColorLine([new Vector3(0,0,0),new Vector3(1,1,0)], [1,0,0,0,1,0]).translateX(-1));

    return super.render();
  }

  animate(sceneObject){

    super.animate(sceneObject, () => {

      let y = calcY(this.currentT, this.polynomArray);
      let ySteigung = calcYAbleitung(this.currentT, this.polynomArray);

      sceneObject.add(new Ring(new Vector3(this.currentT, y)).setRadius(0.01, 0.02));
      sceneObject.add(new AbleitungsVector(this.currentT, y, ySteigung));

    })
  }
}
