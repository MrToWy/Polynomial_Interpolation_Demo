import {Point} from "../../js/classes/Point";
import {Raycaster, Vector2, Vector3} from "three";
import {
  ANIMATION_SPEED,
  COLOR_0,
  COLOR_1,
  COLOR_2,
  COLOR_3, COLOR_4, COLOR_5, COLOR_6,
  POINT_SIZE,
  WINDOW_HEIGHT,
  WINDOW_WIDTH
} from "../../js/constants";
import {Linie} from "../../js/classes/Linie";
import {calculateOffset} from "../../js/helpers";
import {TransformControl} from "../../js/classes/TransformControl";
import {Ring} from "../../js/classes/Ring";
import {calcY, deCasteljau, getBernsteinPolynomes, lerpVector} from "../../js/interpolation";
import {AnimatedScene} from "../../js/classes/AnimatedScene";

let currentT = 0.5;
let point0 = new Point(new Vector3(0.1,-0.5,0)).setRadius(POINT_SIZE).setColor(COLOR_0);
let point1 = new Point(new Vector3(0.2,0.9,0)).setRadius(POINT_SIZE).setColor(COLOR_1);
let point2 = new Point(new Vector3(1.8,0.9,0)).setRadius(POINT_SIZE).setColor(COLOR_2);
let point3 = new Point(new Vector3(1.9,-0.5,0)).setRadius(POINT_SIZE).setColor(COLOR_3);

let linie0 = new Linie().setPoints([point0.position,point1.position]).setColor(COLOR_4);
let linie1 = new Linie().setPoints([point1.position,point2.position]).setColor(COLOR_5);
let linie2 = new Linie().setPoints([point2.position,point3.position]).setColor(COLOR_6);

let bezierArrowOrigin = new Vector3(1, -0.2);

let curves = [];


export class CasteljauScene extends AnimatedScene{

  constructor(domElementId) {
    super(domElementId);
    this.domElementId = domElementId;

    this.transformControl = new TransformControl(this.camera, this.renderer, () => {
      this.renderCasteljauCurve();
      this.renderCasteljauLines();
    });

    this.camera.move(1,0.5);
  }

  render(){
    this.clear();

    this.addElements([point0, point1, point2, point3, linie0, linie1, linie2, this.transformControl])

    this.add(new Ring(bezierArrowOrigin).setRadius(0, 0.02));

    let bezierArrowLengths = this.getBezierArrowLengths()
    let bezierArrow0 = lerpVector(bezierArrowOrigin, point0.position, bezierArrowLengths[0]);
    let bezierArrow1 = lerpVector(bezierArrowOrigin, point1.position, bezierArrowLengths[1]);
    let bezierArrow2 = lerpVector(bezierArrowOrigin, point2.position, bezierArrowLengths[2]);
    let bezierArrow3 = lerpVector(bezierArrowOrigin, point3.position, bezierArrowLengths[3]);

    this.add(new Linie().setPoints([bezierArrowOrigin, bezierArrow0]).setColor(COLOR_0));
    this.add(new Linie().setPoints([bezierArrowOrigin, bezierArrow1]).setColor(COLOR_1));
    this.add(new Linie().setPoints([bezierArrowOrigin, bezierArrow2]).setColor(COLOR_2));
    this.add(new Linie().setPoints([bezierArrowOrigin, bezierArrow3]).setColor(COLOR_3));


    curves = this.drawDeCasteljau(currentT);
    this.addElements(curves)

    return super.render()
  }

  animate(sceneObject) {
    if(sceneObject.pause) return;

    currentT += ANIMATION_SPEED;

    if(currentT > 1) currentT = 0;

    sceneObject.render();

    requestAnimationFrame(() => sceneObject.animate(sceneObject));
    return sceneObject;
  }

  renderCasteljauCurve() {
    if(curves && curves.length > 0)
      for (const curve of curves) {
        this.remove(curve);
      }
    curves = this.drawDeCasteljau(currentT);

    this.addElements(curves);
    this.renderer.render(this, this.camera);
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
    this.renderer.render(this, this.camera);
  }

   drawDeCasteljau(counter) {
    let stepSize = 0.01;
    let curve = [];
    let objects = [];
    for (let t = 0; t <= counter; t+= stepSize) {
      let result = deCasteljau(1 - t, point0, point1, point2, point3);
      curve.push(result[5]);
    }

    let casteljauPoints = deCasteljau(1- counter, point0, point1, point2, point3);
    objects.push(new Linie().setPoints([casteljauPoints[0], casteljauPoints[1]]).setColor(COLOR_4));
    objects.push(new Linie().setPoints([casteljauPoints[1], casteljauPoints[2]]).setColor(COLOR_4));
    objects.push(new Linie().setPoints([casteljauPoints[3], casteljauPoints[4]]).setColor(COLOR_5));

    objects.push(new Linie().setPoints(curve).setColor(COLOR_6));

    objects.push(new Ring(casteljauPoints[0]).setColor(COLOR_4))
    objects.push(new Ring(casteljauPoints[1]).setColor(COLOR_4))
    objects.push(new Ring(casteljauPoints[2]).setColor(COLOR_4))
    objects.push(new Ring(casteljauPoints[3]).setColor(COLOR_5))
    objects.push(new Ring(casteljauPoints[4]).setColor(COLOR_5))
    objects.push(new Ring(casteljauPoints[5]).setColor(COLOR_6))
    return objects;
  }

  getBezierArrowLengths(){
    let bernsteinPolynomes = getBernsteinPolynomes();
    let arrow0length = 1 - calcY(currentT, bernsteinPolynomes[0]);
    let arrow1length = 1 - calcY(currentT, bernsteinPolynomes[1]);
    let arrow2length = 1 - calcY(currentT, bernsteinPolynomes[2]);
    let arrow3length = 1 - calcY(currentT, bernsteinPolynomes[3]);

    return [arrow0length, arrow1length, arrow2length, arrow3length]
  }

  onDocumentMouseDown( e, sceneObject ) {
    e.preventDefault();

    const offset = calculateOffset(document.getElementById(sceneObject.domElementId)); //or some other element

    let posX = e.clientX+offset.x;
    let posY = e.clientY+offset.y;
    let pointer = new Vector2((posX / WINDOW_WIDTH) * 2 - 1, -(posY / WINDOW_HEIGHT) * 2 + 1)
    let raycaster = new Raycaster();
    raycaster.setFromCamera(pointer, sceneObject.camera);

    // calculate clicked objects
    const intersects = raycaster.intersectObjects(sceneObject.children).filter(obj => {
      return obj.object instanceof Point;
    });

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
