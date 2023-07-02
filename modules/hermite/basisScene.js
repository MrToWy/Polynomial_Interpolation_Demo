import {Szene} from "../../js/classes/Szene";
import {calcY, calcYAbleitung, getHermitePolynomes} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {
  ANIMATION_SPEED,
  COLOR_0,
  COLOR_1,
  COLOR_2,
  COLOR_3,
  DRAW_STEP_SIZE,
  GREY,
  X_AXIS_SIZE
} from "../../js/constants";
import {Ring} from "../../js/classes/Ring";
import {Vector3} from "three";
import {AbleitungsVector} from "../../js/classes/AbleitungsVector";
import {Linie} from "../../js/classes/Linie";

let currentT = 0.5;

export class BasisScene extends Szene{
  constructor(domElementId, points) {
    super(domElementId);
    this.points = points;
  }

  render(){
    this.addAxis(false);

    let polynomMatrix = getHermitePolynomes(this.points);

    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[0]).setShowNegativeAxis(false).setColor(COLOR_0));
    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[1]).setShowNegativeAxis(false).setColor(COLOR_1));
    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[2]).setShowNegativeAxis(false).setColor(COLOR_2));
    this.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[3]).setShowNegativeAxis(false).setColor(COLOR_3));


    return super.render();
  }

  animate(sceneObject){
    if(sceneObject.pause) return;

    currentT += ANIMATION_SPEED;
    if(currentT > 1) currentT = 0;

    this.clear();

    let startOfWhiteLine = new Vector3(currentT, -0.3);
    let endOfWhiteLine = new Vector3(currentT, 1.2);
    sceneObject.add(new Linie().setPoints([startOfWhiteLine, endOfWhiteLine]).setColor(GREY))

    sceneObject.render();


    requestAnimationFrame(() => sceneObject.animate(sceneObject));
    return sceneObject;
  }

  // todo: doppelter Code (casteljauScene)
  togglePause(e, sceneObject) {
    sceneObject.pause = !sceneObject.pause;
    if(sceneObject.pause){
      e.target.innerHTML = "Play";
    } else {
      e.target.innerHTML = "Pause";
      sceneObject.animate(sceneObject);
    }
  }
}
