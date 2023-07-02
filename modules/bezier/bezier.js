import "regenerator-runtime/runtime";
import {CasteljauScene} from "./casteljauScene";
import {BernsteinScene} from "./bernsteinScene";


let casteljauScene = new CasteljauScene("canvasLeft").render()

new BernsteinScene("canvasRight").render()


window.addEventListener( 'click', (e) => casteljauScene.onDocumentMouseDown(e, casteljauScene), false );
document.getElementById("pause").addEventListener('click',e => casteljauScene.togglePause(e, casteljauScene));
