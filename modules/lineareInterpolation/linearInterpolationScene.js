import {getRungePoints, interpolate} from "../../js/interpolation";
import {Polynom} from "../../js/classes/Polynom";
import {COLOR_1, DRAW_STEP_SIZE, POINT_SIZE} from "../../js/constants";
import {Vector3} from "three";
import {Point} from "../../js/classes/Point";
import {Linie} from "../../js/classes/Linie";
import {InteractiveScene} from "../../js/classes/InteractiveScene";
import * as latexjs from "latex.js";
import {all} from "mathjs";

let points = [
  new Vector3(-1, 2),
  new Vector3(1,1.12),
  new Vector3(3.7,1.32),
  new Vector3(-5,-2.32),
  new Vector3(5,-2.32),
];
let point0 = new Point(points[0]).setRadius(POINT_SIZE*2);
let point1 = new Point(points[1]).setRadius(POINT_SIZE*2);
let point2 = new Point(points[2]).setRadius(POINT_SIZE*2);
let point3 = new Point(points[3]).setRadius(POINT_SIZE*2);
let point4 = new Point(points[4]).setRadius(POINT_SIZE*2);

let sceneObjects = [];


export class LinearInterpolationScene extends InteractiveScene{

  constructor(domElementId) {
    super(domElementId, (sceneObject) => {
      sceneObject.removeAllObjects();
      sceneObject.addAxis();

      sceneObject.addRungeScene();
      sceneObject.addInterpolationLine();
      sceneObject.addAllObjects();
    });

    this.camera.setZposition(14);
    this.changeAxisSize(5, 5);

    this.rungePointCount = 6;

    document.getElementById("small").addEventListener("click", () => this.setPointCount(6));
    document.getElementById("medium").addEventListener("click", () => this.setPointCount(11));
    document.getElementById("large").addEventListener("click", () => this.setPointCount(18));
  }

  render() {
    this.removeAllObjects();
    this.clear();
    this.addAxis();

    this.addRungeScene();
    this.addInterpolationPoints();
    this.addInterpolationLine();
    this.addAllObjects();

    return super.render();
  }

  removeAllObjects(){
    if(sceneObjects && sceneObjects.length > 0) {
      for (const curve of sceneObjects) {
        this.remove(curve);
      }
    }
    sceneObjects = [];
  }

  addAllObjects(){
    if(sceneObjects && sceneObjects.length > 0) {
      for (const curve of sceneObjects) {
        this.add(curve);
      }
    }
  }

  addInterpolationPoints(){
    if(this.step >= 5) return;

    this.addElements([point0, point1, point2, point3, point4, this.transformControl]);
  }

  addInterpolationLine(){
    if(this.step >= 5) return;

    let polynomArray = interpolate([point0.position, point1.position, point2.position, point3.position, point4.position]);
    console.log(polynomArray)
    this.writePolynomText(polynomArray)

    sceneObjects.push(new Polynom(DRAW_STEP_SIZE, this.xAxisSize, polynomArray));
  }

  writePolynomText(polynomArray){
    let nachKommaStellen = 5;

    var generator = new latexjs.HtmlGenerator({ hyphenate: false })


    document.getElementById("grad").innerHTML = "Das aktuell dargestellte Polynom hat " + polynomArray.length.toString() + " Kontrollpunkte, also wird ein Polynom vom Grad " + (polynomArray.length -1).toString() + " benötigt.";


    let latexDivs = document.getElementsByClassName("body")
    for (const katex of latexDivs) {
      try {
        document.getElementById("resultpolynom").removeChild(katex)
      }
      catch {}
      try {
        document.getElementById("defaultpolynom").removeChild(katex)
      }
      catch {}

    }

    let polynomText = "$ \\large{ p(x) = "
    for (let i = 0; i < polynomArray.length; i++) {

      let currentValue = polynomArray[i].toFixed(nachKommaStellen);

      if(i !== 0)
        polynomText += polynomArray[i] > 0 ? "+" : ""

      if(i === 0){
        polynomText += currentValue;
      }
      else if(i === 1){
        polynomText += currentValue + "x";
      }
      else{
        polynomText += currentValue + "x^" + (i);
      }
    }
    polynomText =  polynomText + "}$";


    generator = latexjs.parse(polynomText, { generator: generator })
    let domLatexElement = generator.domFragment()
    document.getElementById("resultpolynom").appendChild(domLatexElement)

    let katexs = document.getElementsByClassName("katex-html")
    for (const katex of katexs) {
      katex.style.display = "none"
    }
  }

  addRungeScene(){
    if(this.step < 5) return;

    let points = getRungePoints(this.rungePointCount);
    let polynomArray = interpolate(points);
    sceneObjects.push(new Polynom(DRAW_STEP_SIZE, this.xAxisSize, polynomArray));
    for (const point of this.getPoints(points, POINT_SIZE)) {
      sceneObjects.push(point)
    }


    // draw actual runge curve
    sceneObjects.push(new Linie().setPoints(getRungePoints(500)).setColor(COLOR_1));
  }

  setPointCount(count){
    this.rungePointCount = count;
    this.render()
  }

  getPoints(pointsArray, pointSize) {
    const points = [];
    for (const point of pointsArray) {
      points.push(new Point(point).setRadius(pointSize));
    }
    return points;
  }
}

