import {Point} from "../../js/classes/Point";
import {Group, Raycaster, Vector2, Vector3} from "three";
import {
  COLOR_0,
  COLOR_1,
  COLOR_2,
  COLOR_3, COLOR_4, COLOR_5, COLOR_6, DRAW_STEP_SIZE,
  POINT_SIZE, WHITE,
  WINDOW_HEIGHT,
  WINDOW_WIDTH, X_AXIS_SIZE
} from "../../js/constants";
import {Linie} from "../../js/classes/Linie";
import {calculateOffset} from "../../js/helpers";
import {TransformControl} from "../../js/classes/TransformControl";
import {Ring} from "../../js/classes/Ring";
import {calcY, deCasteljau, getBernsteinPolynomes, lerpVector} from "../../js/interpolation";
import {AnimatedScene} from "../../js/classes/AnimatedScene";
import {Polynom} from "../../js/classes/Polynom";
import {Axis} from "../../js/classes/Axis";

let point0 = new Point(new Vector3(0.1,-0.5,0)).setRadius(POINT_SIZE).setColor(COLOR_0);
let point1 = new Point(new Vector3(0.2,0.9,0)).setRadius(POINT_SIZE).setColor(COLOR_1);
let point2 = new Point(new Vector3(1.8,0.9,0)).setRadius(POINT_SIZE).setColor(COLOR_2);
let point3 = new Point(new Vector3(1.9,-0.5,0)).setRadius(POINT_SIZE).setColor(COLOR_3);

let linie0 = new Linie().setPoints([point0.position,point1.position]).setColor(WHITE);
let linie1 = new Linie().setPoints([point1.position,point2.position]).setColor(WHITE);
let linie2 = new Linie().setPoints([point2.position,point3.position]).setColor(WHITE);

let bezierArrowOrigin = new Vector3(1, -0.2);

let sceneObjects = [];

let showBezierOrOther = "casteljau"; // casteljau or other


export class CasteljauScene extends AnimatedScene{

  constructor(domElementId) {
    super(domElementId);
    this.domElementId = domElementId;

    this.step = 1;

    this.transformControl = new TransformControl(this.camera, this.renderer, () => {
      this.removeAllObjects();

      this.addDeCasteljau();
      this.addOther();

      this.renderCasteljauLines();
      this.renderer.render(this, this.camera);
    });

    this.camera.move(1,0.5);
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
    this.addElements([linie0, linie1, linie2]);
  }

  addCasteljauPointStep1(){
    let casteljauPoints = deCasteljau(this.currentT, point0, point1, point2, point3);
    sceneObjects.push(new Ring(casteljauPoints[0]).setColor(COLOR_4));
    sceneObjects.push(new Ring(casteljauPoints[1]).setColor(COLOR_4));
    sceneObjects.push(new Ring(casteljauPoints[2]).setColor(COLOR_4));
  }

  addCasteljauLinesStep1(){
    let casteljauPoints = deCasteljau(this.currentT, point0, point1, point2, point3);
    sceneObjects.push(new Linie().setPoints([casteljauPoints[0], casteljauPoints[1]]).setColor(COLOR_4));
    sceneObjects.push(new Linie().setPoints([casteljauPoints[1], casteljauPoints[2]]).setColor(COLOR_4));
  }

  addCasteljauPointStep2(){
    let casteljauPoints = deCasteljau(this.currentT, point0, point1, point2, point3);
    sceneObjects.push(new Ring(casteljauPoints[3]).setColor(COLOR_5));
    sceneObjects.push(new Ring(casteljauPoints[4]).setColor(COLOR_5));
  }

  addCasteljauLinesStep2(){
    let casteljauPoints = deCasteljau(this.currentT, point0, point1, point2, point3);
    sceneObjects.push(new Linie().setPoints([casteljauPoints[3], casteljauPoints[4]]).setColor(COLOR_5));
  }

  addCasteljauPointStep3(){
    let casteljauPoints = deCasteljau(this.currentT, point0, point1, point2, point3);
    sceneObjects.push(new Ring(casteljauPoints[5]).setColor(COLOR_6))
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
    this.remove(linie0);
    this.remove(linie1);
    this.remove(linie2);
    linie0 = new Linie().setPoints([point0.position,point1.position]);
    linie1 = new Linie().setPoints([point1.position,point2.position]);
    linie2 = new Linie().setPoints([point2.position,point3.position]);
    this.add(linie0);
    this.add(linie1);
    this.add(linie2);

  }

