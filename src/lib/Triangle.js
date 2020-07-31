let p5;

export function main(_p5) {
  p5 = _p5

  // const g = function*(){
  //   console.log(yield)
  // }

  console.log(p5)

  // return g

  p5.setup = () => {
    var canvas = p5.createCanvas(500, 500)
    canvas.parent("p5Canvas");


    p5.noStroke();
    p5.fill('rgba(255, 204, 100, 0.3)');
    p5.triangle(30, 75, 58, 20, 500, 75)

    // p5.noStroke();
    // p5.fill('rgba(0,255,0, 0.3)');
    // p5.triangle(30.9, 75, 58, 20, 86, 75)
  }

  // p5.setup = () => {

  //   var canvas = p5.createCanvas(500, 500)
  //   canvas.parent("p5Canvas");

  //   // p5.noStroke();
  //   // p5.fill('rgba(255, 204, 100, 0.3)');
  //   // p5.triangle(30, 75, 58, 20, 500, 75)

  //   p5.noStroke();
  //   p5.fill('rgba(0,255,0, 0.3)');
  //   p5.triangle(30.9, 75, 58, 20, 86, 75)
  // }
}