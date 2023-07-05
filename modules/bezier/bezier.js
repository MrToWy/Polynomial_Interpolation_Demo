import "regenerator-runtime/runtime";
import {CasteljauScene} from "./casteljauScene";
import {addCardClickListener} from "../../js/uiHelpers";


let casteljauScene = new CasteljauScene("canvasLeft").render();

window.addEventListener( 'click', (e) => casteljauScene.onDocumentMouseDown(e, casteljauScene), false );
document.getElementById("canvasLeft").addEventListener( 'mousemove', (e) => casteljauScene.onDocumentMouseMove(e, casteljauScene), false );

for (let i = 1; i <= 6 ; i++) {
  addCardClickListener(casteljauScene, i);
}




document.getElementById("nextBezier").addEventListener('click',() => {
  document.getElementById("cards").style.display = 'none';
  document.getElementById("arrowCards").style.display = 'flex';
});




document.getElementById("pause").addEventListener('click',e => {
  casteljauScene.togglePause(e, casteljauScene);
});
document.getElementById("arrowpause").addEventListener('click',e => {
  casteljauScene.togglePause(e, casteljauScene);
});
