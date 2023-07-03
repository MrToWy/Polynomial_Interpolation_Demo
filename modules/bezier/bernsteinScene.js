import {getBernsteinPolynomes} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_0, COLOR_1, COLOR_2, COLOR_3, DRAW_STEP_SIZE, X_AXIS_SIZE} from "../../js/constants";
import {AnimatedScene} from "../../js/classes/AnimatedScene";

export class BernsteinScene extends AnimatedScene{
  constructor(domElementId) {
    super(domElementId);
  }

  render() {
    this.addAxis(false);
    this.addElements(this.getBernsteinLines());
    this.addMovingLineToAxis(this.currentT, this);

    return super.render();
  }

  getBernsteinLines() {
    let bernsteinPolynomes = getBernsteinPolynomes();
    let bernsteinLines = [];

    bernsteinLines.push(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[0]).setShowNegativeAxis(false).setColor(COLOR_0));
    bernsteinLines.push(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[1]).setShowNegativeAxis(false).setColor(COLOR_1));
    bernsteinLines.push(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[2]).setShowNegativeAxis(false).setColor(COLOR_2));
    bernsteinLines.push(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[3]).setShowNegativeAxis(false).setColor(COLOR_3));

    return bernsteinLines;
  }
}
