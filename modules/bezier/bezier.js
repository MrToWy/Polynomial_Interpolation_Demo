import "regenerator-runtime/runtime";
import {CasteljauScene} from "./casteljauScene";
import {BernsteinScene} from "./bernsteinScene";
import {addCardClickListener} from "../../js/uiHelpers";


let casteljauScene = new CasteljauScene("canvasLeft").render();
let bernsteinScene = new BernsteinScene("canvasRight").render();

window.addEventListener( 'click', (e) => casteljauScene.onDocumentMouseDown(e, casteljauScene), false );

for (let i = 1; i <= 6 ; i++) {
  addCardClickListener(casteljauScene, i);
}

document.getElementById("pause").addEventListener('click',e => {
  casteljauScene.togglePause(e, casteljauScene);
  bernsteinScene.togglePause(e, bernsteinScene);
});

document.getElementById("nextBezier").addEventListener('click',() => document.getElementById("cards").classList.toggle('hide'));

