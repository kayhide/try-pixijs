import "lodash";
import pixi from "pixi";

const Piece = {
  create(data) {
    var geometry = new pixi.Graphics();
    geometry.beginFill(0.5, 0.5);
    geometry.lineStyle(1, 0xFFFFFF, 0.5);
    geometry.moveTo(...data.points[0]);
    _.chunk(data.points.slice(1), 3).forEach(([p1, p2, p3]) => {
      if (p1 && p2) {
        geometry.bezierCurveTo(...p1, ...p2, ...p3);
      } else {
        geometry.lineTo(...p3);
      }
    });
    geometry.endFill();

    var actor = new pixi.Container();
    actor.addChild(geometry);
    return {
      actor,
      geometry
    };
  },

  texturize({ actor, geometry }, texture) {
    var sprite = new pixi.Sprite(texture);
    sprite.mask = geometry;
    actor.addChild(sprite);
  }
};

export default Piece;
