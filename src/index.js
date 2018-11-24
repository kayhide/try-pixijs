import "./style.css";
import pixi from "./pixi";
import _ from "lodash";

var app = new pixi.Application({
  autoResize: true,
  resolution: devicePixelRatio,
  antialias: true,
  transparent: true
});
PIXI.app = app;

document.body.appendChild(app.view);
window.addEventListener('resize', adjustPlacement);
window.addEventListener('load', adjustPlacement);

function adjustPlacement() {
  const parent = app.view.parentNode;
  app.renderer.resize(parent.clientWidth, parent.clientHeight);
  app.stage.position.x = app.screen.width / 2;
  app.stage.position.y = app.screen.height / 2;
}

var file = "IMG_2062.jpg"
var image = pixi.Sprite.fromImage(file)
image.anchor.set(0.5);
image.scale.set(0.2, 0.2);

pixi.loader.add("puzzle_small", "samples/puzzle_400x300_6.json");
pixi.loader.add("puzzle_middle", "samples/puzzle_400x300_88.json");
pixi.loader.add("puzzle_large", "samples/puzzle_400x300_972.json");
pixi.loader.load((loader, resources) => {
  const piece = resources.puzzle_small.data.pieces[0];
  resources.puzzle_middle.data.pieces.forEach(piece => {
    var mask = new pixi.Graphics();
    mask.beginFill(0.5, 0.5);
    mask.lineStyle(1, 0xFFFFFF, 0.5);
    mask.moveTo(...piece.points[0]);
    _.chunk(piece.points.slice(1), 3).forEach(([p1, p2, p3]) => {
      if (p1 && p2) {
        mask.bezierCurveTo(...p1, ...p2, ...p3);
      } else {
        mask.lineTo(...p3);
      }
    });
    mask.endFill();
    const bounds = mask.getBounds();
    mask.pivot.set(bounds.width / 2 + bounds.x, bounds.height / 2 + bounds.y);
    mask.position.set(- bounds.width / 2 - bounds.x, - bounds.height / 2 - bounds.y);
    image.addChild(mask);
    app.ticker.add((delta) => {
      mask.rotation -= 0.02 * delta;
    });
  });
});


app.stage.addChild(image);
app.ticker.add((delta) => {
  image.rotation += 0.01 * delta;
});
