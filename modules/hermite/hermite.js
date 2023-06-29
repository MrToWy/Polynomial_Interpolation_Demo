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

const sceneRight = new Scene();
const sceneLeft = new Scene();
const rendererRight = new Renderer(WINDOW_WIDTH, WINDOW_HEIGHT);
const rendererLeft = new Renderer(WINDOW_WIDTH, WINDOW_HEIGHT);
document.getElementById("canvasRight").appendChild(rendererRight.domElement);
document.getElementById("canvasLeft").appendChild(rendererLeft.domElement);

function render() {
  let punkt0 = new Vector3(0,0.1,0);
  let punkt1 = new Vector3(1,0.9,0);
  let ableitung0 = new Vector3(punkt0.x, -0.3,0);
  let ableitung1 = new Vector3(punkt1.x,-0.6,0);
  ableitung0.isAbleitung = true;
  ableitung1.isAbleitung = true;

  let points = [punkt0,ableitung0,punkt1,ableitung1];

  renderLeft(points);
  renderRight(points);
}

function renderLeft(points) {
  sceneLeft.clear();

  const camera = new Camera(WINDOW_WIDTH, WINDOW_HEIGHT);

  sceneLeft.add(new Axis().setAxisSize(X_AXIS_SIZE, Y_AXIS_SIZE));

  let polynomArray = interpolate(points);

  sceneLeft.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomArray).setShowNegativeAxis(false).setColor(0xff0000).setBoundarys(points[0].x, points[2].x));

  sceneLeft.add(new Point(points[0]).setRadius(POINT_SIZE).setColor(COLOR_0));
  sceneLeft.add(new AbleitungsVector(points[0], points[1]));
  sceneLeft.add(new Point(points[2]).setRadius(POINT_SIZE).setColor(COLOR_1));
  sceneLeft.add(new AbleitungsVector(points[2], points[3]));


  sceneLeft.add(new ColorLine([new Vector3(0,0,0),new Vector3(1,1,0)], [1,0,0,0,1,0]).translateX(-1));
  rendererLeft.render(sceneLeft, camera);
}

function renderRight(points){
  sceneRight.clear();

  const camera = new Camera(WINDOW_WIDTH, WINDOW_HEIGHT);

  sceneRight.add(new Axis().setAxisSize(X_AXIS_SIZE, Y_AXIS_SIZE));

  let polynomMatrix = getHermitePolynomes(points);

  sceneRight.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[0]).setShowNegativeAxis(false).setColor(COLOR_0));
  sceneRight.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[1]).setShowNegativeAxis(false).setColor(COLOR_1));
  sceneRight.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[2]).setShowNegativeAxis(false).setColor(COLOR_2));
  sceneRight.add(new Polynom(DRAW_STEP_SIZE, X_AXIS_SIZE, polynomMatrix[3]).setShowNegativeAxis(false).setColor(COLOR_3));

  rendererRight.render(sceneRight, camera);
}

render();

