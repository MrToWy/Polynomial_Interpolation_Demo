import {Point} from "../../js/classes/Point";
import {Group,  Vector3} from "three";
import {
  COLOR_0,
  COLOR_1,
  COLOR_2,
  COLOR_3, COLOR_4, COLOR_5, COLOR_6, DRAW_STEP_SIZE,
  POINT_SIZE, WHITE,
  X_AXIS_SIZE
} from "../../js/constants";
import {Linie} from "../../js/classes/Linie";
import {Ring} from "../../js/classes/Ring";
import {calcY, deCasteljau, getBernsteinPolynomes, lerpVector} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {Axis} from "../../js/classes/Axis";
import {InteractiveScene} from "../../js/classes/InteractiveScene";

let point0 = new Point(new Vector3(0.1,-0.5,0)).setRadius(POINT_SIZE).setColor(COLOR_0);
let point1 = new Point(new Vector3(0.2,0.9,0)).setRadius(POINT_SIZE).setColor(COLOR_1);
let point2 = new Point(new Vector3(1.8,0.9,0)).setRadius(POINT_SIZE).setColor(COLOR_2);
let point3 = new Point(new Vector3(1.9,-0.5,0)).setRadius(POINT_SIZE).setColor(COLOR_3);

let bezierArrowOrigin = new Vector3(1, -0.2);

let point0Vec = new Linie().setPoints([point0.position,bezierArrowOrigin]).setColor(COLOR_0);
let point1Vec = new Linie().setPoints([point1.position,bezierArrowOrigin]).setColor(COLOR_1);
let point2Vec = new Linie().setPoints([point2.position,bezierArrowOrigin]).setColor(COLOR_2);
let point3Vec = new Linie().setPoints([point3.position,bezierArrowOrigin]).setColor(COLOR_3);

let outerLine0 = new Linie().setPoints([point0.position,point1.position]).setColor(WHITE);
let outerLine1 = new Linie().setPoints([point1.position,point2.position]).setColor(WHITE);
let outerLine2 = new Linie().setPoints([point2.position,point3.position]).setColor(WHITE);

let casteljauLine0 = new Linie().setColor(COLOR_4);
let casteljauLine1 = new Linie().setColor(COLOR_4);
let casteljauLine2 = new Linie().setColor(COLOR_5);
let castelJauCurve = new Linie().setColor(COLOR_6);

let arrowLine0 = new Linie().setColor(COLOR_0);
let arrowLine1 = new Linie().setColor(COLOR_1);
let arrowLine2 = new Linie().setColor(COLOR_2);
let arrowLine3 = new Linie().setColor(COLOR_3);


let ring0 = new Ring().setColor(COLOR_4);
let ring1 = new Ring().setColor(COLOR_4);
let ring2 = new Ring().setColor(COLOR_4);
let ring3 = new Ring().setColor(COLOR_5);
let ring4 = new Ring().setColor(COLOR_5);
let ring5 = new Ring().setColor(COLOR_6);



let bernsteinPolynomes = getBernsteinPolynomes();
let bernsteinGroup = new Group();
bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[0]).setShowNegativeAxis(false).setColor(COLOR_0));
bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[1]).setShowNegativeAxis(false).setColor(COLOR_1));
bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[2]).setShowNegativeAxis(false).setColor(COLOR_2));
bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[3]).setShowNegativeAxis(false).setColor(COLOR_3));
bernsteinGroup.translateX(1.5).translateY(1.5);
bernsteinGroup.scale.set(0.5, 0.5, 0.5);


let sceneObjects = [];



export class CasteljauScene extends InteractiveScene{

  constructor(domElementId) {
    super(domElementId, (sceneObject) => {
      sceneObject.removeAllObjects();

      sceneObject.addDeCasteljau(1);
      sceneObject.addOther();

      sceneObject.renderCasteljauLines();
    });

    this.domElementId = domElementId;

    this.camera.move(1,0.5);
    this.showBezierOrOther = "casteljau"; // casteljau or other
    bernsteinGroup.add(new Axis().setAxisSize(this.xAxisSize, this.yAxisSize));
  }

  render(){
    this.clear();

    this.removeAllObjects();
    this.addPoints();

    this.addDeCasteljau();
    this.addOther();


    return super.render()
  }

  addPoints(){
    this.addElements([point0, point1, point2, point3, this.transformControl]);
  }

  addOuterLines(){
    this.addElements([outerLine0, outerLine1, outerLine2]);
  }

  addPointVecs(){
    sceneObjects.push(point0Vec.setPoints([point0.position,bezierArrowOrigin]));
    sceneObjects.push(point1Vec.setPoints([point1.position,bezierArrowOrigin]));
    sceneObjects.push(point2Vec.setPoints([point2.position,bezierArrowOrigin]));
    sceneObjects.push(point3Vec.setPoints([point3.position,bezierArrowOrigin]));
  }

  addCasteljauPointStep1(){
    let casteljauPoints = deCasteljau(this.currentT, point0, point1, point2, point3);
    sceneObjects.push(ring0.setPosition(casteljauPoints[0]));
    sceneObjects.push(ring1.setPosition(casteljauPoints[1]));
    sceneObjects.push(ring2.setPosition(casteljauPoints[2]));
  }

  addCasteljauLinesStep1(){
    let casteljauPoints = deCasteljau(this.currentT, point0, point1, point2, point3);
    sceneObjects.push(casteljauLine0.setPoints([casteljauPoints[0], casteljauPoints[1]]));
    sceneObjects.push(casteljauLine1.setPoints([casteljauPoints[1], casteljauPoints[2]]));
  }

