import {
  calcY, calcYAbleitung,
  getHermitePolynomes,
  interpolate, interpolateX,
  lerpVector, normalizeVec3
} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {
  ARROW_COLOR, BASISFUNKTIONS_LINE_WIDTH,
  COLOR_0,
  COLOR_1,
  COLOR_2,
  COLOR_3,
  DRAW_STEP_SIZE,
  POINT_SIZE,
  RED,
  WHITE,
  X_AXIS_SIZE
} from "../../js/constants";
import {Point} from "../../js/classes/Point";
import {ArrowHelper, Group, Vector3} from "three";
import {Ring} from "../../js/classes/Ring";
import {AnimatedScene} from "../../js/classes/AnimatedScene";
import {Linie} from "../../js/classes/Linie";
import {Axis} from "../../js/classes/Axis";
import * as mathjs from "mathjs";

let hermiteArrowOrigin = new Vector3(0.7, 0.3);

export class HermiteScene extends AnimatedScene{
  constructor(domElementId, points) {
    super(domElementId);
    this.points = points;
    this.polynomArray = interpolate(this.points);
    this.polynomArrayX = interpolateX(this.points);
    this.camera.move(1, 1.3);
    this.addLinesTogether = false;

   this.initBernsteinGroup();
  }

  initBernsteinGroup(){
    this.bernsteinGroup = new Group();
    let polynomMatrix = getHermitePolynomes(this.points);
    this.bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[0]).setShowNegativeAxis(false).setColor(COLOR_0).setLineWidth(BASISFUNKTIONS_LINE_WIDTH));
    this.bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[1]).setShowNegativeAxis(false).setColor(COLOR_1).setLineWidth(BASISFUNKTIONS_LINE_WIDTH));
    this.bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[2]).setShowNegativeAxis(false).setColor(COLOR_2).setLineWidth(BASISFUNKTIONS_LINE_WIDTH));
    this.bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[3]).setShowNegativeAxis(false).setColor(COLOR_3).setLineWidth(BASISFUNKTIONS_LINE_WIDTH));

    this.bernsteinGroup.add(new Axis().setAxisSize(this.xAxisSize, this.yAxisSize));

    this.bernsteinGroup.translateX(1.5).translateY(2.3);
    this.bernsteinGroup.scale.set(0.5, 0.5, 0.5);
  }

  addControlPoints(){
    this.add(new Point(this.points[0]).setRadius(POINT_SIZE).setColor(COLOR_0));
    this.add(new Point(this.points[2]).setRadius(POINT_SIZE).setColor(COLOR_2));
  }

  addResultLine(){
    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, this.polynomArray, this.polynomArrayX).setShowNegativeAxis(false).setColor(RED).setBoundarys(this.points[0].x, this.points[2].x));
  }

  addTRing(y){
    this.add(new Ring(new Vector3(calcY(this.currentT, this.polynomArrayX), calcY(this.currentT, this.polynomArray))))
  }

  addAbleitungsvektorStartEnd(){
    this.addAbleitungsArrow(0, COLOR_1);
    this.addAbleitungsArrow(1, COLOR_3);
  }

  addAbleitunsgvektorT(){
    this.addAbleitungsArrow(this.currentT);
  }

  addAbleitungsArrow(t, color = ARROW_COLOR){
    let x = calcY(t, this.polynomArrayX);
    let y = calcY(t, this.polynomArray);
    let origin = new Vector3(x,y);

    let xAbleitung = calcYAbleitung(t, this.polynomArrayX);
    let yAbleitung = calcYAbleitung(t, this.polynomArray);
    let dir = new Vector3(xAbleitung, yAbleitung);

    this.addArrowLine(dir, origin, color);
    this.addArrowHead(dir, origin, color);
  }

  addArrowHead(dir, origin, color = ARROW_COLOR){
    let spitze = new ArrowHelper(normalizeVec3(dir),origin, dir.length(), color,0.05, 0.08);
    spitze.remove(spitze.line)
    this.add(spitze);
  }

  addArrowLine(dir, origin, color = ARROW_COLOR){
    let linie = new Linie().setPoints([new Vector3(), dir]).setColor(color);
    linie.move(origin.x, origin.y);
    this.add(linie);
  }

  addArrowLines(){
    this.add(new Point(hermiteArrowOrigin))

    let hermiteArrowLengths = this.getHermiteArrowLengths(this.points)

    let bezierArrow0 = lerpVector(hermiteArrowOrigin,this.points[0], hermiteArrowLengths[0]);
    let bezierArrow1 = lerpVector(new Vector3(),this.points[1], hermiteArrowLengths[1]);
    let bezierArrow2 = lerpVector(hermiteArrowOrigin, this.points[2], hermiteArrowLengths[2]);
    let bezierArrow3 = lerpVector(new Vector3() ,this.points[3], hermiteArrowLengths[3]);
    this.add(new Point(hermiteArrowOrigin));

    let arrowLine0 = new Linie().setPoints([hermiteArrowOrigin, bezierArrow0]).setColor(COLOR_0);
    let arrowLine1 = new Linie().setPoints([new Vector3(), bezierArrow1]).setColor(COLOR_1);
    let arrowLine2 = new Linie().setPoints([hermiteArrowOrigin, bezierArrow2]).setColor(COLOR_2);
    let arrowLine3 = new Linie().setPoints([new Vector3(), bezierArrow3]).setColor(COLOR_3);


    this.add(new Point(new Vector3()))

    if(this.addLinesTogether) {

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
    this.addAxis(false)

    let y = calcY(this.currentT, this.polynomArray);

    switch (true) {
      case this.step > 6:

      case this.step > 5:
      //TODO: Arrows als eigene Karten aufsplitten

      case this.step > 4:
        this.addArrowLines();

      case this.step > 3:
        this.addBasisGraph();

      case this.step > 2:
        this.addAbleitunsgvektorT();
        this.addTRing(y);
        this.addResultLine();
        //TODO: Resultline nicht komplett zeichnen nur bis T

      case this.step > 1:
        this.addAbleitungsvektorStartEnd();
    }

    this.addControlPoints();

    return super.render();
  }

  addBasisGraph(){
    this.bernsteinGroup.add(this.getMovingLine());

    this.add(this.bernsteinGroup);
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