  addBernsteinLines() {
    let bernsteinPolynomes = getBernsteinPolynomes();

    let bernsteinGroup = new Group();
    bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[0]).setShowNegativeAxis(false).setColor(COLOR_0));
    bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[1]).setShowNegativeAxis(false).setColor(COLOR_1));
    bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[2]).setShowNegativeAxis(false).setColor(COLOR_2));
    bernsteinGroup.add(new Polynom(DRAW_STEP_SIZE,X_AXIS_SIZE,bernsteinPolynomes[3]).setShowNegativeAxis(false).setColor(COLOR_3));

    bernsteinGroup.add(new Axis().setAxisSize(this.xAxisSize, this.yAxisSize));
    bernsteinGroup.add(this.getMovingLine());

    bernsteinGroup.translateX(1.5).translateY(1.5);
    bernsteinGroup.scale.set(0.5, 0.5, 0.5);

    sceneObjects.push(bernsteinGroup);
  }

   addDeCasteljau() {

    if (showBezierOrOther === "other") return;

      switch (true) {
        case this.step > 5:
          this.addCasteljauCurve();

        case this.step > 4:
          this.addCasteljauLinesStep2();
          this.addCasteljauPointStep3();

        case this.step > 3:
          this.addCasteljauLinesStep1();
          this.addCasteljauPointStep2();

          this.addBernsteinLines();

        case this.step > 2:
          this.addCasteljauPointStep1();
          this.addOuterLines();
      }

     this.addElements(sceneObjects);
  }

  addOther() {
    if (showBezierOrOther !== "other") return;

    let joinArrows = false;
    switch (true) {
      case this.step > 2:
        this.addCasteljauCurve();

      case this.step > 1:
        joinArrows = true;

      case this.step > 0:
        this.addBezierArrows(joinArrows);
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

    let arrow0 = new Linie().setPoints([bezierArrowOrigin, bezierArrow0]).setColor(COLOR_0);
    let arrow1 = new Linie().setPoints([bezierArrowOrigin, bezierArrow1]).setColor(COLOR_1);
    let arrow2 = new Linie().setPoints([bezierArrowOrigin, bezierArrow2]).setColor(COLOR_2);
    let arrow3 = new Linie().setPoints([bezierArrowOrigin, bezierArrow3]).setColor(COLOR_3);

    if(joinArrows){
      arrow1.move(bezierArrow0.x-bezierArrowOrigin.x, bezierArrow0.y-bezierArrowOrigin.y);
      arrow2.move(bezierArrow1.x-2*bezierArrowOrigin.x+bezierArrow0.x, bezierArrow1.y-2*bezierArrowOrigin.y+bezierArrow0.y);
      arrow3.move(bezierArrow2.x-3*bezierArrowOrigin.x+bezierArrow0.x+bezierArrow1.x, bezierArrow2.y-3*bezierArrowOrigin.y+bezierArrow0.y+bezierArrow1.y);
    }
    sceneObjects.push(arrow0,arrow1,arrow2,arrow3);
    this.addElements([arrow0,arrow1,arrow2,arrow3]);
  }

  getBezierArrowLengths(){
    let bernsteinPolynomes = getBernsteinPolynomes();
    let arrow0length = calcY(this.currentT, bernsteinPolynomes[0]);
    let arrow1length = calcY(this.currentT, bernsteinPolynomes[1]);
    let arrow2length = calcY(this.currentT, bernsteinPolynomes[2]);
    let arrow3length = calcY(this.currentT, bernsteinPolynomes[3]);

    return [arrow0length, arrow1length, arrow2length, arrow3length];
  }

  getCollidingObjects(e, sceneObject){
    const offset = calculateOffset(document.getElementById(sceneObject.domElementId)); //or some other element

    let posX = e.clientX+offset.x;
    let posY = e.clientY+offset.y;
    let pointer = new Vector2((posX / WINDOW_WIDTH) * 2 - 1, -(posY / WINDOW_HEIGHT) * 2 + 1)
    let raycaster = new Raycaster();
    raycaster.setFromCamera(pointer, sceneObject.camera);

    // calculate clicked objects
    return raycaster.intersectObjects(sceneObject.children).filter(obj => {
      return obj.object instanceof Point;
    });
  }

  onDocumentMouseMove( e, sceneObject ) {
    e.preventDefault();

    let intersects = sceneObject.getCollidingObjects(e, sceneObject);

    document.getElementById(this.domElementId).style.cursor = intersects.length === 0 ? "auto" : "pointer";
  }

  onDocumentMouseDown( e, sceneObject ) {
    e.preventDefault();

    let intersects = sceneObject.getCollidingObjects(e, sceneObject);

    if(intersects.length === 0){
      sceneObject.transformControl.detach();
      sceneObject.render();
    }

    for (const intersect of intersects) {
      sceneObject.transformControl.attach(intersect.object);
      sceneObject.add(sceneObject.transformControl)
      sceneObject.render();
    }
  }
}
