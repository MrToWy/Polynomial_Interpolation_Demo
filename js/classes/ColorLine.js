import {Linie} from "./Linie";

export class ColorLine extends Linie{
  constructor(points, colors) {
    super().setPoints(points) ;
    this.material.vertexColors = true;
    this.geometry.setColors(colors);
  }
}
