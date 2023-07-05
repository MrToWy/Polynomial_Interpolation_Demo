import "regenerator-runtime/runtime";
import {LinearInterpolationScene} from "./linearInterpolationScene";
import {addCardClickListener} from "../../js/uiHelpers";
import {Simple} from "./Simple";

let scene = new LinearInterpolationScene("canvasLeft").render();

for (let i = 1; i <= 5 ; i++) {
  addCardClickListener(scene, i);
}

window.addEventListener('click', () => scene.render());


window.addEventListener( 'click', (e) => scene.onDocumentMouseDown(e, scene), false );
document.getElementById("canvasLeft").addEventListener( 'mousemove', (e) => scene.onDocumentMouseMove(e, scene), false );
