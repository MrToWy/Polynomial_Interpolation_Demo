import "regenerator-runtime/runtime";
import {getRungePoints, interpolate} from "../../js/interpolation";
import {Axis} from "../../js/classes/Axis";
import {Group, Scene} from "three";
import {Point} from "../../js/classes/Point";
import {Polynom} from "../../js/classes/Polynom";
import {Camera} from "../../js/classes/Camera";
import {Renderer} from "../../js/classes/Renderer";
import {DRAW_STEP_SIZE, POINT_SIZE, WINDOW_HEIGHT, WINDOW_WIDTH_FULL} from "../../js/constants";

const xAxisSize = 5;
const yAxisSize = 5;

let rungePointCount = 0;

const scene = new Scene();
const renderer = new Renderer(WINDOW_WIDTH_FULL, WINDOW_HEIGHT);
document.getElementById("canvas").appendChild(renderer.domElement);

document.getElementById("small").addEventListener("click", () => setPointCount(6));
document.getElementById("medium").addEventListener("click", () => setPointCount(11));
document.getElementById("large").addEventListener("click", () => setPointCount(18));


function render(){
  scene.clear();

  const camera = new Camera(WINDOW_WIDTH_FULL, WINDOW_HEIGHT).setZposition(14);

  scene.add(new Axis().setAxisSize(-xAxisSize, -yAxisSize).setColor(0x999999));
  scene.add(new Axis().setAxisSize(xAxisSize, yAxisSize));

  let points = getRungePoints(rungePointCount);
  let polynomArray = interpolate(points);
  scene.add(new Polynom(DRAW_STEP_SIZE, xAxisSize, polynomArray));
  scene.add(getPoints(points, POINT_SIZE));

  renderer.render(scene, camera);
}

function setPointCount(count){
  rungePointCount = count;
  render()
}

function getPoints(pointsArray, pointSize) {
  const group = new Group();
  for (const point of pointsArray) {
    group.add(new Point(point).setRadius(pointSize));
  }
  return group;
}
