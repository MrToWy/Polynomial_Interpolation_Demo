import {
  calcY, calcYAbleitung,
  getHermitePolynomes,
  interpolate, interpolateX,
  lerpVector
} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_0, COLOR_1, COLOR_2, COLOR_3, DRAW_STEP_SIZE, POINT_SIZE, X_AXIS_SIZE} from "../../js/constants";
import {Point} from "../../js/classes/Point";
import {Group, Vector3} from "three";
import {Ring} from "../../js/classes/Ring";
import {AnimatedScene} from "../../js/classes/AnimatedScene";
import {Linie} from "../../js/classes/Linie";
import {Axis} from "../../js/classes/Axis";

let hermiteArrowOrigin = new Vector3(0.7, 0.3);

export class HermiteScene extends AnimatedScene{
  constructor(domElementId, points) {
    super(domElementId);
    this.points = points;
    this.polynomArray = interpolate(this.points);
    this.polynomArrayX = interpolateX(this.points);
    this.camera.move(1, 1.3);
  }

  addControlPoints(){
    this.add(new Point(this.points[0]).setRadius(POINT_SIZE).setColor(COLOR_0));
    this.add(new Point(this.points[2]).setRadius(POINT_SIZE).setColor(COLOR_1));
  }

  addResultLine(){
    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, this.polynomArray, this.polynomArrayX).setShowNegativeAxis(false).setColor(0xff0000).setBoundarys(this.points[0].x, this.points[2].x));
  }

  addTRing(y){
    this.add(new Ring(new Vector3(calcY(this.currentT, this.polynomArrayX), calcY(this.currentT, this.polynomArray))))
  }

  addAbleitungsvektor(){

    let linieStart = new Linie().setPoints([new Vector3(), this.points[1]]);
    this.add(linieStart);

    let x = calcY(this.currentT, this.polynomArrayX)
    let y = calcY(this.currentT, this.polynomArray)
    let xAbleitung = calcYAbleitung(this.currentT, this.polynomArrayX)
    let yAbleitung = calcYAbleitung(this.currentT, this.polynomArray)
    let linieT = new Linie().setPoints([new Vector3(), new Vector3(xAbleitung, yAbleitung)]);
    linieT.move(x, y);
    this.add(linieT);

    let linieEnd = new Linie().setPoints([new Vector3(), this.points[3]]);
    linieEnd.move(this.points[2].x, this.points[2].y);
    this.add(linieEnd);
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
    this.clear();

    let y = calcY(this.currentT, this.polynomArray);

    this.addResultLine();
    this.addControlPoints();

    this.addTRing(y);
    this.addAbleitungsvektor();

    this.addArrowLines(false);
    this.addBasisGraph();

    return super.render();
  }

  addBasisGraph(){
    let bernsteinGroup = new Group();

    let polynomMatrix = getHermitePolynomes(this.points);

    bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[0]).setShowNegativeAxis(false).setColor(COLOR_0));
    bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[1]).setShowNegativeAxis(false).setColor(COLOR_1));
    bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[2]).setShowNegativeAxis(false).setColor(COLOR_2));
    bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[3]).setShowNegativeAxis(false).setColor(COLOR_3));

    bernsteinGroup.add(new Axis().setAxisSize(this.xAxisSize, this.yAxisSize));
    bernsteinGroup.add(this.getMovingLine());

    bernsteinGroup.translateX(1.5).translateY(2.3);
    bernsteinGroup.scale.set(0.5, 0.5, 0.5);
    this.add(bernsteinGroup);
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
