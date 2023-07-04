import {
  calcY,
  calcYAbleitung,
  getHermitePolynomes,
  interpolate,
  lerpVector
} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_0, COLOR_1, COLOR_2, COLOR_3, DRAW_STEP_SIZE, POINT_SIZE, X_AXIS_SIZE} from "../../js/constants";
import {Point} from "../../js/classes/Point";
import {AbleitungsVector} from "../../js/classes/AbleitungsVector";
import {ColorLine} from "../../js/classes/ColorLine";
import {Vector3} from "three";
import {Ring} from "../../js/classes/Ring";
import {AnimatedScene} from "../../js/classes/AnimatedScene";
import {Linie} from "../../js/classes/Linie";

let hermiteArrowOrigin = new Vector3(1.5, -0.2);

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

    let y = calcY(this.currentT, this.polynomArray);
    let ySteigung = calcYAbleitung(this.currentT, this.polynomArray);

    this.add(new Ring(new Vector3(this.currentT, y)).setRadius(0.01, 0.02).setColor(COLOR_0));
    this.add(new AbleitungsVector(this.currentT, y, ySteigung));

    let hermiteArrowLengths = this.getHermiteArrowLengths(this.points)
    let bezierArrow0 = lerpVector(hermiteArrowOrigin, this.points[0], hermiteArrowLengths[0]);
    let bezierArrow1 = lerpVector(hermiteArrowOrigin, this.points[1], hermiteArrowLengths[1]);
    let bezierArrow2 = lerpVector(hermiteArrowOrigin, this.points[2], hermiteArrowLengths[2]);
    let bezierArrow3 = lerpVector(hermiteArrowOrigin, this.points[3], hermiteArrowLengths[3]);

    this.add(new Point(hermiteArrowOrigin))

    this.add(new Linie().setPoints([hermiteArrowOrigin, bezierArrow0]).setColor(COLOR_0));
    this.add(new Linie().setPoints([hermiteArrowOrigin, bezierArrow1]).setColor(COLOR_1).move(bezierArrow0.x-hermiteArrowOrigin.x,  bezierArrow0.y-hermiteArrowOrigin.y));
    this.add(new Linie().setPoints([hermiteArrowOrigin, bezierArrow2]).setColor(COLOR_2).move(bezierArrow1.x-2*hermiteArrowOrigin.x+bezierArrow0.x, bezierArrow1.y-2*hermiteArrowOrigin.y+bezierArrow0.y));
    this.add(new Linie().setPoints([hermiteArrowOrigin, bezierArrow3]).setColor(COLOR_3).move(bezierArrow2.x-3*hermiteArrowOrigin.x+bezierArrow0.x+bezierArrow1.x, bezierArrow2.y-3*hermiteArrowOrigin.y+bezierArrow0.y+bezierArrow1.y));

    return super.render();
  }

  getHermiteArrowLengths(){
    let hermitePolynomes = getHermitePolynomes(this.points)
    let arrow0length = calcY(this.currentT, hermitePolynomes[0]);
    let arrow1length = calcY(this.currentT, hermitePolynomes[1]);
    let arrow2length = calcY(this.currentT, hermitePolynomes[2]);
    let arrow3length = calcY(this.currentT, hermitePolynomes[3]);

    return [arrow0length, arrow1length, arrow2length, arrow3length]
  }
}
