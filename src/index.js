import "lodash";
import pixi from "pixi";

import Piece from "puzzle/piece";
import "./style.css";

var app = new pixi.Application({
  autoResize: true,
  resolution: devicePixelRatio,
  antialias: true,
  transparent: true
});
pixi.app = app;

document.body.appendChild(app.view);
window.addEventListener('resize', adjustPlacement);
window.addEventListener('load', adjustPlacement);

function adjustPlacement() {
  const parent = app.view.parentNode;
  app.renderer.resize(parent.clientWidth, parent.clientHeight);
  app.stage.position.x = app.screen.width / 2;
  app.stage.position.y = app.screen.height / 2;
  app.stage.scale.set(0.2);
}

pixi.loader.add("puzzle_small", "samples/puzzle_400x300_6.json");
pixi.loader.add("puzzle_middle", "samples/puzzle_400x300_88.json");
pixi.loader.add("puzzle_large", "samples/puzzle_400x300_972.json");
pixi.loader.add("image", "IMG_2062.jpg");
pixi.loader.load((loader, resources) => {
  const puzzle = {
    data: resources.puzzle_middle.data,
    texture: resources.image.texture,
    pieces: null
  };
  const puzzleScale = [
    puzzle.texture.width / puzzle.data.width,
    puzzle.texture.hegiht / puzzle.data.height
  ];

  puzzle.pieces = puzzle.data.pieces.map(data => {
    var piece = Piece.create(data);
    piece.geometry.scale.set(...puzzleScale);
    Piece.texturize(piece, puzzle.texture);

    const bounds = piece.actor.getLocalBounds();
    const center = [bounds.width / 2 + bounds.x, bounds.height / 2 + bounds.y];
    piece.actor.pivot.set(...center);
    piece.actor.position.set(...center);
    piece.actor.x -= puzzle.texture.width / 2;
    piece.actor.y -= puzzle.texture.height / 2;

    piece.actor.cacheAsBitmap = true;
    app.stage.addChild(piece.actor);
    return piece;
  });

  const pieces = _.sampleSize(puzzle.pieces, 100);

  app.ticker.add((delta) => {
    pieces.forEach(piece => {
      piece.actor.rotation -= 0.02 * delta;
    });
  });
});


// app.stage.addChild(image);
// app.ticker.add((delta) => {
//   image.rotation += 0.01 * delta;
// });
