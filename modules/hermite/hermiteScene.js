import {
  calcY,
  calcYAbleitung, calcYZweiteAbleitung,
  getHermitePolynomes,
  interpolate, interpolateX,
  lerpVector
} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_0, COLOR_1, COLOR_2, COLOR_3, DRAW_STEP_SIZE, POINT_SIZE, X_AXIS_SIZE} from "../../js/constants";
import {Point} from "../../js/classes/Point";
import {AbleitungsVector, getAbleitungsVecs} from "../../js/classes/AbleitungsVector";
import {ColorLine} from "../../js/classes/ColorLine";
import {Color, Vector3} from "three";
import {Ring} from "../../js/classes/Ring";
import {AnimatedScene} from "../../js/classes/AnimatedScene";
import {Linie} from "../../js/classes/Linie";

let hermiteArrowOrigin = new Vector3(0.7, 0.3);

let yellowPoints = []

export class HermiteScene extends AnimatedScene{
  constructor(domElementId, points) {
    super(domElementId);
    this.points = points;
    this.polynomArray = interpolate(this.points);
    this.polynomArrayX = interpolateX(this.points);
    this.camera.move(.5, 0.5);
    //this.camera.translateZ(17)

    //console.log(this.polynomArray)
  }

  addControlPoints(){
    this.add(new Point(this.points[0]).setRadius(POINT_SIZE).setColor(COLOR_0));
    this.add(new Point(this.points[2]).setRadius(POINT_SIZE).setColor(COLOR_1));
  }

  addResultLine(){
    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, this.polynomArray, this.polynomArrayX).setShowNegativeAxis(false).setColor(0xff0000).setBoundarys(this.points[0].x, this.points[2].x));
  }

  addTRing(y){
    this.add(new Ring(new Vector3(this.currentT, y)).setRadius(0.01, 0.02).setColor(COLOR_0));
  }

  addAbleitungsvektor(){
    this.add(new AbleitungsVector(this.currentT, this.polynomArray));

    this.add(new AbleitungsVector(0, this.polynomArray));
    this.add(new AbleitungsVector(1, this.polynomArray));
  }

  addArrowLines(addLinesTogether){
    this.add(new Point(hermiteArrowOrigin))

    let hermiteArrowLengths = this.getHermiteArrowLengths(this.points)

    let bezierArrow0 = lerpVector(hermiteArrowOrigin, this.points[0], hermiteArrowLengths[0]);
    let bezierArrow1 = lerpVector(new Vector3(),this.points[1], hermiteArrowLengths[1]);
    let bezierArrow2 = lerpVector(hermiteArrowOrigin, this.points[2], hermiteArrowLengths[2]);
    let bezierArrow3 = lerpVector(new Vector3() ,this.points[3], hermiteArrowLengths[3]);
    this.add(new Point(hermiteArrowOrigin))



    let arrowLine0 = new Linie().setPoints([hermiteArrowOrigin, bezierArrow0]).setColor(COLOR_0);
    let arrowLine1 = new Linie().setPoints([new Vector3(), bezierArrow1]).setColor(COLOR_1);
    let arrowLine2 = new Linie().setPoints([hermiteArrowOrigin, bezierArrow2]).setColor(COLOR_2);
    let arrowLine3 = new Linie().setPoints([new Vector3(), bezierArrow3]).setColor(COLOR_3);


    this.add(new Point(new Vector3()))
    this.add(new Ring(new Vector3(calcY(this.currentT, this.polynomArrayX), calcY(this.currentT, this.polynomArray))))

    addLinesTogether = true;
    if(addLinesTogether) {

      // move line1 to origin
      // move line1 to end of line0
      arrowLine1.move(bezierArrow0.x, bezierArrow0.y)


      // move line2 to origin
      arrowLine2.move(-hermiteArrowOrigin.x, -hermiteArrowOrigin.y)
      // move line2 to end of line1
      arrowLine2.move(bezierArrow1.x, bezierArrow1.y)
      // repeat movements from arrowLine1
      arrowLine2.move(bezierArrow0.x, bezierArrow0.y)


      // move line3 to origin
      arrowLine3.move(bezierArrow2.x, bezierArrow2.y)
      // repeat movements from arrowLine2
      arrowLine3.move(-hermiteArrowOrigin.x, -hermiteArrowOrigin.y)
      arrowLine3.move(bezierArrow1.x, bezierArrow1.y)
      arrowLine3.move(bezierArrow0.x, bezierArrow0.y)
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

    // this.addTRing(y);
    // this.addAbleitungsvektor();

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
