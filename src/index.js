import "./style.css";

import _ from "lodash";
import pixi from "./pixi";

import Game from "./puzzle/Game";
import Piece from "./puzzle/Piece";
import PieceActor from "./PieceActor";
import Puzzle from "./puzzle/Puzzle"

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
  app.stage.scale.set(0.15);
}


// import puzzle_data from "../app/samples/puzzle_400x300_6.json";
// import puzzle_data from "../app/samples/puzzle_400x300_88.json";
import puzzle_data from "../app/samples/puzzle_400x300_972.json";

pixi.loader.add("image", require("../app/IMG_2062.jpg"));
pixi.loader.load((loader, resources) => {
  const game = new Game(puzzle_data);
  const texture = resources.image.texture;

  var playboard = new pixi.Container();
  playboard.pivot.set(texture.width / 2, texture.height / 2);

  var puzzle = game.createPuzzle(texture.width, texture.height);
  var actors = puzzle.pieces.map(piece => {
    var actor = new PieceActor(piece, texture);
    playboard.addChild(actor);
    return actor;
  });

  actors.forEach(actor => {
    const bounds = actor.getLocalBounds();
    const center = [bounds.width / 2 + bounds.x, bounds.height / 2 + bounds.y];
    actor.pivot.set(...center);
    actor.position.set(...center);
    actor.cacheAsBitmap = true;
  });
  // const actors = _.sampleSize(actors, 100);

  app.stage.addChild(playboard);
  app.ticker.add((delta) => {
    actors.forEach(actor => {
      actor.rotation -= 0.02 * delta;
    });
    playboard.rotation += 0.001 * delta;
  });
});
