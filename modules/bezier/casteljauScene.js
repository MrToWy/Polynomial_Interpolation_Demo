import {Szene} from "../../js/classes/Szene";
import {Point} from "../../js/classes/Point";
import {Raycaster, Vector2, Vector3} from "three";
import {ANIMATION_SPEED, COLOR_0, COLOR_1, COLOR_2, POINT_SIZE, WINDOW_HEIGHT, WINDOW_WIDTH} from "../../js/constants";
import {Linie} from "../../js/classes/Linie";
import {calculateOffset} from "../../js/helpers";
import {TransformControl} from "../../js/classes/TransformControl";
import {Ring} from "../../js/classes/Ring";
import {deCasteljau} from "../../js/interpolation";

let currentT = 0.5;
let point0 = new Point(new Vector3(0.1,-0.5,0)).setRadius(POINT_SIZE);
let point1 = new Point(new Vector3(0.2,0.9,0)).setRadius(POINT_SIZE);
let point2 = new Point(new Vector3(1.8,0.9,0)).setRadius(POINT_SIZE);
let point3 = new Point(new Vector3(1.9,-0.5,0)).setRadius(POINT_SIZE);

let linie0 = new Linie().setPoints([point0.position,point1.position]);
let linie1 = new Linie().setPoints([point1.position,point2.position]);
let linie2 = new Linie().setPoints([point2.position,point3.position]);

let curves = [];


export class CasteljauScene extends Szene{

  constructor(domElementId) {
    super(domElementId);
    this.domElementId = domElementId;

    this.transformControl = new TransformControl(this.camera, this.renderer, () => {
      this.renderCasteljauCurve();
      this.renderCasteljauLines();
    });

    this.camera.translateX(1).translateY(0.5).setLookAt(1,0.5,0);
  }

  render(){
    this.clear();

    this.addElements([point0, point1, point2, point3, linie0, linie1, linie2, this.transformControl])

    // do we need this? scene is cleared before this, no?
   // if(curves && curves.length > 0)
    //  for (const curve of curves) {
     //   sceneLeft.remove(curve);
      //}

    curves = this.drawDeCasteljau(currentT);
    this.addElements(curves)

    return super.render()
  }

  togglePause(e, sceneObject) {
    sceneObject.pause = !sceneObject.pause;
    if(sceneObject.pause){
      e.target.innerHTML = "Play";
    } else {
      e.target.innerHTML = "Pause";
      sceneObject.animate(sceneObject);
    }
  }

  animate(sceneObject) {
    if(sceneObject.pause) return;

    currentT += ANIMATION_SPEED;

    if(currentT > 1) currentT = 0;

    sceneObject.renderCasteljauCurve();

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
    objects.push(new Linie().setPoints([casteljauPoints[0], casteljauPoints[1]]).setColor(COLOR_0));
    objects.push(new Linie().setPoints([casteljauPoints[1], casteljauPoints[2]]).setColor(COLOR_0));
    objects.push(new Linie().setPoints([casteljauPoints[3], casteljauPoints[4]]).setColor(COLOR_1));

    objects.push(new Linie().setPoints(curve).setColor(COLOR_2));

    objects.push(new Ring(casteljauPoints[0]).setColor(COLOR_0))
    objects.push(new Ring(casteljauPoints[1]).setColor(COLOR_0))
    objects.push(new Ring(casteljauPoints[2]).setColor(COLOR_0))
    objects.push(new Ring(casteljauPoints[3]).setColor(COLOR_1))
    objects.push(new Ring(casteljauPoints[4]).setColor(COLOR_1))
    objects.push(new Ring(casteljauPoints[5]).setColor(COLOR_2))
    return objects;
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
