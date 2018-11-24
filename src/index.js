import "./style.css";
import pixi from "./pixi";

var app = new pixi.Application({
  autoResize: true,
  resolution: devicePixelRatio,
  backgroundColor : 0x1099bb
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

// center the sprite's anchor point
image.anchor.set(0.5);

image.scale.set(0.2, 0.2);

app.stage.addChild(image);

app.ticker.add((delta) => {
  image.rotation += 0.04 * delta;
});

