import "regenerator-runtime/runtime";
import {Vector3} from "three";
import {HermiteScene} from "./hermiteScene";
import {BasisScene} from "./basisScene";

let punkt0 = new Vector3(0,0.,0);
let punkt1 = new Vector3(1,1.4,0);
let ableitung0 = new Vector3(punkt0.x, 3.3,0);
let ableitung1 = new Vector3(punkt1.x,-3.6,0);
ableitung0.isAbleitung = true;
ableitung1.isAbleitung = true;

let points = [punkt0,ableitung0,punkt1,ableitung1];

let hermiteScene = new HermiteScene("canvasLeft", points).render()
let basisScene = new BasisScene("canvasRight", points).render()

document.getElementById("pause").addEventListener('click',e => {
  hermiteScene.togglePause(e, hermiteScene);
  basisScene.togglePause(e, basisScene);
});
