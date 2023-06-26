import "regenerator-runtime/runtime";
import { parse, HtmlGenerator } from "latex.js";

import { LaTeXJSComponent } from "latex.js";
customElements.define("latex-js", LaTeXJSComponent);

//global.window = createHTMLWindow()
global.document = window.document;

let latex =
  "$\n" +
  "\\left( \\begin{array}{r}\n" +
  "n  \\\\\n" +
  "k  \\\\\n" +
  "\\end{array}\\right)\n" +
  "=\n" +
  "\\frac{n!}{k! \\cdot (n-k)!}$";

let generator = new HtmlGenerator({ hyphenate: false });

let doc = parse(latex, { generator: generator }).domFragment();

console.log(doc);
