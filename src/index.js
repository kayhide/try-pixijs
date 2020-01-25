import "./app.scss";

import * as _ from "lodash";
import * as PIXI from 'pixi.js'

import Game from "./puzzle/Game";
import PieceActor from "./PieceActor";

var app = new PIXI.Application({
  autoResize: true,
  resolution: devicePixelRatio,
  antialias: true,
  transparent: true
});
PIXI.app = app;

var state = {
  difficulty: "easy",
  glowing: false,
  shadowing: false,
};

document.body.appendChild(app.view);
window.addEventListener('resize', () => adjustPlacement());
window.addEventListener('load', () => adjustPlacement());

const adjustPlacement = () => {
  const parent = app.view.parentNode;
  app.renderer.resize(parent.clientWidth, parent.clientHeight);
  app.stage.position.x = app.screen.width / 2;
  app.stage.position.y = app.screen.height / 2;
  app.stage.scale.set(0.15);
}

const updateNav = () => {
  document.querySelectorAll("[data-difficulty]").forEach(elm => {
    if (state.difficulty === elm.dataset.difficulty) {
      elm.classList.add("active");
    } else {
      elm.classList.remove("active");
    }
  })
  document.querySelectorAll("[data-toggle]").forEach(elm => {
    elm.classList[state[elm.dataset.toggle] ? "add" : "remove"]("active");
  });
}

const init = (resources) => {
  app.stage.removeChildren();

  const texture = resources.image.texture;
  var playboard = new PIXI.Container();
  playboard.pivot.set(texture.width / 2, texture.height / 2);

  const game = new Game(puzzleData[state.difficulty]);
  var puzzle = game.createPuzzle(texture.width, texture.height);
  var actors = puzzle.pieces.map(piece => {
    var actor = new PieceActor(piece, texture);
    const c = new PIXI.Container();
    if (state.glowing) {
      var glow = new PieceActor(piece, texture, { wireframe: true, blur: true });
      c.addChild(glow);
    }
    c.addChild(actor);
    playboard.addChild(c);
    return c;
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
      actor.rotation -= 0.03 * delta;
    });
    playboard.rotation += 0.001 * delta;
  });
};


const puzzleDataEasy = require("../app/samples/puzzle_400x300_6.json");
const puzzleDataNormal = require("../app/samples/puzzle_400x300_88.json");
const puzzleDataHard = require("../app/samples/puzzle_400x300_972.json");
const imageUrl = require("../app/IMG_2062.jpg");

const puzzleData = {
  easy: puzzleDataEasy,
  normal: puzzleDataNormal,
  hard: puzzleDataHard
};

PIXI.loader.add("image", imageUrl);
PIXI.loader.load((loader, resources) => {
  document.querySelectorAll("[data-difficulty]").forEach(elm => {
    elm.addEventListener("click", e => {
      state.difficulty = elm.dataset.difficulty;
      updateNav();
      init(resources);
    });
  });
  document.querySelectorAll("[data-toggle=glowing]").forEach(elm => {
    elm.addEventListener("click", e => {
      state.glowing = ! state.glowing;
      updateNav();
      init(resources);
    });
  });
  document.querySelectorAll("[data-toggle=shadowing]").forEach(elm => {
    elm.addEventListener("click", e => {
      state.shadowing = ! state.shadowing;
      updateNav();
      document.querySelectorAll("canvas").forEach(canvas => {
        canvas.classList[state.shadowing ? "add" : "remove"]("shadow");
      });
    });
  });
  updateNav();
  init(resources);
});