  addCasteljauPointStep2(){
    let casteljauPoints = deCasteljau(this.currentT, point0, point1, point2, point3);
    sceneObjects.push(ring3.setPosition(casteljauPoints[3]));
    sceneObjects.push(ring4.setPosition(casteljauPoints[4]));
  }

  addCasteljauLinesStep2(){
    let casteljauPoints = deCasteljau(this.currentT, point0, point1, point2, point3);
    sceneObjects.push(casteljauLine2.setPoints([casteljauPoints[3], casteljauPoints[4]]));
  }

  addCasteljauPointStep3(){
    let casteljauPoints = deCasteljau(this.currentT, point0, point1, point2, point3);
    sceneObjects.push(ring5.setPosition(casteljauPoints[5]))
  }

  addCasteljauCurve(){
    let stepSize = 0.01;
    let curve = [];
    for (let t = 0; t <= this.currentT; t+= stepSize) {
      let result = deCasteljau( t, point0, point1, point2, point3);
      curve.push(result[5]);
    }
    sceneObjects.push(new Linie().setPoints(curve).setColor(COLOR_6));
  }

  removeAllObjects(){
    if(sceneObjects && sceneObjects.length > 0) {
      for (const curve of sceneObjects) {
        this.remove(curve);
      }
    }
    sceneObjects = [];
  }

  renderCasteljauLines() {
    this.remove(outerLine0);
    this.remove(outerLine1);
    this.remove(outerLine2);
    outerLine0.setPoints([point0.position,point1.position]);
    outerLine1.setPoints([point1.position,point2.position]);
    outerLine2.setPoints([point2.position,point3.position]);
    this.add(outerLine0);
    this.add(outerLine1);
    this.add(outerLine2);

  }

  addBernsteinLines() {

    bernsteinGroup.add(this.getMovingLine());

    sceneObjects.push(bernsteinGroup);
  }

   addDeCasteljau(overWriteT = null) {

    if (this.showBezierOrOther === "other") return;

      switch (true) {
        case this.step > 6:
          this.addCasteljauCurve(overWriteT);

        case this.step > 5:
          this.addCasteljauLinesStep2();
          this.addCasteljauPointStep3();

        case this.step > 4:
          this.addCasteljauLinesStep1();
          this.addCasteljauPointStep2();

        case this.step > 3:
          this.addCasteljauPointStep1();
          this.addOuterLines();
      }

      if(overWriteT !== null)
      {
        this.addCasteljauCurve();
      }

     this.addElements(sceneObjects);
  }

  addOther() {
    if (this.showBezierOrOther !== "other") return;

    let joinArrows = false;
    switch (true) {
      case this.step > 4:
        this.addCasteljauCurve();
        this.addCasteljauPointStep3();

      case this.step > 3:
        joinArrows = true;

      case this.step > 2:
        this.addBezierArrows(joinArrows);
        break;

      case this.step > 1:
        this.addBernsteinLines();

      case this.step === 1:
        this.addPointVecs();
    }

    this.addElements(sceneObjects);
  }

  addBezierArrows(joinArrows){
    this.add(new Ring(bezierArrowOrigin).setRadius(0, 0.02));

    let bezierArrowLengths = this.getBezierArrowLengths();
    let bezierArrow0 = lerpVector(bezierArrowOrigin, point0.position, bezierArrowLengths[0]);
    let bezierArrow1 = lerpVector(bezierArrowOrigin, point1.position, bezierArrowLengths[1]);
    let bezierArrow2 = lerpVector(bezierArrowOrigin, point2.position, bezierArrowLengths[2]);
    let bezierArrow3 = lerpVector(bezierArrowOrigin, point3.position, bezierArrowLengths[3]);

    arrowLine0.setPoints([bezierArrowOrigin, bezierArrow0]);
    arrowLine1.setPoints([bezierArrowOrigin, bezierArrow1]).setPosition(0, 0);
    arrowLine2.setPoints([bezierArrowOrigin, bezierArrow2]).setPosition(0, 0);
    arrowLine3.setPoints([bezierArrowOrigin, bezierArrow3]).setPosition(0, 0);

    if(joinArrows){
      arrowLine1.setPosition(bezierArrow0.x-bezierArrowOrigin.x, bezierArrow0.y-bezierArrowOrigin.y);
      arrowLine2.setPosition(bezierArrow1.x-2*bezierArrowOrigin.x+bezierArrow0.x, bezierArrow1.y-2*bezierArrowOrigin.y+bezierArrow0.y);
      arrowLine3.setPosition(bezierArrow2.x-3*bezierArrowOrigin.x+bezierArrow0.x+bezierArrow1.x, bezierArrow2.y-3*bezierArrowOrigin.y+bezierArrow0.y+bezierArrow1.y);
    }
    sceneObjects.push(arrowLine0,arrowLine1,arrowLine2,arrowLine3);
    this.addElements([arrowLine0,arrowLine1,arrowLine2,arrowLine3]);
  }

  getBezierArrowLengths(){
    let bernsteinPolynomes = getBernsteinPolynomes();
    let arrow0length = calcY(this.currentT, bernsteinPolynomes[0]);
    let arrow1length = calcY(this.currentT, bernsteinPolynomes[1]);
    let arrow2length = calcY(this.currentT, bernsteinPolynomes[2]);
    let arrow3length = calcY(this.currentT, bernsteinPolynomes[3]);

    return [arrow0length, arrow1length, arrow2length, arrow3length];
  }
}
