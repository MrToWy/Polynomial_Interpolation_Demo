import "regenerator-runtime/runtime";
import {LinearInterpolationScene} from "./linearInterpolationScene";
import {addCardClickListener} from "../../js/uiHelpers";

let scene = new LinearInterpolationScene("canvasLeft").render();

for (let i = 1; i <= 5 ; i++) {
  addCardClickListener(scene, i);
}

window.addEventListener('click', () => scene.render());
