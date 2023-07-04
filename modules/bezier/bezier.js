import "regenerator-runtime/runtime";
import {CasteljauScene} from "./casteljauScene";
import {BernsteinScene} from "./bernsteinScene";


let casteljauScene = new CasteljauScene("canvasLeft").render();

let bernsteinScene = new BernsteinScene("canvasRight").render();


window.addEventListener( 'click', (e) => casteljauScene.onDocumentMouseDown(e, casteljauScene), false );
document.getElementById('upper-card1').addEventListener( 'click', () => {
  document.getElementById("card1").classList.toggle('active')
  casteljauScene.step = 1;
});
document.getElementById('upper-card2').addEventListener( 'click', () => {
  document.getElementById("card2").classList.toggle('active')
  casteljauScene.step = 2;
});
document.getElementById('upper-card3').addEventListener( 'click', () => {
  document.getElementById("card3").classList.toggle('active')
  casteljauScene.step = 3;
});
document.getElementById('upper-card4').addEventListener( 'click', () => {
  document.getElementById("card4").classList.toggle('active')
  casteljauScene.step = 4;
});
document.getElementById("pause").addEventListener('click',e => {
  casteljauScene.togglePause(e, casteljauScene);
  bernsteinScene.togglePause(e, bernsteinScene);
});
