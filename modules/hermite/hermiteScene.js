import {
  calcY,
  calcYAbleitung, calcYZweiteAbleitung,
  getHermitePolynomes,
  interpolate,
  lerpVector
} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_0, COLOR_1, COLOR_2, COLOR_3, DRAW_STEP_SIZE, POINT_SIZE, X_AXIS_SIZE} from "../../js/constants";
import {Point} from "../../js/classes/Point";
import {AbleitungsVector, getAbleitungsVecs} from "../../js/classes/AbleitungsVector";
import {ColorLine} from "../../js/classes/ColorLine";
import {Vector3} from "three";
import {Ring} from "../../js/classes/Ring";
import {AnimatedScene} from "../../js/classes/AnimatedScene";
import {Linie} from "../../js/classes/Linie";

let hermiteArrowOrigin = new Vector3(0, 0);

export class HermiteScene extends AnimatedScene{
  constructor(domElementId, points) {
    super(domElementId);
    this.points = points;
    this.polynomArray = interpolate(this.points);
    this.camera.move(1.2, 1.2);
  }

  addControlPoints(){
    this.add(new Point(this.points[0]).setRadius(POINT_SIZE).setColor(COLOR_0));
    this.add(new Point(this.points[2]).setRadius(POINT_SIZE).setColor(COLOR_1));
  }

  addResultLine(){
    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, this.polynomArray).setShowNegativeAxis(false).setColor(0xff0000).setBoundarys(this.points[0].x, this.points[2].x));
  }

  addTRing(y){
    this.add(new Ring(new Vector3(this.currentT, y)).setRadius(0.01, 0.02).setColor(COLOR_0));
  }

  addAbleitungsvektor(){
    this.add(new AbleitungsVector(this.currentT, this.polynomArray));
  }

  addArrowLines(addLinesTogether){
    this.add(new Point(hermiteArrowOrigin))

    // p0 * H0(t), m0 * Ĥ0(t), p0 * H1(t) und m0 * Ĥ1(t)
    let p0 = this.points[0]
    let m0 = this.points[1]
    let p1 = this.points[2]
    let m1 = this.points[3]
    let t = this.currentT

    function H0(t){
      return 2 * Math.pow(t, 3) - 3 * Math.pow(t, 2)  + 1
    }
    function Hstrich0(t){
      return Math.pow(t, 3) - 2 * Math.pow(t, 2)  + t
    }
    function H1(t){
      return -2 * Math.pow(t, 3) + 3 * Math.pow(t, 2)
    }
    function Hstrich1(t){
      return Math.pow(t, 3) -  Math.pow(t, 2)
    }
    let arrowLine0 = new Linie().setPoints([hermiteArrowOrigin, new Vector3(p0.x * H0(t), p0.y * H0(t))]).setColor(COLOR_0);
    let arrowLine1 = new Linie().setPoints([hermiteArrowOrigin, new Vector3(m0.x * Hstrich0(t), m0.y * Hstrich0(t))]).setColor(COLOR_1);
    let arrowLine2 = new Linie().setPoints([hermiteArrowOrigin, new Vector3(p1.x * H1(t), p1.y * H1(t))]).setColor(COLOR_2);
    let arrowLine3 = new Linie().setPoints([hermiteArrowOrigin, new Vector3(m1.x * Hstrich1(t), m1.y * Hstrich1(t))]).setColor(COLOR_3);



    addLinesTogether = true;
    if(addLinesTogether) {
      arrowLine1.move(p0.x * H0(t),  p0.y * H0(t));
      arrowLine2.move(p0.x * H0(t) + m0.x * Hstrich0(t), p0.y * H0(t) + m0.y * Hstrich0(t))
      arrowLine3.move(p0.x * H0(t) + m0.x * Hstrich0(t) + p1.x * H1(t), p0.y * H0(t) + m0.y * Hstrich0(t) + p1.y * H1(t))
    }

    this.add(arrowLine0);
    this.add(arrowLine1);
    this.add(arrowLine2);
    this.add(arrowLine3);
  }

  render() {
    let y = calcY(this.currentT, this.polynomArray);

    this.addResultLine();
    this.addControlPoints();

    this.addTRing(y);
    this.addAbleitungsvektor();

    this.addArrowLines(false);

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
