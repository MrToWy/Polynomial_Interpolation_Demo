import "regenerator-runtime/runtime";
import {CasteljauScene} from "./casteljauScene";
import {addCardClickListener} from "../../js/uiHelpers";


let casteljauScene = new CasteljauScene("canvasLeft").render();

window.addEventListener( 'click', (e) => casteljauScene.onDocumentMouseDown(e, casteljauScene), false );
window.addEventListener( 'mousemove', (e) => casteljauScene.onDocumentMouseMove(e, casteljauScene), false );

for (let i = 1; i <= 6 ; i++) {
  addCardClickListener(casteljauScene, i);
}

document.getElementById("pause").addEventListener('click',e => {
  casteljauScene.togglePause(e, casteljauScene);
});

document.getElementById("nextBezier").addEventListener('click',() => document.getElementById("cards").classList.toggle('hide'));

