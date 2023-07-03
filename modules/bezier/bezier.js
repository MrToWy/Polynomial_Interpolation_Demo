import "regenerator-runtime/runtime";
import {CasteljauScene} from "./casteljauScene";
import {BernsteinScene} from "./bernsteinScene";


let casteljauScene = new CasteljauScene("canvasLeft").render();

let bernsteinScene = new BernsteinScene("canvasRight").render();


window.addEventListener( 'click', (e) => casteljauScene.onDocumentMouseDown(e, casteljauScene), false );
document.getElementById('card1').addEventListener( 'click', () => document.getElementById("card1").classList.toggle('active'));
document.getElementById('card2').addEventListener( 'click', () => document.getElementById("card2").classList.toggle('active'));
document.getElementById("pause").addEventListener('click',e => {
  casteljauScene.togglePause(e, casteljauScene);
  bernsteinScene.togglePause(e, bernsteinScene);
});
