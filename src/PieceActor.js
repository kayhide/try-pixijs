import * as _ from "lodash";
import * as PIXI from 'pixi.js';

class PieceActor extends PIXI.Container {
  constructor(piece, texture, options = {}) {
    super();
    this.wireframe = options.wireframe || false;
    this.blur = options.blur || false;

    this.piece = piece;
    this.geometry = this.createGeometry(piece);
    this.geometry.scale.set(...piece.scale);
    this.sprite = this.createSprite(texture);

    this.addChild(this.geometry);

    if (this.wireframe) {
      this.sprite.mask = null;
      this.removeChild(this.sprite);
    } else {
      this.sprite.mask = this.geometry;
      this.addChild(this.sprite);
    }
    if (this.blur) {
      this.filters = [new PIXI.filters.BlurFilter()];
    } else {
      this.filters = [];
    }
  }

  createGeometry(piece) {
    var geometry = new PIXI.Graphics();
    geometry.beginFill(0.5, 0.5);
    if (this.wireframe) {
      geometry.lineStyle(5, 0xFFFFFF, 0.5);
    }
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

  createSprite(texture) {
    return new PIXI.Sprite(texture);
  }
};

export default PieceActor;
