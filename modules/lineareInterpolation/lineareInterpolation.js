import "regenerator-runtime/runtime";
import {LinearInterpolationScene} from "./LinearInterpolationScene";
import {addCardClickListener} from "../../js/uiHelpers";

let scene = new LinearInterpolationScene("canvasLeft").render();

for (let i = 1; i <= 5 ; i++) {
  addCardClickListener(scene, i);
}

window.addEventListener('click', () => scene.render());


window.addEventListener( 'click', (e) => scene.onDocumentMouseDown(e, scene), false );
document.getElementById("canvasLeft").addEventListener( 'mousemove', (e) => scene.onDocumentMouseMove(e, scene), false );
