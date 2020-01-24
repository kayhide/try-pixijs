import _ from "lodash";
import pixi from "./pixi";

import Piece from "./puzzle/Piece"

class PieceActor extends pixi.Container {
  constructor(piece, texture) {
    super();
    this.piece = piece;
    this.geometry = PieceActor.createGeometry(piece);
    this.geometry.scale.set(...piece.scale);
    this.sprite = PieceActor.createSprite(texture);

    this.addChild(this.geometry);
    this.wireframe = false;
  }

  get wireframe() {
    return !this.sprite.mask;
  }

  set wireframe(on) {
    if (on) {
      this.sprite.mask = null;
      this.removeChild(this.sprite);
    } else {
      this.sprite.mask = this.geometry;
      this.addChild(this.sprite);
    }
  }

  static createGeometry(piece) {
    var geometry = new pixi.Graphics();
    geometry.beginFill(0.5, 0.5);
    geometry.lineStyle(1, 0xFFFFFF, 0.5);
    geometry.moveTo(...piece.points[0]);
    _.chunk(piece.points.slice(1), 3).forEach(([p1, p2, p3]) => {
      if (p1 && p2) {
        geometry.bezierCurveTo(...p1, ...p2, ...p3);
      } else {
        geometry.lineTo(...p3);
      }
    });
    geometry.endFill();
    return geometry;
  }

  static createSprite(texture) {
    return new pixi.Sprite(texture);
  }
};

export default PieceActor;
