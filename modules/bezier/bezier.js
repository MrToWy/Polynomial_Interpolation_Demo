import "regenerator-runtime/runtime";
import {CasteljauScene} from "./casteljauScene";
import {BernsteinScene} from "./bernsteinScene";


let casteljauScene = new CasteljauScene("canvasLeft").render();

let bernsteinScene = new BernsteinScene("canvasRight").render();


window.addEventListener( 'click', (e) => casteljauScene.onDocumentMouseDown(e, casteljauScene), false );

for (let i = 1; i <= 4 ; i++) {
  addCardClickListener(i);
}

document.getElementById("pause").addEventListener('click',e => {
  casteljauScene.togglePause(e, casteljauScene);
  bernsteinScene.togglePause(e, bernsteinScene);
});

function clearActiveClass() {
  Array.from(document.querySelectorAll('.collapse')).forEach(
    (el) => el.classList.remove('active')
  );
}

function addCardClickListener(number) {
  document.getElementById('upper-card'+ number).addEventListener( 'click', () => {
    clearActiveClass();
    document.getElementById("card" + number).classList.toggle('active');
    casteljauScene.step = number;
  });

}
