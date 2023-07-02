import {Szene} from "../../js/classes/Szene";
import {Vector3} from "three";
import {getHermitePolynomes} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_0, COLOR_1, COLOR_2, COLOR_3, DRAW_STEP_SIZE, X_AXIS_SIZE} from "../../js/constants";



export class BasisScene extends Szene{
  constructor(domElementId, points) {
    super(domElementId);
    this.points = points;
  }

  render(){
    this.clear();
    this.addAxis(false);

    let polynomMatrix = getHermitePolynomes(this.points);

    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[0]).setShowNegativeAxis(false).setColor(COLOR_0));
    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[1]).setShowNegativeAxis(false).setColor(COLOR_1));
    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[2]).setShowNegativeAxis(false).setColor(COLOR_2));
    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[3]).setShowNegativeAxis(false).setColor(COLOR_3));


    return super.render();
  }
}
