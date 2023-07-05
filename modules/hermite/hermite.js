import "regenerator-runtime/runtime";
import {Vector3} from "three";
import {HermiteScene} from "./hermiteScene";
import {addCardClickListener} from "../../js/uiHelpers";

let punkt0 = new Vector3(0,0.,0);
let punkt1 = new Vector3(1,1.4,0);
let ableitung0 = new Vector3(0, 1.3,0);
let ableitung1 = new Vector3(1,-1.6,0);
ableitung0.isAbleitung = true;
ableitung1.isAbleitung = true;

let points = [punkt0,ableitung0,punkt1,ableitung1];

let hermiteScene = new HermiteScene("canvasLeft", points).render()

document.getElementById("pause").addEventListener('click',e => {
  hermiteScene.togglePause(e, hermiteScene);
});

for (let i = 1; i <= 6 ; i++) {
  addCardClickListener(hermiteScene, i);
}
