import "regenerator-runtime/runtime";
import {getHermitePolynomes, interpolate} from "../../js/interpolation";
import {Scene, Vector3} from "three";
import {Axis} from "../../js/classes/Axis";
import {Point} from "../../js/classes/Point";
import {ColorLine} from "../../js/classes/ColorLine";
import {AbleitungsVector} from "../../js/classes/AbleitungsVector";
import {Polynom} from "../../js/classes/Polynom";
import {Camera} from "../../js/classes/Camera";
import {Renderer} from "../../js/classes/Renderer";
import {
  COLOR_0,
  COLOR_1,
  COLOR_2,
  COLOR_3,
  DRAW_STEP_SIZE,
  POINT_SIZE, WINDOW_HEIGHT, WINDOW_WIDTH,
  X_AXIS_SIZE,
  Y_AXIS_SIZE
} from "../../js/constants";
import {HermiteScene} from "./hermiteScene";
import {BasisScene} from "./basisScene";

let punkt0 = new Vector3(0,0.1,0);
let punkt1 = new Vector3(1,0.9,0);
let ableitung0 = new Vector3(punkt0.x, -0.3,0);
let ableitung1 = new Vector3(punkt1.x,-0.6,0);
ableitung0.isAbleitung = true;
ableitung1.isAbleitung = true;

let points = [punkt0,ableitung0,punkt1,ableitung1];

let hermiteScene = new HermiteScene("canvasLeft", points).render()
new BasisScene("canvasRight", points).render()

document.getElementById("pause").addEventListener('click',e => hermiteScene.togglePause(e, hermiteScene));
